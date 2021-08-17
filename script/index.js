const {
  program
} = require('commander');
const {
  log
} = require('../lib/util');
const version = require('../package.json').version;

function programInit() {
  program
    .command('create-page [name]')
    .description('创建 uniApp 页面')
    .option('-s, --simple', '创建 uniApp 简单页面')
    .option('-t, --title <title>', 'page tile')
    .action(require('../lib/commands/create-page'))
    .alias('p')
    .on('--help', () => {
      log('You can enter u-helper create-page to help you to choice.');
      console.log('  Examples:')
      console.log('')
      console.log('$ u-helper create-page')
      console.log('$ u-helper p')
    });

  program
    .command('create-component <name>')
    .description('创建 uniApp 组件')
    .option('-s, --simple', 'create a component')
    .action(require('../lib/commands/create-component'))
    .alias('c')
    .on('--help', () => {
      log('You can enter u-helper create-component to help you to choice.');
    });

  program.command('wechat-dev-tool')
    .description('微信开发工具箱')
    .option('--open', '启动微信开发工具')
    .option('--compile', '编译uniApp')
    .option('--dev', '启动微信开发工具 && 开发编译uniApp')
    .option('--pre', '预发布编译uniApp && 上传微信小程序体验版')
    .option('--release', '生产编译uniApp && 上传微信小程序体验版')
    .option('--test', '工具调试')
    .action(require('../lib/commands/wechat-dev-tool'))
    .alias('w')
    .on('--help', () => {
      console.log('==> Examples:')
      console.log('$ u-helper w --open')
      console.log('$ u-helper w --compile')
      console.log('$ u-helper w --dev')
      console.log('$ u-helper w --pre')
      console.log('$ u-helper w --release')
    });

  program.command('init')
    .description('初始化u-Helper配置')
    .action(require('../lib/commands/init'))
    .alias('i')
    .on('--help', () => {
      console.log('==> Examples:')
      console.log('$ u-helper init')
    });
  program
    .version(version, '-v, --version')
  program.parse(process.argv);
}

programInit();