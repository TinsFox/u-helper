/**
 * u-hepler build
 * Depend on @dcloudio/vue-cli-plugin-uni/commands/build.js
 * 
 */
const path = require('path')
const shellExec = require('shell-exec')
const {
  runByHBuilderX,
  isInHBuilderX
} = require('@dcloudio/uni-cli-shared')

const defaults = {
  clean: false, // 默认不清除旧的产物，微信小程序的一些自定义编译会丢失
  target: 'app',
  'unsafe-inline': true
}

const modifyConfig = (config, fn) => {
  if (Array.isArray(config)) {
    config.forEach(c => fn(c))
  } else {
    fn(config)
  }
}
module.exports = (api, options) => {
  api.registerCommand('uni-build', {
    description: 'build for production',
    usage: 'vue-cli-service uni-build [options]',
    options: {
      '--watch': 'watch for changes',
      '--minimize': 'Tell webpack to minimize the bundle using the TerserPlugin.',
      '--auto-host': 'specify automator host',
      '--auto-port': 'specify automator port',
      '--subpackage': 'specify subpackage',
      '--plugin': 'specify plugin'
    }
  }, async (args) => {
    for (const key in defaults) {
      if (args[key] == null) {
        args[key] = defaults[key]
      }
    }

    const platforms = ['mp-weixin', 'mp-qq', 'mp-baidu', 'mp-alipay', 'mp-toutiao']
    if (args.subpackage && platforms.includes(process.env.UNI_PLATFORM)) {
      process.env.UNI_SUBPACKGE = args.subpackage
    }

    if (args.plugin) {
      if (process.env.UNI_PLATFORM === 'mp-weixin') {
        process.env.UNI_MP_PLUGIN = args.plugin
        analysisPluginDir()
      } else {
        console.error('编译到小程序插件只支持微信小程序')
        process.exit(0)
      }
    }

    require('./util').initAutomator(args)

    args.entry = args.entry || args._[0]

    process.env.VUE_CLI_BUILD_TARGET = args.target

    await build(args, api, options)

    delete process.env.VUE_CLI_BUILD_TARGET
  })
}

function getWebpackConfig(api, args, options) {
  const validateWebpackConfig = require('@vue/cli-service/lib/util/validateWebpackConfig')
  // resolve raw webpack config
  const webpackConfig = require('@vue/cli-service/lib/commands/build/resolveAppConfig')(api, args, options)

  // check for common config errors
  validateWebpackConfig(webpackConfig, api, options, args.target)

  if (args.watch) {
    modifyConfig(webpackConfig, config => {
      config.watch = true
    })
  }

  if (args.minimize && process.env.NODE_ENV !== 'production') {
    modifyConfig(webpackConfig, config => {
      config.optimization.minimize = true
      config.optimization.namedModules = false
    })
  } else {
    modifyConfig(webpackConfig, config => {
      if (!config.optimization) {
        config.optimization = {}
      }
      config.optimization.namedModules = false
    })
  }
  return webpackConfig
}

function getWebpackConfigs(api, args, options) {
  if (!process.env.UNI_USING_V3) {
    return [getWebpackConfig(api, args, options)]
  }
  const pluginOptions = (options.pluginOptions || (options.pluginOptions = {}))
  pluginOptions['uni-app-plus'] = {
    service: true
  }
  options.publicPath = '/'
  const serviceWebpackConfig = getWebpackConfig(api, args, options)
  delete pluginOptions['uni-app-plus'].service
  pluginOptions['uni-app-plus'].view = true
  options.publicPath = './'
  const viewWebpackConfig = getWebpackConfig(api, args, options)
  return [serviceWebpackConfig, viewWebpackConfig]
}

