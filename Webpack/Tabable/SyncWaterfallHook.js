// 同步瀑布流钩子，能往下传递数据
class SyncWaterfallHook {
  constructor(args) {
    this.task = []
  }

  tap(name, task) {
    this.task.push(task);
  }

  call(...args) {
    let [first, ...others] = this.task;
    others.reduce((ret, task) => {
      return task(ret);
    }, first(...args));
  }
}

const hook = new SyncWaterfallHook(['name']);
hook.tap('react', name => {
  console.log('react', name);
  return 'React is Better';
})
hook.tap('node', name => {
  console.log('node', name);
  return 'Node is Better';
})
hook.tap('webpack', name => {
  console.log('webpack', name);
})
hook.call('KenTsang');
