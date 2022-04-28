const { SlashCommandBuilder } = require('@discordjs/builders');
const { logMessage } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('static')
		.setDescription('Throw a challenge against me and I will show you the results.'),
	async execute(interaction) {

		const options = ['scissors', 'rock', 'paper'];
		const emojis = ['\:scissors:', '\:rock:', '\:newspaper:'];
		const randomThrow = options[Math.floor(Math.random() * options.length)];
		const emoji = emojis[options.indexOf(randomThrow)];

		const randomBotThrow = options[Math.floor(Math.random() * options.length)];
		const botEmoji = emojis[options.indexOf(randomBotThrow)];

		let message = `${interaction.user} threw ${randomThrow}! ${emoji}\n`
			+ `I threw ${randomBotThrow}! ${botEmoji}\n`;

		if (options.indexOf(randomThrow) === options.indexOf(randomBotThrow)) {
			// tie
			message = message + 'We tied!';
		} else if (randomThrow === 'scissors') {
			if (randomBotThrow === 'rock') {
				message = message + 'I won!';
			} else {
				message = message + 'You won!';
			}
		} else if (randomThrow === 'rock') {
			if (randomBotThrow === 'paper') {
				message = message + 'I won!';
			} else {
				message = message + 'You won!';
			}
		} else if (randomThrow === 'paper') {
			if (randomBotThrow === 'scissors') {
				message = message + 'I won!';
			} else {
				message = message + 'You won!';
			}
		}
		if (interaction.inGuild()) {
            logMessage(`/rps initiated by ${interaction.member.nickname} on ${interaction.guild.name} in channel ${interaction.channel.name}.`);
        } else {
            logMessage(`/rps initiated by ${interaction.user.username} in a direct message.`);
        }
		logMessage(`/static output = ${message}`);
		await interaction.reply(message);
	},
};