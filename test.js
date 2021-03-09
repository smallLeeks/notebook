/**
 * new操作符
 * 1：创建一个新对象
 * 2：将构造函数的作用域赋值给新对象 {}.__proto__ = 构造函数.prototype
 * 3：执行构造函数中的代码 this指向这个对象
 * 4：返回新对象
 */
let parent = function(name, age) {
  this.name = name;
  this.age = age;
};
parent.prototype.sayName = function() {
  console.log(this.name, this.age);
};
let newMethod = function(parent, ...rest) {
  let child = Object.create(parent.prototype);
  let result = parent.apply(child, rest);
  return typeof result === 'Object' ? result : child;
}
const child = newMethod(parent, 'ch', 25);
child.sayName();

/**
 * 基本数据类型：Number、String、Boolean、Null、undefined、symbol、bigInt
 * 说明：NaN是Number中的一种，非Number，存储在栈内存
 * 
 * 引用数据类型：Object
 * 说明：Object包含function、Array、Date，存储在堆内存，其引用地址存储在栈内存
 * 
 * null和undefined
 * null：表示被赋值过的对象，刻意把一个对象赋值为null，表示其为空，转换为数值时值为0
 * undefined：表示未定义的变量。undefined转为数值时为NaN（非数字值的特殊值）
 * 
 * var、let、const
 * var：可以跨块访问，不能跨函数访问
 * let：只作用当前的作用域
 * const：定义常量，只作用当前的作用域，必须赋值
 * 
 * 判断数据类型
 * 1：typeof
 * 说明：返回一个字符串，表示未经计算的操作数的类型，所有引用类型返回Object
 * 判断的是值类型，typeOf(null): Object Null是空指针，对象的类型标签是0（0x00），null的类型标签为0
 * 
 * 2：instanceof Boolean
 * 说明：测试一个对象在其原型链中是否存在一个构造函数的prototype属性，判断对象是否属于某一类型，左侧必须是对象，右侧必须是函数
 * 只能判断对象，对基本数据类型不能判断（发生一个装箱操作，转换为包装类型new String()），多全局对象是返回不正确（跨窗口或frame操作）
 * 
 * 3：Object.prototype.toString.call(obj) [Object ]
 * 说明：基本数据类型和引用数据类型都能返回正确的值
 * 对自定义类型（都是Objet）无效，都是返回[object Object]，还是使用instanceof
 * 
 * 原型：
 *  1：所有引用类型都有一个__protot__（隐式原型），属性值是一个普通对象
 *  2：所有函数都有一个prototype（原型）属性，属性值是一个普通对象
 *  3：所有的__proto__属性指向它构造函数的prototype
 * 
 * 原型链
 *  访问一个对的某个属性时，先在这个对象本身属性上查找，如果找不到，则取它的__proto__上查找，如果还找不到，
 *  则去构造函数prototype的__proto__查找，一层一层的查找形成一个链式结构
 *  1：一直往上层查找，直到null还没找到，返回undefined
 *  2：Object.prototype.__proto__ = null;
 *  3：所有从原型或高级原型中得到、执行的方法，其中this在执行时，指向当前这个出发事件的对象
 * 
 * 箭头函数：
 * 1：无构造函数
 * 2：无this指向
 * 3：没有原型属性
 * 4：没有arguments，但是可以...reset
 * 
 * ES6模块和CommonJS模块
 * 1：CommonJS输出的是值的拷贝，ES6模块输出的是值得引用
 * 2：CommonJS是运行时加载，ES6模块时编译时输出接口
 * 
 * EventLoop
 * 调用栈中的同步任务都执行完毕，栈内被清空，表示主线程空闲，这个时候会去任务队列中按照顺序读取一个任务放入栈中执行。
 * 每次栈内被清空，都会读取任务队列有没有任务，有就去读取执行，一直循环读取-执行的操作
 * 
 * 一个事件循环中有一个或者多个任务队列
 * 1：宏任务：script、setTimeout、setInterval、setimmediate、I/O、UI rendering
 * 2：微任务：process.nextTick、Promise、Object.observe、
 */
async function async1() {
	console.log('async1 start');
	await async2();
	console.log('asnyc1 end');
}
async function async2() {
	console.log('async2');
}
console.log('script start');
setTimeout(() => {
	console.log('setTimeOut');
}, 0);
async1();
new Promise(function (reslove) {
	console.log('promise1');
	reslove();
}).then(function () {
	console.log('promise2');
})
console.log('script end');

/**
 * instanceof实现 
 */
