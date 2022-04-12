<template>
  <div>
    <p style="font-size:12px">
      上传excel前，处理一下表头：脚本识别的列名为：'题干'、'选项'、'参考答案'、'解析'、'知识点1'、'知识点2'、'知识点3'、'知识点4'、'出处'、'页号+题号'、'书名'。<br />
      选择题的每个选项换行，不用处理前面的ABCD选项字母以及复制过来可能错误的选项标点符号。
    </p>
    <input type="file"
           @change="loadExcel" />
    <el-button type="primary"
               size="small"
               @click="copyResult('exercises')">复制题目</el-button>
    <el-button type="primary"
               size="small"
               @click="copyResult('answer')">复制答案</el-button>
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

<script src="https://unpkg.com/xlsx/dist/xlsx.full.min.js"></script>
<script>
import * as XLSX from 'xlsx'

export default {
  name: 'ExcelToLatex',
  components: {},
  watch: {},
  created() {},
  data() {
    return {
      latexExercises: '',
      latexAnswers: '',
    }
  },
  methods: {
    loadExcel(e) {
      let file = e.target.files[0]
      this.readWorkbookFromLocalFile(file)
    },

    // 读取本地excel文件，读取Excel文件对象
    readWorkbookFromLocalFile(file, callback) {
      var reader = new FileReader()
      reader.onload = (e) => {
        var data = e.target.result
        var workbook = XLSX.read(data, { type: 'binary' })
        let table = workbook.Sheets.Sheet1
        let str = 'ABCDEFGHIJKLMNOPQ'
        let typeToColIndex = {}
        let typeColMap = {
          题干: 'question',
          选项: 'options',
          参考答案: 'answer',
          解析: 'analysis',
          知识点1: 'point1',
          知识点2: 'point2',
          知识点3: 'point3',
          知识点4: 'point4',
          出处: 'source',
          '页号+题号': 'place',
          书名: 'book',
        }
        // 获得列数
        const getColLen = () => {
          let len = 1
          for (let i = 0; i < str.length; i++) {
            if (table[str[i] + '1']) {
              len++
            }
          }
          return len - 1
        }
        let colLen = getColLen()

        // 获得所需列名的索引
        for (let i = 1; i <= colLen; i++) {
          if (table[str[i] + '1']) {
            switch (table[str[i] + '1'].v) {
              case '题干':
              case '选项':
              case '参考答案':
              case '解析':
              case '知识点1':
              case '知识点2':
              case '知识点3':
              case '知识点4':
              case '出处':
              case '页号+题号':
              case '书名':
                typeToColIndex[typeColMap[table[str[i] + '1'].v]] = str[i]
                break
            }
          }
        }
        // 获取有效行数
        const getRowLen = () => {
          let i = 1
          while (table['A' + i]) {
            i++
          }
          return i - 1
        }
        let rowLen = getRowLen()
        let exercisesArr = []
        let answersArr = []
        for (let i = 2; i <= rowLen; i++) {
          let singleLine = {}
          for (let [key, value] of Object.entries(typeColMap)) {
            let location = typeToColIndex[value] + i
            singleLine[value] = table[location] ? table[location].v : ''
          }
          const { question, options, answer, analysis, place, source, book } =
            singleLine
          if (options !== '') {
            let point = ''
            for (let i = 1; i <= 4; i++) {
              point +=
                singleLine[`point${i}`] !== ''
                  ? singleLine[`point${i}`] + '、'
                  : ''
            }
            let exerciseCode = `\\choicequestion{\n${this.parseQuestion(
              question
            )}\n}{\n${this.parseOptions(
              options
            )}\n}{${source}}{${place}}{${point}}\n`
            let answerCode = `\\choiceanswer{${answer}}{\n${analysis}\n}\n`
            exercisesArr.push(exerciseCode)
            answersArr.push(answerCode)
          }
        }
        this.latexExercises = exercisesArr.join('\n')
        this.latexAnswers = answersArr.join('\n')
      }
      reader.readAsBinaryString(file)
    },

    // 处理题干中的括号
    parseQuestion(content) {
      return content.replace(/[（(〔]\s{0,9}[）)〕]/g, '\\choice ')
    },

    // 处理选择题选项
    parseOptions(content) {
      if (content === '') {
        return ''
      }
      let choices = content.trim().split('\n').sort()
      let itemStr = ''
      for (let item of choices) {
        item = item.trim().replace(/^[A-Z\-+][.,，、。\s]{0,}/, '')
        itemStr += item ? `{${item}}` : ''
      }
      // 根据选项长度自动匹配合适的选择行数
      let maxItemLen = this.findLongestWord(choices)
      if (maxItemLen <= 9) {
        return `\\oneline${itemStr}`
      } else if (maxItemLen >= 15) {
        return `\\fourline${itemStr}`
      } else {
        return `\\twoline${itemStr}`
      }
    },

    findLongestWord(strArray) {
      strArray.sort(function (a, b) {
        return b.length - a.length
      })
      return strArray[0].length
    },

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

