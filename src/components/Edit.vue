<template>
  <div id="app">
    <header>
      <span>latexHelper</span>
      <div class="header-right">
        <i class="el-icon-document"
           onclick="window.open('https://github.com/Nshcn/latexHelper')">
          帮助</i>
        <i class="el-icon-question"
           onclick="window.open('https://github.com/Nshcn/latexHelper/issues/new')">
          issue</i>
      </div>
    </header>
    <section class="origin-section">
      <div class="templates-wrap wrap">
        <div class="region">
          <div class="up-region">
            <span>模板列表</span>
            <el-tooltip content="点击下方保存当前编辑区为新模板即可添加自定义模板"
                        placement="top">
              <i class="el-icon-question" />
            </el-tooltip>
          </div>
          <div class="down-region">
            <el-tag v-for="item in templateStore"
                    class="template-item"
                    size="small"
                    :key="item.name"
                    @close="deleteTemplate(item.name)"
                    @click="showTemplate(item.name)"
                    closable>
              <i class="el-icon-tickets" />
              {{item.name}}
            </el-tag>
          </div>
        </div>
      </div>
      <div class="insert-btn">
        <el-button type="text"
                   size="small"
                   @click="addMark(listType)">
          <i class="el-icon-circle-plus-outline" />
          列表
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="addMark('fig')">
          <i class="el-icon-circle-plus-outline" />
          图片
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="addMark('opt')">
          <i class="el-icon-circle-plus-outline" />
          选项
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="addMark('kaishu')">
          <i class="el-icon-circle-plus-outline" />
          楷书
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="addMark('bf')">
          <i class="el-icon-circle-plus-outline" />
          粗体
        </el-button>
        <el-tooltip content="latex-tables.com"
                    placement="right">
          <el-button type="text"
                     size="small"
                     onclick="window.open('https://www.latex-tables.com/#')">
            <i class="el-icon-circle-plus-outline" />
            表格
          </el-button>
        </el-tooltip>
      </div>
      <div class="name-input">
        <span>模板名称</span>
        <el-input v-model="templateName"
                  size="small"
                  placeholder="请输入模板名称"></el-input>
      </div>
      <div class="operate-area">
        <el-button type="text"
                   size="small"
                   @click="saveTemplate">
          <i class="el-icon-circle-plus-outline" />
          保存当前编辑区为新模板
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="originText = ''">
          <i class="el-icon-delete" />
          清空
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="preview">
          <i class="el-icon-refresh" />
          生成latex
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="test">test</el-button>
      </div>
      <el-input type="textarea"
                class="text-area"
                id="edit-area"
                placeholder="请输入内容"
                v-model="originText"
                :autosize="{ minRows: 8}"
                @keydown.tab.native="tabInput($event)"
                show-word-limit>
      </el-input>
    </section>
    <section class="latex-section">
      <div class="insert-btn">
        <div class="latex-snippet-wrap">
          <div class="region">
            <div class="up-region">
              <span>代码片段</span>
              <el-tooltip content="点击下方保存当前编辑区为新片段即可添加常用代码片段"
                          placement="top">
                <i class="el-icon-question" />
              </el-tooltip>
            </div>
            <div class="down-region">
              <el-tag v-for="item in snippetStore"
                      size="small"
                      class="snippet-item"
                      :key="item.name"
                      @close="deleteSnippet(item.name)"
                      @click="insertSnippet(item.name)"
                      closable>
                <i class="el-icon-plus" />
                {{item.name}}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="name-input">
        <span>片段名称</span>
        <el-input v-model="snippetName"
                  size="small"
                  placeholder="请输入片段名称"></el-input>
      </div>
      <el-button type="text"
                 size="small"
                 @click="convertToLatex('ol')">
        <i class="el-icon-magic-stick" />
        有序列表
      </el-button>
      <el-button type="text"
                 size="small"
                 @click="convertToLatex('ul')">
        <i class="el-icon-magic-stick" />
        无序列表
      </el-button>
      <el-button type="text"
                 size="small"
                 @click="convertToLatex('kaishu')">
        <i class="el-icon-magic-stick" />
        楷体
      </el-button>
      <el-button type="text"
                 size="small"
                 @click="convertToLatex('bf')">
        <i class="el-icon-magic-stick" />
        加粗
      </el-button>
      <el-button type="text"
                 size="small"
                 @click="convertToLatex('fig')">
        <i class="el-icon-magic-stick" />
        图片
      </el-button>
      <div class="operate-area">
        <el-button type="text"
                   size="small"
                   @click="saveSnippet">
          <i class="el-icon-circle-plus-outline" />
          保存当前编辑区为新片段
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="clear('latex')">
          <i class="el-icon-delete" />
          清空
        </el-button>
        <el-button type="text"
                   size="small"
                   @click="copyResult">
          <i class="el-icon-document-copy" />
          复制
        </el-button>
      </div>
      <el-input type="textarea"
                class="text-area"
                :class="{active:isActive}"
                id="preview-area"
                placeholder="预览"
                v-model="latexCode"
                :autosize="{ minRows: 8}"
                @keydown.tab.native="tabInput($event)"
                show-word-limit>
      </el-input>
    </section>
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
      this.templateStore.push(
        {
          name: '选择题',
          content: `年份：20\n题号：\n【题目】\n\n${this.ms}opt\n\n${this.ms}\n{\\kaishu\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n${this.ms}ol\n\n${this.ms}\n【对命制练习题的启发】\n\n${this.ms}ol\n\n${this.ms}\n}\n`,
        },
        {
          name: '大题',
          content: `年份：20\n题号：\n【题目】\n{\\kaishu\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n${this.ms}ol\n\n${this.ms}\n【对命制练习题的启发】\n\n${this.ms}ol\n\n${this.ms}\n}\n`,
        }
      )
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
      isActive: false, // 预览区是否激活
      originText: '', // 源码
      latexCode: '', // latex
      templateName: '',
      snippetName: '',
      listType: 'ol',
      ms: '#', // markSymbol 自定义标记符号
      markTypeArr: ['ol', 'ul', 'fig', 'wfig', 'opt', 'kaishu', 'bf'],
      snippetStore: [
        {
          name: '图片并排',
          content:
            '\n\\begin{figure}[ht]\n    \\centering\n    \\subfigure[test]{\n        \\begin{tikzpicture}[xscale=0.16]\n\n        \\end{tikzpicture}\n    }\n    \\subfigure[test]{\n        \\begin{tikzpicture}[xscale=0.16]\n\n        \\end{tikzpicture}\n    }\n    \\subfigure[test]{\n        \\begin{tikzpicture}[xscale=0.16]\n         \n        \\end{tikzpicture}\n    }\n    \\caption{test}\n    \\label{fig:test}\n\\end{figure}\n',
        },
        {
          name: '图片靠右',
          content:
            '\n\\begin{wrapfigure}[5]{r}{180pt}\n    \\begin{tikzpicture}\n        \n    \\end{tikzpicture}\n    \\caption{图片名}\n    \\label{fig:标签}\n\\end{wrapfigure}\n',
        },
        {
          name: '公式',
          content: '\\[\n    \\mathbf{}\n\\]',
        },
      ],
      templateStore: [
        // {
        //   name: '空白',
        //   content: '',
        // },
        // {
        //   name: '选择题',
        //   content: `【题目】\n\n${this.ms}opt\n\n${this.ms}\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n${this.ms}ol\n\n${this.ms}\n【对命制练习题的启发】\n${this.ms}ol\n\n${this.ms}\n`,
        // },
        // {
        //   name: '大题',
        //   content: `【题目】\n\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n${this.ms}ol\n\n${this.ms}\n【对命制练习题的启发】\n${this.ms}ol\n\n${this.ms}\n`,
        // },
      ],
    }
  },
  methods: {
    addMark(type) {
      let dom = document.getElementById('edit-area')
      this.originText =
        dom.value.substring(0, dom.selectionStart) +
        `\n${this.ms + type}\n\n${this.ms}\n` +
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
          message: '模板编辑区为空',
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
              message: '模板覆盖成功!',
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
          message: '模板保存成功',
        })
      }
    },

    test() {
      this.$message({
        type: 'success',
        message: '模板保存成功',
      })
    },
    /**
     * 预览
     */
    preview() {
      // 先处理每行的特殊符号 * = -
      let result = this.originText
        .trim()
        .split('\n')
        .map((line) => {
          return this.parseInlineText(line)
        })
        .join('\n')
      // 补上末尾的标记
      result =
        result[result.length - 1] === this.ms ? result : result + '\n' + this.ms

      // 依次处理各个模块
      let endMark = this.ms
      for (let markType of this.markTypeArr) {
        let startMark = this.ms + markType
        let regStr = new RegExp(`${startMark}[\\s\\S]+?${endMark}`, 'gm')

        result = result.replace(regStr, (item) => {
          let startPos = startMark.length
          let endPos = item.length - endMark.length
          return this.parseSingleType(markType)(
            item.trim().substring(startPos + 1, endPos - 1)
          )
        })
      }

      // 去除所有mark
      result = result.replace(/^#.{0,}/gm, () => {
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
        result += item.trim()[0] === '\\' ? `\n\t${item}` : `\n\t\\item ${item}`
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
        result += item.trim()[0] === '\\' ? `\n\t${item}` : `\n\t\\item ${item}`
      }
      result += '\n\\end{itemize}\n'
      return result
    },
    /**
     * 处理图片
     */
    parseFigure(content) {
      let name = this.getFigName(content)
      let path = this.getFigPath(content)
      let splitArr = content.split('\n')
      let figArr =
        name && splitArr.length > 1 ? splitArr.slice(0, -1) : splitArr
      let len = figArr.length
      if (len > 4) {
        return '暂不支持处理多于4张的图片'
      }

      let result = '\\begin{figure}[ht]\n' + '\t\\centering\n'
      // 只有一张图片
      if (figArr.length === 1) {
        result +=
          `\t\\includegraphics[width=0.8\\textwidth]{${
            path ? path : '图片路径'
          }.png}\n` +
          `\t\\caption{${name ? name : figArr[0]}}\n` +
          `\t\\label{fig:${name ? name : figArr[0]}}%\\ref{fig:${
            name ? name : figArr[0]
          }}\n`
      } else {
        // 处理多张图片
        let size = {
          4: [0.23, 1.7],
          3: [0.3, 2.2],
          2: [0.45, 2.5],
        }
        for (let fig of figArr) {
          result +=
            `\t\\subfigure[${fig}]{\n` +
            `\t\t\\begin{minipage}[ht]{${size[len][0]}\\linewidth}\n` +
            '\t\t\\centering\n' +
            `\t\t\\includegraphics[width=${size[len][1]}in]{${
              path ? path : '图片路径'
            }.png}\n` +
            `\t\t\\label{fig:${figArr[0]}}%\\ref{fig:${figArr[0]}}\n` +
            '\t\t\\end{minipage}\n' +
            '\t}\n'
        }
        result += `\t\\caption{${name ? name : '图片名'}}\n\t\\label{fig:${
          name ? name : '图片标签'
        }}%\\ref{fig:${name ? name : '图片标签'}}\n`
      }
      result += '\\end{figure}\n'
      return result
    },
    // 提取图片名字和路径
    getFigName(content) {
      let match = content.match(/^\[.+\]/gm)
      return match ? match[0].slice(1, -1) : ''
    },
    getFigPath(content) {
      let match = content.match(/\(.+\)/gm)
      return match ? match[0].slice(1, -1) : ''
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
     * 处理多行楷体
     */
    parseKaishu(content) {
      return `{\\kaishu ${content}}\n`
    },
    /**
     * 处理多行粗体
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
      let regStrBf = /\*.{2,}?\*/
      while (regStrBf.test(content)) {
        content = content.replace(regStrBf, (item) => {
          return `{\\bf ${item.slice(1, -1)}}`
        })
      }
      // 楷体
      let regStrKaishu = /=.{2,}?=/
      while (regStrKaishu.test(content)) {
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
      let content = '\n' + this.latexCode.trim() + '\n'
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
      this.latexCode =
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
              message: 'Latex片段覆盖成功!',
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
          message: 'Latex片段保存成功',
        })
      }
    },

    clear() {
      this.latexCode = ''
    },

    convertToLatex(type) {
      let dom = document.getElementById('preview-area')
      let selectText = dom.value.substring(dom.selectionStart, dom.selectionEnd)
      this.latexCode =
        dom.value.substring(0, dom.selectionStart) +
        this.parseSingleType(type)(selectText) +
        dom.value.substring(dom.selectionEnd, dom.textLength)
    },
  },
}
</script>

