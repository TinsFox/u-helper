const inquirer = require('inquirer');

const askQuestions = () => {
  const questions = [
    {
      name: 'FILENAME',
      type: 'input',
      message:
        'Please enter page name?[Support multi-level directories,such as：user/login]',
    },
    {
      name: 'TITLE',
      type: 'input',
      message: 'Please enter page title（meta.title）',
    },
    {
      type: 'list',
      name: 'SIMPLE',
      message: 'What is the template type?',
      choices: ['normal:[create .vue .js .[style]]', 'simple: [only .vue]'],
      filter: function (val) {
        return val.split(':')[0] === 'simple' ? true : false;
      },
    },
  ];
  return inquirer.prompt(questions);
};
const askCss = () => {
  const questions = [
    {
      name: 'CSS_TYPE',
      type: 'list',
      message: 'what is this css style type?',
      choices: ['scss', 'less', 'sass', 'stylus'],
      filter: function (val) {
        return val;
      },
    },
  ];
  return inquirer.prompt(questions);
};

module.exports = { askQuestions, askCss };
