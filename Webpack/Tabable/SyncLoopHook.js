// 同步遇到某个不返回 undefined 的监听函数多次执行
class SyncLoopHook {
  constructor(args) {
    this.task = [];
  }

  tap(name, task) {
    this.task.push(task);
  }

  call(name) {
    this.task.forEach(task => {
      let ret;
      do {
        ret = task(name);
      } while(!ret);
    })
  }
}

const hook = new SyncLoopHook(['name']);
let nodeCount = 0;
hook.tap('react', name => {
  console.log('react', name);
  if (++nodeCount < 3) {
    return undefined;
  } else {
    return true;
  }
})
hook.tap('node', name => {
  console.log('node', name);
  return true;
})
hook.call('KenTsang');

