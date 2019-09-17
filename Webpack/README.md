webpack 自身只处理 js 文件，其它文件格式需使用 loader 来转换为 webpack 能处理的有效文件，如 css、jpg|png、json 等。

## mode 模式
1. development
2. production
3. none

默认打包方式为 production，会启用 uglifyjs 对 js 代码压缩。

### NODE_ENV
webpack.config.js 无法直接配置 process.env.NODE_ENV 的值，但可以使用 webpack.DefinePlugin 为所有依赖指定该环境值。

```js
module.exports = {
  //...
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production');
    }),
  ]
}
```

## loader 加载器
loader 本身是一个函数，用于对模块的源代码进行转换，在配置文件的 module.rules 中配置 loader。

### loader 特性
1. 执行顺序：默认从右到左，从下到上
2. 支持链式传递，支持同异步，命名约定为 `xxx-loader`

| 常用 loader | 功能 |
| -- | -- |
| css-loader | 处理 CSS 文件，如 @import/url 等 |
| style-loader | 处理 CSS 文件插入到 html 中 |
| post-loader | 补全浏览器前缀，配合 autoprefixer 使用，并先于 css-loader 执行，额外配置文件 .bowerlistrc/postcss.config.js |
| less-loader | 配合 less 处理 |
| sass-loader | 配合 sass 处理 |
| babel-loader | 处理 ES6 转换，@babel/core @babel/preset-env @babel/plugin-transform-runtime |
| eslint-loader | 处理语法校验 |
| file-loader | 生成文件到 build 目录，并返回地址 |
| url-loader | 能限制图片大小转换 base64，超出则类似 file-loader |
| html-withimg-loader | 处理 html 中的图片命名，与 file-loader 同步 |
| expose-loader | 暴露给全局对象 |

### loader 类型：
* 前置 loader `enforce: 'pre'` 优先执行 
* 后置 loader `enforce: 'post'` 延后执行
* 普通 loader 
* 内联 loader `expose?$!jquery` 
* 行内 loader `inline-loader!./a.js`

#### 行内 loader
| 方式 |  |
| -- | -- |
| 默认使用 | `inline-loader!./a.js` |
| pre + normal 不处理 | `-!inline-loader!./a.js` |
| normal 不处理 | `!inline-loader!./a.js` |
| 仅 inline-loader 执行 | `!!inline-loader!./a.js` |

#### loader 组成
1. pitch
2. normal

```js
// 3 个 loader -> [1, 2, 3]

// 顺序：pithch: 1 -> 2 -> 3 -> 资源 -> normal: 3 -> 2 -> 1
```

pitch 两种情况：
1. 无返回值，继续后续执行
2. 有返回值，阻断后续执行，例如 pitch 2 有返回值，将会执行 normal 3

```js
loader2.pitch = fn () {
  //... 有返回值，loader2 不会执行，执行 loader1
  //... 无返回值，执行 loader3 -> loader2 -> loader1
}
```

### 常用 loader 源码实现

![url-loader](http://img.wuliv.com/1568626043156.png)

[查看更多](https://github.com/ZengLingYong/Blog/tree/master/Webpack/Loader)


## plugin
plugin 本身是一个具有 `apply()` 方法的类，目的在于解决 loader 无法实现的其它问题。

| 常用 plugin | 功能 |
| -- | -- |
| html-webpack-plugin | 打包生成 html 文件 |
| mini-css-extract-plugin | 将 CSS 文件抽离成单独文件以 link 方式插入到 html 中 |
| optimize-css-assets-plugin | 处理 CSS 压缩，使用该插件后，需自行处理 js 压缩 |
| uglify-js-plugin | 处理 js 压缩 |
| clean-webpack-plugin | 处理每次打包清除指定文件夹，默认是 dist |
| copy-webpack-plugin | 处理文件拷贝 |
| happpack | 多线程打包 |

webpack 本身也集成了部分常用的 plugin 

| webpack/plugin | 功能 |
| -- | -- |
| BannerPlugin | 向 js 文件插入注释内容 | 
| IgnorePlugin | 忽略打包指定引用文件，如屏蔽 moment 全语言包引入 |
| DllPlugin | 用于第三方分离打包 |
| DefinePlugin | 定义环境变量 |
| ProvidePlugin | 暴露模块，不必通过 import/require 引用 |

## 模块解析

### resolve

功能：
1. 处理模块查找位置；
2. 处理 import 后缀简写；
3. 处理模块默认引用文件，默认为 main.js

配置方式：
* modules 
* mainFields
* mainFiles
* alias
* estensions

```js
module.exports = {
  //...
  resolve: {
    // 指定模块查找目录，当前 node_modules 目录下查找，不指定时则会一直向上查找
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
}
```

### resolveLoader
功能：处理 loader 查找位置

配置方式：
* modules
* alias

```js
module.exports = {
  //...
  resolveLoader: {
    // 指定 loader 查找目录，node_modules 找不到，再去 loaders 目录查找
    modules: [path.resolve('node_modules'), path.resolve(__dirname, 'loaders')],
    // 通过别名的方式指定 loader 文件路径
    alias: {
      myLoader: path.resolve(__dirname, 'loaders', 'myLoader.js')
    }
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


## 全局变量引入，
* expose-loader 暴露到 window 上；
* webpack.ProvidePlugin 暴露到每个模块；
* CDN 外链与 import 共用时，使用 exteneral 避免重复打包

### expose-loader 暴露 $ 到 window 对象
```js
import $ from 'expose-loader?$!jquery';
console.log(window.$);
```

或在 webpack 中配置
```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: 'expose-loader?$
      }
    ]
  }
}

