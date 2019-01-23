const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();


const config = require("./data/config.json");

// The token of your bot - https://discordapp.com/developers/applications/me

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});
var opt = ['scissors', 'rock', 'paper'];
var moji = ['\:scissors:', '\:full_moon_with_face:', '\:newspaper:'];
// Create an event listener for messages

client.on('message', message => {
  if (message.channel.type === "dm") return; 
  if (!message.content.startsWith(config.prefix)) return; // Ignore messages that don't start with the prefix
  if (message.content === '!rps') {
    var resp = opt[Math.floor(Math.random()*opt.length)];
    var gene = moji[opt.indexOf(resp)];
    message.reply('threw ' + resp + '! ' + gene);
  }
});
// Log our bot in
client.login(config.token);