function instance_of(obj, fun) {
  // 基本数据类型都为false, null没有__proto__
  const baseType = ['number', 'string', 'boolean', 'undefined', 'symbol'];
  if (baseType.includes(typeof obj)) return false;
  const _obj = obj.__proto__;
  const _fun = fun.prototype;
  while (true) {
    // obj.__proto__.proto__....null
    if (_obj === null) return false;
    if (_obj === _fun) return true;
  }
}

/**
 * 深浅拷贝
 *
 * 浅拷贝：创建一个新对象，这个对象有着对原始对象属性值的一份精确拷贝。
 * 如果属性是基本类型，拷贝的就是基本类型的值，如果属性是引用类型，拷贝的就是内存地址。
 * 所以如果其中一个对象改变了这个地址，就会影响到另一个对象
 * 
 * 深拷贝：将一个对象从内存中完整拷贝一份出来，从堆内存中开辟一个新的区域存放新对象，且修改新对象不会影响原对象
 */
function shallowClone(target) {
  let cloneTarget = {};
  for (const key in target) {
    cloneTarget[key] = target[key];
  }
  return cloneTarget;
}

function forEarch(array, interatee) {
  let index = -1;
  const length = array.length;
  while (++index < length) {
    interatee(array[index], index);
  }
  return array;
}
function deepClone(target, map = new WeakMap()) {
  if (typeof target === 'object') {
    const isArray = Array.isArray(target);
    let cloneTarget = isArray ? [] : {};
    if (map.get(target)) {
      return target;
    }
    map.set(target, cloneTarget);
    const keys = isArray ? undefined : Object.keys(target);
    forEarch(keys || target, (value, key) => {
      if (keys) {
        key = value;
      }
      cloneTarget[key] = deepClone(target[key], map);
    });
    return cloneTarget;
  } else {
    return target;
  }
}

/**
 * 防抖和节流
 * 
 * 防抖：触发高频事件n秒后执行一次
 * 节流：触发高频时间n秒内执行一次
 */
function debounce(fn, delay) {
  let timeout = null;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  }
}

function throttle(fn, delay) {
  let flag = true;
  return function() {
    if (!flag) return;
    flag = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      flag = true;
    }, delay);
  }
}

/**
 * call、bind、apply
 * 说明：第一个参数都是this的指向对象
 * call：参数是直接放进去
 * bind：多有参数都必须放在一个数组里面
 * apply：返回的是函数，入参和call一样
 */
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    return undefined;
  }
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  const args = [...arguments].slice(1);
  const result = context[fn](...args);
  delete context[fn];
  return result;
}

Function.prototype.myApply = function(context) {
  if (typeof this !== 'function') {
    return undefined;
  }
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  let result;
  if (arguments[1] instanceof Array) {
    result = context[fn](...arguments[1]);
  } else {
    result = context[fn]();
  }
  delete context[fn];
  return result;
}

Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  const _this = this;
  const args = [...arguments].slice(1);
  return function F() {
    if (this instanceof F) {
      return new _this(...args, ...arguments);
    }
    return _this.apply(context, args.concat(...arguments));
  }
}

/**
 * 类和继承
 */
class Parent {
  constructor(e) {
    this.a = 1;
  }
  fun() {};
}
// babel解析
function _classCheck(instance, constructor) {
  if (!(instance instanceof constructor)) {
    throw new TypeError('');
  }
}
var Parents = function Parents(a) {
  _classCheck(this, Parents);
  this.a = 1;
  this.fun = function() {};
}

/**
 * 原型链继承
 * 
 * 说明：新实例的原型等于父类的实例
 * 1：新实例无法向父类构造函数传参
 * 2：继承单一
 * 3：所有新实例都会共享父类实例的属性
 */
function Super0(a) {
  this.a = a;
  this.fun = function() {};
}
Super0.prototype.a = 0;
function Foo0() {
  this.a = 10;
}
Foo0.prototype = new Super0();
var Foo0 = new Foo0();
console.log(Foo0);

/**
 * 构造函数继承
 * 
 * 说明：call、apply将父类构造函数引入子类函数
 * 1：无法向父类构造函数传参
 * 2：同时new两个对象时，改变一个对象的原型中的引用类型的属性时，另一个对象的该属性也会修改。因为
 * 来自原型对象的引用属性是所有实例共享的
 */
function Super1(a) {
  this.a = a;
  this.fun = function() {};
}
function Foo1(a, b) {
  this.a = a;
  Super1.call(this, b);
}
var Foo1 = new Foo1(1, 2);

