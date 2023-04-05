const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { BOT_TOKEN, APPLICATION_ID } = process.env;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
  console.log(`Started refreshing ${commands.length} application (/) commands.`);

  try {
    const data = await rest.put(
      Routes.applicationCommands(APPLICATION_ID),
      { body: commands },
    );
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  }
  catch (error) {
    console.error(error);
  }
})();
