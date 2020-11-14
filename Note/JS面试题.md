<details>
  <summary>['1', '2', '3'].map(parseInt) what & why</summary>
  
  ```javascript
  ['10', '10', '10', '10'].map(parseInt);
  // [10, NaN, 2, 3];
  ```
  > parseInt(string[, radix]):int|NaN，解析一个字符串参数，并返回一个指定基数的整数
  * string: 被解析的值，如果参数不是一个字符串，则将其转换为字符串（toString), 字符串开头空白符会被省略
  * radix: 2-36 之间的整数，默认为 10
  * 返回一个整数或 `NaN`

  #### radix 为 `undefined/0/没有指定参数`时处理原则：
  1. 如果字符串 string 以 `0x` 或者 `0X` 开头，则基数是 16（十六进制）
  2. 如果字符串 string 以 `0` 开头，则基数是 8（八进制）或 10（十进制)，具体情况由实现环境决定，ES5 规定是 10，但并不是所有浏览器都遵守，需明确指定 radix 参数
  3. 如果字符串 string 以其它任何值开头，则基数是 10（十进制）

  > map(callback(currentValue[, index[, array]])[, thsArg]): newArray
  
  ```javascript
  parseInt('10', 0);    // 10
  parseInt('10', 1);    // NaN
  parseInt('10', 2);    // 2
  parseInt('10', 3);    // 3

  // 
  parseInt('1', 0);     // 1
  parseInt('2', 1);     // NaN
  parseInt('3', 3);     // NaN
  ```

</details>

<details>
  <summary>
  `var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],10]`
  将数组扁平化并去除重复数据，得到一个升序且不重复的数据
  </summary>

  ```javascript
  function flatten(arr) {
    return arr.reduce((acc, val) => {
      return acc.concat(Array.isArray(val) ? flatten(val) : val)
    }, [])
  }

  let result = Array.from(new Set(flatten(arr)));
  result = result.sort((a, b) => a - b);
  ```
</details>

<details>
  <summary>
    请把两个数组 `['A1', 'A2', 'B1', 'B2', 'C1', 'C2']` 和 `['A', 'B', 'C']` 合并为 `['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C']`
  </summary>

  ```javascript
  let a1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  let a2 = ['A', 'B', 'C'];
  
  // 确保 a2 的 'A' 能排到 a1 的 'A2' 后面
  a2 = a2.map(val => val + '3');

  let a3 = [...a1, ...a2].sort(val) => {
    if (val.includes('3')) {
      return val.split('')[0];
    }
    return val;
  })
  ```
</details>

<details>
  <summary>JS 的重定向有哪些？</summary>

  ```javascript
  let url = 'http://wuliv.com';

  location.assign(url);
  location.href = url;
  
  window.location = url;
  top.location = url;
  self.location = url;

  window.location.href = url;
  ```
</details>

<details>
  <summary>`substr` 与 `substring` 的区别</summary>

  > substr(start[, length])

  > substring(start [, end]) 

  相同：当有一个参数时，两者的功能是一样的，返回从 start 指定位置到字符串结束的子串

  不同：有两个参数时
  
  1. `substr(start, length)` 返回从 start 位置开始 length 长度的子串
  2. `substr(start, length)` 当 length 为 0 或负数时，返回空字符串
  3. `substring(start, end)` 返回从 start 位置开始到 end 位置的子串（不含 end)
  4. `substring(start, end)` 使用 start/end 两者中较小值作为起始点
  5. `substring(start, end)` start 或 end 为 NaN 或负数，那么将其替换为 0
  6. str 是字符串时 `str.substring(start,end)` 和 `str.slice(start, end)` 等价
</details>

<details>
  <summary>`for...in` 特点及遍历顺序</summary>

  特点：
  1. 循环返回的值是数据结构的“键值名"
  2. 遍历对象返回对象的 key 值，遍历数组返回数组的下标（key)
  3. 不仅可遍历数字键名，还会遍历**原型上的值**和手动添加的其它键
  4. 不可推出循环

  > 排序属性：也即数字属性，指对象中以数字为键名的属性，V8 中被称为 elements。

  > 常规属性：也即字符串属性，指对象中以字符串为键名的属性，V8 中被称为 properties

  **遍历顺序：ECMAScript 规范中定义 "数字属性应该按照索引值大小升序排列，字符串属性按照创建时的顺序升序排列**

</details>

<details>
  <summary>`for..of` 特点</summary>

  特点：
  1. 数据结构只要部署了 `Symbol.iterator` 属性，就被视为具有 iterator 接口，可用 `for...of` 循环
  2. 可结合 `break/continue/throw/return` 退出寻

  具备 iterator 接口的数据结构：
  1. Array
  2. Map
  3. Set
  4. String
  5. arguments 对象
  6. NodeList（dom 列表集合）
<details>