<template>
  <div id="app">
    <el-card>
      <div slot="header">编辑区</div>
      <div>
        <el-radio-group v-model="questionType">
          <el-radio-button label="choice"
                           size="small">选择题</el-radio-button>
          <el-radio-button label="essay"
                           size="small">问答题</el-radio-button>
        </el-radio-group>
        <edit :source-text="originText"></edit>
      </div>
    </el-card>
    <el-button type="primary"
               @click="copyResult">复制</el-button>
  </div>
</template>

<script>
import Edit from '@/components/Edit.vue'

// eslint-disable-next-line no-unused-vars
function tabInput(e) {
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
}

export default {
  name: 'App',
  components: {
    Edit,
  },
  watch: {
    questionType(newType) {
      switch (newType) {
        case 'choice':
          this.originText =
            '【题目】\n\n#opt\n\n#\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n#ol\n\n#\n【对命制练习题的启发】\n#ol\n\n#\n'
          break
        case 'essay':
          this.originText =
            '【题目】\n\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n#ol\n\n#\n【对命制练习题的启发】\n#ol\n\n#\n'
          break
        default:
          break
      }
    },
  },
  data() {
    return {
      originText: 'abcd',
      questionType: 'choice',
      analysis: '',
      latexResult: '',
    }
  },
  methods: {
    generateLatex() {
      this.parseOrderedList(this.analysis)
      this.copyResult()
    },

    copyResult() {
      let content = this.latexResult
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
