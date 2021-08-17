const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');
const {
  rootPath,
  resolvePath
} = require('../util');
const ora = require('ora');
const args = require('minimist')(process.argv.slice(2));
const {
  s, y
} = args;
/**
 * 初始化u-Helper 配置
 * TODO: 写入 u-helper.config.js 文件
 * note: 用webpack --watch 无法触发 npm 的post
 */
module.exports = async () => {
  if (y) {
    ora(`初始化配置`).start();
    const uBuildPath = resolvePath('u-helper/lib/commands/build.js');
    const targetPath = resolvePath(resolvePath('@dcloudio/vue-cli-plugin-uni/commands/build.js'));
    fs.copySync(uBuildPath, targetPath), {
      overwrite: true
    };
    ora(`初始化完成`).succeed();
    ora(`开始享受吧！`).info();
  } else if (s) {
    ora(`正在重写package.json`).info();
    const packageJsonPath = path.join(process.cwd(), '/package.json');
    jsonfile.readFile(path.join(packageJsonPath))
      .then(origin => {
        return jsonfile.readFile(packageJsonPath)
          .then(obj => {
            obj.scripts = { ...origin.scripts, 'postdev:mp-weixin': 'npm run u-helper --openProject' };
            ora(`重写完成`).succeed();
            ora(`开始享受吧！`).info();
            return obj;
          });
      })
      .then(obj => {
        return jsonfile.writeFile(packageJsonPath, obj, {
          spaces: 2
        });
      })
      .catch(err => {
        throw err;
      });

  } else {
    ora(`请输入你要执行的操作`).fail();
    console.log('==> Examples:');
    console.log('$ u-helper init -y');
    console.log('$ u-helper init -s');
  }

};
