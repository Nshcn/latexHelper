<template>
  <div>
    <p style="font-size:12px">
      上传excel前，处理一下表头：脚本识别的列名为：'题干'、'选项'、'参考答案'、'解析'、'知识点1'、'知识点2'、'知识点3'、'知识点4'、'出处'、'页号+题号'、'书名'、'所属小节'、'题目图片'。<br />
      选择题选项可以放在一个同一单元格“选项”中，也可以分别放在四列：“选项A”、“选项B”、“选项C”、“选项D”。<br />
      如果所有选项放在同一个单元格中，选项之间换行分割。<br />
      不用自己删除选项前的ABCD字母以及复制过来可能错误的选项标点符号，如“A、”，“B。”，“C，”，“D.”等，会自动过滤掉。
    </p>
    <input type="file"
           @change="loadExcel" />
    <div>
      <el-tag v-for="tableName in tableNameArr"
              :type="tableLatex[tableName].length>0?'success':'danger'"
              @click="toggleTable(tableName)"
              size="small"
              :key="tableName">{{tableName}}</el-tag>
    </div>
    <div v-if="currentTable!==''">
      <h1>{{currentTable+'('+tableLatex[currentTable].length+')'}}</h1>
      <el-button v-for="section in tableLatex[currentTable].sectionName"
                 type="text"
                 @click="toggleSection(section)"
                 :key="section">{{section+'('+tableLatex[currentTable][section].exercisesArr.length+')'}}</el-button>
    </div>
    <div>
      <el-button type="primary"
                 size="small"
                 @click="copyResult('exercises')">复制题目</el-button>
      <el-button type="primary"
                 size="small"
                 @click="copyResult('answer')">复制答案</el-button>
    </div>
    <div class="text-area">
      <el-input type="textarea"
                placeholder="题目代码"
                v-model="latexExercises"
                @keydown.tab.native="tabInput($event)"
                :autosize="{minRows:20}"
                show-word-limit>
      </el-input>
      <el-input type="textarea"
                placeholder="答案代码"
                v-model="latexAnswers"
                :autosize="{minRows:20}"
                @keydown.tab.native="tabInput($event)"
                show-word-limit>
      </el-input>
    </div>

  </div>
</template>


<script>
import * as XLSX from 'xlsx'

