class AsyncSeriesHook {
  constructor () {
    this.tasks = [];
  }

  tapAsync(name, task) {
    this.tasks.push(task);
  }

  callAsync(...params) {
    const finalCallback = params.pop();
    let index = 0, len = this.tasks.length;
    let next = () => {
      if (index === len) {
        return finalCallback();
      }
      this.tasks[index++](...params, next);
    }
    next();
  }
}

let { log } = console;
let hook = new AsyncSeriesHook(['name']);
hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    log('node', name);
    cb();
  }, 1000);
})
hook.tapAsync('react', (name, cb) => {
  setTimeout(() => {
    log('react', name);
    cb();
  }, 1000);
})
hook.callAsync('KenTsang', () => {
  log('end');
})