const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forget')
    .setDescription('Vergesse die aktuell geladene Session'),
  async execute(interaction) {
    const bot = interaction.client;
    bot.currentSession = null;
    await interaction.reply('Session vergessen.');
  },
};
