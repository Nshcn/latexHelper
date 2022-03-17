<template>
  <div id="main">
    <header>
      <span>LatexHelper</span>
      <div class="header-right">
        <i class="el-icon-question"
           onclick="window.open('https://github.com/Nshcn/latexHelper')">
          帮助</i>
      </div>
    </header>
    <div class="content-wrapper">
      <section class="origin-section">
        <div class="operate-area">
          <div class="templates-wrap wrap">
            <div class="region">
              <div class="up-region">
                <span>模板列表</span>
                <el-button type="text"
                           size="small"
                           @click="saveTemplate">
                  <i class="el-icon-folder-opened" />
                  保存当前编辑区为新模板
                </el-button>
              </div>
              <div class="down-region">
                <el-tag v-for="item in templateStore"
                        class="tag-item"
                        size="mini"
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
          <div class="history">
            <div class="region">
              <div class="up-region">
                <span>存档记录</span>
                <el-button type="text"
                           size="small"
                           @click="saveLhHistory">
                  <i class="el-icon-folder-opened" />
                  保存当前编辑区编辑记录
                </el-button>
              </div>
              <div class="down-region">
                <el-tag v-for="item in historyLhStore"
                        class="tag-item"
                        size="mini"
                        :key="item.name"
                        @close="deleteLhHistory(item.name)"
                        @click="showLhHistory(item.name)"
                        closable>
                  <i class="el-icon-tickets" />
                  {{item.name}}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="name-input">
            <span>{{titleType==='lh'?'记录名称':'模板名称'}}</span>
            <el-input v-model="templateName"
                      size="small"
                      :placeholder="titleType==='lh'?'请输入需要保存的记录名称':'请输入需要保存的模板名称'"></el-input>
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

          <div class="btn-wrapper">
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
              生成LaTex
            </el-button>
            <el-button type="text"
                       v-if="env==='development'"
                       size="small"
                       @click="test">测试</el-button>
          </div>
        </div>
        <el-input type="textarea"
                  class="text-area lh-area"
                  id="lh-area"
                  placeholder="LatexHelper语法编辑区"
                  v-model="originText"
                  @keydown.tab.native="tabInput($event)"
                  show-word-limit>
        </el-input>

      </section>
      <section class="latex-section">
        <div class="operate-area">

          <div class="insert-btn">
            <div class="latex-snippet-wrap">
              <div class="region">
                <div class="up-region">
                  <span>代码片段</span>
                  <el-button type="text"
                             size="small"
                             @click="saveSnippet">
                    <i class="el-icon-circle-plus-outline" />
                    保存当前编辑区为新片段
                  </el-button>
                </div>
                <div class="down-region">
                  <el-tag v-for="item in snippetStore"
                          size="mini"
                          class="tag-item"
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
          <div>
            <el-button type="text"
                       size="small"
                       @click="latexCode = ''">
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
        </div>
        <!-- <Code class="text-area"
              id="latex-area"
              :text='originText'></Code> -->
        <el-input type="textarea"
                  class="text-area"
                  :class="{active:isActive}"
                  id="latex-area"
                  placeholder="LaTex原生语法编辑区"
                  v-model="latexCode"
                  @keydown.tab.native="tabInput($event)"
                  show-word-limit>
        </el-input>
      </section>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage'
