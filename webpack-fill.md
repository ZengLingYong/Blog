

> webpack 默认只压缩 js 文件，或者理解为 webpack 默认只能处理 js 文件，对于其它文件格式需借用 loader/ plugin 来转化

> loader执行顺序：默认从右到左，从下到上

| plugin | 功能 |
| HtmlWebpackPlugin | 打包生成 html 文件 |
| MiniCssExtractPlugin | 将 CSS 文件抽离成单独文件以 link 方式插入到 html 中 |
| OptimizeCSSAssetsPlugin | 处理 CSS 压缩，使用该插件后，需自行处理 js 压缩 |
| UglifyJsPlugin | 处理 js 压缩 |
| html-withimg-loader | 处理 html 中的图片命名，与 file-loader 同步 |

| loader | 功能 |
| css-loader | 处理 CSS 样式文件，如 @import |
| style-loader | 处理 CSS 样式文件插入到 html 中 |
| post-loader | 补全浏览器兼容前缀，搭配 autoprefixer 使用，并先于 css-loader 执行，额外配置文件 .bowerlistrc/postcss.config.js |
| babel-loader | 处理 ES6 转换，@babel/core @babel/preset-env @babel/plugin-transform-runtime |
| eslint-loader | 处理语法校验 |
| expose-loader | 暴露给全局对象 |
| file-loader | 生成图片到 build 目录 |
| url-loader | 能限制图片大小转换 base64 |


#### loader 类型：
* 前置 loader `enforce: 'pre'` 优先执行 
* 后置 loader `enforce: 'post'` 延后执行
* 普通 loader
* 内联 loader `expose?$!jquery` 


#### 引用 jQuery
* expose-loader 暴露到 window 上
* webpack.ProvidePlugin 暴露到每个模块
* 引入打包 exteneral 避免重复打包


#### devtool 的 sourceMap
* source-map  增加映射文件，大而全
* eval-source-map 不产生单独文件，可显示行列
* cheap-module-source-map 单独映射文件，显示行不显示列
* cheap-module-eval-source-map 有行无列

* outputPath 输出分目录
* CDN 用 publicPath  
* watch 监控webpack配置文件变化

```js
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

```
// .bowerlistsrc
last 2 versions
```

```js
// 处理 js/css 压缩
optimization: {
  minimizer: [
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true
    }),
    new OptimizeCSSAssetsPlugin()
  ]
},
```