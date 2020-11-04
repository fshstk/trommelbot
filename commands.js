const infoText = `
============================================================
Der digitale Trommelkreis ist eine regelmäßige Veranstaltung.
============================================================
`;

/* ========================================================================== */

const { global } = require("./global");
const {
    userIsAdmin, onlyAllowedChannels, channelAllowed, parseMessage,
} = require("./helper_functions");

/* ========================================================================== */

const regularCommands = {
    trommel: (msg) => {
        msg.channel.send("...kreis!");
    },
    info: (msg) => {
        msg.reply(infoText);
    },
};

const adminCommands = {
    lock: (msg) => {
        global().locked = true;
        msg.reply("TrommelBot gesperrt. Diktatur!");
    },
    unlock: (msg) => {
        if (userIsAdmin(msg.author)) {
            global().locked = false;
            msg.reply("TrommelBot entsperrt. Anarchie!");
        }
    },
    sesh: (msg) => {
        msg.channel.send("Listening Party!");
        // loadSession();
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
        handleMessage(msg);
    } else if (command in regularCommands) {
        const handleMessage = regularCommands[command];
        handleMessage(msg);
    }
});
