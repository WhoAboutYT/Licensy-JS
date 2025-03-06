const config = require('../../config.json');
const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const JsonDB = require('../utils/jsonDb');

if (config.finishedConfiguration && config.db.type == 'mongo') {
    mongoose.connect(config.db.mongo_connection_url).then(() => {
        console.log("Connected to database!");
    }).catch(e => console.error(e));
} else {
  console.log(chalk.blueBright(`[INFO] Using JSON Database`));

  new JsonDB().ensureDB();
};