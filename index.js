require("dotenv").config();
const Discord = require("discord.js");
const { global } = require("./global");

global().bot = new Discord.Client();
global().bot.login(process.env.BOT_TOKEN);
global().locked = true;

require("./message_handlers");

global().bot.on("ready", () => console.log(`Logged in as ${global().bot.user.tag}!`));

// const loadSession = () => {
//     // load session from REST API
// };
