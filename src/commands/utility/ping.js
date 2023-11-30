const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const msg = await interaction.reply({
			content: 'Pinging...',
			fetchReply: true,
		});
		msg.edit(`Pong 🏓!\n Latency is ${msg.createdTimestamp - interaction.createdTimestamp}ms. API Latency is ${interaction.client.ws.ping}ms`);
	},
};