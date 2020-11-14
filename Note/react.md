### setState
1. 不可变值，`state` 只可在 `constructor` 初始值
2. 可能是异步更新
  * setTimeout/setInterval/自定义 DOM 事件时 `setState` 同步更新
  * 其它情况异步更新
3. 多次 `setState` 可能会被合并
  * 有时合并（对象），有时不合并（函数）
  * 默认传入对象，多次 `setState` 会合并，类似 `Object.assign`
4. batchUpdate 机制
5. transaction（事务）机制

```js
// 类似 Vue 的 $nextTick
this.setState({count: 1}, () => {
  console.log(this.state.count);  // 1
})

// setState 第一个参数接收函数时，多次不合并（且同步）
this.state = {count: 0}
this.setState((prevState, props) => {
  return {
    count: prevState.count + 1
  }
})
this.setState((prevState, props) => {
  return {
    count: prevState.count + 1
  }
})
// this.state.count = 2
```

### 组件间通讯
1. 父子组件 props 传递（区别于 Vue 的 props/$emit)
2. 自定义事件（与 Vue 类似 $on/$emit)
3. Redux 和 Context 

> JSX 本质会被 babel 编译成 React.createElement（类 h 函数）, 执行后返回 VNode（JSX 等同于 Vue 模版）

（React 中规定组件必须大写开头，小写开头会被当作 HTML 标签）

> 渲染列表为何使用 key: diff 算法中通过 tag 和 key 来判断是否是 sameNode


### 事件
1. 合成事件，需手动解决 `this` 绑定
2. `event.nativeEvent` 访问原生事件
3. `event.nativeEvent.currentTarget` 指向在 `document` 上（React17 版本是指向挂载节点 `id="root"`，即根 DOM）


> 事件触发原理：事件会冒泡到 `document` 上，由 `document` 统一去接收事件，并合成事件对象 SyntheticEvent，并 `dispatchEvent` 触发对应事件回调函数

* 类似命令式编程时代的事件委托，减少内存消耗，避免子元素频繁绑定解绑事件
* 更好的兼容性和跨平台（旧版本 IE 事件绑定监听兼容问题）
* 方便事件统一管理（如事务机制）

### VDom 和 diff
1. 只比较同一层级，不跨级比较
2. tag 不相同，直接删掉重建
3. tag 和 key 相同，则认为是相同节点，不再深度比较

### 生命周期

### 高级特性
1. 函数组件
  * Hook 之前无 state 跟生命周期钩子
2. 受控组件
  * 表单值 value/checked 受 state 控制
  * 需自行监听 onChange 更新 state 进而修改表单值
2. 非受控组件/[type=file]/富文本编辑器
  * defaultValue/defaultChecked
  * 需结合 ref 手动获取 DOM 节点和它的值
3. Portals （传送门）指定节点渲染
  * overflow: hidden
  * z-index 层级问题
  * 需要放在 body 第一层
  * 组件结构不变，事件冒泡节点不变
4. context（语言/主题）
5. 性能优化
6. HOC: 类似工厂模式，输入一个组件，输出一个组件
7. RenderProps: 通过一个函数将 class 组件的 state 作为 props 传递给函数组件
8. 异步组件
  * import()
  * React.lazy
  * React.Suspense

### HOC VS Render Props
1. HOC: 模式简单，会增加组件层级
2. Render Props: 代码简洁，学习成本较高

### 性能优化
父组件 state/props 更新，会触发自身的 render 方法，而 render 方法会触发其子组件的更新（即使传给子组件的数据没有更新）

1. `shouldComponentUpdate(nextProps, nextState){//...}` (SCU)
2. `PureComponent`(类组件)/`React.memo`(函数组件), 实现了浅比较的 SCU
3. immutable.js 不可变值
  * 彻底拥抱“不可变值”
  * 利用共享数据（非深拷贝）
  * 有学习及迁移成本

### React 和 Vue 区别
相同：
1. 视图层框架
2. 支持组件化
3. 使用 VDom 操作 DOM

区别：
1. React 使用 JSX 拥抱 JS，Vue 使用模版拥抱 html
2. React 函数式编程，Vue 声明式编程
3. React 更依赖底层 JS，Vue 封装成指令

### ReactFiber
1. patch 分为两阶段（JS与DOM渲染共用一个线程）
2. reconciliation 阶段：执行 diff 算法，纯 JS 计算
3. commit 阶段：将 diff 结果渲染 DOM

> Fiber：将 reconciliation 阶段进行拆分成片段，DOM 需要渲染时暂停 diff，空闲时恢复，通过 window.requestIdleCallback 得知 DOM 需要渲染（该 API 可能存在浏览器兼容，不支持时则放弃 Fiber 机制）

### Hooks（16.8）
背景：复用公共逻辑，this 指向

1. useEffect 处理副作用，渲染完成后执行
2. useMemo 缓存计算值，参与渲染（渲染时处理）
3. useCallback 缓存函数

