// 同步容断性钩子，比如学得太累学不下去了，可中断
class SyncBailHook {
  constructor(args) {
    this.task = [];
  }
  
  tap(name, task) {
    this.task.push(task);
  }

  call(...args) {
    let ret, index = 0, len = this.task.length;
    do {
      ret = this.task[index++](...args); 
    } while(!ret && index < len); 
  }
}

// 使用
let hook = new SyncBailHook(['name']);
hook.tap('react', name => {
  console.log('react', name);
  return '学不下去了';
});
hook.tap('node', name => {
  console.log('node', name);
})
hook.call('KenTsang');