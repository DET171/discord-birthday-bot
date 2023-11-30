require('dotenv').config();
const console = require('consola');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const schedule = require('node-schedule');
const createBirthdayEmbed = require('./createEmbed.js');
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
		GatewayIntentBits.MessageContent,
	],
});


// load all slash commands under src/commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


// eslint-disable-next-line no-shadow
client.once(Events.ClientReady, (client) => {
	console.log(`Logged in as ${client.user.tag}`);
	client.user.setActivity('War Thunder', { type: ActivityType.Playing });
	client.user.setStatus('dnd');
});


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.warn(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	}
	catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});


client.on(Events.MessageCreate, async (message) => {
	// placeholder for future functionality
});

client.login(process.env.TOKEN);


const job = schedule.scheduleJob(scheduleRule, async () => {
	const birthdays = require('../birthdays.json');

	const channel = client.channels.cache.get('1136035236988321933');
	const today = dayjs().tz('MST').format('MM/DD');

	for (const user of birthdays) {
		if (user.date.substring(0, 5) === today) {
			const embed = await createBirthdayEmbed(channel, user.id, client);

			channel.send({
				embeds: [embed],
			});
		}
	}
});