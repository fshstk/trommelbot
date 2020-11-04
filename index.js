require("dotenv").config();
const Discord = require("discord.js");
const { global } = require("./global");

global().bot = new Discord.Client();
global().bot.login(process.env.BOT_TOKEN);
global().locked = true;

require("./commands");

global().bot.on("ready", async () => {
    console.log(`Logged in as ${global().bot.user.tag}!`);
    global().voiceChannel = await global().bot.channels.fetch(process.env.CHANNEL_ID);
});

// const loadSession = () => {
//     // load session from REST API
// };
