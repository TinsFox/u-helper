/**
 * 常量
 */
const path = require('path');

const fs = require('fs-extra');
const OS = {
  LINUX: `linux`,
  DARWIN: `darwin`,
  WINDOWS: `windows`
};
const PATH = {
  darwin: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli',
  windows: ``,
  linux: ``
};
const projectPath = path.resolve()
const UNI_PLATFORM = process.env.UNI_PLATFORM
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : `development`
const outPath = `/dist`
const ENV = NODE_ENV === `development` ? `dev` : `build`

const CONFIG = `u-helper.config.js`
const projectConfigPath = `/project.config.json`
const privateProjectConfigPath = `/project.private.config.json`
const projectConfigTemplePath = `/node_modules/u-helper/generator/uniapp/config/mp-weixin/project.config.json`
const platform = process.platform === `darwin` ? `macOS/Linux` : `Windows`

const ENVDISTPATH = `/${ENV}`
const distPath = `${projectPath}${outPath}${ENVDISTPATH}/${UNI_PLATFORM}`
const projectConfig = `${distPath}${projectConfigPath}`
const privateProjectConfig = `${distPath}${privateProjectConfigPath}`
const projectConfigTemple = `${projectPath}${projectConfigTemplePath}`
const uHelperConfig = (() => {
  let uHelperConfigExit = fs.existsSync(`${projectPath}/${CONFIG}`)
  if (uHelperConfigExit)
    return require(`${projectPath}/${CONFIG}`)
})()
let toolPath = PATH[process.platform];

module.exports = {
  OS,
  PATH,
  outPath,
  distPath,
  CONFIG,
  projectConfig,
  privateProjectConfig,
  projectConfigTemple,
  projectPath,
  platform,
  toolPath,
  ENV,
  UNI_PLATFORM,
  uHelperConfig
}