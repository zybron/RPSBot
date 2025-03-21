const fs = require('node:fs');
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { Pool } = require('pg');
const config = require("./config.json");
const { compare } = require('libsodium-wrappers');
const { join } = require('node:path');
const { logMessage, dateString } = require('./utils.js');

// Create an instance of a Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Get settings from environment variables or optional config file

if (process.env.TOKEN) {
  token = process.env.TOKEN;
} else {
  token = config.token;
}


// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.once('ready', () => {
  logMessage('I am ready!');
  logMessage(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} servers.`);
  logMessage('Sever list:');
  const guildNames = client.guilds.cache.sort((a,b) => {
    if (a.name === b.name) return 0;
    if (a.name < b.name) return -1;
    return 1;
  }).map(g => g.name).join("\n" + dateString());
  logMessage(guildNames);
  client.user.setActivity('RPS. Use /help for commands');
});


// Create an event listener for commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.on("disconnect", function (event) {
  logMessage('Connection to discord closed');
  logMessage('Attempting to reconnect.');
  login();
});

client.on("error", function (error) {
  logMessage(`client's WebSocket encountered a connection error: ${error}`);
  logMessage('Attempting to reconnect.');
  login();
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  logMessage(`New server joined: ${guild.name} (id: ${guild.id}). This server has ${guild.memberCount} members!`);
  // createSettings(guild.id);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  logMessage(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  // deleteSettings(guild.id);
});

// Log our bot in
login();

function login() {
  client.login(token).catch((reason) => {
    console.error(dateString() + reason);
    return;
  });
}

function sendMessage(message, text) {
  message.reply(text)
    .then(value => logMessage('(' +
      ((message.guild && message.guild.name) ? message.guild.name : 'No Server') + ':' +
      ((message.channel && message.channel.name) ? message.channel.name : 'No Channel') + '): sent ' + text + ' to ' + message.author.username))
    .catch(error => console.error(dateString() + error));
};

function sendPM(message, text) {
  message.author.send(text)
    .then(value => logMessage('(' +
      ((message.guild && message.guild.name) ? message.guild.name : 'No Server') + ':' +
      ((message.channel && message.channel.name) ? message.channel.name : 'No Channel') + '): sent ' + text + ' to ' + message.author.username))
    .catch(error => console.error(dateString() + error));
};

