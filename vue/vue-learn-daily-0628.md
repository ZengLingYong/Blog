> 组件中的 data 为什么是一个函数
* 组件可被复用多次，也就会创建多个实例，实际创建实例共用一个构造函数
* 若 data 为对象时，属引用类型，真实值存储在堆中，值引用指针存储在栈中。为保证组件中不同实例之间 data 数据对象独立不冲突，data 必须是一个函数，相当每次都执行函数返回一个新对象

> v-for 和 v-if 不建议联用
* `v-for` 优先级高于 `v-if`，联用意味着 `v-if` 作用于每次遍历判断，优化为在计算属性中过滤遍历数组
* 若想用 `v-if` 来控制是否执行循环逻辑，则在外层使用 `v-if`

> $nextTick 的实现原理
* 下次 DOM 更新循环结束后执行回调，在修改数据后立即使用 `$nextTick` 来获取更新后的 DOM

> Vue 不能检测数组的哪些变动？
* 利用索引直接设置一个数组项时 `vm.items[index] = newValue`
* 修改数组长度时 `vm.items.length = newLength`

解决方法：
1. Vue.set / Array.prototype.splice 
2. Array.prototype.splice ???

```js
// 索引设置数组项
Vue.set(vm.items, index, newValue);
vm.items.splice(index, 1, newValue);

// 改变数组长度
vm.items.splice(newLength); ???
```

针对数组的不纯函数会自动触发视图更新，如 `push/pop/shift/unshift/splice/sort/reverse`

> Vue 如何监测数组变化
* 使用函数劫持方式重写数组方法，对 data 中的数组进行原型链重写，指向了自定义的数组原型方法，调用数组 api 时，可通知更新依赖
* 若数组中包含引用类型，则会对引用类型再次递归遍历进行监控


> vm.$set() 解决对象新增属性不能响应问题？
* 如果目标是数组，直接使用数组的 splice 方法触发响应式
* 如果目标是对象，判断属性是否存在、对象是否为响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理

> defineReactive： Vue 在初始化对象时，对数据对象进行 Object.defineProperty 动态添加 getter/setter 的操作

> Vue 事件绑定原理？
* 原生事件绑定通过 `addEventListener` 给真实元素添加事件
* 组件事件绑定通过 Vue 自定义的 `$on` 实现

> key 属性作用
* 更准确：避免就地复用（Vue 默认会就地复用组件或元素）
* 更快速：利用 key 唯一性生成 map 对象获取对应节点，比遍历更快

key 使用 index 时，在顺序出现调整时，会导致 Vue 复用错误旧节点 ？？？

> 生命周期
| 生命周期 | 发生了什么 |
| -- | -- |
| beforeCreated | 实例创建前，data/methods/computed/watch 上的数据方法均不可用 |
| created | 实例创建后，可使用数据，在此阶段更改数据不触发 updated；无法获取 DOM，若需要可使用 $nextTick 来访问 DOM|
| beforeMount | 挂载前，当前阶段虚拟 DOM 创建完成，在此阶段更改数据不会触发 updated |
| mounted | 挂载完成后，当前阶段真实 DOM 挂载完成，可访问 DOM 或使用 $refs 操作 DOM |
| beforeUpdate | 更新前，虚拟 DOM 重新渲染之前，在此阶段更改数据，不会造成重新渲染 |
| updated | 更新完成后，当前阶段组件 DOM 已更新，注意避免在此阶段更新数据，防止死循环 |
| beforeDestroy | 实例销毁前，实例可被使用，可作移除事件监听，计时器等操作 |
| destroyed | 实例销毁后，只剩下 DOM 空壳，数据绑定被移除，监听移除，子实例被销毁 |
| actived | keep-alive 组件被激活时调用 |
| deactived | keep-alive 组件被销毁时调用 |

> Vue 中组件生命周期调用顺序
* 调用顺序：先父后子；渲染顺序：先子后父
* 销毁操作顺序：先父后子；销毁完成顺序：先子后父

> 接口请求在哪个生命周期
* created/beforeMount/mounted 中皆可使用，因为这三个生命周期，data 已创建完成
* 推荐 created 钩子中使用
  * 更快获取数据
  * SSR 不支持 beforeMount/mounted 钩子函数

> Vue 对比 React

> keep-alive
* Vue 内置的一个组件，作用是使包含的组件保留状态，避免重新渲染
* 结合路由和动态组件，可缓存组件
* 提供 include/exclude, 支持字符串或正则配置，exclude 优先级高
* 提供两个生命周期钩子 actived/deactived，组件在缓存中激活时 actived，组件在缓存中移除是 deactived ???

> SSR
优点：
* 服务端渲染，更好的SEO
* 首屏加载快

缺点：
1. 只支持 beforeCreate/created
2. 更多的服务端负载

> SPA 优缺点
SPA: 仅在页面初始化时加载相应的 HTML/CSS/JS，页面加载完成后，不会因为用户操作进行页面的重新加载或跳转，而是根据路由机制实现内容的变换，避免页面重新加载及渲染

优点：
* 避免频繁地页面重新加载，不必要的跳转和重复渲染，提升用户体验
* 数据局部刷新及获取，服务器端压力较小（相对）
* 前后端分离，职责明确，架构清晰，前端处理交互逻辑，后端负责数据处理

缺点：
* 首次加载耗时（可作首屏优化）
* 不能使用浏览器的前进后退功能，需自行对前进后退路由堆栈管理
* 不利于 SEO

> Vue 3.0 的特性
* 监测机制的改变：Proxy 代替 Object.defineProperty
* 对象式的组件生命方式：组件声明方式改成类式写法