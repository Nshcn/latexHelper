<template>
  <div id="app">
    <div class="templates-wrap">
      <el-tag v-for="item in templateStore"
              class="template-item"
              :type="curTemplate===item.name?'danger':'info'"
              :key="item.name"
              @close="deleteTemplate(item.name)"
              @click="showTemplate(item.name)"
              closable>{{item.name}}</el-tag>
      <el-input class="input-new-tag"
                v-if="inputVisible"
                v-model="newTemplateName"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
      </el-input>
      <el-button v-else
                 class="button-new-tag"
                 size="small"
                 @click="addTemplate">新建模板</el-button>
      <el-button type="primary"
                 size="small"
                 @click="saveTemplate">保存为模板</el-button>
    </div>
    <el-button type="primary"
               size="small"
               @click="preview">预览</el-button>
    <el-button type="primary"
               size="small"
               @click="addMark(listType)">列表</el-button>
    <el-radio v-model="listType"
              label="ol">有序</el-radio>
    <el-radio v-model="listType"
              label="ul">无序</el-radio>

    <el-button type="primary"
               size="small"
               @click="addMark('fig')">图片</el-button>
    <a href="https://www.latex-tables.com/#"
       target="_blank">表格</a>
    <el-button type="primary"
               size="small"
               @click="addMark('opt')">选项</el-button>
    <el-button type="primary"
               size="small"
               @click="addMark('kaishu')">楷书</el-button>
    <el-button type="primary"
               size="small"
               @click="addMark('bf')">粗体文本</el-button>
    <el-button type="primary"
               size="small"
               @click="test">test</el-button>
    <el-input type="textarea"
              id="edit-area"
              placeholder="请输入内容"
              v-model="originText"
              :autosize="{ minRows: 8}"
              @keydown.tab.native="tabInput($event)"
              show-word-limit>
    </el-input>
    <el-input type="textarea"
              placeholder="预览"
              v-model="latexCode"
              :autosize="{ minRows: 8}"
              @keydown.tab.native="tabInput($event)"
              show-word-limit>
    </el-input>
    <el-button type="primary"
               size="small"
               @click="copyResult">复制</el-button>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  components: {},
  props: {
    sourceText: String,
  },
  watch: {
    sourceText(newValue) {
      this.originText = newValue
    },
  },
  data() {
    return {
      originText: '',
      inputVisible: false,
      newTemplateName: '',
      curTemplate: '空白',
      latexCode: '',
      listType: 'ol',
      markTypeArr: ['ol', 'ul', 'fig', 'wfig', 'opt', 'kaishu', 'bf'],
      templateStore: [
        {
          name: '空白',
          content: '',
        },
        {
          name: '选择题',
          content:
            '【题目】\n\n/opt\n\n/\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n/ol\n\n/\n【对命制练习题的启发】\n/ol\n\n/\n',
        },
        {
          name: '大题',
          content:
            '【题目】\n\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n/ol\n\n/\n【对命制练习题的启发】\n/ol\n\n/\n',
        },
      ],
    }
  },
  methods: {
    addMark(type) {
      let dom = document.getElementById('edit-area')
      dom.value =
        dom.value.substring(0, dom.selectionStart) +
        `\n/${type}\n\n/\n` +
        dom.value.substring(dom.selectionEnd, dom.textLength)
    },
    showTemplate(templateName) {
      this.curTemplate = templateName
      for (let item of this.templateStore) {
        if (item.name === templateName) {
          this.originText = item.content
          return
        }
      }
    },
    deleteTemplate(templateName) {
      for (let i = 0; i < this.templateStore.length; i++) {
        if (this.templateStore[i].name === templateName) {
          this.$confirm(
            `此操作将永久删除"${templateName}"模板, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              this.templateStore.splice(i, 1)
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              return
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除',
              })
              return
            })
        }
      }
    },
    addTemplate() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      let newTemplateName = this.newTemplateName
      if (newTemplateName) {
        this.templateStore.push({
          name: newTemplateName,
          content: '',
        })
      }
      this.inputVisible = false
      this.newTemplateName = ''
    },
    saveTemplate() {
      for (let i = 0; i < this.templateStore.length; i++) {
        if (this.templateStore[i].name === this.curTemplate) {
          this.templateStore[i].content = this.originText
        }
      }
      this.$message({
        type: 'success',
        message: '保存成功!',
      })
    },
    /**
     * 预览
     */
    preview() {
      let result =
        this.originText[this.originText.length - 1] === '/'
          ? this.originText
          : this.originText + '\n/'
      for (let markType of this.markTypeArr) {
        let regStr = new RegExp(
          '(?<=(/' + markType + '\\s))[\\s\\S*]+?(?=/)',
          'gm'
        )
        result = result.replace(regStr, (item) => {
          return this.parseSingleType(markType)(item.trim())
        })
      }
      // 去除所有mark
      result = result.replace(/^\/.{0,}/gm, () => {
        return ''
      })
      this.latexCode = result
    },

    parseSingleType(type) {
      switch (type) {
        case 'ul':
          return this.parseUnorderedList
        case 'ol':
          return this.parseOrderedList
        case 'fig':
          return this.parseFigure
        case 'wfig':
          return this.parseWrapFigure
        case 'opt':
          return this.parseChoiceQuestion
        case 'kaishu':
          return this.parseKaishu
        case 'bf':
          return this.parseBf
        default:
          break
      }
    },
    /**
     * 处理有序列表
     */
    parseOrderedList(content) {
      let list = content.split('\n')
      let result = '\\begin{enumerate}[leftmargin=2\\parindent]'
      for (let item of list) {
        result += `\n\t\\item ${this.parseInlineText(item)}`
      }
      result += '\n\\end{enumerate}\n'
      return result
    },
    /**
     * 处理无序列表
     */
    parseUnorderedList(content) {
      let list = content.split('\n')
      let result = '\\begin{itemize}[leftmargin=2\\parindent]'
      for (let item of list) {
        result += `\n\t\\item ${this.parseInlineText(item)}`
      }
      result += '\n\\end{itemize}\n'
      return result
    },
    /**
     * 处理图片
     */
    parseFigure(content) {
      let figName = content
      return (
        '\\begin{figure}[ht]\n' +
        '\t\\centering\n' +
        `\t\\includegraphics[width=0.8\\textwidth]{${figName}.png}\n` +
        `\t\\caption{${figName}}\n` +
        `\t\\label{fig:${figName}}\n` +
        '\\end{figure}\n'
      )
    },
    parseWrapFigure(content) {
      let figName = content
      return (
        '\\begin{wrapfigure}[ht]\n' +
        '\t\\centering\n' +
        `\t\\includegraphics[width=0.8\\textwidth]{${figName}.png}\n` +
        `\t\\caption{${figName}}\n` +
        `\t\\label{fig:${figName}}\n` +
        '\\end{wrapfigure}\n'
      )
    },
    /**
     * 处理楷书模块
     */
    parseKaishu(content) {
      console.log(content)
      return `{\\kaishu\n${this.parseInlineText(content)}\n}\n`
    },
    /**
     * 处理单行粗体
     */
    parseBf(content) {
      return `{\\bf ${content}}\n`
    },
    /**
     * 处理行内文字
     */
    parseInlineText(content) {
      // 去除-
      content = content.replace(/^-[\s]{0,}/, '')
      // 粗体
      let regStrBf = /\*.{2,8}\*/
      while (/\*.{2,8}\*/.test(content)) {
        content = content.replace(regStrBf, (item) => {
          return `{\\bf ${item.slice(1, -1)}}`
        })
      }
      // 楷体
      let regStrKaishu = /=.{2,8}=/
      while (/=.{2,8}=/.test(content)) {
        content = content.replace(regStrKaishu, (item) => {
          return `{\\kaishu ${item.slice(1, -1)}}`
        })
      }
      return content
    },
    /**
     * 处理选择题选项
     */
    parseChoiceQuestion(content) {
      let choices = content.split('\n')
      let itemStr = ''
      // 去除选项前的字母
      let regStr = /^[ABCD\-+][.|,|，|。|\s]{0,}/
      for (let item of choices) {
        item = item.trim()
        if (regStr.test(item)) {
          item = item.replace(regStr, '')
        }
        itemStr += `{${item}}\n`
      }
      // 根据选项长度自动匹配合适的选择行数
      let maxItemLen = this.findLongestWord(choices)
      if (maxItemLen <= 9) {
        return `\\onech\n${itemStr}`
      } else if (maxItemLen >= 15) {
        return `\\fourch\n${itemStr}`
      } else {
        return `\\twoch\n${itemStr}`
      }
    },
    findLongestWord(strArray) {
      strArray.sort(function (a, b) {
        return b.length - a.length
      })
      return strArray[0].length
    },

    test() {
      let str =
        '翻*领狂单J*S莱肯发范定龙*江了赛季浮动*茯苓丹发浮动浮动发腮动发腮发龙家店发腮'
      let res = this.parseInlineText(str)
      console.log(res)
    },

    // textarea输入tab制表符
    tabInput(e) {
      e.preventDefault()
      const insertText = '\t'
      const elInput = e.target
      const startPos = elInput.selectionStart
      const endPos = elInput.selectionEnd
      if (startPos === undefined || endPos === undefined) return
      const txt = elInput.value
      elInput.value =
        txt.substring(0, startPos) + insertText + txt.substring(endPos)
      elInput.focus()
      elInput.selectionStart = startPos + insertText.length
      elInput.selectionEnd = startPos + insertText.length
      this.inputValue = elInput.value
    },
    copyResult() {
      let content = this.latexCode
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
        message: '复制成功',
        type: 'success',
      })
    },
  },
}
</script>

<style>
* {
  margin: 0;
}
.templates-wrap {
  padding: 10px;
}
.template-item {
  cursor: pointer;
}

.active {
  background: black !important;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
