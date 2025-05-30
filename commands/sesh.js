const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const { API_URL } = process.env;

const loadSession = async (slug) => {
  const fetch = (...args) => import('node-fetch')
    .then(({ default: f }) => f(...args));
  const response = await fetch(`${API_URL}/sessions/${slug}`);
  if (response.status !== 200) {
    const error = await response.text();
    console.warn(`[${response.status}]: ${error}`);
    return null;
  }
  const session = await response.json();
  return session;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sesh')
    .setDescription('Lade eine Session')
    .addStringOption(option => option.setName('sesh')
      .setDescription('Link zur Session oder Session ID (YYYYMMDD)')
      .setRequired(false)),
  async execute(interaction) {
    await interaction.reply('Ich suche die Session, bitte kurz warten…');

    const today = moment().format('YYYYMMDD');
    let slug = interaction.options.getString('sesh') ?? today;

    try {
      // Match first group of 8 digits in input argument:
      [slug] = slug.match(/\d{8}/);
    }
    catch {
      return await interaction.editReply('⚠️ Format: `YYYYMMDD` oder die ganze `URL` aus dem Archiv.');
    }

    const session = await loadSession(slug);
    if (!session) {
      return await interaction.editReply(`⚠️ Keine Session mit ID ${slug} gefunden…`);
    }

    const bot = interaction.client;
    bot.currentSession = session;

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(bot.currentSession.challenge.name)
      .setURL(bot.currentSession.url)
      .setDescription(bot.currentSession.challenge.blurb)
      .addFields(
        ...bot.currentSession.tracks.map(
          (track, index) => ({
            name: `Track ${index + 1}`,
            value: `${track.name} [${track.duration}]`,
            inline: false,
          }),
        ),
      )
      .setFooter({ text: session.date });
    await interaction.editReply({ content: 'Session geladen:', embeds: [embed] });
  },
};
