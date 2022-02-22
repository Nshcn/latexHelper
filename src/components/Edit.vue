<template>
  <div id="app"
       style="margin-top:50px">

    <div class="templates-wrap">
      <el-tag v-for="item in templateStore"
              class="template-item"
              :key="item.name"
              @close="deleteTemplate(item.name)"
              @click="showTemplate(item.name)"
              closable>{{item.name}}</el-tag>

    </div>
    <el-button type="text"
               size="small"
               @click="saveTemplate">保存当前编辑区为新模板</el-button>
    <el-button type="text"
               size="small"
               @click="preview">预览</el-button>
    <el-button type="text"
               size="small"
               @click="originText = ''">清空</el-button>
    <el-button type="text"
               size="small"
               @click="addMark(listType)">+ 列表</el-button>
    <el-radio v-model="listType"
              label="ol">有序</el-radio>
    <el-radio v-model="listType"
              label="ul">无序</el-radio>

    <el-button type="text"
               size="small"
               @click="addMark('fig')">+ 图片</el-button>
    <a href="https://www.latex-tables.com/#"
       target="_blank">表格</a>
    <el-button type="text"
               size="small"
               @click="addMark('opt')">+ 选项</el-button>
    <el-button type="text"
               size="small"
               @click="addMark('kaishu')">+ 楷书</el-button>
    <el-button type="text"
               size="small"
               @click="addMark('bf')">+ 粗体文本</el-button>
    <el-button type="text"
               size="small"
               @click="test">test</el-button>
    <el-input v-model="templateName"
              placeholder="请输入模板名称"></el-input>
    <el-input type="textarea"
              id="edit-area"
              placeholder="请输入内容"
              v-model="originText"
              :autosize="{ minRows: 8}"
              @keydown.tab.native="tabInput($event)"
              show-word-limit>
    </el-input>
    <div class="latex-snippet-wrap">
      <el-tag v-for="item in snippetStore"
              class="snippet-item"
              :key="item.name"
              @close="deleteSnippet(item.name)"
              @click="insertSnippet(item.name)"
              closable>{{'+'+item.name}}</el-tag>

    </div>
    <el-button type="text"
               size="small"
               @click="saveSnippet">保存当前编辑区为新片段</el-button>
    <el-button type="text"
               size="small"
               @click="latexCode = ''">清空</el-button>
    <el-input v-model="snippetName"
              placeholder="请输入片段名称"></el-input>
    <el-input type="textarea"
              id="preview-area"
              placeholder="预览"
              v-model="latexCode"
              :autosize="{ minRows: 8}"
              @keydown.tab.native="tabInput($event)"
              show-word-limit>
    </el-input>
    <el-button type="text"
               size="small"
               @click="copyResult">复制</el-button>
  </div>
</template>

<script>
import storage from '@/utils/storage'

