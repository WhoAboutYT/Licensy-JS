const { Chalk } = require('chalk');
const djs = require('discord.js');
const chalk = new Chalk({ level: 3 });
const log = console.log;

module.exports = {
  name: 'interactionCreate',
  /**
   *
   * @param {djs.Interaction} interaction
   * @param {djs.Client} client
   */
  execute: async (interaction, client) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      setTimeout(async () => {
        if (interaction.replied || interaction.deferred) console.error('You have a duplicate bot process running.') && process.exit(0);
      }, 3000);
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', flags: djs.MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', flags: djs.MessageFlags.Ephemeral });
      }
    }
  },
};
