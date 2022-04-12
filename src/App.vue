<template>
  <div id="app">
    <edit v-if="false"></edit>
    <excel-to-latex />
  </div>
</template>

<script>
import Edit from '@/components/Edit.vue'
import ExcelToLatex from '@/components/ExcelToLatex'
export default {
  name: 'App',
  components: {
    Edit,
    ExcelToLatex,
  },
  watch: {},
  data() {
    return {}
  },
  methods: {},
}
</script>

<style>
* {
  margin: 0;
}
</style>
