const { EmbedBuilder } = require('discord.js');

const createBirthdayEmbed = async (id, client) => {
	const quotes = require('../quotes.json');
	const quote = quotes[Math.floor(Math.random() * quotes.length)];

	console.log(`Sending birthday message to ${id}`);

	const user = await client.users.fetch(id);

	const embed = new EmbedBuilder()
		.setColor('#' + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0'))
		.setTitle('Happy Birthday!')
		.setDescription(`Happy birthday <@${id}>!`)
		.setThumbnail(user.avatarURL())
		.setImage('https://totalpng.com//public/uploads/preview/birthday-cake-png-with-candle-download-free-2-116516454435ftcobinqs.png')
		.setAuthor({
			name: 'From HiFii and friends',
			iconURL: 'https://cdn.discordapp.com/avatars/248828550176702466/dc7506b21c06de9dea3f6960e90aaafc.webp?size=128',
		})
		.addFields([
			{ name: 'Today is your day!', value: 'We hope you have a great day and get to do something fun!' },
		])
		.setFooter({ text: quote })
		.setTimestamp();

	return embed;
};

module.exports = createBirthdayEmbed;