<template>
  <div id="app">
    <test :code="code"></test>
    <edit></edit>
  </div>
</template>

<script>
import Edit from '@/components/Edit.vue'
import Test from './components/Test.vue'

export default {
  name: 'App',
  components: {
    Edit,
    Test,
  },
  watch: {},
  data() {
    return {
      code: 'fdsfjdk',
    }
  },
  methods: {},
}
</script>

<style>
* {
  margin: 0;
}
</style>
