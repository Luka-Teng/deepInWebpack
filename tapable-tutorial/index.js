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

let chain = Promise.resolve()

const runTask = (fn) => {
  chain = chain.then(() => new Promise((res) => {
    console.log('-----------')
    fn(res)
  }))
}


/***
 * hooks 分类：
 * 常用的钩子 分为同步和异步，异步又分为并发执行和串行执行
 * 1.SynncHook
 * 2.SyncBailHook
 * 3.SyncWaterfallHook
 * 4.SyncLoopHook
 * 
 * ----
 * 5.AsyncParallelHook
 * 6.  AsyncParallelHook,
 * 7.AsyncParallelBailHook,
 * 8.AsyncSeriesHook,
 * 9.AsyncSeriesBailHook,
 * 10.AsyncSeriesWaterfallHook
 * 
 * 每一个 钩子 都是一个构造函数
 * 
 */

 /**
  * 注册事件：常用的注册事件的方法有：tap, tapPromise, tapAsync。
  * 如何触发：常用的触发事件的方法有：call,promise, callAsync。
  * 
  * Sync*类型的hooks：该钩子下面的插件 执行的顺序 都是顺序执行的，只能tap 注册，不能使用tapPromise和tapAsync
  * 
  */

/**
 * SyncHook 
 * 同步钩子，串行执行 tap
 */
runTask((res) => {
  const syncHook = new SyncHook(["name",'age'])
  const log = _log('syncHook')
// tap 接受两个参数，第一个参数是名称 （没有任何意义），第二个参数是一个函数，接收参数
  syncHook.tap('1', (name,age) => { 
    log(1, name,age)
   })
  syncHook.tap('2', (name,age) => { 
    log(2, name,age)
   })
  syncHook.tap('3', (name,age) => { 
    log(3, name,age)
   })
  syncHook.call('雷',18)
  res()
})

/**
 * SyncBailHook 
 * 同步钩子，串行的执行 tap
 * 如果函数处理队列有一个返回值不为空，则中断处理
 */
runTask((res) => {
  const syncBailHook = new SyncBailHook(["name"])
  const log = _log('syncBailHook')
  syncBailHook.tap('1', (name) => { log(1, name) })
  syncBailHook.tap('2', (name) => {
    log(2, name)
    return null
  })
  // 上一个函数返回不是undefined下面的不执行
  syncBailHook.tap('3', (name) => { log(3, name) })
  syncBailHook.call('yan')
  res()
})

/**
 * SyncWaterfallHook  下一个任务要拿到上一个任务的返回值
 * 同步钩子，串行的执行 tap
 * 函数的返回值作为下个函数的参数
 * 如果该函数B没有返回值，则函数C的参数为函数A的返回值
 * 只有第一个函数可以获得call的参数
 */
