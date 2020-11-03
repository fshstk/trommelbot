require("dotenv").config();
const ytdl = require("ytdl-core");
const Discord = require("discord.js");

const { messageHandlers, commandPrefix } = require("./commands.js");

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

    const command = msg.content.slice(commandPrefix.length);
    const handleMessage = messageHandlers[command];
    if (handleMessage) handleMessage(msg);
});
