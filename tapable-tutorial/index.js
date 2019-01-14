/**
 * tapable测试教程
 * tapble是webpack的dependency，不需要在安装了
 */
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable")

const _log = (name) => (...args) => {
  console.log(name, ...args)
}

const runTask = (fn) => {
  console.log(`----------`)
  fn()
}

/**
 * SyncHook 
 * 同步钩子，串行执行 tap
 */
runTask(() => {
  const syncHook = new SyncHook(["name"])
  const log = _log('syncHook')
  syncHook.tap('1', (name) => { log(1, name) })
  syncHook.tap('2', (name) => { log(2, name) })
  syncHook.tap('3', (name) => { log(3, name) })
  syncHook.call('Luka')
})

/**
 * SyncBailHook 
 * 同步钩子，串行的执行 tap
 * 如果函数处理队列有一个返回值不为空，则中断处理
 */
runTask(() => {
  const syncBailHook = new SyncBailHook(["name"])
  const log = _log('syncBailHook')
  syncBailHook.tap('1', (name) => { log(1, name) })
  syncBailHook.tap('2', (name) => {
    log(2, name)
    return true
  })
  syncBailHook.tap('3', (name) => { log(3, name) })
  syncBailHook.call('Luka')
})

/**
 * SyncWaterfallHook 
 * 同步钩子，串行的执行 tap
 * 函数的返回值作为下个函数的参数
 * 如果该函数B没有返回值，则函数C的参数为函数A的返回值
 * 只有第一个函数可以获得call的参数
 */
runTask(() => {
  const syncWaterfallHook = new SyncWaterfallHook(['name'])
  const log = _log('syncWaterfallHook')
  syncWaterfallHook.tap('1', (name) => {
    log(1, name)
    return name + 1
  })
  syncWaterfallHook.tap('2', (name) => {
    log(2, name)
    return name + 2
  })
  syncWaterfallHook.tap('3', (name) => {
    log(3, name)
    return name + 3
  })
  const ret = syncWaterfallHook.call('luka')
  console.log('SyncWaterfallHook result', ret)
})

/**
 * SyncLoopHook 
 * 同步钩子，串行的执行 tap
 * 网上教程：函数返回undefined则退出循环，否则不断循环
 * 实际：函数返回undefined则退出循环，否则会从第一个函数开始循环
 */
/**
 * @description sampleCode
  var _loop;
  do {
    _loop = false;
    var _fn0 = _x[0];
    var _result0 = _fn0(name);
    if(_result0 !== undefined) {
      _loop = true;
    } else {
      var _fn1 = _x[1];
      var _result1 = _fn1(name);
      if(_result1 !== undefined) {
        _loop = true;
      } else {
        if(!_loop) {
        }
      }
    }
  } while(_loop)
 */
runTask(() => {
  const syncLoopHook = new SyncLoopHook(['name'])
  const log = _log('syncLoopHook')
  let loop1 = 3
  let loop2 = 4
  syncLoopHook.tap('1', (name) => {
    log('loop1', name, loop1)
    return --loop1 > 0 ? true : undefined
  })
  syncLoopHook.tap('2', (name) => {
    log('loop2', name, loop2)
    return --loop2 > 0 ? true : undefined
  })
  syncLoopHook.call('luka')
})


/**
 * AsyncParallelHook 
 * 异步钩子，并行执行 tap tapAsync tapPromise
 * 所有的异步函数并行执行
 * tapAsync (name: string, callback: (...params: any[], done: Function) => any): any
 * tapPromise (name: string, callback: (...params: any[]) => Promise): any
 * callAsync 和 promise 的回调参数是没有值的
 */
runTask(() => {
  const asyncParallelHook = new AsyncParallelHook(['name'])
  const log = _log('asyncParallelHook')

  // tapAsync
  asyncParallelHook.tapAsync("1", (name, done) => {
    setTimeout(() => {
      console.log("1", name, 'tapAsync')
      done()
    }, 1000)
  })
  asyncParallelHook.tapAsync("2", (name, done) => {
    setTimeout(() => {
      console.log("2", name, 'tapAsync')
      done()
    }, 2000)
  })
  asyncParallelHook.tapAsync("3", (name, done) => {
    setTimeout(() => {
      console.log("3", name, 'tapAsync')
      done()
    }, 3000)
  })
  asyncParallelHook.callAsync('Luka', () => {
    console.log('tapAysnc', '每个函数都调用了done方法我才会被调用')
  })

  // tapPromise
  asyncParallelHook.tapPromise('1', (name) => {
    return new Promise((res) => {
      setTimeout(() => {
        console.log('1', name, 'tapPromise')
        res(1)
      }, 1000)
    })
  })
  asyncParallelHook.tapPromise('2', (name) => {
    return new Promise((res) => {
      setTimeout(() => {
        console.log('2', name, 'tapPromise')
        res(1)
      }, 2000)
    })
  })
  asyncParallelHook.tapPromise('3', (name) => {
    return new Promise((res) => {
      setTimeout(() => {
        console.log('3', name, 'tapPromise')
        res(1)
      }, 3000)
    })
  })
  asyncParallelHook.promise('Luka').then(() => {
    console.log('tapPromise')
  })
})
