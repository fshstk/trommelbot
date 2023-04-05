const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Infos zum Digitalen Trommelkreis und zum Trommelbot'),
  async execute(interaction) {
    const reply = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('Der offizielle Discord Bot des digitalen Trommelkreises')
      .setAuthor({ name: 'Trommelbot', iconURL: 'https://www.trommelkreis.club/static/img/logo.png', url: 'https://trommelkreis.club' })
      .setDescription(`
            ‣ Der Trommelkreis findet *jeden zweiten Montag um 19:30 Uhr* statt.
            ‣ Gemeinsames Anhören findet hier um ca. 22:00/22:30 Uhr statt.
            ‣ Mehr zum digitalen Trommelkreis erfährt ihr auf der [Webseite](https://trommelkreis.club)!
            ‣ Wenn ihr mitmachen wollt, lohnt es sich der [WhatsApp](https://chat.whatsapp.com/IuA760mHIrcKiR3krPjBwK) oder [Signal](https://signal.group/#CjQKIDRCSmC9AGtGBHjdrN0DhwHUKWmrvBHnzqM9dZ7MrU__EhD1Do3fYVenTPVm2D1WlZq1) Gruppe beizutreten.
            ‣ Alle sind willkommen!

            **Verfügbare Commands:** ([TrommelBot](https://github.com/fshstk/trommelbot))
            ‣ \`trommel\`: …kreis!
            ‣ \`info\`: diese Nachricht anzeigen.
            ‣ \`sesh\`: lade die heutige Session.
            ‣ \`sesh [YYYYMMDD oder URL]\`: lade die angegebene Session.
            ‣ \`forget\`: vergesse die aktuell geladene Session.
            ‣ \`play\`: spiele den aktuellen bzw. nächsten Track.
            ‣ \`play [#]\`: spiele Track Nummer \`#\`.
            ‣ \`herzeigen\`: spiele deinen in Discord hochgeladenen Track.
            ‣ \`stop\`: stopp, vergesse die aktuell geladene Session.

            **Verfügbare Commands**: ([MEE6](https://mee6.xyz/))
            ‣ \`!help\`: Hilfetext anzeigen
            ‣ \`!play [URL]\`: Link abspielen (YouTube / SoundCloud / MP3)
            ‣ \`!pause/stop\`: pause / stopp
            `)
      .setFooter({ text: 'Fabian Hummel | github.com/fshstk/trommelbot' });
    await interaction.reply({ embeds: [reply] });
  },
};
