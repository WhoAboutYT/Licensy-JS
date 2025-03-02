const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });
const log = console.log;

module.exports = {
  name: 'ready',
  execute: client => {
    log('-- -- -- --  --');
    log('-____________-');
    log('-| LicensyJS |-');
    log('---------------');
    log('-- -- -- --  --');
    log(chalk.blue('[READY]  ..  Bot Online!'));
    log(chalk.rgb(0, 183, 255)(`[READY] Bot online as ${client.user.tag}`));
  },
};