runTask((res) => {
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
  const ret = syncWaterfallHook.call('我是')
  console.log('SyncWaterfallHook result', ret)
  res()
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
runTask((res) => {
  const syncLoopHook = new SyncLoopHook(['name'])
  const log = _log('SyncLoopHook')
  let loop1 = 3
  let loop2 = 4
  let count=0
  
  syncLoopHook.tap('1', (name) => {
    log('loop1', name, loop1)
    return --loop1 > 0 ? true : undefined
  })
  syncLoopHook.tap('2', (name) => {
    log('loop2', name, loop2)
    return --loop2 > 0 ? true : undefined
  })
  syncLoopHook.tap('3',name => {
    console.log('count',count++)
    if(count===name){
      return true
    }else{
      return
    }
  })
  syncLoopHook.call('luka')
  res()
})

/********************************* */

// Async* 类型 的hook 
// callback的第一个参数是错误

/**
 * AsyncParallelHook 
 * 异步钩子，并行执行 tap tapAsync tapPromise
 * 所有的异步函数并行执行
 * tapAsync (name: string, callback: (...params: any[], done: Function) => any): any
 * tapPromise (name: string, callback: (...params: any[]) => Promise): any
 * callAsync 和 promise 的回调参数是没有值的
 */
runTask((res) => {

  // AsyncParallelHook 异步并发执行
  const asyncParallelHook = new AsyncParallelHook(['name'])
  const log = _log('asyncParallelHook')

  // 第一种注册方式
  asyncParallelHook.tap('0',(name)=>{
    log(name,'tap')
  })


  // 第二种注册方式 凡是有异步必有回diao
  // tapAsync
  asyncParallelHook.tapAsync("1", (name, callback) => {
    setTimeout(() => {
      log("1", name, 'tapAsync')
      callback()
    }, 1000)
  })
  asyncParallelHook.tapAsync("2", (name, done) => {
    setTimeout(() => {
      log("2", name, 'tapAsync')
      done()
    }, 2000)
  })
  asyncParallelHook.tapAsync("3", (name, done) => {
    setTimeout(() => {
      log("3", name, 'tapAsync')
      done()
    }, 3000)
  })
  // asyncParallelHook.callAsync('Luka', (err) => {
  //   console.log(err)
  //   log('tapAysnc', '每个函数都调用了done方法我才会被调用')
  // })

  // 第三种注册 方式：
  // tapPromise
 
  asyncParallelHook.tapPromise('1', (name) => {
    return new Promise((res,reject) => {
      setTimeout(() => {
        log('1', name, 'tapPromise')
        res(1)
      }, 1000)
    })
  })
  asyncParallelHook.tapPromise('2', (name) => {
    return new Promise((res) => {
      setTimeout(() => {
        log('2', name, 'tapPromise')
        res(1)
      }, 2000)
    })
  })
  asyncParallelHook.tapPromise('3', (name) => {
    return new Promise((res) => {
      setTimeout(() => {
        log('3', name, 'tapPromise')
        res(1)
      }, 3000)
    })
  })
  asyncParallelHook.promise('Luka').then(() => {
    res()
    log('ok')
  }).catch(err => {
    console.log(err)
  })
})


runTask((res) => {
  const asyncSeriesHook=new AsyncSeriesHook(['name'])
  const log = _log('asyncSeriesHook')
  asyncSeriesHook.tapAsync('1',(name,cb)=>{
    setTimeout(()=>{
      log('1',name)
      cb()
    },1000)
  })

  asyncSeriesHook.tapAsync('2',(name,cb)=>{
    setTimeout(()=>{
      log('2',name)
      cb('asyncSeriesHook err')
    },1000)
  })

  asyncSeriesHook.tapAsync('3',(name,cb)=>{
    setTimeout(()=>{
      log('3',name)
      cb()
    },1000)
  })

  asyncSeriesHook.callAsync('Luka',(err)=>{
    console.log(err)
    log('over')
    res()
  })
})

/**
 * AsyncSeriesBailHook 异步串行执行
 * callback不能含有参数，如果含有参数则中断执行
 */
runTask((res)=>{
  const asyncSeriesBailHook=new AsyncSeriesBailHook(['name'])
  const log = _log('asyncSeriesBailHook')
  asyncSeriesBailHook.tapAsync('1',(name,cb)=>{
    setTimeout(()=>{
      log('11',name)
      cb()
    },1000)
  })

  asyncSeriesBailHook.tapPromise('3', (name) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        log('22', name, 'tapPromise')
        rej('asyncSeriesBailHook err')
      }, 1000)
    })
  })

  asyncSeriesBailHook.tapAsync('2',(name,cb)=>{
    setTimeout(()=>{
      log('33',name)
      cb()
    },1000)
  })

  asyncSeriesBailHook.tapAsync('3',(name,cb)=>{
    setTimeout(()=>{
      log('44',name)
      cb()
    },1000)
  })

  asyncSeriesBailHook.callAsync('lei',(err)=>{
    console.log(err)
    log('over')
    res()
  })
})


/**
 * AsyncSeriesWaterfallHook 下一个任务要拿到上一个任务的返回值
 * 异步串行
 * callback的第一个参数为error, 非null的话会直接执行完毕，并返回错误  
 */

runTask(()=>{
  const asyncSeriesWaterfallHook=new AsyncSeriesWaterfallHook(['name'])
  const log = _log('myasyncSeriesWaterfallHook')

  asyncSeriesWaterfallHook.tapAsync('1',(name,cb)=>{
    setTimeout(()=>{
      log('111',name)
      cb(null,'wo')
    },1000)
  })

  asyncSeriesWaterfallHook.tapAsync('1',(name,cb)=>{
    setTimeout(()=>{
      log('222',name)
      cb('asyncSeriesWaterfallHook err','shi')
    },1000)
  })

  asyncSeriesWaterfallHook.tapAsync('1',(name,cb)=>{
    setTimeout(()=>{
      log('333',name)
      cb(null,'yige')
    },1000)
  })

  asyncSeriesWaterfallHook.callAsync('leiyanyan',(err)=>{
    console.log(err)
    console.log('asyncSeriesWaterfallHook over')
  })
})