/**
 * 组合继承
 * 
 * 说明：组合原型链和构造函数继承，传参和复用
 * 优点：不存在引用属性共享的问题，可传参，函数复用
 * 缺点：父类的属性会被实例化两次，获取不到真正的父类（无法区分实例是父类创建还是子类创建的）
 */
function Super2(a) {
  this.a = a;
  this.fun = function() {};
}
Super2.prototype.c = function() { }
function Foo2(a, b) {
  this.a = a;
  Super2.call(this, b);
}
Foo2.prototype = Super2.prototype;
var fool = new Foo2(1, 2);

/**
 * 寄生组合继承
 * 
 * 说明：对父类的prototype进行一次寄生，包装一个空对象的prototype，再把这个对象实例化出来作为子类的prototype
 * 缺点：无法区分实例时父类创建还是子类创建的
 */
function Super3(a) {
  this.a = a;
}
Super3.prototype.c = function() {};
function Foo3(a, b) {
  this.a = a;
  Super3.call(this, b);
}
var f = new Function();
f.prototype = Super3.prototype;
Foo3.prototype = new f();
// 等同于Foo.prototype = Object.create(Super.prototype);
var fool = new Foo3(1, 2);

/**
 * 原型继承
 * 
 * 说明：函数包装对象，然后返回这个函数的调用，这个函数就成为可以随意增添属性的实例或对象。object.create()原理
 * 1：所有实例都会继承原型上的属性
 * 2：无法实现复用（新实例属性都是后面添加的）
 */
function Super4(a) {
  this.a = a;
  this.fun = function() {};
}
function Foo4(obj) {
  function f() {};
  f.prototype = obj;
  return new f();
}
var Super4 = new Super4(2);
var Foo4 = Foo4(Super4);
console.log(Foo4.a);

/**
 * 寄生继承
 * 
 * 说明：原型继承外面套一个壳子
 * 优点：没有创建自定义类型，只是套了壳子返回这个对象
 * 缺点：没有用到原型，无法复用
 */
function Super5(a) {
  this.a = a;
  this.fun = function() {};
}
function Foo5(obj) {
  function f() {};
  f.prototype = obj;
  return new f();
}
var Super5 = new Super5();
function obj(obj) {
  var Foo = Foo5(obj);
  Foo.a = 5;
  return Foo;
}
var obj = obj(Super5);
console.log(obj);

/**
 * 柯里化函数
 * 
 * 减少代码冗余，增加可读性
 */
function currying() {
  var _args = Array.prototype.slice.call(...arguments);
  var _add = function() {
    _args.push(...arguments);
    return _add;
  }
  _add.toString = function() {
    return _args.reduce((a, b) => {
      return a + b;
    });
  }
  console.log(_add);
  return _add;
}
currying(1)(2)(3)(4)(5);

function foo() {
  getName = function() {
    console.log(1);
  }
  return this;
}
foo.getName = function() {
  console.log(2);
}
foo.prototype.getName = function() {
  console.log(3);
}
var getName = function() {
  console.log(4);
}
function getName() {
  console.log(5);
}
foo.getName();
getName();
foo().getName();
getName();
new foo.getName();
new foo().getName();
new new foo().getName();

/**
 * 冒泡排序
 * 
 * 比较相邻两个元素
 */
function bubbleSort(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {
      if (array[j] > array[j + 1]) {
        let newData = array[j];
        array[j] = array[j + 1];
        array[j + 1] = newData;
      }
    } 
  }
  return array;
}

/**
 * 计数排序
 * 
 * 数组元素作为数组下标，然后用一个临时数组统计元素出现的次数
 */

/**
 * 快速排序
 * 
 * 1：选择数组中间数作为基数
 * 2：创建两个数组，较小的放在左边，较大的放在右边
 * 3：递归处理两个数组，并将处理后的数据与基数按照大小合并
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let index = Math.floor(arr.length / 2);
  let mid = arr.splice(index, 1)[0], left = [], right = [];
  for (let i = 0; i < arr.length; i++) {
    if (mid > arr[i]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([mid], quickSort(right));
}

/**
 * 归并排序
 * 
 * 1：把数组拆分为A、B两个小组，两个小组继续拆直到一个元素为止
 * 2：按照拆分过程逐步合并小组
 * 3：对左右两个小数列重复第二步，指导各区间只有一个数
 */
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let left = arr.slice(0, mid), right = arr.slice(mid);
  let mergerLeft = mergeSort(left);
  let mergerRight = mergeSort(right);
  return merge(mergerLeft, mergerRight);
}
function merge(left, right) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  while (left.length) {
    result.push(left.shift());
  }
  while (right.length) {
    result.push(right.shift());
  }
  return result;
}