async function build(args, api, options) {
  const fs = require('fs-extra')
  const chalk = require('chalk')
  const webpack = require('webpack')

  const {
    log,
    done,
    logWithSpinner,
    stopSpinner
  } = require('@vue/cli-shared-utils')

  const runByAliIde = process.env.BUILD_ENV === 'ali-ide'

  log()

  if (!runByHBuilderX && !runByAliIde) {
    logWithSpinner(`开始编译当前项目至 ${process.env.UNI_SUB_PLATFORM || process.env.UNI_PLATFORM} 平台...`)
  }

  const targetDir = api.resolve(options.outputDir)

  const webpackConfigs = getWebpackConfigs(api, args, options)

  if (process.env.NODE_ENV === 'production') {
    try {
      fs.emptyDir(path.resolve(process.env.UNI_CLI_CONTEXT, 'node_modules/.cache'))
    } catch (e) {}
  }

  if (args.clean || process.env.UNI_PLATFORM === 'app-plus') {
    await fs.emptyDir(targetDir)
  }

  if (process.env.UNI_USING_NATIVE || process.env.UNI_USING_V3_NATIVE) {
    webpackConfigs.length = 0
  }

  if (
    process.env.UNI_USING_NATIVE ||
    process.env.UNI_USING_V3_NATIVE ||
    (process.UNI_NVUE_ENTRY && Object.keys(process.UNI_NVUE_ENTRY).length)
  ) {
    webpackConfigs.push(require('@dcloudio/vue-cli-plugin-hbuilderx/build/webpack.nvue.conf.js')(process.UNI_NVUE_ENTRY))
  }

  return new Promise((resolve, reject) => {
    webpack(webpackConfigs, (err, stats) => {
      if (!runByHBuilderX && !runByAliIde) {
        stopSpinner(false)
      }
      if (err) {
        return reject(err)
      }

      if (stats.hasErrors()) {
        /* eslint-disable prefer-promise-reject-errors */
        return reject('Build failed with errors.')
      }

      if (!args.silent && (process.env.UNI_PLATFORM !== 'app-plus' || process.env.UNI_AUTOMATOR_WS_ENDPOINT)) {
        const targetDirShort = path.relative(
          api.service.context,
          process.env.UNI_OUTPUT_DIR
        )

        if (!args.watch) {
          const dirMsg = runByHBuilderX ? '' :
            `The ${chalk.cyan(targetDirShort)} directory is ready to be deployed.`
          done(`Build complete. ${dirMsg}`)

          if (process.env.UNI_PLATFORM === 'h5' && !isInHBuilderX) {
            console.log()
            console.log('欢迎将H5站部署到uniCloud前端网页托管平台，高速、免费、安全、省心，详见：')
            console.log('https://uniapp.dcloud.io/uniCloud/hosting')
          }
        } else {
          const dirMsg = runByHBuilderX ? '' : `The ${chalk.cyan(targetDirShort)} directory is ready. `
          done(`Build complete. ${dirMsg}Watching for changes...`)
        }
        // TODO 启动开发工具
        shellExec(`/Applications/wechatwebdevtools.app/Contents/MacOS/cli open --project ${targetDir}`)
        done('The project has been opened in the development tool')
      }
      resolve()
    })
  })
}

module.exports.defaultModes = {
  'uni-build': process.env.NODE_ENV
}

/**
 * 编译到微信小程序插件 文件校验
 */
function analysisPluginDir() {
  const fs = require('fs-extra')

  // plugin.json 是否存在
  const pluginJsonName = 'plugin.json'
  const pluginJsonPath = path.resolve(process.env.UNI_INPUT_DIR, pluginJsonName)

  if (!fs.pathExistsSync(pluginJsonPath)) {
    console.error(`${pluginJsonName}文件不存在，请检查后重试`)
    process.exit(0)
  }

  const pluginJson = require(pluginJsonPath)

  // index.js 入口文件是否存在
  process.env.UNI_MP_PLUGIN_MAIN = pluginJson.main
  const UNI_MP_PLUGIN_MAIN = process.env.UNI_MP_PLUGIN_MAIN
  const mainFilePath = path.resolve(process.env.UNI_INPUT_DIR, UNI_MP_PLUGIN_MAIN)

  if (UNI_MP_PLUGIN_MAIN && !fs.pathExistsSync(mainFilePath)) {
    console.error(`${UNI_MP_PLUGIN_MAIN}入口文件不存在，请检查后重试`)
    process.exit(0)
  }

  // 目前编译到小程序插件，需要在 pages.json 中配置页面，在main.js中引入使用一下组件，因此先不做一下校验
  // 配置的路径是否存在
  /* const pages = pluginJson.pages || {}
   const publicComponents = pluginJson.publicComponents || {}
   const allFilesPath = Object.values(pages).map(item => item + '.vue').concat(Object.values(publicComponents).map(item => item + '.vue'))
   const inexistenceFiles = []
   if (allFilesPath.length) {
   allFilesPath.forEach(pagePath => {
   const curentPageAbsolutePath = path.resolve(process.env.UNI_INPUT_DIR, pagePath)
   if (!fs.pathExistsSync(curentPageAbsolutePath)) {
   inexistenceFiles.push(curentPageAbsolutePath)
   }
   })
   }
   if (inexistenceFiles.length) {
   inexistenceFiles.forEach(path => {
   console.error(`${path}文件不存在，请检查后重试`)
   })
   process.exit(0)
   } */
}