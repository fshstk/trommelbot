require("dotenv").config();
const ytdl = require("ytdl-core");
const Discord = require("discord.js");

const { messageHandlers } = require("./commands.js");
const { onlyAdmin, commandPrefix } = require("./config.json");

const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("disconnect", () => {
    console.log("Disconnected.");
});

client.on("message", (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith(commandPrefix)) return;
    if (onlyAdmin && msg.author.id !== process.env.ADMIN_ID) return;

    console.log(msg.author);

    const command = msg.content.slice(commandPrefix.length);

    const handleMessage = messageHandlers[command];
    if (handleMessage) handleMessage(msg);
});
