

> webpack 自身只处理 js 文件，其它文件格式需使用 loader 来转换为 webpack 能处理的有效文件

## mode 模式
1. development
2. production 默认，会开启 UglifyJsPlugin 


## loader 加载器
loader 本身是一个函数，用于对模块的源代码进行转换，配置文件中在 module.rules 中配置 loader。

> loader执行顺序：默认从右到左，从下到上，支持链式传递，支持同异步，命名约定为 xxx-loader

| 常用loader | 功能 |
| -- | -- |
| css-loader | 处理 CSS 样式文件，如 @import/url 等 |
| style-loader | 处理 CSS 样式文件插入到 html 中 |
| post-loader | 补全浏览器前缀，搭配 autoprefixer 使用，并先于 css-loader 执行，额外配置文件 .bowerlistrc/postcss.config.js |
| less-loader | 搭配 less 处理 |
| sass-loader | 搭配 sass 处理 |
| babel-loader | 处理 ES6 转换，@babel/core @babel/preset-env @babel/plugin-transform-runtime |
| eslint-loader | 处理语法校验 |
| expose-loader | 暴露给全局对象 |
| file-loader | 生成图片到 build 目录 |
| url-loader | 能限制图片大小转换 base64，超出限制使用 file-loader |
| html-withimg-loader | 处理 html 中的图片命名，与 file-loader 同步 |

### loader 类型：
* 前置 loader `enforce: 'pre'` 优先执行 
* 后置 loader `enforce: 'post'` 延后执行
* 普通 loader
* 内联 loader `expose?$!jquery` 
* 行内 loader `inline-loader!./a.js`

### 行内 loader
1. 默认使用
```js
inline-loader!./a.js
```
2. 不再交由 pre + normal 处理
```js
-!inline-loader!./a.js
```
3. 不再交由 normal 处理
```js
!inline-loader!./a.js
```
4. 只由 inline-loader 执行
```js
!!inline-loader!./a.js
```

### loader 组成
1. pitch
2. normal

```js
[1,2,3]

// pithch: 1 -> 2 -> 3 -> 资源 -> normal: 3 -> 2 -> 1
```

pitch 两种情况：
1. 若无返回值，将会继续执行，若有返回值
2. 将会阻断后续执行，例如 pitch 2 有返回值，将会执行 normal 3

```js
loader2.pitch = fn() {
  //... 有返回值，loader2不会执行，执行loader1
  //... 无返回值，执行loader3 -> loader2 -> loader1
}
```

### 常用 loader 源码实现

