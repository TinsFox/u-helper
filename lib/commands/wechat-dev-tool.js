/**
 * @description 微信开发工具脚本
 */
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const shell = require('shelljs');
const fs = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const concurrently = require('concurrently');

let {
  PATH,
  distPath,
  projectConfig,
  privateProjectConfig,
  projectConfigTemple,
  uHelperConfig,
  ENV,
  platform,
  toolPath,
  projectPath,
  UNI_PLATFORM
} = require('../constant');
const {
  open,
  compile,
  dev,
  pre,
  test,
  release,
  openProject
} = args;
const shellMap = require('../../generator/uniapp/uniAppScript');
/**
 * 初始化数据
 */
initializePath = async () => {
  ora(`Reading configuration`).info();
  ora(`The current computer system is ${platform}`).info();
  if (fs.existsSync(`${projectConfig}`)) {
    const {
      toolPath: customPath
    } = uHelperConfig;
    if (customPath != '') {
      toolPath = customPath;
      ora(`Use user-defined configuration`).warn();
      ora(`The user-defined tool path is in${customPath}`).fail();
    }
    if (customPath == '') {
      ora(`User-defined configuration is Invalid`).warn();
    }
  }
  ora(`The configuration is as follows`).info();
  ora(`You are currently under ${projectPath}`).info();
  ora(`The development tool is on the in ${toolPath}`).info();
  ora(`The build product will be generated on the ${distPath}`).info();
  ora(`Reading completed`).succeed();
};
/**
 * 编译
 */
compileCode = async () => {
  const nodeScript = `npm run ${ENV}:${UNI_PLATFORM}`;
  try {
    const projectConfigData = fs.pathExistsSync(projectConfig);
    if (!projectConfigData) {
      // 不存在配置文件，为了保证开发工具能正常启动，写入一个默认的配置
      // console.log('默认配置数据', );
      fs.outputJson(projectConfig, fs.readJsonSync(projectConfigTemple));
      ora(chalk.green('End of writing the default configuration')).succeed();
    }
    setTimeout(() => {
      concurrently([{
        command: nodeScript,
        name: 'compile code'
      }, {
        command: `npm run u:open`,
        name: 'open dev-tool'
      }, {
        command: `${toolPath} open --project ${distPath}`,
        name: 'open project'
      }], {
        prefix: 'name',
        killOthers: ['failure', 'success'],
        restartTries: 3
      }).then((success, failure) => {

      });
    }, 2000);

  } catch (err) {

    throw err;
  }
};
/**
 * 启动微信开发者工具
 */
openWeChatDevTool = async () => {
  let flag = false;
  shell.exec(`${toolPath} open`, (code) => {
    flag = code === 0;
    ora(chalk.green('Development tools have started')).succeed();
  });
  return flag;
};
devCode = async () => {
  await compileCode();
  const nodeScript = `npm run ${ENV}:${UNI_PLATFORM}`;
  setTimeout(async () => {
    concurrently([{
      command: nodeScript,
      name: 'compile code'
    }, {
      command: `npm run u:open`,
      name: 'open dev-tool'
    }, {
      command: `${toolPath} open --project ${distPath}`,
      name: 'open project'
    }], {
      prefix: 'name',
      killOthers: ['failure', 'success'],
      restartTries: 3
    }).then((success, failure) => {

    });
  }, 2000);
};
/**
 * 启动项目
 */
openProjectHelper = async () => {
  let flag = false;
  shell.exec(`${toolPath} open --project ${distPath}`, (code) => {
    flag = code === 0;
    ora(chalk.green('The project has been opened in the development tool')).succeed();
  });
  return flag;
};
testHandle = () => {
  const rootPath = path.resolve(process.cwd(), 'node_modules');

  /** 解析绝对路径
   * @param {Object} dir
   */
  function resolvePath(dir) {
    return path.resolve(rootPath, dir);
  }

  console.log('rootPath', rootPath);
  require(resolvePath('@dcloudio/vue-cli-plugin-uni/commands/build.js'));

};
/**
 * initializePath     初始化配置
 * openWeChatDevTool  启动微信开发工具
 * compile            编译项目（dev pre release）
 * openProjectHelper        打开项目
 */
module.exports = async () => {
  ora(`${chalk.green('Hey! Welcome to u-helper')}`).info();
  await initializePath(); // 初始环境
  open && await openWeChatDevTool(); // 打开工具
  dev && (compileCode()); // 启动项目
  pre && (ora(`pre ...`).info());
  release && (ora(`release ...`).info());
  test && (testHandle());
  openProject && await openProjectHelper();
};