export default {
  name: 'Edit',
  components: {},
  watch: {
    templateStore: {
      handler(newValue) {
        storage.setItem({
          value: newValue,
          name: 'templateStore',
        })
      },
      deep: true,
    },
    snippetStore: {
      handler(newValue) {
        storage.setItem({
          value: newValue,
          name: 'snippetStore',
        })
      },
      deep: true,
    },
  },
  created() {
    let localTemplateStore = storage.getItem('templateStore')
    if (localTemplateStore) {
      this.templateStore = localTemplateStore
    } else {
      storage.setItem({
        value: this.templateStore,
        name: 'templateStore',
      })
    }

    let localSnippetStore = storage.getItem('snippetStore')
    if (localSnippetStore) {
      this.snippetStore = localSnippetStore
    } else {
      storage.setItem({
        value: this.snippetStore,
        name: 'snippetStore',
      })
    }
  },
  data() {
    return {
      originText: '',
      inputVisible: false,
      templateName: '',
      snippetName: '',
      latexCode: '',
      listType: 'ol',
      markTypeArr: ['ol', 'ul', 'fig', 'wfig', 'opt', 'kaishu', 'bf'],
      snippetStore: [
        {
          name: '表格',
          content: '【表格】,fdskjkjsfdjsdkafds\nfjdklsjfl\njfkdjsk',
        },
      ],
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
      if (this.originText.trim() !== '') {
        this.$confirm(`切换模板会清空编辑区, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.templateName = templateName
            for (let item of this.templateStore) {
              if (item.name === templateName) {
                this.originText = item.content
                return
              }
            }
          })
          .catch(() => {})
      } else {
        this.templateName = templateName
        for (let item of this.templateStore) {
          if (item.name === templateName) {
            this.originText = item.content
            return
          }
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
            .catch(() => {})
        }
      }
    },
    saveTemplate() {
      if (this.templateName === '') {
        this.$message({
          type: 'warning',
          message: '请输入模板名称',
        })
        return
      }
      if (this.originText === '') {
        this.$message({
          type: 'warning',
          message: '编辑区为空',
        })
        return
      }
      let repeatIndex = -1
      for (let i = 0; i < this.templateStore.length; i++) {
        if (this.templateStore[i].name === this.templateName) {
          repeatIndex = i
          break
        }
      }
      if (repeatIndex !== -1) {
        this.$confirm(`"${this.templateName}"模板已存在, 是否覆盖?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.templateStore[repeatIndex].content = this.originText
            console.log(this.templateStore)
            this.$message({
              type: 'success',
              message: '覆盖成功!',
            })
          })
          .catch(() => {})
      } else {
        this.templateStore.push({
          name: this.templateName,
          content: this.originText,
        })
        this.$message({
          type: 'success',
          message: '保存成功',
        })
      }
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
      this.copyResult()
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
        `\t%\\ref{fig:${figName}}\n` +
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
        `\t%\\ref{fig:${figName}}\n` +
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
      this.insertSnippet('fd')
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
        message: '已复制到剪切板',
        type: 'success',
      })
    },

    deleteSnippet(snippetName) {
      for (let i = 0; i < this.snippetStore.length; i++) {
        if (this.snippetStore[i].name === snippetName) {
          this.$confirm(
            `此操作将永久删除"${snippetName}"片段, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              this.snippetStore.splice(i, 1)
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              return
            })
            .catch(() => {})
        }
      }
    },

    insertSnippet(snippetName) {
      this.snippetName = snippetName
      let dom = document.getElementById('preview-area')
      let index = this.snippetStore.findIndex((item) => {
        return item.name === snippetName
      })
      let snippetContent = this.snippetStore[index].content
      dom.value =
        dom.value.substring(0, dom.selectionStart) +
        `\n${snippetContent}\n` +
        dom.value.substring(dom.selectionEnd, dom.textLength)
    },

    saveSnippet() {
      if (this.snippetName === '') {
        this.$message({
          type: 'warning',
          message: '请输入模板名称',
        })
        return
      }
      if (this.latexCode === '') {
        this.$message({
          type: 'warning',
          message: '编辑区为空',
        })
        return
      }
      let repeatIndex = this.snippetStore.findIndex((item) => {
        return item.name === this.snippetName
      })
      if (repeatIndex !== -1) {
        this.$confirm(`"${this.snippetName}"片段已存在, 是否覆盖?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.snippetStore[repeatIndex].content = this.latexCode
            this.$message({
              type: 'success',
              message: '覆盖成功!',
            })
          })
          .catch(() => {})
      } else {
        this.snippetStore.push({
          name: this.snippetName,
          content: this.latexCode,
        })
        this.$message({
          type: 'success',
          message: '保存成功',
        })
      }
    },
  },
}
</script>

<style>
* {
  margin: 0;
}
.templates-wrap,
.latex-snippet-wrap {
  padding: 10px;
}
.template-item,
.snippet-item {
  /* margin: 0 10px 0 0 !important; */
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
