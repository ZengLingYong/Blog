// 同步钩子
class SyncHook {
  constructor(args) {
    this.task = [];
  }

  call(...args) {
    this.task.forEach(task => task(...args))
  }

  tap(name, task) {
    this.task.push(task);
  }
}

// 使用
const hook = new SyncHook(['name']);
hook.tap('react', name => {
  console.log('react', name);
})
hook.tap('node', name => {
  console.log('node', name);
})
hook.call('KenTsang');
