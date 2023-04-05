const { getVoiceConnection } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('discord.js');
const { GUILD_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder().setName('stop').setDescription('Stopp'),
  async execute(interaction) {
    const connection = getVoiceConnection(GUILD_ID);

    if (!connection) {
      await interaction.reply('Es spielt nix…');
    }

    try {
      connection.destroy();
    }
    catch (e) {
      console.warn(e);
    }

    await interaction.reply('⏹ Stopp.');
  },
};
