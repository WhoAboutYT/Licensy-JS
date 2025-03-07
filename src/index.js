const Discord = require('discord.js');
const { Chalk } = require('chalk');
const chalk = new Chalk({ level: 3 });
const CommandHandler = require('./handlers/commands');
const EventHandler = require('./handlers/events');
const configs = require('../config.json');
const ClientLoginErrorHandling = require('./utils/ClientLoginErrorHandling');

console.log(chalk.bold(`[LicensyJS]: Loading...\n`));

const client = new Discord.Client({
  intents: ['Guilds', 'GuildMessages', 'GuildIntegrations', 'GuildMembers'],
});

if (configs.debug.status) client.on('debug', console.log);

client.commands = new Discord.Collection();
client.dbSetting = configs.db.type;

async function initializeBot() {
  try {
    const result = await new CommandHandler(true, client).setup();
    const commandsLoaded = result[0];
    const commandsJsonData = result[1];

    const eventsLoaded = await new EventHandler(client).setup();

    const passedHandling = [commandsLoaded, eventsLoaded].filter(Boolean).length;

    switch (passedHandling) {
      case 2:
        console.log(chalk.green('[handlers]: All handlers passed successfully.'));
        break;
      case 1:
        console.log(chalk.yellow('[handlers]: 1 handler passed, 1 failed.'));
        break;
      default:
        console.log(chalk.red('[handlers]: Both handlers failed.'));
        return;
    }

    // Step 1: Run registry function only if command & event handlers passed
    const registryHandler = new CommandHandler(false, client);
    const registrySuccess = await registryHandler.registry(configs.token, configs.clientId, configs.guildId, commandsJsonData);

    if (!registrySuccess) {
      console.log(chalk.red('[bot] Registry failed, stopping bot initialization.'));
      return;
    }

    // Step 2: Log in only if registry succeeded
    console.log(chalk.blue('[bot] Logging in...'));
    await client.login(configs.token);
    console.log(chalk.green('[bot] Successfully logged in.'));
  } catch (error) {
    console.error(chalk.red(`[bot] Error during initialization: ${error.message}`));
    ClientLoginErrorHandling(error);
  }
}


// Run initialization
initializeBot();