// 正常使用
import $ from 'jquery'
```

### webpack.ProvidePlugin 暴露到每个模块
```js
module.exports = {
  //...
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
}

// 各模块可直接使用，无需 import/require引入
```

### CDN 引用避免重复引用打包
```js
module.exports = {
  //...
  externals: {
    jquery: 'jQuery'
  }
}
```


## 前后端接口调试
1. 代理 proxy
2. mock 数据 before(app) {...}
3. 中间件共享端口 webpack-dev-middleware


## webpack-merge 区分打包环境

```js
// webpack.common.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist)
  }
}
```

```js
// webpack.dev.js
const webpackMerge = require('webpack-merge');
module.exports = webpackMerge(common, {
  mode: 'development',
  devServer: {
    port: '8080',
    contentBase: 'dist
})
```

```js
// webpack.prod.js
const webpackMerge = require('webpack-merge');
module.exports = webpackMerge(common, {
  mode: 'production',
  optimization: {
    minimize: true
  },
})
```

```
// 开发环境构建
webpack --config webpack.dev.js
// 生成环境构建
webpack --config webpack.prod.js
```

## webpack 优化

### webpack 内置优化
* tree-shaking 
* scope hosting 作用域提升

### 生产环境代码压缩
```js
// 处理 js/css 压缩
module.exports = {
  //...
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
}
```

### 抽取公共代码（多页面）
```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          chunks: 'initial',
          name: 'common'
        },
        vendor: {
          chunks: 'initial',
          test: /node_modules/,
          name: 'vendor',
          priority: 1
        }
      }
    }
  }
}
```

### noParse 不解析包的依赖
```js
import $ from 'jquery
```

webpack 默认会去解析引用的包是否有依赖，如上 webpack 会去解析 jquery 这个包是否还有其它依赖项，但 jquery 是个独立的包，并没有其它依赖，因此可使用 noParse 让 webpack 构建时屏蔽对 jquery 包中依赖项进行检查和解析。

```js
module.exports = {
  //...
  module: {
    noParse: /jquery/,  // 不去解析 jquery 中的依赖关系
    //...
  }
}
```

### include/exclude
缩小 loader 处理文件的范围：include 包含 / exclude 排除

```js
module.exports = {
  //...
  module: {
    rules: [
      { 
        test: /\.js$/, 
        include: path.resolve('src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            preset: ['@babel/preset-env']
          }
        } 
      },
    ],
  }
}
```

### webpack.IgnorePlugin 忽略依赖文件
针对 moment 语言包全部引入的情况下，使用后需手动引入需要的语言包文件。
```js
// 使用 moment
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn'),
moment().endOf('day').fromNow();
```

```js
// webpack 配置
module.exports = {
  //...
  plugins: [
    new webpack.IgnorePlugin(/\.\/locale/, /moment/),
    // 如果从 moment 中 引入了 ./locale/* 文件，就会自动屏蔽构建
  ]
}
```

### DllPlugin 单独打包第三方公共模块
针对第三包，在开发环境时无需频繁构建，因此可针对第三包单独构建，并生成映射。

[查看源码](https://github.com/ZengLingYong/Blog/tree/master/Webpack/DllPlugin) 

### happypack 多线程打包
```js
const Happypack = require('happypack');

module.exports = {
  //...
  plugins: [
    new Happpack({
      id: 'css',
      use: ['style-loader', 'css-loader']
    }),
  ],
  module: {
    rules: [
      { test: /\.css$/, use: 'Happypack/loader?id=css' },
    ],
  }
}
```

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

[查看源码](https://github.com/ZengLingYong/Blog/tree/master/Webpack/Tabable)