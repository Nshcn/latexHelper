<template>
  <div id="app">
    <!-- <el-radio-group v-model="questionType">
      <el-radio-button label="choice"
                       size="small">选择题</el-radio-button>
      <el-radio-button label="essay"
                       size="small">问答题</el-radio-button>
    </el-radio-group> -->
    <edit :source-text="originText"></edit>
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
            '【题目】\n\n/opt\n\n/\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n/ol\n\n/\n【对命制练习题的启发】\n/ol\n\n/\n'
          break
        case 'essay':
          this.originText =
            '【题目】\n\n【参考答案】\n\n【本题解析】\n\n【对知识点解析工作的启发】\n/ol\n\n/\n【对命制练习题的启发】\n/ol\n\n/\n'
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
