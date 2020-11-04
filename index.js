require("dotenv").config();
const ytdl = require("ytdl-core");
const Discord = require("discord.js");
const { commandPrefix, allowedChannels } = require("./config.json");

const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

client.on("ready", () => console.log(`Logged in as ${client.user.tag}!`));

const userIsAdmin = (user) => user.id === process.env.ADMIN_ID;
const onlyAllowedChannels = () => allowedChannels.length > 0;
const channelAllowed = (channel) => allowedChannels.includes(channel.name);
const parseMessage = (msg) => {
    let hasPrefix = false;
    let messageBody = msg.content;
    if (messageBody.startsWith(commandPrefix)) {
        hasPrefix = true;
        messageBody = messageBody.slice(commandPrefix.length);
    }
    messageBody = messageBody.split(" ");
    return { hasPrefix, command: messageBody[0], arguments: messageBody.slice(1) };
};
let locked = true;
const loadSession = () => {
    // load session from REST API
};

const infoText = `
============================================================
Der digitale Trommelkreis ist eine regelmäßige Veranstaltung.
============================================================
`;

const messageHandlers = {
    trommel: (msg) => {
        msg.channel.send("...kreis!");
    },
    info: (msg) => {
        msg.reply(infoText);
    },
};

const adminMessageHandlers = {
    lock: (msg) => {
        locked = true;
        msg.reply("TrommelBot gesperrt. Diktatur!");
    },
    unlock: (msg) => {
        if (userIsAdmin(msg.author)) {
            locked = false;
            msg.reply("TrommelBot entsperrt. Anarchie!");
        }
    },
    sesh: (msg) => {
        msg.channel.send("Listening Party!");
        loadSession();
    },
};

client.on("message", (msg) => {
    const { hasPrefix, command } = parseMessage(msg);

    if (msg.author.bot) return;
    if (!hasPrefix) return;
    if (locked && !userIsAdmin(msg.author)) return;
    if (onlyAllowedChannels() && !channelAllowed(msg.channel)) return;

    console.log(parseMessage(msg));

    if (userIsAdmin(msg.author) && command in adminMessageHandlers) {
        const handleMessage = adminMessageHandlers[command];
        handleMessage(msg);
    } else if (command in messageHandlers) {
        const handleMessage = messageHandlers[command];
        handleMessage(msg);
    }
});
