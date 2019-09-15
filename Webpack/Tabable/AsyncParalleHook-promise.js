class AsyncParalleHook {
  constructor(...args) {
    this.tasks = []
  }

  tapPromise(name, task) {
    this.tasks.push(task);
  } 

  promise(...params) {
    let tasks = this.tasks.map(task => task(...params));
    return Promise.all(tasks);
  }
}

let count = 0;
let { log } = console;
let hook = new AsyncParalleHook(['name']);
hook.tapPromise('node', name => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      log('node', name);
      resolve();
    }, 1000)
  })
});
hook.tapPromise('react', (name, cb) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      log('react', name);
      resolve();
    }, 1000)
  })
})

hook.promise('KenTsang').then(() => {
  log('end');
});