const Discord = require('discord.js');
const { Pool } = require('pg');
const config = require("./config.json");

// connect to database
let pool = {};
if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else if (config.database_url !== '') {
  pool = new Pool({
    connectionString: config.database_url,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  logMessage('Unable to connect to database. DATABASE_URL environment variable not available.');
  process.exit(1);
}



// Create an instance of a Discord client
const client = new Discord.Client();

var prefix = '';
var token = '';

// Get settings from environment variables or optional config file

if (process.env.PREFIX) {
  prefix = process.env.PREFIX;
} else {

  prefix = config.prefix;
}

if (process.env.TOKEN) {
  token = process.env.TOKEN;
} else {
  token = config.token;
}

var inviteLink = '';
var donateLink = 'https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=8HT56HRQQZ27N&source=url'
var helpEmbed = {
  "embed": {
    "description": "**Commands available to all users:** \n" +
      "Use `" + prefix + "rps` to throw a challenge. \n" +
      "Use `" + prefix + "rps static` to throw a challenge against me and I will show you the results. \n" +
      "Use `" + prefix + "help` to show this message.\n\n" +
      "**Commands only available to Members/Roles with the Manage Server permission:** \n" +
      "Use `" + prefix + "prefix` followed by the new prefix character(s) to change the prefix. \n" +
      "Use `" + prefix + "helpinpm on` to have all help messages sent via PM. \n" +
      "Use `" + prefix + "helpinpm off` to have all help messages display in the channel they were issued. \n\n" +
      "[Invite](<<inviteLink>>) RPSBot to your own server.\n\n" +
      "[Donate](" + donateLink + ") to support RPSBot.",
    "url": "https://github.com/zybron/RPSBot",
    "author": {
      "name": "RPSBot",
      "url": "https://github.com/zybron/RPSBot",
      "icon_url": "https://cdn.discordapp.com/avatars/537420362921803787/30e4c0df91512798b98c7a888c9df60c.png"
    }
  }
};

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  logMessage('I am ready!');
  logMessage(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} servers.`);
  logMessage('Sever list:');
  client.guilds.sort().forEach((guild) => {
    logMessage(guild.name);
  });
  client.generateInvite(['SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'ADD_REACTIONS',
    'VIEW_CHANNEL'])
    .then(link => {
      logMessage(`Generated bot invite link: ${link}`);
      inviteLink = link;
      updateHelpMessage();
    });
  client.user.setActivity(`on ${client.guilds.size} servers`);
});
var opt = ['scissors', 'rock', 'paper'];
var moji = ['\:scissors:', '\:full_moon_with_face:', '\:newspaper:'];
// Create an event listener for messages

client.on('message', async message => {
  var help_in_pm = 1;
  // get the prefix for the current server
  if (message.channel.type !== 'dm') {
    const settings = await getSettings(message.guild.id);
    if (settings) {
      prefix = settings.prefix;
      if (settings.help_in_pm !== null) {
        help_in_pm = settings.help_in_pm;
      }
      updateHelpMessage();
    } else {
      // We're seeing messages but there are no settings for this guild id. so save if guild id is defined
      if (message.guild.id) {
        await createSettings(message.guild.id);
      }
    }
  }
  if (message.channel.type !== "dm" && !message.content.startsWith(prefix)) return; // Ignore messages that don't start with the prefix
  if (message.author.bot) return; // Ignore messages from bots
  if (message.content.toLocaleLowerCase().trim() === prefix) return; // Don't respond if there is no command
  if (message.content.toLocaleLowerCase() === prefix + 'help' ||
    (message.channel.type === 'dm' && message.content.toLocaleLowerCase() === 'help')) {
    if (message.channel.type !== 'dm' && help_in_pm !== 1) {
      sendMessage(message, helpEmbed);
    } else {
      sendPM(message, helpEmbed);
    }

  } else if (message.content.toLocaleLowerCase() === prefix + 'rps static' ||
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


  } else if (message.content.toLocaleLowerCase() === prefix + 'rps' ||
    (message.channel.type === 'dm' && message.content.toLocaleLowerCase() === 'rps')) {

    var resp = opt[Math.floor(Math.random() * opt.length)];
    var gene = moji[opt.indexOf(resp)];
    if (message.channel.type === 'dm') {
      sendPM(message, 'you threw ' + resp + '! ' + gene);
    } else {
      sendMessage(message, 'you threw ' + resp + '! ' + gene);
    }
  } else if (message.content.toLocaleLowerCase() === prefix + 'test' ||
    (message.channel.type === 'dm' && message.content.toLocaleLowerCase() === 'test')) {
    if (message.channel.type === 'dm') {
      sendPM(message, helpEmbed);
    } else {
      sendMessage(message, helpEmbed);
    }
  } else if (message.channel.type !== 'dm' && message.content.toLocaleLowerCase().startsWith(prefix + 'prefix')) {
    if (message.member && !message.member.hasPermission(['ADMINISTRATOR', 'MANAGE_GUILD'])) {
      // doesn't have permission to change the prefix
      sendPM(message, 'You do not have permission to change the bot prefix for RPSBot.');
      return;
    }
    var new_prefix = message.content.replace(prefix + 'prefix', '').trim();
    if (new_prefix === '') {
      sendMessage(message, 'The prefix must be at least one character in length. Please include the new prefix after the command `' + prefix + 'prefix`. For example, `' + prefix + 'prefix #`');
      return;
    }
    const saved = await savePrefix(message.guild.id, new_prefix );
    if (saved) {
      prefix = new_prefix;
      sendMessage(message, 'Prefix was successfully updated to ' + prefix);
      updateHelpMessage();
    } else {
      sendMessage(message, 'There was an issue connecting to the database. The prefix has not been changed.');
    }
  } else if (message.channel.type === 'dm' &&
    (message.content.startsWith(prefix + 'prefix') ||
      message.content.startsWith('prefix'))) {
    sendPM(message, 'The bot prefix cannot be updated via PM. Please issue this command in a channel the bot has permission to read.');
  } else if (message.channel.type !== 'dm' && message.content.toLocaleLowerCase().startsWith(prefix + 'helpinpm')) {
    
    if (message.member && !message.member.hasPermission(['ADMINISTRATOR', 'MANAGE_GUILD'])) {
      // doesn't have permission to change the prefix
      sendPM(message, 'You do not have permission to change the Help in PM setting for RPSBot.');
      return;
    }
    var toggle = message.content.replace(prefix + 'helpinpm', '').trim();
    if (toggle === '') {
      sendMessage(message, 'The helpinpm command requires an additional argument of on or off. For example, `' + prefix + 'helpinpm on`');
      return;
    }
    if (!(toggle === 'on' || toggle === 'off')) {
      sendMessage(message, "The helpinpm command only accepts either on or off as an argument.");
      return;
    }
    const saved = await saveHelp(message.guild.id, toggle === 'on' ? 1 : 0 );
    if (saved) {
      sendMessage(message, 'Help in PM was successfully updated to ' + toggle);
    } else {
      sendMessage(message, 'There was an issue connecting to the database. The helpinpm setting has not been changed.');
    }
  } else if (message.channel.type === 'dm' &&
    (message.content.startsWith(prefix + 'helpinpm') ||
      message.content.startsWith('helpinpm'))) {
    sendPM(message, 'The Help in PM setting cannot be updated via PM. Please issue this command in a channel the bot has permission to read.');

  } else {
    if (message.author.username !== 'RPSBot') { // don't try to respond to myself
      if (message.channel.type === "dm") {
        sendPM(message, 'Sorry, I don\'t understand that command.');
        sendPM(message, helpEmbed);
      } else {
        sendMessage(message, 'Sorry, I don\'t understand that command.');
        if (help_in_pm === 1) {
          sendPM(message, helpEmbed);
        } else {
          sendMessage(message, helpEmbed);
        }
      }
    }
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
  client.user.setActivity(`on ${client.guilds.size} servers`);
  createSettings(guild.id);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  logMessage(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`on ${client.guilds.size} servers`);
  deleteSettings(guild.id);
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

function logMessage(message) {
  console.log(dateString() + message);
};

function dateString() {
  var date = new Date();
  var d = date.toDateString();
  var t = date.toLocaleTimeString();

  return '[' + d + ' ' + t + '] ';
};

async function createSettings(guild_id) {
  if (!pool) {
    return null;
  } else {
    if (!guild_id) {
      return null;
    } else {
      try {
        const res = await pool.query('insert into public.server_settings (guild_id, prefix, help_in_pm) VALUES ($1, $2, $3)', [guild_id, '!', 1]);
        return res.rows[0];
      } catch (err) {
        console.log(err.stack);
        return null;
      }
    }
  }
}

async function getSettings(guild_id) {
  if (!pool) {
    return null;
  } else {
    if (!guild_id) {
      return null;
    } else {
      try {
        const res = await pool.query('select * from public.server_settings where guild_id = $1', [guild_id]);
        return res.rows[0];
      } catch (err) {
        console.log(err.stack);
        return null;
      }
    }
  }
}

async function savePrefix(guild_id, prefix) {
  var params = [prefix, guild_id];
  var querytext = "update public.server_settings set prefix=$1 where guild_id=$2";
  try {
    const update = await pool.query(querytext, params);
    return update;
  } catch (error) {
    logMessage(error.stack);
    return null;
  }
};

async function saveHelp(guild_id, help_in_pm) {
  var params = [help_in_pm, guild_id];
  var querytext = "update public.server_settings set help_in_pm=$1 where guild_id=$2";
  try {
    const update = await pool.query(querytext, params);
    return update;
  } catch (error) {
    logMessage(error.stack);
    return null;
  }
};

async function deleteSettings(guild_id) {
  if (!pool) {
    return false;
  } else {
    if (!guild_id) {
      return false;
    } else {

      try {
        const res = await pool.query('delete from public.server_settings where guild_id = $1', [guild_id]);
        return true;
      } catch (err) {
        console.log(err.stack);
        return false;
      }
    }
  }
}

function updateHelpMessage() {
  helpEmbed = {
    "embed": {
      "description": "**Commands available to all users:** \n" +
        "Use `" + prefix + "rps` to throw a challenge. \n" +
        "Use `" + prefix + "rps static` to throw a challenge against me and I will show you the results. \n" +
        "Use `" + prefix + "help` to show this message.\n\n" +
        "**Commands only available to Members/Roles with the Manage Server permission:** \n" +
        "Use `" + prefix + "prefix` followed by the new prefix character(s) to change the prefix. \n" +
        "Use `" + prefix + "helpinpm on` to have all help messages sent via PM. \n" +
        "Use `" + prefix + "helpinpm off` to have all help messages display in the channel they were issued. \n\n" +
        "[Invite](<<inviteLink>>) RPSBot to your own server.\n\n" +
        "[Donate](" + donateLink + ") to support RPSBot.",
      "url": "https://github.com/zybron/RPSBot",
      "author": {
        "name": "RPSBot",
        "url": "https://github.com/zybron/RPSBot",
        "icon_url": "https://cdn.discordapp.com/avatars/537420362921803787/30e4c0df91512798b98c7a888c9df60c.png"
      }
    }
  };
  helpEmbed.embed.description = helpEmbed.embed.description.replace("<<inviteLink>>", inviteLink);
}
