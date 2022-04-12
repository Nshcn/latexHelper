let  copyResult=(type)=> {
  let content =
    '\n' +
    (type === 'exercises' ? this.latexExercises : this.latexAnswers) +
    '\n'
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
}


export {copyResult}