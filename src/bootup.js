const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });
const log = console.log;
const fs = require('fs');
const config = require('../config.json');
const readline = require('node:readline');
console.clear();

log('-- -- -- --  --');
log('-____________-');
log('-| LicensyJS |-');
log('---------------');
log('-- -- -- --  --');
log(chalk.blue('[NOTICE]  Starting Bootup Checks..'));

let arrayOfAnswers = [];

if (!config.finishedConfiguration) {
  (async () => {
    log();
    log();
    log(chalk.yellow('[CFG]  You have not configured this bot yet. You will now enter that process.'));
    log();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const askQuestion = q => new Promise(resolve => rl.question(q, resolve));

    try {
      // Questions
      const token = await askQuestion(chalk.bold('Enter Bot Token (discord.com/developers) --> '));
      arrayOfAnswers.push(token);

      const guildId = await askQuestion(chalk.bold('Enter Guild ID (use developer mode) --> '));
      arrayOfAnswers.push(guildId);

      const clientId = await askQuestion(chalk.bold('Enter Client ID (use developer mode) --> '));
      arrayOfAnswers.push(clientId);

      let enableJsonDb = await askQuestion(chalk.bold('Enable Json Db Mode? (Could lead to data loss) --> [y/n] '));
      while (!['y', 'n'].includes(enableJsonDb.toLowerCase())) {
        enableJsonDb = await askQuestion(chalk.bgYellow('[Invalid Input] Enable Json Db Mode? (Could lead to data loss) --> [y/n] ') + ' ');
      }

      const isJsonDbEnabled = enableJsonDb.toLowerCase() === 'y';
      arrayOfAnswers.push(isJsonDbEnabled);
      log(chalk.blue('[DEBUG] isJsonDbEnabled:', isJsonDbEnabled));

      let mongoConnectionUrl = '';

      // Check condition before asking for MongoDB connection URL (this seems to error sometimes)
      if (!isJsonDbEnabled) {
        log(chalk.blue('[DEBUG] Asking for MongoDB URL...'));
        mongoConnectionUrl = await askQuestion(chalk.bold('Mongoose connection URL? (do not omit username/pass) --> '));
        arrayOfAnswers.push(mongoConnectionUrl);
      } else {
        log(chalk.blue('[DEBUG] Skipping MongoDB URL as JSON DB is enabled.'));
      }

      // Update config object
      config.token = token;
      config.guildId = guildId;
      config.clientId = clientId;
      config.db.type = isJsonDbEnabled ? 'json' : 'mongo';
      config.db.mongo_connection_url = mongoConnectionUrl;
      config.finishedConfiguration = true;
      console.log(config);
      // Write updated configuration to file
      fs.writeFileSync(require('path').join(__dirname, '../config.json'), JSON.stringify(config), { encoding: 'utf-8' });

      log(chalk.green('[SUCCESS] Configuration updated successfully. Re-run the bot!'));
    } catch (err) {
      log(chalk.red('[ERROR] An error occurred during the configuration process.'), err);
    } finally {
      rl.close();
    }
  })();
} else {
  log(chalk.green('[NOTICE]  Checks passed!'));

  log(chalk.rgb(160, 32, 240)('[NOTICE] Redirecting to main file (index.js) ....!'));
  log();
  log();
  require('./index.js');
}