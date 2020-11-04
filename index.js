require("dotenv").config();
const Discord = require("discord.js");
const { global } = require("./global");

global().bot = new Discord.Client();
global().bot.login(process.env.BOT_TOKEN);
global().locked = true;

require("./commands");
const { confirmVoiceChannelSetup } = require("./voice_channel");

global().bot.on("ready", async () => {
    console.log(`Logged in as ${global().bot.user.tag}!`);
    global().voiceChannel = await global().bot.channels.fetch(process.env.CHANNEL_ID);
    confirmVoiceChannelSetup();
});

// const loadSession = () => {
//     // load session from REST API
// };
global().bot.on("debug", (msg) => {
    if (process.env.DEBUG === "1") console.log(msg);
});
