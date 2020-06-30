> readonly vs const
* 作为变量使用：const
* 作为属性使用：readonly

> 只读属性
对象属性只能在对象刚刚创建的时候修改其值
```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error
```

ReadonlyArray<T>

> 跳出额外属性检测
把对象赋值给另一个变量
```ts
let squareOptions = { colour: 'red', width: 100 };
let mySquare = createSquare(squareOptions);
```

> 支持两种索引签名：字符串和数字
数字索引的返回值必须是字符串索引返回值类型的子类型，因为 JS 使用数字索引时会转换成字符串索引
```ts
interface NumberDictionary {
  [index: string]: number;
  length: number;
  name: string; `name`的类型与索引类型返回值类型不匹配
}

// 将索引设为只读，防止给索引赋值
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
myArray[2] = 'Ken'; // error
```

> interface 定义类接口规范
* 只针对类公共部分，不会检查类的私有成员
* 只检测类的实例类型，constructor 属静态
* 接口可通过 extends 继承多个接口
* 接口可继承类（private/protected)，该接口类型只能被这个类或其子类实现

> 类
* 默认为 public
* private 不能在类外部访问
* protected 在派生类中仍可访问，类外部不能访问
* readonly 只读属性必须在声明时或构造函数中初始化
* 参数属性方便我们在一个地方定义并初始化成员
* 存取器 get/set，只带有 get 不带有 set 的存取器自动被推断为 readonly
* 静态属性 static, 类.访问
* 抽象类 abstract 包含成员的实现细节（不包括具体实现）必须在派生类中实现，抽象类不实例化，abstract 声明的抽象方法可没有具体实现，在派生类中实现
* 类可当作接口使用

#### 参数属性
```ts
// 参数属性：声明赋值合并到一处
class Animal {
  // public/protected 也通用
  constructor(private name: string) { }
}

// 等同于
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}
```

#### 存取器
```ts
// 存取器
class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    // 增加设置值的业务逻辑
    if (pwd == '***') {
      this._fullName = newName
    } else {
      throw new Error('密码不对')
    }
  }
}
```

#### 类作接口使用
```ts
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

> 函数重载：定义重载时，最精确的定义放在最前面
```ts
function pickCard(x: {suit: string; card: number;}[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
  if (typeof x === 'object') {
    //...
  }

  if (typeof x === 'number) {
    //...
  }
}

// pickCard(x): any 不是重载列表，只有两个重载：一个接受对象，一个接受数字
```

> 解决 --noImplicitThis 报错 this

#### 提供一个显示的 `this` 参数
```ts
// this 是个假参数，出现在参数列表最前面
function f(this: void) {
  // make sure `this` is unusable in this standalone function
}

interface People {
  say: () => void;
}
function f(this: People) {
  this.say();
}
```

#### 回调函数里的 `this` 参数
* 箭头函数
* 不用到 this 时，则两处都显示 `this` 参数为 `void`

> 泛型：获取类型并作参数使用
```ts
// 明确传入类型
let output = identity<string>('myIdentity');

// 不传入类型，ts自动检测获取类型
let output = identity('myIdentity');
```

#### 调用签名的对象字面量来定义泛型函数
```ts
// 字面量
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;

// 接口
interface GenericIdentityFn {
  <T>(arg: T): T;
}
```

#### 泛型约束
```ts
interface LengthWise {
  length: number
}

function loginIdentity<T extends LengthWise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

> 枚举
* 异构枚举：混合字符串枚举和数字枚举，字符串枚举后的数字枚举需重新指定数字索引起始数字