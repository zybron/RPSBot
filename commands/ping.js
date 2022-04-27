const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Shows the current websocket ping rate.'),
	async execute(interaction) {
		await interaction.reply(`Websocket heartbeat: ${interaction.client.ws.ping}ms.`);
	},
};