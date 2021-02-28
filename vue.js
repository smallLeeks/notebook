/**
 * 实现流程；数据劫持+发布订阅
 * 1：observer遍历收集子数据，多少属性，定义多少个set和get
 * 2：数据劫持 =>递归处理observer数据嵌套 => Object.defineProperty
 *    set：拿到子集依赖，判断value并通知订阅者是否改变
 *    get: 把watcher实例指定到Dep收集器的静态属性target，缓存订阅者
 * 3：Dep收集器：每收集一个子依赖，就new一个watcher实例
 * 4：watcher订阅者：
 *    updata：通知数据更新，执行run()
 *    run：新旧数据对比执行回调
 *    get：指定到Dep收集器的静态属性target缓存自己，然后释放
 */

class Vue {
  /**
   * @param {object} options 数据对象
   * @param {*} el 挂载dom
   * @param {*} key 属性
   */
  constructor(options, el, key) {
    this.data = options.data;
    this.observer(this.data);
    el.innerHTML = this.data[key];

    new Watcher(options, key, value => {
      el.innerHTML = value;
    });
    this.data.test
  }

  // 遍历对象，多少属性定义多少个get和set
  observer(data) {
    if (!data || typeof data !== 'object') return;
    Object.keys(data).forEach(x => {
      this.defineReactive(data, x, data[x]);
    });
  }

  /**
   * 数据劫持
   * 
   * @param {object} data 原始对象
   * @param {string} key 对象属性
   * @param {} value 属性值
   */
  defineReactive(data, key, value) {
    // 递归处理数据嵌套
    this.observer();
    const dep = new Dep();
    Object.defineProperty(data, key, {
      get: () => {
        Dep.target && dep.addDep(Dep.target);
        return value;
      },
      set: (newVal) => {
        if (newVal === value) return;
        value = newVal;
        dep.notify();
      }
    })
  }
}

// 发布订阅：收集器
class Dep{
  constructor() {
    this.map = [];
  }
  addDep(data) {
    this.map.push(data);
  }
  notify() {
    console.log(this.map);
    this.map.forEach(dep => dep.updata())
  }
}

/**
 * 订阅者
 * 
 * @param { object } options 数据依赖
 * @param { string } key options的属性
 * @param { function } cb 数据改变执行的回调
 */
class Watcher {
  constructor(options, key, cb) {
    this.cb = cb;
    this.options = options;
    this.key = key;
    this.value = this.get();
  }
  updata() {
    console.log("属性更新了");
    this.run();
  }
  run() {
    const value = this.options.data[this.key];
    const oldValue = this.value;
    if (value !== oldValue) {
      this.value = value;
      this.cb(this.value);
    }
  }
  get() {
    // 将当前watcher实例指定到Dep静态属性target，缓存订阅者，然后释放
    Dep.target = this;
    const value = this.options.data[this.key];
    Dep.target = null;
    return value;
  }
}

/**
 * complie 解析、初始化、编译
 * 
 * 1：解析模板指令，替换数据，更新视图
 * 2：绑定模板指令对应节点到对应更新函数，初始化订阅器
 */
class paseElement {
  constructor() {
    this.els = null; // 虚拟节点对象
  }
  // 创建虚拟节点对象
  nodeEls(el) {
    this.els = document.createDocumentFragment();
    const child = el.firstChild;
    while (child) {
      this.els.appendChild(child);
      child = el.firstChild;
    }
    return this.els;
  }
  // 编译节点
  compileEle(el) {
    const childNodes = el.childNodes;
    [].slice.call(childNodes).forEach(x => {
      const reg = /\{\{.*}\}\}/;
      const text = x.textContent;
      if (this.isTextNode() && reg.test(text)) {
        this.compileText(node, reg.exec(text)[1]);
      }
      if (x.childNodes && x.childNodes.length) {
        this.compileEle(x);
      }
    });
  }
  compileText(node, data) {
    const initText = this.vm[data];
    this.updataText(node, initText); // 初始化数据到视图
    new Watcher(this.vm, data, value => { // 生成订阅器绑定更新函数
      this.updataText(node, value);
    })
  }
}

class compile {
  constructor(node) {
    this.nodeAttrs = node.attributes;
  }

}