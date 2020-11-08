require("dotenv").config();
const Discord = require("discord.js");
const { commandPrefix } = require("./config.json");
const { global } = require("./global");

const {
    BOT_TOKEN, ADMIN_ID, CHANNEL_ID, API_URL,
} = process.env;

global().bot = new Discord.Client();
global().locked = true;
global().prefix = commandPrefix;
global().apiUrl = API_URL;

require("./commands");
const { confirmVoiceChannelSetup } = require("./voice_channel");

global().bot
    .on("error", console.error)
    .on("warn", console.warn)
    .on("debug", console.log)
    .on("ready", async () => {
        console.log(`Logged in as ${global().bot.user.tag}!`);
        global().voiceChannel = await global().bot.channels.fetch(CHANNEL_ID);
        global().adminUser = await global().bot.users.fetch(ADMIN_ID);
        confirmVoiceChannelSetup();
        global().bot.user.setActivity("message", { type: "CUSTOM_STATUS" }); // not sure if works
    });

global().bot.login(BOT_TOKEN);
