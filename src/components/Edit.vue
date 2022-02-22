<template>
  <div id="app">
    <el-button type="primary"
               size="small"
               @click="preview">预览</el-button>
    <el-button type="primary"
               size="small"
               @click="addMark(listType)">添加列表</el-button>
    <el-radio v-model="listType"
              label="ol">有序</el-radio>
    <el-radio v-model="listType"
              label="ul">无序</el-radio>

    <el-button type="primary"
               size="small"
               @click="addMark('fig')">添加图片</el-button>
    <a href="https://www.latex-tables.com/#"
       target="_blank">添加表格</a>
    <el-button type="primary"
               size="small"
               @click="addMark('opt')">添加选项</el-button>
    <el-button type="primary"
               size="small"
               @click="addMark('kaishu')">添加楷书</el-button>
    <el-button type="primary"
               size="small"
               @click="addMark('bf')">添加粗体文本</el-button>
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
  </div>
</template>

<script>
export default {
  name: 'Edit',
  components: {},
  props: {
    sourceText: String,
  },
  created() {
    console.log(this.sourceText)
    this.originText = this.sourceText
  },
  watch: {
    sourceText(newValue) {
      this.originText = newValue
    },
  },
  data() {
    return {
      originText: '',
      latexCode: '',
      listType: 'ol',
      markTypeArr: ['ol', 'ul', 'fig', 'wfig', 'opt', 'kaishu', 'bf'],
    }
  },
  methods: {
    addMark(type) {
      let dom = document.getElementById('edit-area')
      dom.value =
        dom.value.substring(0, dom.selectionStart) +
        `\n#${type}\n\n#\n` +
        dom.value.substring(dom.selectionEnd, dom.textLength)
    },

    /**
     * 预览
     */
    preview() {
      let result =
        this.originText[this.originText.length - 1] === '#'
          ? this.originText
          : this.originText + '\n#'
      for (let markType of this.markTypeArr) {
        let regStr = new RegExp(
          '(?<=(#' + markType + '\\s))[\\s\\S*]+?(?=#)',
          'gm'
        )
        result = result.replace(regStr, (item) => {
          return this.parseSingleType(markType)(item.trim())
        })
      }
      // 去除所有mark
      result = result.replace(/^#.{0,}/gm, () => {
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
  },
}
</script>

<style>
</style>
