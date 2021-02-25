class Vue {
  constructor(options, el, key) {
    this.data = options.data;
    this.observe(this.data);
    el.innerHTML = this.data[key];

    new Watcher(options, key, value => {
      el.innerHTML = value;
    });
    this.data.test
  }

  observe(data) {
    if (!data || typeof data !== 'object') return;
    Object.keys(data).forEach(x => {
      this.defineReactive(data, x, data[x]);
    });
  }

  defineReactive(data, key, value) {
    this.observe();
    const dep = new Dep();
    console.log(data);
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
      this.cb(this.value)
    }
  }
  get() {
    Dep.target = this;
    const value = this.options.data[this.key];
    Dep.target = null;
    return value;
  }
}