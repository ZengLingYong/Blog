

> webpack 默认只压缩 js 文件，或者理解为 webpack 默认只能处理 js 文件，对于其它文件格式需借用 loader/ plugin 来转化

> loader执行顺序：默认从右到左，从下到上

| plugin | 功能 |
| -- | -- |
| HtmlWebpackPlugin | 打包生成 html 文件 |
| MiniCssExtractPlugin | 将 CSS 文件抽离成单独文件以 link 方式插入到 html 中 |
| OptimizeCSSAssetsPlugin | 处理 CSS 压缩，使用该插件后，需自行处理 js 压缩 |
| UglifyJsPlugin | 处理 js 压缩 |
| CleanWebpackPlugin | 处理每次打包清除指定文件夹，默认是 dist |
| CopyWebpackPlugin | 处理文件拷贝 |

webpack 自带的 plugin

| plugin | 功能 |
| -- | -- |
| BannerPlugin | 向 js 文件 copyright | 
| IgnorePlugin | 忽略打包指定引用文件，如屏蔽 moment 全语言包引入 |


| loader | 功能 |
| -- | -- |
| css-loader | 处理 CSS 样式文件，如 @import |
| style-loader | 处理 CSS 样式文件插入到 html 中 |
| post-loader | 补全浏览器前缀，搭配 autoprefixer 使用，并先于 css-loader 执行，额外配置文件 .bowerlistrc/postcss.config.js |
| less-loader | 搭配 less 处理 |
| sass-loader | 搭配 sass 处理 |
| babel-loader | 处理 ES6 转换，@babel/core @babel/preset-env @babel/plugin-transform-runtime |
| eslint-loader | 处理语法校验 |
| expose-loader | 暴露给全局对象 |
| file-loader | 生成图片到 build 目录 |
| url-loader | 能限制图片大小转换 base64 |
| html-withimg-loader | 处理 html 中的图片命名，与 file-loader 同步 |


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

#### 前后端数据调试
1. 代理 proxy
2. mock数据 before(app) {...}
3. 中间件共享端口 webpack-dev-middleware


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


resolve
* 处理包查找位置
* 处理 import 后缀简写
* 处理包默认引用文件，一般为main.js
* webpack.DefinePlugin 定义环境遍历
* webpack-merge 区分打包环境


优化
* noParse 不去解析包的依赖
* exclude 排除处理文件
* IgnorePlugin 忽略打包指定文件，如语言包
* DllPlugin 单独打包公共模块
* happypack 多线程打包

webpack 内置优化
* tree-shaking 
* scope hosting 作用域提升

抽取公共代码（多页面） 
optimization splitChunks

热更新 
* NamedModulesPlugin 热更新模块路径
* HotModuleReplacementPlugin 热更新插件


Webpack 事件流机制核心：Tabable，类似 NodeJs 的 events 库，原理是发布订阅模式
```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParalleHook,
  AsyncParelleBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfailHook
} = require('tapable');
```

> SyncHook: 