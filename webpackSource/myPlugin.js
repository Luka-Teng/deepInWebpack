const chalk = require("chalk");

class MyPlugin {
  constructor () {
    this.count = 1
  }
  apply(compiler) {
    global.compiler = compiler
    compiler.hooks.normalModuleFactory.tap('nmf', (nmf) => {

      nmf.hooks.beforeResolve.tap("test", (result) => {  
        debugger   
        return global.a = result
      })

      nmf.hooks.resolver.tap("test", (result) => {
        debugger
        return global.a = result
      })

      nmf.hooks.afterResolve.tap("test", (result) => {
        debugger
        return global.a = result
      })

      nmf.hooks.module.tap("test", (result) => {
        debugger
        return global.a = result
      })

      nmf.hooks.parser.for('javascript/auto').tap("test", (parser) => {
        parser.hooks.program.tap('test', (options) => {
          debugger
        })
      })
    })

    compiler.hooks.compilation.tap('test', (compilation) => {
      compilation.hooks.buildModule.tap('test', (module) => {
        debugger
      })

      compilation.hooks.succeedModule.tap('test', (module) => {
        debugger
      })

      compilation.hooks.finishModules.tap('test', (modules) => {
        debugger
      })

      compilation.hooks.seal.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.optimize.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.record.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.beforeHash.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.afterHash.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.chunkHash.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.contentHash.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.beforeModuleAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.shouldGenerateChunkAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.beforeChunkAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.additionalChunkAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.additionalAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.optimizeChunkAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.afterOptimizeChunkAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.optimizeAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.afterOptimizeAssets.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.reviveChunks.tap('test', (...options) => {
        debugger
      })
      
      compilation.hooks.moduleAsset.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.chunkAsset.tap('test', (...options) => {
        debugger
      })

      compilation.hooks.assetPath.tap('test', (...options) => {
        debugger
        return options[0]
      })
    })
  }
}

module.exports = MyPlugin;