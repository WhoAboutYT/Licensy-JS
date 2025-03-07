const config = require('../../config.json');
const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const JsonDB = require('../utils/jsonDb');

if (config.finishedConfiguration && config.db.type == 'mongo') {
  console.log(chalk.blueBright(`[INFO] Using Mongo Database`));

  if (!config.db.mongo_connection_url.startsWith('mongodb')) {
    console.log(chalk.bgRed(`[DB] Cannot connect to mongo DB : Invalid Connection URL. `));
    process.exit(1);
  }

  mongoose.connect(config.db.mongo_connection_url).then(() => {
    console.log(chalk.bgGreen(`[DB] Connected to Mongo Database!`));
  }).catch(e => {
    console.log(chalk.bgRed(`[DB] Error!! ${e.message} make sure your connection url is valid, or correctly formatted if symbols are included.`));
    process.exit(0);
  })
} else {
  console.log(chalk.blueBright(`[INFO] Using JSON Database`));
  console.log(chalk.bgGreen(`[DB] Connected to Json Database!`));

  new JsonDB().ensureDB();
}