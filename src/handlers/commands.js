const fs = require('fs');
const path = require('path');
const { Chalk } = require('chalk');
const { Client, Collection } = require('discord.js');
const chalk = new Chalk({ level: 3 });
const Discord = require('discord.js');

module.exports = class CommandHandler {
  /**
   * Creates an instance of CommandHandler.
   * @param {Boolean} debug - Boolean, True/False if you want to enable Debug Messages.
   * @param {Client} client - Provide a Discord Client with client.commands initialized.
   */
  constructor(debug, client) {
    if (debug !== true && debug !== false) {
      throw Error('Error: Debug must be of type BOOLEAN.');
    }

    this.client = client;
    this.debug = debug;
    this.__jsonData = [];
  }

  /**
   * Reads specified directory, looks for JS files and loads them into slash commands.
   * @param {String} dir
   * @returns {Boolean} Success or Failure.
   */
  async setup(dir = path.join(__dirname, '../commands/')) {
    console.log(chalk.rgb(61, 0, 80)('[handlers] Starting Command Handling'));

    //  * Basic reference: https://discordjs.guide/creating-your-bot/command-handling.html#loading-command-files for a better insight.
    if (!this.client.commands || !(this.client.commands instanceof Collection)) {
      console.log(chalk.rgb(88, 0, 0)('Cannot proceed with command handling because client.commands does not exist or not instance of Collection.'));
      return false;
    }
    let loadedCt = 0;

    const foldersInCommands = fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory()); // TODO: Typescript Support

    for (const folder of foldersInCommands) {
      const commandsPath = path.join(dir, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js')); // files must be placed in folders, so it can't be ungrouped, use an "other" folder

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
          loadedCt++;
          if (this.debug) console.log(chalk.blue(`[handlers] Loaded command "${command.data.name}", count: ${loadedCt}`));
          this.client.commands.set(command.data.name, command);
          this.__jsonData.push(command.data.toJSON());
          console.log(this.__jsonData)
        } else {
          console.log(chalk.rgb(255, 102, 0)(`[WARN] Command at ${filePath} is missing "data" and "execute" property.`));
        }
      }
    }

    console.log(chalk.green(`[handlers] Set ${loadedCt} command files.`));
    this.__jsonData = this.__jsonData;
    return [true, this.__jsonData];
  }

  /**
   * https://discordjs.guide/creating-your-bot/command-deployment.html#guild-commands
   * @param {String} token
   * @param {String} clientId
   * @param {String} guildId
   */
  async registry(token, clientId, guildId, json) {
    const REST = new Discord.REST().setToken(token);
    try {
      // The put method is used to fully refresh all commands in the guild with the current set
      await REST.put(Discord.Routes.applicationGuildCommands(clientId, guildId), { body: json });

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
};
