<template>
  <div class="exercise">
    <codemirror v-model="codeSnippets"
                :options="cmOptions" />
  </div>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
export default {
  name: 'Test',
  props: {
    code: String,
  },
  created() {
    this.codeSnippets = this.code
  },
  data() {
    return {
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript', // 模式
        theme: 'base16-dark', // 主题
        lineNumbers: true, // 是否显示行数
        line: true,
        viewportMargin: Infinity, // 处理高度自适应时搭配使用
        highlightDifferences: true,
        autofocus: false,
        indentUnit: 2,
        smartIndent: true,
        // readOnly: true, // 只读
        showCursorWhenSelecting: true,
        firstLineNumber: 1,
        // 更多配置查询 https://codemirror.net/doc/manual.html#config
      },
      codeSnippets: `for (var i = 0; i < 3; i++) {
        setTimeout(() => console.log(i), 1)
      }

      for (let i = 0; i < 3; i++) {
        setTimeout(() => console.log(i), 1)
      }`,
    }
  },
  components: {
    codemirror,
  },
}
</script>
<style>
/* 注意：这里的样式需要全局，如果写了scoped会导致样式不生效 */
.CodeMirror {
  border: 1px solid #eee;
  height: auto; /* 编辑器盒子高度自适应 */
  width: 30%;
}
</style>