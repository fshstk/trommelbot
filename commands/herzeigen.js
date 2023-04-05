const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
const { GUILD_ID, VOICE_CHANNEL_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('herzeigen')
    .setDescription('Spiele einen in Discord hochgeladenen Track')
    .addAttachmentOption(option => option.setName('file')
      .setDescription('MP3 das du herzeigen möchtest')
      .setRequired(true)),
  async execute(interaction) {
    const file = interaction.options.getAttachment('file');
    if (!file) {
      return console.error('No file found!');
    }

    const url = file.proxyURL;
    const fileName = url.split('/').pop();
    const fileSuffix = url.split('.').pop();

    const allowedSuffixes = ['mp3', 'wav'];
    if (!allowedSuffixes.includes(fileSuffix)) {
      return await interaction.reply('⚠️ Erlaubte Dateiformate: MP3, WAV');
    }

    let connection = getVoiceConnection(GUILD_ID);
    if (connection) {
      return await interaction.reply('Oida ich spiel schon einen Track…');
    }
    else {
      const guild = interaction.client.guilds.cache.get(GUILD_ID);
      connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: guild.voiceAdapterCreator,
        selfDeaf: false,
      });
    }

    const resource = createAudioResource(url);
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

    await interaction.reply(`▶️ ${interaction.user.username} – ${fileName}`);
  },
};
