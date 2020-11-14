### module/chunk/bundle
1. module: 各个源码文件，一切皆模块
2. chunk: 分析得出，多模块合并成的，如 entry/import/splitChunk
3. bundle: 最终的输出文件

> module，chunk 和 bundle 其实就是同一份逻辑代码在不同转换场景下的取了三个名字：我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。

### hash/chunkHash/contentHash
* hash: 计算与整个项目构建相关
* chunkHash: 计算与同一 chunk 内容相关
* contentHash: 计算与文件内容本身相关

### webpackPrefetch/webpackPreload/webpackChunkName
webpackPrefetch: 浏览器闲时下载文件
webpackPreload: 父 chunk 加载时并行下载文件
webpackChunkName: 动态 import 时以注释形式为 chunk 文件取名
```javascript
import(/* webpackChunkName: "lodash" */ 'lodash');
```

### 开发/生产
1. 开发：cheap-module-eval-source-map 
2. 生产：cheap-module-source-map

| 生产 | 开发 |
| -- | -- |
| 优化 babel-loader | 自动刷新 |
| IgnorePlugin | 热更新 |
| noParse | DllPlugin |
| happyPack | -- |
| ParalleUglifyPlugin | -- | 
| 

1. 抽离CSS MiniCssExtractPlugin
2. 抽离公共代码 splitChunk
3. 多入口文件，多个 HtmlWebpackPlugin 实例


### 性能优化 - 构建
#### 1. 优化 babel-loader
```javascript
{
  test: /\.js$/,
  loader: ['babel-loader?cacheDirectory'], // 开启缓存
  include: path.resolve(__dirname, 'src')  // 明确范围
  // 排除范围，include 和 exclude 两者选一个即可
  // exclude: path.resolve(__direname, 'node_modules')
}
```

#### 2. IgnorePlugin 忽略无用文件（直接不引入，代码没有）
例如：moment 会支持多语言，如何只引入中文模块？
```javascript
// 忽略 moment 下的 /locale目录
new webpack.IgnorePlugin(/\.\/locale/, /moment/)

// 业务代码中自行引入语言包
import 'moment/locale/zh-cn'
```

#### 3. noParse 避免重复打包
```javascript
module: {
  noParse: [/react\.min\.js$/]
}
```

IgnorePlugin 与 noParse 区别：
1. IgnorePlugin 直接不引入，代码中没有
2. noParse (类似vue.min.js已经模块化处理过)引入，但不打包

#### 4. happyPack 多进程打包（多核CPU）
```js
const HappyPack = require('happypack');

{
  rules: [
    {
      test: /\.js$/,
      use: ['happypack/loader?id=babel'],
    }
  ],
  plugin: [
    new HappyPack({
      id: 'babel',
      loaders: ['babel-loader?cacheDirectory']
    })
  ]
}
```
#### 5. ParalleUglifyPlugin 多进程压缩 JS
  * 项目较大，打包较慢，开启多进程可提高速度
  * 项目较小，打包很快，开启多进程会降低速度（进程开销）

```javascript
// 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
const ParallelUglifyPlugin = require('ParallelUglifyPlugin')

new ParallelUglifyPlugin({
  // 传递给 UglifyJS 的参数
  // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
  uglifyJS: {
    output: {
      beautify: false, // 最紧凑的输出
      comments: false // 删除所有的注释
    },
    compress: {
        // 删除所有的 `console` 语句，可以兼容ie浏览器
        drop_console: true,
        // 内嵌定义了但是只用到一次的变量
        collapse_vars: true,
        // 提取出出现多次但是没有定义成变量去引用的静态值
        reduce_vars: true
      }
  }
})

```

#### 6. 自动刷新 `watch: true`
#### 7. 热更新（刷新时留存状态）
1. HotModuleReplacementPlugin
2. webpack-dev-server 自带 `hot: true`

#### DllPlugin 动态链接库
1. DllPlugin - 打包出 dll 文件
2. DllReferencePlugin - 使用 dll 文件
3. 可借用 AutoDllPlugin 简化配置
4. Dll 加速不明显，可用 HardSourceWebpackPlugin 替代

vue-cli/create-react-app 已移除，Webpack4 打包速度足够快不再需要使用 DllPlugin


### 性能优化 - 打包
1. 小图片 base64 编码（对图片使用 url-loader 配置 options.limit)
2. bundle 加 hash `[name].[contentHash:8].js`
3. 懒加载 `()=>import()`
4. 提取公共代码 `splitChunks` 公共代码和第三方库
5. IgnorePlugin 忽略文件不引入打包
6. 使用 CDN 加速 （output 配置 publicPath)
  * output 配置 publicPath
  * url-loader 中的 options 也加入 publicPath （设置图片）
7. 使用 production 
  * 自动开启代码压缩
  * Vue/React 自动删掉调试代码（如开发环境的 warning)
  * 启动 Tree-Shaking (ES Module才可，CommonJS 不可)
8. Scope Hosting （多个函数合并一个函数，减少作用域）
  * 代码体积更小
  * 创建函数作用域更少
  * 代码可读性更好

### 模块化
* ES Module 静态引用，编译时引入
* Commonjs 动态引入，执行时引入
* Tree-Shaking 只支持静态分析

babel: 
1. Polyfill —— 7.4弃用 补丁（core-js/regenerator)的集合 
2. presets —— 预设，plugin 的集合
3. plugins —— 实际 babel 转换工作
4. Polyfill 7.4 弃用，直接使用 core-js/regenerator，会污染全局环境
5. babel-runtime 不会污染全局环境（开发第三方库）
```js
{
  "presets": [
    [
      "@babel/preset-env" // 预设，plugin 的集合
    ]
  ],
  "plugins": [  // 实际 babel 转换是依赖多个 plugin 完成
    //...
  ]
}
```

***

参考文章：
* [webpack 中那些最易混淆的 5 个知识点](https://juejin.im/post/6844904007362674701)
* [辛辛苦苦学会的 webpack dll 配置，可能已经过时了](https://juejin.im/post/6844903952140468232)