const fs = require('fs-extra');
const {
  rootPath,
  resolvePath
} = require("../util")
module.exports = async () => {
  const ora = require('ora');
  ora(`初始化配置`).info();
  const uBuildPath = resolvePath('u-helper/lib/commands/build.js')
  const targetPath = resolvePath(resolvePath('@dcloudio/vue-cli-plugin-uni/commands/build.js'))
  fs.copySync(uBuildPath, targetPath), {
    overwrite: true
  }
  ora(`初始化完成`).succeed();
}