const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();


const config = require("./data/config.json");

// The token of your bot - https://discordapp.com/developers/applications/me

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  logMessage('I am ready!');
});
var opt = ['scissors', 'rock', 'paper'];
var moji = ['\:scissors:', '\:full_moon_with_face:', '\:newspaper:'];
// Create an event listener for messages

client.on('message', message => {
  // if (message.channel.type === "dm") return; 
  if (message.channel.type !== "dm" && !message.content.startsWith(config.prefix)) return; // Ignore messages that don't start with the prefix
  if (message.content.toLocaleLowerCase() === config.prefix + 'help' ||
    (message.channel.type === 'dm' && message.content.toLocaleLowerCase() === 'help')) {
    sendPM(message, 'Use `' + config.prefix + 'rps` to throw a challenge. \n' +
      'Use `' + config.prefix + 'rps static` to throw a challenge against me and I will show you the results. \n' +
      'Finally, `' + config.prefix + 'help` will show you this message.');

  } else if (message.content.toLocaleLowerCase() === config.prefix + 'rps static' ||
    (message.channel.type === 'dm' && message.content.toLocaleLowerCase() === 'rps static')) {
    var first_throw = opt[Math.floor(Math.random() * opt.length)];
    var first_moji = moji[opt.indexOf(first_throw)];
    var second_throw = opt[Math.floor(Math.random() * opt.length)];
    var second_moji = moji[opt.indexOf(second_throw)];

    var reply = 'you threw ' + first_throw + '! ' + first_moji + '\n'
      + 'I threw ' + second_throw + '! ' + second_moji + '\n';

    if (opt.indexOf(first_throw) === opt.indexOf(second_throw)) {
      // tie
      reply = reply + 'We tied!';
    } else if (first_throw === 'scissors') {
      if (second_throw === 'rock') {
        reply = reply + 'I won!';
      } else {
        reply = reply + 'You won!';
      }
    } else if (first_throw === 'rock') {
      if (second_throw === 'paper') {
        reply = reply + 'I won!';
      } else {
        reply = reply + 'You won!';
      }
    } else if (first_throw === 'paper') {
      if (second_throw === 'scissors') {
        reply = reply + 'I won!';
      } else {
        reply = reply + 'You won!';
      }
    }

    if (message.channel.type === 'dm') {
      sendPM(message, reply);
    } else {
      sendMessage(message, reply);
    }
    

  } else if (message.content.toLocaleLowerCase() === config.prefix + 'rps' ||
    (message.channel.type === 'dm' && message.content.toLocaleLowerCase() === 'rps')) {

    var resp = opt[Math.floor(Math.random() * opt.length)];
    var gene = moji[opt.indexOf(resp)];
    if (message.channel.type === 'dm') {
      sendPM(message, 'you threw ' + resp + '! ' + gene);
    } else {
      sendMessage(message, 'you threw ' + resp + '! ' + gene);
    }
    

  } else {
    if (message.author.username !== 'RPSBot') { // don't try to respond to myself
      if (message.channel.type === "dm") {
        sendPM(message, 'Sorry, I don\'t understand that command.\nUse `' + config.prefix + 'rps` to throw a challenge. \n' +
          'Use `' + config.prefix + 'rps static` to throw a challenge against me and I will show you the results. \n' +
          'Finally, `' + config.prefix + 'help` will show you this message.');
      } else {
        sendMessage(message, 'Sorry, I don\'t understand that command. I sent you a PM of available commands.');
        sendPM(message, 'Use `' + config.prefix + 'rps` to throw a challenge. \n' +
          'Use `' + config.prefix + 'rps static` to throw a challenge against me and I will show you the results. \n' +
          'Finally, `' + config.prefix + 'help` will show you this message.');
      }
    }
  }
});

client.on("disconnect", function(event){
  logMessage('Connection to discord closed');
  logMessage('Attempting to reconnect.');
  login();
});

client.on("error", function(error){
  logMessage(`client's WebSocket encountered a connection error: ${error}`);
  logMessage('Attempting to reconnect.');
  login();
});

// Log our bot in
login();

function login() {
  client.login(config.token).catch((reason) => {
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

function logMessage(message) {
  console.log(dateString() + message);
};

function dateString() {
  var date = new Date();
  var d = date.toDateString();
  var t = date.toLocaleTimeString();

  return '[' + d + ' ' + t + '] ';
};
