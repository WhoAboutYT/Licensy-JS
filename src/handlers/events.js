const path = require('path');
const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });
const fs = require("fs");
const { Client } = require('discord.js');

module.exports = class EventHandler {
  /**
   * Creates an instance of class EventHandler.
   * **Does not support folders.**
   * @param {Client} client - Initialized Discord Client Instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Handles events.
   * @param {String} dir 
   * @returns {Boolean} If it failed or passed.
   */
  async setup(dir = path.join(__dirname, '../events')) {
    console.log(chalk.rgb(61, 0, 80)('[handlers] Starting Event Handling'));

    const eventFiles = fs.readdirSync(dir).filter(f => f.endsWith(".js")); 

    if (eventFiles.length == 0) {
        console.log(chalk.bgRed('[Error] There are no files in folder ' + dir));
        return false
    };

    let loadedCt = 0;
    for (const file of eventFiles) {
      const event = require(`${dir}/${file}`);
      if ('execute' in event && 'name' in event) {
        loadedCt++;
        this.client.on(event.name, (...args) => event.execute(...args, this.client));
      } else {
        console.log(chalk.bgYellow(`[handlers] Event at Path ${dir}/${file} doesn't have either a name or execution property/func.`));
      }
    };

    console.log(chalk.green(`[handlers] Loaded ${loadedCt} event ${loadedCt > 1 ? "files" : "file"}`))
    console.log(); //Usually, this will be at the bottom so to make it look nicer, new line.

    return loadedCt > 0;
  }
};