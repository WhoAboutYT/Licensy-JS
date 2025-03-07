const { SlashCommandBuilder, PermissionsBitField, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('new_license')
    .setDescription('Creates a new license.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addRoleOption(option => option.setName('role').setDescription('Role to assign the license to').setRequired(true))
    .addIntegerOption(option => option.setName('expiry').setDescription('Expiry time of the license in days').setRequired(true)),
  /**
   *
   * @param {import('discord.js').Interaction} interaction
   */
  async execute(interaction) {
    const role = interaction.options.getRole('role');
    const expInDays = interaction.options.getInteger('expiry');

    interaction.reply({
      embeds: [new EmbedBuilder()
        .setTitle("Information Provided")
        .setDescription(`${role} & ${expInDays} Days`)
        .setColor("Green")
        .setFooter({ text: "LicensyJS" })
      ]
    })
  },
};
