const { SlashCommandBuilder } = require('discord.js');
const createBirthdayEmbed = require('../../createEmbed.js');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);


module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Tests the happy birthday message.'),
	async execute(interaction, client) {
		const birthdays = require('../../../birthdays.json');

		const today = dayjs().tz('MST').format('MM/DD');

		for (const user of birthdays) {
			if (user.date.substring(0, 5) === today) {
				const embed = await createBirthdayEmbed(user.id, client);

				await interaction.reply({
					embeds: [embed],
				});
			}
		}
	},
};