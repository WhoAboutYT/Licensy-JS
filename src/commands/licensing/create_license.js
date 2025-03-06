const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder().setName('new_license').setDescription('Creates a new license.').setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    return interaction.reply("This isn't setup yet.");
  },
};