// import Code from './Code.vue'
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
    historyLhStore: {
      handler(newValue) {
        storage.setItem({
          value: newValue,
          name: 'historyLhStore',
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
          content: `年份：20\n题号：\n【题目】\n\n${this.ms}opt\n\n${this.ms}\n{\\kaishu\n【参考答案】\n\n【本题解析】\n\n【xxx启发】\n${this.ms}ol\n\n${this.ms}\n【xxx启发】\n\n${this.ms}ol\n\n${this.ms}\n}\n`,
        },
        {
          name: '大题',
          content: `年份：20\n题号：\n【题目】\n{\\kaishu\n【参考答案】\n\n【本题解析】\n\n【xxx启发】\n${this.ms}ol\n\n${this.ms}\n【xxx启发】\n\n${this.ms}ol\n\n${this.ms}\n}\n`,
        }
      )
      storage.setItem({
        value: this.templateStore,
        name: 'templateStore',
      })
    }
    // 获取本地history Lh编辑区的历史记录
    let localHistoryLhStore = storage.getItem('historyLhStore')
    if (localHistoryLhStore) {
      this.historyLhStore = localHistoryLhStore
    }

    // 获取本地snippet片段
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
      env: process.env.NODE_ENV,
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
      templateStore: [],
      historyLhStore: [],
      titleType: 'template',
    }
  },
  methods: {
    addMark(type) {
      let dom = document.getElementById('lh-area')
      this.originText =
        dom.value.substring(0, dom.selectionStart) +
        `\n${this.ms + type}\n\n${this.ms}\n` +
        dom.value.substring(dom.selectionEnd, dom.textLength)
    },
    showTemplate(templateName) {
      this.titleType = 'template'
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
    showLhHistory(templateName) {
      if (this.originText.trim() !== '') {
        this.saveLhHistory(this.templateName)
        this.templateName = templateName
        for (let item of this.historyLhStore) {
          if (item.name === templateName) {
            this.originText = item.content
            return
          }
        }
      } else {
        this.templateName = templateName
        for (let item of this.historyLhStore) {
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
    deleteLhHistory(templateName) {
      for (let i = 0; i < this.historyLhStore.length; i++) {
        if (this.historyLhStore[i].name === templateName) {
          this.$confirm(
            `此操作将永久删除"${templateName}"记录, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
          )
            .then(() => {
              this.historyLhStore.splice(i, 1)
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
    saveLhHistory() {
      this.titleType = 'lh'
      if (this.templateName === '') {
        this.$message({
          type: 'warning',
          message: '记录名称为空',
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
      for (let i = 0; i < this.historyLhStore.length; i++) {
        if (this.historyLhStore[i].name === this.templateName) {
          repeatIndex = i
          break
        }
      }
      if (repeatIndex !== -1) {
        this.historyLhStore[repeatIndex].content = this.originText
        this.$message({
          type: 'success',
          message: '保存成功!',
        })
      } else {
        this.historyLhStore.push({
          name: this.templateName,
          content: this.originText,
        })
        this.$message({
          type: 'success',
          message: '新记录保存成功',
        })
      }
    },
    saveTemplate() {
      this.titleType = 'template'
      if (this.templateName === '') {
        this.$message({
          type: 'warning',
          message: '模板名称为空',
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

    // 测试
    test() {
      this.$message({
        type: 'success',
        message: 'test',
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
        let regStr = new RegExp(`^${startMark}([\\s\\S]+?)^${endMark}`, 'gm')
        result = result.replace(regStr, (full, $1) => {
          return ['ul', 'ol'].includes(markType)
            ? this.parseNestedList(full.trim()) // 单独处理列表
            : this.parseSingleType(markType)($1.trim())
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
     * 处理嵌套列表
     */
    parseNestedList(content) {
      let lineStr = content.trim().split('\n')
      let i = 0
      let j = lineStr.length - 1
      while (i <= j) {
        while (i <= j && lineStr[i].trim()[0] !== '#') {
          lineStr[i] = lineStr[i].replace(/\b.+/g, (item) => {
            return `    \\item ${item}`
          })
          i++
        }
        while (i <= j && lineStr[j].trim()[0] !== '#') {
          lineStr[j] = lineStr[j].replace(/\b.+/g, (item) => {
            return `    \\item ${item}`
          })
          j--
        }
        if (i > j) {
          break
        }
        let listType = lineStr[i].trim()
        lineStr[i] = lineStr[i].replace(
          listType,
          `\\begin{${
            listType === '#ol' ? 'enumerate' : 'itemize'
          }}[leftmargin=2\\parindent]`
        )
        lineStr[j] = lineStr[j].replace(
          /#/g,
          `\\end{${listType === '#ol' ? 'enumerate' : 'itemize'}}`
        )
        i++
        j--
      }
      let res = lineStr.join('\n')
      return res
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
      let match = content.match(/[[【].+[\]】]/gm)
      return match ? match[0].slice(1, -1) : ''
    },
    getFigPath(content) {
      let match = content.match(/[(（].+[)）]/gm)
      return match ? match[0].slice(1, -1) : ''
    },
    parseWrapFigure(content) {
      let figName = content
      return (
        '\\begin{wrapfigure}[ht]\n' +
        '\t\\centering\n' +
        `\t\\includegraphics[width=0.8\\textwidth]{图片路径.png}\n` +
        `\t\\caption{${figName}}\n` +
        `\t\\label{fig:${figName}}%\\ref{fig:${figName}}\n` +
        '\\end{wrapfigure}\n'
      )
    },
    /**
     * 处理多行楷体
     */
    parseKaishu(content) {
      return `{\\kaishu ${content}}`
    },
    /**
     * 处理多行粗体
     */
    parseBf(content) {
      return `{\\bf ${content}}`
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
      // 处理标题
      if (/^# (.+)/.test(content)) {
        let section = content.match(/^# (.+)/)[1]
        return `\\section{${section}}`
      }
      if (/^## (.+)/.test(content)) {
        let subSection = content.match(/^## (.+)/)[1]
        return `\\subsection{${subSection}}`
      }
      // 处理markdown格式的图片
      if (content[0] === '!') {
        let name = this.getFigName(content)
        let path = this.getFigPath(content)
        if (name && path) {
          return (
            '\\begin{figure}[ht]\n' +
            '\t\\centering\n' +
            `\t\\includegraphics[width=0.8\\textwidth]{${path}.png}\n` +
            `\t\\caption{${name}}\n` +
            `\t\\label{fig:${name}}\n` +
            `\t%\\ref{fig:${name}}\n` +
            '\\end{figure}\n'
          )
        }
      }
      return content
    },
    /**
     * 处理选择题选项
     */
    parseChoiceQuestion(content) {
      let choices = content
        .trim()
        .split(/[ABCD\-+][.|,|，|。|\s]{0,}/)
        .slice(1)
      let itemStr = ''
      for (let item of choices) {
        item = item.trim()
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
      let dom = document.getElementById('latex-area')
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

    convertToLatex(type) {
      let dom = document.getElementById('latex-area')
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
.content-wrapper {
  display: flex;
  flex-direction: row;
  padding: 5px;
  min-height: calc(100vh - 70px);
}

.content-wrapper section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-wrapper .origin-section {
  margin-right: 0 !important;
}
#main section {
  margin: 0 5px 0 5px;
  border: 1px solid #9d9d9d;
  padding: 0px 8px 8px 8px;
  border-radius: 5px;
}
.origin-section {
  background: cornsilk;
}

.text-area {
  flex: 1;
}
#latex-area,
#lh-area {
  height: 100%;
}
#main header {
  font-size: 40px;
  font-weight: 800;
  text-align: center;
  padding: 10px;
  position: relative;
  height: 40px;
  line-height: 1;
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

#main header span {
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
.up-region .el-button {
  float: right;
  padding: 0;
}
.down-region {
  /* overflow: scroll; */
  padding: 0 5px 0 5px;
  max-height: 65px;
  overflow: scroll;
  /* flex: 1; */
}
.name-input {
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
}
.name-input span {
  font-size: 14px;
  padding: 5px;
  width: 70px;
}
.name-input .text-area {
  flex: 1;
}

* {
  margin: 0;
}
.tag-item {
  margin: 5px 10px 5px 0 !important;
  cursor: pointer;
}

.active #latex-area {
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
