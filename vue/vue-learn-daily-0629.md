> 路由 hash/history 模式实现原理及区别
#### hash 模式
* #后面hash值变化，浏览器不会发生请求，页面不会刷新
* 通过监听 `hashchange` 事件来监听 hash 变化，回调处理对应的页面显示 

#### history 模式
* HTML5 标准的两个API `pushState/replaceState`，这两个 api 会改变 url，但是不会发送请求，通过监听 url 变化回调处理页面显示

#### 区别
* url 显示上，hash模式有 #, history 模式没有
* 刷新页面时，hash 可正常加载到对应页面，history 需后端配置重定向到首页路由
* 兼容性上，hash 支持低版本浏览器

> Vue-router 导航守卫
* 全局前置钩子：beforeEach/beforeResolve/afterEach
* 路由独享守卫：beforeEnter
* 组件内守卫：beforeRouteEnter/beforeRouteUpdate/beforeRouteLeave

> diff 算法

> computed 与 watch 的区别
* computed：计算属性，依赖于其它属性值，可「缓存」，依赖的属性值变化时才会重新计算
* watch：无缓存，「观察」作用，对数据的监听回调，深度监听对象属性时，可 `deep: true` 

运用场景：
* computed：依赖于其它属性的 getter/setter 时，可利用缓存减少频繁计算
* watch：异步或开销大的操作，且需设置中间状态（如 loading )

> Vue 组件通信的方式

> Vue 模版编译原理

> v-model 双向数据绑定

> MVVM 理解

> 响应式数据/双向绑定原理

> Vue 的 混入(mixin)
* 分发组件中的复用功能，mixin 可包含任意组件选项
* 组件和 mixin 数据对象有同名选项时，会递归进行合并，冲突时组件数据优先
* 同名钩子函数合并为一个数组，mixin 优先执行
* 值为对象选项时，如 methods/components/directives，会合并为同一对象，冲突时组件为准
* 组件可混入多个 mixin 对象

Vue.extend 合并策略相同

