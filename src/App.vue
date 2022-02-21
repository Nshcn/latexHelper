<template>
  <div id="app">
    <el-input type="textarea"
              placeholder="请输入题目"
              v-model="question"
              :autosize="{ minRows: 8}"
              show-word-limit>
    </el-input>
    <el-input type="textarea"
              placeholder="请输入答案"
              v-model="answer"
              :autosize="{ minRows: 8}"
              show-word-limit>
    </el-input>
    <el-input type="textarea"
              placeholder="请输入解析"
              v-model="analysis"
              :autosize="{ minRows: 8}"
              show-word-limit>
    </el-input>
    <el-input type="textarea"
              placeholder="请输入对知识点解析工作的启发"
              v-model="knowledgeInspiration"
              :autosize="{ minRows: 8}"
              show-word-limit>
    </el-input>
    <el-input type="textarea"
              placeholder="请输入对命制练习题的启发"
              v-model="QuestionInspiration"
              :autosize="{ minRows: 8}"
              show-word-limit>
    </el-input>
    <el-button type="primary"
               @click="generateLatex">生成latex</el-button>
    <el-input type="textarea"
              placeholder=""
              v-model="latexResult"
              :autosize="{ minRows: 8}"
              show-word-limit>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      question: '',
      answer: '',
      analysis: '',
      knowledgeInspiration: '',
      QuestionInspiration: '',
      latexResult: '',
    }
  },
  methods: {
    generateLatex() {
      this.latexResult =
        this.question +
        '\n【参考答案】' +
        this.answer +
        '\n【本题解析】\n' +
        this.analysis +
        '\n{\\kaihsu\n' +
        '【对知识点解析工作的启发】\n' +
        '\\begin{enumerate}[leftmargin=2\\parindent]\n' +
        this.knowledgeInspiration +
        '\n\\end{enumerate}' +
        '\n【对命制练习题的启发】' +
        '\n\\begin{enumerate}[leftmargin=2\\parindent]\n' +
        this.QuestionInspiration +
        '\n\\end{enumerate}' +
        '\n}'
    },
  },
}
</script>

<style>
</style>
