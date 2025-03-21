const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, OAuth2Scopes, EmbedBuilder } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('help')
                .setDescription('Displays a help message.'),
        async execute(interaction) {
        const inviteLink = interaction.client.generateInvite({ scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            permissions: [
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageMessages,
            PermissionFlagsBits.EmbedLinks,
            PermissionFlagsBits.MentionEveryone],
            });
        const helpMessage = updateHelpMessage(inviteLink);
                await interaction.reply({ embeds:[helpMessage], ephemeral:true });
        },
};


function updateHelpMessage(inviteLink) {
    const donateLink = 'https://paypal.me/RPSBot';
    let helpEmbed = new EmbedBuilder()
        .setTitle('RPS Bot')
        .setURL('https://github.com/zybron/RPSBot')
        .setAuthor({
        name: 'RPS Bot',
        iconURL: 'https://cdn.discordapp.com/avatars/537420362921803787/30e4c0df91512798b98c7a888c9df60c.png',
        url: 'https://discord.js.org' })
        .setDescription(`**Commands available to all users:** \n` +
        'Use `/rps` to throw a challenge. \n' +
        'Use `/static` to throw a challenge against me and I will show you the results. \n' +
        'Use `/help` to show this message.\n\n' +
        `[Invite](${inviteLink}) RPSBot to your own server.\n\n` +
        `[Donate](${donateLink}) to support RPSBot.`);

    return helpEmbed;
}
