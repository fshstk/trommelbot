const Discord = require("discord.js");
const { global } = require("./global");

const {
    BOT_TOKEN, ADMIN_ID, CHANNEL_ID, API_URL, COMMAND_PREFIX, ALLOWED_CHANNEL
} = process.env;

global().bot = new Discord.Client();
global().locked = false;
global().commandPrefix = COMMAND_PREFIX;
global().apiUrl = API_URL;
global().allowedChannel = ALLOWED_CHANNEL

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
