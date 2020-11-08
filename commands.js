const { MessageEmbed } = require("discord.js");

const { global } = require("./global");
const {
    userIsAdmin, onlyAllowedChannels, channelAllowed, parseMessage, loadSession,
} = require("./helper_functions");
const { playURL } = require("./voice_channel");

/* ========================================================================== */

const regularCommands = {
    trommel: (msg) => msg.channel.send("...kreis!"),
    info: (msg) => {
        const reply = new MessageEmbed()
            .setColor("#FF0000")
            .setTitle("Der offizielle Discord Bot des digitalen Trommelkreises")
            .setAuthor("Trommelbot", "https://www.trommelkreis.club/static/img/logo.png")
            .setDescription(`
            ‣ Der Trommelkreis findet *jeden zweiten Montag um 19:30 Uhr* statt.
            ‣ Gemeinsames Anhören findet hier um ca. 22:00/22:30 Uhr statt.
            ‣ Mehr zum digitalen Trommelkreis erfährt ihr auf der [Webseite](https://trommelkreis.club)!
            ‣ Wenn ihr mitmachen wollt, lohnt es sich der [WhatsApp Gruppe](https://chat.whatsapp.com/IuA760mHIrcKiR3krPjBwK) beizutreten.
            ‣ Jeder ist willkommen!

            **Verfügbare Commands:** (TrommelBot)
            ‣ \`${global().prefix}info\`: diese Nachricht anzeigen
            ‣ \`${global().prefix}sesh load\`: lade die heutige Session.
            ‣ \`${global().prefix}sesh load [YYYYMMDD]\`: lade die Session des angegebenen Datums.
            ‣ \`${global().prefix}sesh load [URL]\`: lade die Session der angegebenen URL.
            ‣ \`${global().prefix}sesh info\`: Informationen zur aktuell geladenen Session
            ‣ \`${global().prefix}sesh next\`: Spiele das nächste Lied der aktuell geladenen Session.
            ‣ \`${global().prefix}play/pause\`: Play/Pause
            ‣ \`${global().prefix}stop\`: Stopp, vergesse die aktuell geladene Session.

            **Verfügbare Commands**: ([MEE6](https://mee6.xyz/))
            ‣ \`!help\`: Hilfetext anzeigen
            ‣ \`!play [URL]\`: Link abspielen (YouTube / SoundCloud / MP3)
            ‣ \`!pause/stop\`: Pause / Stopp
            `);
        return msg.channel.send(reply);
    },
};

const adminCommands = {
    lock: (msg) => {
        global().locked = true;
        return msg.reply("TrommelBot gesperrt. Diktatur!");
    },
    unlock: (msg) => {
        global().locked = false;
        return msg.reply("TrommelBot entsperrt. Anarchie!");
    },
    sesh: (msg) => msg.reply("ich suche die Session, bitte kurz warten…").then(async (response) => {
        const slug = parseMessage(msg).arguments[0];
        const session = await loadSession(slug);
        if (!session) {
            return response.edit("Keine Session mit diesem Datum gefunden… benutze das Format `YYYYMMDD`, so wie im URL auf der Webseite.");
        }
        global().session = session;
        // console.log(global().session);

        response.edit("Session geladen:");
        return response.edit(new MessageEmbed()
            .setColor("#FF0000")
            .setTitle(session.challenge.name)
            .setURL(session.url)
            .setDescription(session.challenge.blurb)
            .addFields(
                ...session.tracks.map(
                    (track, index) => ({
                        name: `Track ${index + 1}`,
                        value: `${track.name} [${track.duration}]`,
                        inline: false,
                    }),
                ),
            )
            .setFooter(session.date));
    }),
    play: (msg) => {
        const urlString = parseMessage(msg).arguments[0];
        playURL(urlString);
    },
};

/* ========================================================================== */

global().bot.on("message", (msg) => {
    const { hasPrefix, command } = parseMessage(msg);

    if (msg.author.bot) return;
    if (!hasPrefix) return;
    if (global().locked && !userIsAdmin(msg.author)) return;
    if (onlyAllowedChannels() && !channelAllowed(msg.channel)) return;

    if (userIsAdmin(msg.author) && command in adminCommands) {
        const handleMessage = adminCommands[command];
        handleMessage(msg).catch(console.error);
    } else if (command in regularCommands) {
        const handleMessage = regularCommands[command];
        handleMessage(msg).catch(console.error);
    }
});