![url-loader](http://img.wuliv.com/1568626043156.png)

[查看更多](https://github.com/ZengLingYong/Blog/tree/master/Webpack/Loader)


### 引用 jQuery
* expose-loader 暴露到 window 上
* webpack.ProvidePlugin 暴露到每个模块
* 引入打包 exteneral 避免重复打包

## plugin
plugin 本身是一个具有 `apply` 方法的类，目的在于解决 loader 无法实现的其它问题。

| 常用plugin | 功能 |
| -- | -- |
| HtmlWebpackPlugin | 打包生成 html 文件 |
| MiniCssExtractPlugin | 将 CSS 文件抽离成单独文件以 link 方式插入到 html 中 |
| OptimizeCSSAssetsPlugin | 处理 CSS 压缩，使用该插件后，需自行处理 js 压缩 |
| UglifyJsPlugin | 处理 js 压缩 |
| CleanWebpackPlugin | 处理每次打包清除指定文件夹，默认是 dist |
| CopyWebpackPlugin | 处理文件拷贝 |
| CommonsChunkPlugin | 提取公用代码 |


| webpack 自带plugin | 功能 |
| -- | -- |
| BannerPlugin | 向 js 文件 插入注释内容 | 
| IgnorePlugin | 忽略打包指定引用文件，如屏蔽 moment 全语言包引入 |

## 模块解析

### resolve

resolve 的作用：
1. 处理模块查找位置
2. 处理 import 后缀简写
3. 处理模块默认引用文件，默认为 main.js

resolve 配置方式：
* modules 
* mainFields
* mainFiles
* alias
* estensions

```js
resolve: {
  // 指定模块查找目录，当前 node_modules 目录下查找
  modules: [path.resolve('node_modules')],  
  // 指定目录顺序，先在 style 目录下找，找不到再到 main 目录
  mainFields: ['style', 'main'],    
  // 指定入口文件为 index.js
  mainFiles: ['index.js'],
  // 指定别名对应的引入文件
  alias: {
    bootstrap: 'bootstrap/dist/css/bootstrap.css'
  },
  // 省略文件扩展名，默认按序查找引用 import HomePage from './homePage'
  extensions: ['.vue', '.js', '.css']
}
```

### resolveLoader
作用：处理 loader 查找位置

配置方式：
* modules
* alias

```js
resolveLoader: {
  // 指定 loader 查找目录，node_modules 找不到，再去 loader 目录查找
  modules: [path.resolve('node_modules'), path.resolve(__dirname, 'loaders')]
  // 通过别名的方式指定 loader 文件路径
  alias: {
    myLoader: path.resolve(__dirname, 'loaders', 'myLoader.js')
  }
}
```

## devtool 的 sourceMap
| 类型 | 功能 |
| -- | -- |
| source-map | 增加映射文件，大而全 |
| eval-source-map | 无单独文件，可显示行列 |
| cheap-module-source-map | 单独映射文件，显示行不显示列 |
| cheap-module-eval-source-map | 无单独文件，有行无列 |


## 前后端接口调试
1. 代理 proxy
2. mock数据 before(app) {...}
3. 中间件共享端口 webpack-dev-middleware

## webpack 优化

### webpack 内置优化
* tree-shaking 
* scope hosting 作用域提升

### 生产环境代码压缩
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

### 抽取公共代码（多页面）
optimization splitChunks

### 其它优化方案
* noParse 不去解析包的依赖
* exclude 排除处理文件
* IgnorePlugin 忽略打包指定文件，如语言包
* DllPlugin 单独打包公共模块
* happypack 多线程打包


### 热更新 
* NamedModulesPlugin 热更新模块路径
* HotModuleReplacementPlugin 热更新插件


## webpack 事件机制

Webpack 事件流机制核心：Tapable，类似 NodeJs 的 events 库，原理是 "发布订阅模式"

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

| Tabable 钩子 | 功能 |
| -- | -- |
| SyncHook | 同步钩子，顺序执行 forEach |
| SyncBailHook | 同步容断钩子，当某个tap事件有返回值时（非 undefined)，中断后续执行 do...while |
| SyncWaterfallHook | 同步瀑布钩子，钩子回调函数数据往下传递 reduce |
| SyncLoopHook | 同步多次执行，当某个tap事件有返回值时（非 undefined)，循环执行
| AsyncParalleHook | 异步并行钩子，每个tapAsync事件调用回调，所有都执行方可执行caaSync的回调 |
| AsyncParalleBailHook | 异步并行容断钩子 |
| AsyncSeriesHook | 异步串行钩子 |
| AsyncSeriesBailHook | 异步串行容断钩子 |
| AsyncSeriesWaterfallHook | 异步串行瀑布钩子 |

* Sync 同步钩子使用 `tap/call`
* Async 异步钩子使用 `tapAsync/callAsync` 和 `tapPromie/promise`

[源码实现](https://github.com/ZengLingYong/Blog/tree/master/Webpack/Tabable)


## 待整理
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

* webpack.DefinePlugin 定义环境遍历
* webpack-merge 区分打包环境


webpack-dev-middleware 集成在 webpack-dev-server，也可单独使用

```js
// webpack-dev-middleware 搭建服务器
const express = require('express');
const webpack = require('webpack');

const webpackDevMiddle = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

app.use(webpackDevMiddle(compiler, {
  publicPath: config.output.publicPath
}))

app.listen(4444, function() {
  console.log('Example app listening on port 3000!\n');
})
```