export default {
  name: 'ExcelToLatex',
  components: {},
  watch: {},
  created() {},
  data() {
    return {
      currentTable: '',
      tableNameArr: [],
      tableOrigin: {}, // 原始的表格数据
      tableLatex: {}, // latex表格数据
      latexExercises: '',
      latexAnswers: '',
      // 列名
      typeColMap: {
        题干: 'question',
        选项: 'options',
        选项A: 'optionA',
        选项B: 'optionB',
        选项C: 'optionC',
        选项D: 'optionD',
        参考答案: 'answer',
        解析: 'analysis',
        知识点1: 'point1',
        知识点2: 'point2',
        知识点3: 'point3',
        知识点4: 'point4',
        出处: 'source',
        '页号+题号': 'place',
        书名: 'book',
        所属小节: 'section',
        题目图片: 'figure',
      },
    }
  },
  methods: {
    loadExcel(e) {
      let file = e.target.files[0]
      this.readWorkbookFromLocalFile(file)
    },

    // 读取本地excel文件
    readWorkbookFromLocalFile(file) {
      var reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        var workbook = XLSX.read(data, { type: 'binary' })

        console.log(workbook)
        // 筛选掉评分表
        this.tableNameArr = workbook.SheetNames.filter(
          (name) => name.indexOf('评分') === -1
        )

        this.tableOrigin = workbook.Sheets
        for (let tableName of this.tableNameArr) {
          this.transformSingleTable(tableName)
        }
      }
      reader.readAsBinaryString(file)
    },

    // 单个表格转换成latex
    transformSingleTable(tableName) {
      let tableData = this.tableOrigin[tableName]
      let str = 'ABCDEFGHIJKLMNOPQ'
      let typeToColIndex = {}
      // 获得列数
      const getColLen = () => {
        let len = 1
        for (let i = 0; i < str.length; i++) {
          if (tableData[str[i] + '1']) {
            len++
          }
        }
        return len - 1
      }
      let colLen = getColLen()

      // 获得所需列名的索引
      let colName = Object.keys(this.typeColMap)
      for (let i = 1; i <= colLen; i++) {
        if (tableData[str[i] + '1']) {
          if (colName.includes(tableData[str[i] + '1'].v)) {
            typeToColIndex[this.typeColMap[tableData[str[i] + '1'].v]] = str[i]
          }
        }
      }

      // 获取有效行数
      const getRowLen = () => {
        let i = 1
        while (tableData['A' + i]) {
          i++
        }
        return i - 1
      }
      let rowLen = getRowLen()
      this.tableLatex[tableName] = { length: 0, sectionName: [] }

      for (let i = 2; i <= rowLen; i++) {
        let singleLine = {}
        for (let value of Object.values(this.typeColMap)) {
          let location = typeToColIndex[value] + i
          singleLine[value] = tableData[location]
            ? String(tableData[location].v)
            : ''
        }
        const {
          question,
          options,
          optionA,
          optionB,
          optionC,
          optionD,
          answer,
          analysis,
          place,
          source,
          book,
          section,
        } = singleLine

        // 存在至少一个选项时识别为选择题
        if (options || optionA || optionB || optionC || optionD) {
          // 处理知识点
          let point = singleLine['point1']
          for (let i = 2; i <= 4; i++) {
            point +=
              singleLine[`point${i}`] !== ''
                ? '、' + singleLine[`point${i}`]
                : ''
          }
          let exerciseCode = `\\choicequestion{\n${this.parseQuestion(
            question
          )}\n}{\n${this.parseOptions(
            options,
            optionA,
            optionB,
            optionC,
            optionD
          )}\n}{${source}}{${book}-${place.replace('_', '-')}}{${point}}\n`
          let answerCode = `\\choiceanswer{${answer}}{\n${analysis}\n}\n`

          // 将题目添加到对应的小节中
          if (this.tableLatex[tableName][section] === undefined) {
            this.tableLatex[tableName].sectionName.push(section)
            this.tableLatex[tableName][section] = {
              exercisesArr: [],
              answersArr: [],
            }
          }
          this.tableLatex[tableName].length++
          this.tableLatex[tableName][section].exercisesArr.push(exerciseCode)
          this.tableLatex[tableName][section].answersArr.push(answerCode)
        }
      }
      console.log(tableName, this.tableLatex[tableName])
    },

    // 切换table
    toggleTable(tableName) {
      this.latexExercises = ''
      this.latexAnswers = ''
      this.currentTable = tableName
      if (this.tableLatex[tableName].sectionName.length === 0) {
        this.$message({
          message: '该表格未分章节',
          type: 'warning',
        })
      }
    },
    // 切换并显示section
    toggleSection(sectionName) {
      let tableLatex = this.tableLatex[this.currentTable]
      this.latexExercises = tableLatex[sectionName].exercisesArr.join('\n')
      this.latexAnswers = tableLatex[sectionName].answersArr.join('\n')
    },
    // 处理题干中的括号
    parseQuestion(content) {
      return content.replace(/[（(〔]\s{0,9}[）)〕]/g, '\\choice ')
    },

    // 处理选择题选项
    parseOptions(options, optionA, optionB, optionC, optionD) {
      let choices
      if (options !== '') {
        choices = options.trim().split('\n').sort()
      } else if (optionA || optionB || optionC || optionD) {
        choices = [optionA, optionB, optionC, optionD]
      } else {
        return ''
      }
      let itemStr = ''
      for (let item of choices) {
        item = item.trim().replace(/^[A-Z\-+][.,，、。\s]{0,}/, '')
        itemStr += item ? `{${item}}` : ''
      }
      // 根据选项长度自动匹配合适的选择行数
      const findLongestWord = (strArray) => {
        strArray.sort(function (a, b) {
          return b.length - a.length
        })
        return strArray[0].length
      }
      let maxItemLen = findLongestWord(choices)
      if (maxItemLen <= 9) {
        return `\\oneline${itemStr}`
      } else if (maxItemLen >= 15) {
        return `\\fourline${itemStr}`
      } else {
        return `\\twoline${itemStr}`
      }
    },

    // 复制到剪切板
    copyResult(type) {
      let content =
        '\n' +
        (type === 'exercises' ? this.latexExercises : this.latexAnswers) +
        '\n'
      if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(content)
      } else {
        var textarea = document.createElement('textarea')
        document.body.appendChild(textarea)
        // 隐藏此输入框
        textarea.style.position = 'fixed'
        textarea.style.clip = 'rect(0 0 0 0)'
        textarea.style.top = '10px'
        // 赋值
        textarea.value = content
        // 选中
        textarea.select()
        // 复制
        document.execCommand('copy', true)
        // 移除输入框
        document.body.removeChild(textarea)
      }
      this.$message({
        message: '已复制到剪切板',
        type: 'success',
      })
    },
  },
}
</script>

<style scoped>
.text-area {
  height: 100vh;
  display: flex;
  flex-direction: row;
}
.text-area textarea {
  flex: 1;
  height: 100%;
}
</style>>

