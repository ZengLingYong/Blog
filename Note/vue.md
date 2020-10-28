1. 插值只能放表达式，不能放 JS 语句
2. v-html 插入 html， 会覆盖子元素，有 xss 风险


$nextTick
1. Vue 是异步渲染
2. data 改变后，DOM 不会立即渲染（多次改变会合并）
3. $nextTick 会在 DOM 渲染之后被出发，以获取最新 DOM 节点

mixin 缺点：
1. 变量来源不明确，不利于阅读
2. 多 mixin 方法或数据对象属性命名冲突，生命周期会全保留
3. mixin 和组件对应关系多对多，复杂度高

Vue 组件通讯：
1. props 和 $emit（父子）
2. 自定义事件 event.$on/$emit（兄弟或跨层级）
3. Vuex

Vue 高级特性：
1. 自定义 v-model
2. $nextTick
3. slot
4. 动态、异步组件
5. keep-alive
6. mixin


webpack:
1. module: 各个源码文件，一切皆模块
2. chunk: 分析得出，多模块合并成的，如 entry/import/splitChunk
3. bundle: 最终的输出文件

| 生产 | 开发 |
| -- | -- |
| 优化 babel-loader | 自动刷新 |
| IgnorePlugin | 热更新 |
| noParse | DllPlugin |
| happyPack | -- |
| ParalleUglifyPlugin | -- | 
| 

1. 抽离CSS MiniCssExtractPlugin
2. 抽离公共代码 splitCHunk
3. 多入口文件，多个 HtmlWebpackPlugin 实例


性能优化: 
1. 优化 babel-loader
```javascript
{
  test: /\.js$/,
  loader: ['babel-loader?cacheDirectory], // 开启缓存
  include: srcPath  // 精确文件
}
```
2. happyPack 多进程打包（多核CPU）
```js
{
  rules: [
    {
      test: /\.js$/,
      use: ['happypack/loader?id=babel'],
      include: srcPath
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
3. ParalleUglifyPlugin 多进程压缩 JS
* 项目较大，打包较慢，开启多进程可提高速度
* 项目较小，打包很快，开启多进程会降低速度（进程开销）

4. IgnorePlugin
5. noParse
6. 自动刷新 `watch: true`
7. 热更新（刷新时留存状态），需手动配置哪些文件改动会触发热更新
8. DllPlugin 动态链接库
  * DllPlugin - 打包出 dll 文件
  * DllReferencePlugin - 使用 dll 文件

产出代码：
1. 小图片 base64 编码
2. 提取公共代码
3. bundle 加 hash
4. IgnorePlugin
5. 懒加载
6. 使用 CDN 加速 （output 配置 publicPath)
7. 使用 production 
  * 自动开启代码压缩
  * Vue/React 自动删掉调试代码（如开发环境的 warning)
  * 启动 Tree-Shaking (ES Module才可，CommonJS 不可)
8. Scope Hosting （多个函数合并一个函数，减少作用域）
  * 代码体积更小
  * 创建函数作用域更少
  * 代码可读性更好

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