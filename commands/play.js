const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { GUILD_ID, VOICE_CHANNEL_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Spiele den nächsten Track')
    .addIntegerOption(option => option.setName('track')
      .setDescription('Nummer des Tracks in der Session Reihenfolge')
      .setRequired(false)),
  async execute(interaction) {
    const bot = interaction.client;
    if (!bot.currentSession) {
      return await interaction.reply('Keine Session geladen! (Lade zuerst eine Session mit `/sesh`)');
    }

    const num = interaction.options.getInteger('track');
    const guild = bot.guilds.cache.get(GUILD_ID);
    let connection = getVoiceConnection(GUILD_ID);

    if (num) {
      if (num < 1 || num > bot.currentSession.tracks.length) {
        return await interaction.reply(`Deine Auswahl muss zwischen 1 und ${bot.currentSession.tracks.length} sein…`);
      }
      bot.currentSession.currentTrackId = num - 1;
    }
    else if (bot.currentSession.currentTrackId == null) {
      bot.currentSession.currentTrackId = 0;
    }
    else if (!connection) {
      bot.currentSession.currentTrackId++;
    }

    if (bot.currentSession.currentTrackId >= bot.currentSession.tracks.length) {
      try {
        connection.destroy();
      }
      catch (e) {
        console.warn(e);
      }
      bot.currentSession = null;
      return await interaction.reply('⏹ Ende der Playlist.');
    }

    if (!connection) {
      connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
      });
    }

    const track = bot.currentSession.tracks[bot.currentSession.currentTrackId];
    const resource = createAudioResource(track.url);
    const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      try {
        connection.destroy();
      }
      catch (e) {
        console.warn(e);
      }
    });

    await interaction.reply(`▶️ ${track.name} (${track.duration})`);
  },
};
