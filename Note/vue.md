1. 插值只能放表达式，不能放 JS 语句
2. v-html 插入 html， 会覆盖子元素，有 xss 风险

### $nextTick
1. Vue 是异步渲染
2. data 改变后，DOM 不会立即渲染（多次改变会合并）
3. $nextTick 会在 DOM 渲染之后被触发，以获取最新 DOM 节点

### mixin 缺点：
1. 变量来源不明确，不利于阅读
2. 多 mixin 方法或数据对象属性命名冲突，生命周期会全保留
3. mixin 和组件对应关系多对多，复杂度高

### Vue 组件通讯：
1. props 和 $emit（父子）
2. 自定义事件 event.$on/$emit（兄弟或跨层级）- V3 移除
3. Vuex

### Vue 高级特性：
1. 自定义 v-model
2. $nextTick
3. slot
4. 动态、异步组件
5. keep-alive
6. mixin

### Vue3 
1. Teleport 传送门 (类似 React 的 Portals)
```html
<teleport to="body">
  <div class="modal">弹窗</div>
<teleport/>
```
2. Fragments 组件可拥有多个根，无须显示用 Fragments 包裹（React）
```html
<template>
  <div>Hello world.</div>
  <input type="text"/>
  <button>提交</button>
</template>
```
3. emits 选项
  * 原生事件会触发两次
  * 更好的指示组件工作方式
  * 对象形式事件校验
```html
<template>
  <div @click="$emit('click')">
    自定义事件
  </div>
</template>

<script>
  export default {
    // 若此处不设置，模版中 click 与原生 click 重名触发两次
    emits: ['click'],
  }
</script>
```

#### 组合式 API:
* 暴露给模板的 property 来源十分清晰，因为它们都是被组合逻辑函数返回的值
* 不存在命名空间冲突，可以通过解构任意命名
* 不再需要仅为逻辑复用而创建的组件实例

#### 对比 React Hooks
setup() 函数只会调用一次，React Hooks 依赖调用顺序
* 无须顾虑调用顺序，可用于条件语句
* 不会在每次渲染时重复执行 
* 自动的依赖跟踪可确保侦听器和计算属性准确，不用像 useEffect/useMemo 指定依赖值
* 不存在内联处理函数导致子组件永远更新的问题，不需要 useCallback

#### ref/reactive
* ref: 基础类型具有响应性
* reactive: 针对引用类型，一般是对象
* toRefs: 将响应式对象每个属性都转为 ref

```js
const name = ref('以乐之名');
const person = reactive({
  name: '以乐之名',
  sex: '男'
});
```

watchEffect 在 mounted 前执行，若想在副作用函数中使用 DOM，则需在 onMounted 中使用 watchEffect