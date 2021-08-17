const chalk = require('chalk');
const path = require('path')
const error = (message) => {
  console.error(chalk.red(message));
};
const rootPath = path.resolve(process.cwd(), 'node_modules');

/** 解析绝对路径
 * @param {Object} dir 
 */
function resolvePath(dir) {
  return path.resolve(rootPath, dir);
}
const log = (message) => {
  console.log(chalk.green(message));
};
const success = (message) => {
  console.log(chalk.white.bgGreen.bold(message));
};

module.exports = {
  error,
  log,
  success,
  resolvePath
};