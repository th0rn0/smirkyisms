require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.TOKEN;

client.login(TOKEN);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.startsWith('SMIRKET PIN!')) {
		message.channel.send('Fair Sik...');
		return;
	}
});