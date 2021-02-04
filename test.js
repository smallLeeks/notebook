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
 * undefined：undefined转为数值时为NaN（非数字值的特殊值）
 * 
 * 判断数据类型
 * 1：typeof
 * 说明：返回一个字符串，表示未经计算的操作数的类型，所有引用类型返回Object
 * 判断的是值类型，typeof(function): function  typeOf(null): Object Null是空指针，对象的类型标签是0（0x00），null的类型标签为0
 * 
 * 2：instanceof Boolean
 * 说明：测试一个对象在其原型链中是否存在一个构造函数的prototype属性，判断对象是否属于某一类型
 * 只能判断对象，对基本数据类型不能判断，多全局对象是返回不正确（跨窗口或frame操作）
 * 
 * 3：Object.prototype.toString.call(obj) [Object ]
 * 说明：基本数据类型和引用数据类型都能返回正确的值
 * 对自定义类型（都是Objet）无效，都是返回[object Object]，还是使用instanceof
 */

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
 * 原型继承
 * 
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
var foo1 = new Foo1(1, 2);

/**
 * 组合继承
 * 
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