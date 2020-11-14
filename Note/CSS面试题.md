<details>
  <summary>盒模型</summary>
  
  #### 盒模型包括：
  1. 外边距（margin)
  2. 边框（border)
  3. 内边距（padding)
  4. 内容（content)

  > 标准(W3C)盒子模型: width = content, 可用 box-sizing: content-box 

  > IE 盒子模型: width = content + padding + border，可用 box-sizing: border-box

  #### 获取/设置盒模型的宽高
  1. dom.style.width/height 只能获取内联样式的宽高
  2. dom.currentStyle.width/height 获取渲染后元素的宽高（仅IE支持）
  3. window.getComputedStyle(dom).style/height 获取渲染后元素的宽高(兼容性好)
  4. dom.getBoundingClientRect().width/height（left/top/width/height) 常用于获取元素绝对位置（相对于视窗左上角）

  * padding: 继承 content 颜色
  * border: 继承 color 字体颜色

</details>

<details>
  <summary>元素设置成 inline-block 元素会出现什么问题？怎么解决？</summary>

  使用 CSS 更改非 inline-block 水平元素为 inline-block 水平，元素间会出现留白间距，原因是标签间的空格。

  解决方案：
  1. 去除 HTML 中的空格，代码连城一行
  2. 借助 HTML 注释不换行
  3. margin 负值
  4. font-size: 0

</details>

<details>
  <summary> 如何创建 BFC </summary>

  1. float 属性不为 none
  2. position 属性为 absolute | fixed
  3. display 属性为 inline-block | table-cell | table-caption | flex | inline-flex
  4. overflow 属性不为 visible ，设置（auto | hidden)

  BFC 可应用：
  1. 清除浮动（解决父级元素高度塌陷问题）
  2. 解决垂直边距 margin 重叠
</details>

<details>
  <summary>清除浮动的方法</summary>
  
  1. after 伪元素清除浮动（推荐）
  2. 额外标签清除浮动
  3. before 和 after 双伪元素清除浮动
  4. 父级元素添加 overflow 属性触发 BFC
  5. 浮动父级元素

  (IE6/7不支持伪元素，需使用 `zoom: 1` 触发 hasLayout)
</details>