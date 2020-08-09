'use strict';

const packageJsonFile = require(`../../../package.json`);
const chalk = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    const version = packageJsonFile.version;
    console.log(chalk.blue(version));
  }
};
