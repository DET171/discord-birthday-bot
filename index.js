require('dotenv').config();
const { Client, Events, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const schedule = require('node-schedule');
const birthdays = require('./birthdays.json');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localizedFormat = require('dayjs/plugin/localizedFormat');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.hour = 8;
scheduleRule.minute = 0;
scheduleRule.tz = 'America/Phoenix';


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
	],
});


// eslint-disable-next-line no-shadow
client.once(Events.ClientReady, (client) => {
	console.log(`Logged in as ${client.user.tag}`);
	client.user.setActivity('War Thunder', { type: ActivityType.Playing });
	client.user.setStatus('dnd');
});

client.on(Events.MessageCreate, async (message) => {
	// standard test command
	if (message.content === 'ping') {
		const msg = await message.reply('Pinging...');
		msg.edit(`Pong 🏓! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${client.ws.ping}ms`);
	}
});

client.login(process.env.TOKEN);

const sendBirthdayMessage = (channel, id) => {
	console.log(`Sending birthday message to ${id}`);

	const user = client.users.cache.get(id);

	const embed = new EmbedBuilder()
		.setColor('#' + ((1 << 24) * Math.random() | 0).toString(16).padStart(6, '0'))
		.setTitle('Happy Birthday!')
		.setDescription(`Happy birthday <@${id}>!`)
		.setThumbnail(user.avatarURL)
		.setImage('https://totalpng.com//public/uploads/preview/birthday-cake-png-with-candle-download-free-2-116516454435ftcobinqs.png')
		.setTimestamp();

	channel.send({ embeds: [embed] });
};

const job = schedule.scheduleJob(scheduleRule, () => {
	const channel = client.channels.cache.get('1136035236988321933');
	const today = dayjs().tz('MST').format('MM/DD');

	for (const user of birthdays) {
		if (user.date.substring(0, 5) === today) {
			sendBirthdayMessage(channel, user.id);
		}
	}
});