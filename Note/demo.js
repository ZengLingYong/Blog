const match = _.curry(function (reg, str) {
  return str.match(reg)
})

const haveSpace = match(/\s+/g);
const haveNumber = match(/\d+/g);
const filter = _.curry(function(func, array) {
  return array.filter(func)
})

const findSpace = filter(haveSpace)

// 获取数组最后一个元素再转换成大写字母 洋葱代码 h(g(f(x)))

`_.toUpper(_.first(_.reverse(array)))`

function compose(f, g) {
  return function(value) {
    return f(g(value))
  }
}

lodash 中组合函数
1. flow/flowRight
2. flow 从左往右，flowRight 从右往左

const f = _.flowRight(_.toUpperCase, _.reverse);
f(['HTML', 'JavaScript']);

如何调试组合函数


 lodash/fp 模块
 1. 函数自动柯里化
 2. 方法优先
 3. 数据置后

 1. 不需要指明处理的数据
 2. 只需要合成运算的过程
 3. 需要定义一些辅助的基本运算函数