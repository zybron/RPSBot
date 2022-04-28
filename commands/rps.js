const { SlashCommandBuilder } = require('@discordjs/builders');
const { logMessage } = require('../utils.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Throw a challenge.'),
	async execute(interaction) {
        
        const options = ['scissors', 'rock', 'paper'];
        const emojis = ['\:scissors:', '\:rock:', '\:newspaper:'];
        const randomThrow  = options[Math.floor(Math.random() * options.length)];
        const emoji = emojis[options.indexOf(randomThrow)];
        if (interaction.inGuild()) {
            logMessage(`/rps output = ${interaction.member.nickname} threw ${randomThrow} on ${interaction.guild.name} in channel ${interaction.channel.name}.`);
        } else {
            logMessage(`/rps output = ${interaction.member.nickname} threw ${randomThrow} in a direct message.`);
        }
        
		await interaction.reply(`${interaction.user} threw ${randomThrow}! ${emoji}`);
	},
};