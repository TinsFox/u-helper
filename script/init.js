const { program } = require('commander');
const { log } = require('../lib/util');
const version = require('../package.json').version;
function programInit() {
  program.version(version);
  program
    .command('create-page [name]')
    .description('create a page')
    .option('-s, --simple', 'create a simple page only vue file')
    .option('-t, --title <title>', 'page tile')
    .action(require('../commands/create-page'))
    .on('--help', () => {
      log('You can enter u-helper create-page to help you to choice.');
    });

  program
    .command('create-component [name]')
    .description('create a component')
    .option('-s, --simple', 'create a component')
    .action(require('../commands/create-component'))
    .on('--help', () => {
      log('You can enter u-helper create-component to help you to choice.');
    });
  program.parse(process.argv);
}

programInit();
