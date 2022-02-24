const vConsolePlugin = require('vconsole-webpack-plugin')

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js', // 入口文件
      title: 'latexHelper'
    }
  },
  publicPath: './',
  configureWebpack: config => {
    //生产环境去掉vconsole调试器
  let envType = process.env.NODE_ENV != 'production'
  let pluginsDev = [
      new vConsolePlugin({
          filter: [],
          enable: envType
      })
  ]

  config.plugins = [...config.plugins, ...pluginsDev]
 }

}