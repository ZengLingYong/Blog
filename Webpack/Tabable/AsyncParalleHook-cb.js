class AsyncParalleHook {
  constructor(...args) {
    this.tasks = []
  }

  tapAsync(name, task) {
    this.tasks.push(task)
  } 

  callAsync(...params) {
    let finalCallback = params.pop();
    let len = this.tasks.length;
    let index = 0;
    
    let done = () => {
      if (++index == len) {
        finalCallback();
      }
    }

    this.tasks.map(task => {
      task(...params, done)
    })
  }
}

let count = 0;
let { log } = console;
let hook = new AsyncParalleHook(['name']);
hook.tapAsync('node', (name, cb) => {
  setTimeout(() => {
    log('node', name);
    cb();
  }, 1000)
});
hook.tapAsync('react', (name, cb) => {
  setTimeout(() => {
    log('react', name);
    cb();
  }, 1000)
})

hook.callAsync('KenTsang', () => {
  log('end');
});