<style>
#app section {
  margin: 10px;
  border: 1px solid #9d9d9d;
  padding: 0px 8px 8px 8px;
  border-radius: 5px;
}
#app header {
  font-size: 40px;
  font-weight: 800;
  text-align: center;
  margin: 10px;
  position: relative;
}
.header-right {
  display: flex;
  flex-direction: column;
  position: absolute;
  font-size: 12px;
  right: 0;
  top: 0;
  text-align: left;
}
.header-right i {
  cursor: pointer;
  margin: 3px;
}
.header-right i::before {
  margin-right: 3px;
}

#app header span {
  cursor: pointer;
}
.region {
  /* height: 150px; */
  background: #fff;
  margin: 10px 0;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}
.up-region {
  padding: 5px 5px 5px 0;
  height: 100%;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #dcdfe6;
}
.up-region span {
  padding-left: 5px;
}
.down-region {
  /* overflow: scroll; */
  padding: 0 5px 0 5px;
  flex: 1;
}
.name-input {
  display: flex;
  flex-direction: row;
}
.name-input span {
  font-size: 14px;
  padding: 5px;
  width: 70px;
}
.name-input .text-area {
  flex: 1;
}

#edit-area,
#preview-area {
  font-family: consolas fongsong;
}

* {
  margin: 0;
}
.templates-wrap,
.latex-snippet-wrap {
  /* padding: 10px; */
}
.template-item,
.snippet-item {
  margin: 5px 10px 5px 0 !important;
  cursor: pointer;
}

.active #preview-area {
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

/* 滚动条的宽度 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

/* 滚动条凹槽的颜色，还可以设置边框属性 */
::-webkit-scrollbar-track-piece {
  /* // background-color:#f8f8f8;  // 这个不要更加好看，如果要了这个样式，没有产生滚动条的时候都会有一个框在右侧 */
  border-radius: 2px;
}

/* 滚动条的设置 */
::-webkit-scrollbar-thumb {
  background-color: #dddddd;
  background-clip: padding-box;
  min-height: 28px;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #bbb;
}

.latex-section {
  background: aliceblue;
}
</style>
