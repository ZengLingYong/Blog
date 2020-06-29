> 基础类型补漏

* number/string/boolean
* any
* unknown
* 枚举
* 元祖
* void 无任何类型
* never 永不存在（异常或不会有返回值），利用特性作全面类型检查
* null/undefined 所有类型的子类型 --strictNullCheck 开启时，只能赋值给自身/void

```js
// never
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while(true) {}
}
```

> 联合类型 string | number
```ts
const sayHello = (name: string | void = '以乐之名') => {
  //...
}

say();       // '以乐之名'
say('Ken');  // 'Ken'
```

> 交叉类型 IPerson & IWorker
将多个类型合并为一个类型，包含了两个类型的所有特性
```ts
interface IPerson {
  id: string;
  age: number;
}

interface IWorker {
  company: string
}

type IStaff = IPerson & IWorker;

const staff: IStaff = {
  id: 1,
  age: 30,
  company: 'Ali'
}
```

> 函数可选参数

```ts
function create(name: string, age?: number): string {
  //...
}
```

> 对象可选属性
```ts
interface Person {
  readonly name: string;
  age?: number;
}
```

> 类静态属性和方法
```ts
class Greeter {
  static name: string = '';

  static getName() {
    //...
  }
}
// 调用静态属性
Greeter.name;
Greeter.getName();
```

> 私有字段 #
* 私有字段以 # 开头
* 唯一限定于其包含的类
* 私有字段不能使用可访问性修饰符 public/private
* 私有字段不能在包含的类之外访问，深圳不能被检测

> 类型守卫
* typeof 判断基础类型 number/string/boolean/symbol
* instanceof 判断实例是否属于某个类
* in 判断属性/方法是否属于某个对象
* 字面量类型保护（自己造 type）

> 类型断言
as 断言条件：当 S 是 T 的子集，或 T 是 S 的子集，S 能被成功断言成 T，暴力解决使用双重断言

```ts
function handler(event: Event) {
  const element = event as HTMLElement;
  // Error: 'Event' 和 ‘HTMLElement' 中任何一个不能赋值给另一个
}

// 双重断言暴力解决
function handler(event: Event) {
  const element = (event as any) as HTMLElement;
}
```

> 可选链/空值联合
* 可选链接 `worker?.person?.name`，避免 `a && a.b && a.b.c`
* 空值联合 `let name = me ?? 'Ken'` `me` 为 `null`时 返回 `Ken`

> type 与 interface 区别
| type | interface |
| -- | -- |
| 通过 & 合并 | 通过 extends 扩展 |
| 支持类型更多 | 只表达 object/class/function |

> 泛型
考虑重用性，支持当前数据类型，也支持未来数据类型
```ts
function identity<T>(arg: T): T {
  return arg;
}
identity(1024);
identity('1024KB');

// 约束
function identity<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}

interface LengthWise {
  length: number
}
function identity<T extends LengthWise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

> 装饰器
* 它是一个表达式
* 表达式执行后，返回一个函数
* 函数入参为 target、name 和 descriptor
* 执行该函数后，可能返回 descriptor，用于配置 target 对象
* 多个装饰器应用在一个声明上
  * 由上至下依次对装饰器表达式求值
  * 求值结果会被当作函数，由下至上依次调用

```ts
function f() {
    console.log("f(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("f(): called");
    }
}

function g() {
    console.log("g(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("g(): called");
    }
}

class C {
    @f()
    @g()
    method() {}
}

/*
f(): evaluated
g(): evaluated
g(): called
f(): called
*/
```

#### 类装饰器
```ts
function Greeter(target: Function): void {
  target.prototype.greet = function(): void {
    console.log('Hi, man!');
  }
}

@Greeter
class Greeting {}
let myGreeting = new Greeting();
myGreeting.greet(); // 'Hi, man!'

// 带参数
function Greeter(greeting: string) {
  return function(target: Function): void {
    target.prototype.greet = function(): void {
      console.log(greeting);
    }
  }
}
@Greeter('How are you doing?');
class Greeting {}
let myGreeting = new Greeting();
myGreeting.greet(); // 'How are you doing?'
```
#### 属性装饰器
#### 方法装饰器
#### 参数装饰器

> 处理第三方库类型问题
1. react 中 module.hot, 安装 @types/webpack-env
2. 库本身没有类型定义，需自行声明 `declare module 'lodash'`
3. 类型声明报错, compileOptions 添加 skipLibCheck: true
4. 类型声明库有误，使用 //@ts-ignore 忽略

> React 的 TypeScript 实践
#### 定义组件
```ts
// 函数声明
function MHead(): React.ReactNode {
  return <h1>My Header</h1>
}

// 函数表达式
const YHead: React.FC = () => <h1>My Header</h1>
```
#### 约束 props
```ts
interface MProps {
  name: string;
  color: string;
}

type Props = {
  name: string;
  color: string;
}

function MHead({name, color}: MProps): React.ReactNode {
  //...
}
const YHead: React.FC<YProps> = ({name, color}) => <h1>My Header</h1>
```
* 编写库/第三方环境类型定义时，用 interface 定义公共 API
* 组件 state/props 使用 type

#### 处理表单
```ts
const MInput = () => {
  const [value, setValue] = useState();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  return <input value={value} onChange={onChange}>
}
```

#### 扩展 Props
```ts
// type
type ButtonProps {
  color: string;
  text: string;
}

type ContainerProps = ButtonProps & {
  height: number;
}

// interface
interface ButtonProps {
  color: string;
  text: string;
}

interface ContainerProps extends Buttons {
  height: number;
}
```