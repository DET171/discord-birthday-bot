# discord-birthday-bot
A simple bot that loads birthdays from a JSON file and sends a message to a channel when it's someone's birthday.

## Setup
Clone the repo:
```bash
git clone https://github.com/DET171/discord-birthday-bot.git
```

Install dependencies:
```bash
yarn
```

Create a `.env` file in the root directory and add the following:
```bash
TOKEN=your-bot-token
CLIENT_ID=your-application-id
```

Create a `birthdays.json` file in the root directory and add the following:
```json
[
	{
		"id": "<discord-user-id>",
		"date": "06/09/2004"
	}
]
```
The JSON file should contain an array of objects with the following properties:
- `id`: The Discord tag of the person
- `date`: The date of the person's birthday in the format `MM/DD/YYYY`

## Usage
Start the bot:
```bash
# push slash commands to discord first
yarn deploy
yarn start
```