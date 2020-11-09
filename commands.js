const { MessageEmbed } = require("discord.js");
const moment = require("moment");

const { global } = require("./global");
const {
    userIsAdmin, onlyAllowedChannels, channelAllowed, parseMessage, loadSession,
} = require("./helper_functions");
const { playURL, stopPlaying } = require("./voice_channel");

/* ========================================================================== */

const regularCommands = {
    trommel: (msg) => msg.channel.send("…kreis! 🥁"),
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

            **Verfügbare Commands:** ([TrommelBot](https://github.com/fshstk/trommelbot))
            ‣ \`${global().prefix}trommel\`: …kreis!
            ‣ \`${global().prefix}info\`: diese Nachricht anzeigen.
            ‣ \`${global().prefix}sesh\`: lade die heutige Session.
            ‣ \`${global().prefix}sesh [YYYYMMDD oder URL]\`: lade die angegebene Session.
            ‣ \`${global().prefix}play\`: spiele den aktuellen Track von vorne.
            ‣ \`${global().prefix}play next\`: spiele den nächsten Track der aktuell geladenen Session.
            ‣ \`${global().prefix}play prev\`: spiele den vorigen Track der aktuell geladenen Session.
            ‣ \`${global().prefix}play [#]\`: spiele Track Nummer \`#\`.
            ‣ \`${global().prefix}stop\`: stopp, vergesse die aktuell geladene Session.

            **Verfügbare Commands**: ([MEE6](https://mee6.xyz/))
            ‣ \`!help\`: Hilfetext anzeigen
            ‣ \`!play [URL]\`: Link abspielen (YouTube / SoundCloud / MP3)
            ‣ \`!pause/stop\`: pause / stopp
            `)
            .setFooter("Fabian Hummel | github.com/fshstk/trommelbot");
        return msg.channel.send(reply);
    },
    sesh: (msg) => msg.reply("ich suche die Session, bitte kurz warten…").then(async (response) => {
        let slug = parseMessage(msg).arguments[0];
        if (!slug) slug = moment().format("YYYYMMDD");
        else {
            try {
                [slug] = slug.match(/\d{8}/); // match first group of 8 digits in input argument
            } catch {
                return response.edit("Keine Session gefunden… Format: `YYYYMMDD` oder die ganze `URL` aus dem Archiv.");
            }
        }
        const session = await loadSession(slug);
        if (!session) {
            return response.edit("Keine Session gefunden… Format: `YYYYMMDD` oder die ganze `URL` aus dem Archiv.");
        }
        global().session = session;

        response.edit("Session geladen:");
        return response.edit(new MessageEmbed()
            .setColor("#FF0000")
            .setTitle(session.challenge.name)
            .setURL(session.url)
            .setDescription(session.challenge.blurb)
            .addFields(
                // TODO: multiple session subsections
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
        const { session } = global();
        if (!session) return msg.channel.send("Keine Session geladen! (Lade eine Session mit `sesh [YYYYMMDD oder URL]`");
        if (!session.currentTrackId) session.currentTrackId = 0;

        const argument = parseMessage(msg).arguments[0];
        if (argument === "next") {
            session.currentTrackId += 1;
            if (session.currentTrackId >= session.tracks.length) {
                global().session = null;
                stopPlaying();
                return msg.channel.send("⏹ Ende der Playlist.");
            }
        } else if (argument === "prev") {
            session.currentTrackId -= 1;
            if (session.currentTrackId < 0) session.currentTrackId = 0;
        } else if (argument % 1 === 0) { // check if whole number
            if (argument < 1 || argument > session.tracks.length) {
                return msg.reply(`Deine Auswahl muss zwischen 1 und ${session.tracks.length} sein…`);
            }
            session.currentTrackId = argument - 1;
        } else if (argument) {
            return msg.reply("i versteh ned wost wüst…");
        }

        const track = session.tracks[session.currentTrackId];
        playURL(track.url);
        return msg.channel.send(`▶️ ${track.name} (${track.duration})`);
    },
    stop: (msg) => {
        if (global().isPlaying) {
            stopPlaying();
            return msg.channel.send("⏹ Stopp.");
        }
        return msg.reply("es spielt nix…");
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
    } else if (
        (command in regularCommands)
        && (userIsAdmin(msg.author) || !global().locked)
    ) {
        const handleMessage = regularCommands[command];
        handleMessage(msg).catch(console.error);
    }
});
