class AsyncSeriesHook {
  constructor () {
    this.tasks = [];
  }

  tapPromise(name, task) {
    this.tasks.push(task);
  }

  promise(...params) {
    let [firstTask, ...otherTask] = this.tasks;
    return otherTask.reduce((prev, next) => {
      return prev.then(() => next(...params));
    }, firstTask(...params)) 
  }
}

let { log } = console;
let hook = new AsyncSeriesHook(['name']);
hook.tapPromise('node', name => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      log('node', name);
      resolve()
    }, 1000);
  })
})
hook.tapPromise('react', name => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      log('react', name);
      resolve();
    }, 1000);
  })
})
hook.promise('KenTsang').then(() => {
  log('end');
})