const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { BOT_TOKEN } = process.env;

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
bot.login(BOT_TOKEN);

const http = require('node:http');
const port = process.env.PORT || 3000;

// Health check response
bot.once('ready', () => {
  const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      if (bot.isReady()) {
        res.writeHead(200);
        res.end('OK');
      } else {
        res.writeHead(503);
        res.end('Not logged in');
      }
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });
  server.listen(port, () => console.log(`Listening on port ${port}`));
});

{
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith('.js'));
  bot.commands = new Collection();
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      bot.commands.set(command.data.name, command);
    }
    else {
      console.warn(
        `The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

{
  const eventsPath = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      bot.once(event.name, (...args) => event.execute(...args));
    }
    else {
      bot.on(event.name, (...args) => event.execute(...args));
    }
  }
}
