const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trommel')
    .setDescription('…kreis!'),
  async execute(interaction) {
    await interaction.reply('…kreis! 🥁');
  },
};
