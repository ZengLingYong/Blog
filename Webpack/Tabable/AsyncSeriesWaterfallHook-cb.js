class AsyncSeriesWaterfallHook {
  constructor () {
    this.tasks = [];
  }

  tapAsync(name, task) {
    this.tasks.push(task);
  }

  callAsync(...params) {
    const finalCallBack = params.pop();
    let index = 0;
    
    let next = (err, data) => {
      let task = this.tasks[index];
      if (err != null || !task) {
        return finalCallBack();
      }

      if (index === 0) {
        task(...params, next);
      } else {
        task(data, next);
      }

      ++index;
    }
    next();
  }
}

let { log } = console;
let hook = new AsyncSeriesWaterfallHook(['name']);
hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    log('node', name);
    cb(null, '学得还行');
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