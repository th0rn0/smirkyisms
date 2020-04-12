// Dependencies
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios').default;

// Settings
const voteTime = 30000;
const botToken = process.env.DISCORD_TOKEN;
const apiAddr = process.env.API_ADDR;
const auth0ClientId = process.env.AUTH0_CLIENT_ID;
const auth0ClientSecret = process.env.AUTH0_CLIENT_SECRET;
const auth0Audience = process.env.AUTH0_AUDIENCE;
const auth0BotUserId = process.env.AUTH0_BOT_USER_ID; 

// Commands
const commandId = '.';
const commandQuote = commandId + 'smirketpin';

// Bot
client.login(botToken);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('Eating Pizza Sandwiches');

});

client.on('message', message => {
	if (message.author.bot) return;

	if (message.content.toLowerCase().startsWith(commandQuote)) {
		var messageId = message.content.split(commandQuote + ' ')[1];
		console.log(messageId);
		const provokeMessage = message;
		message.channel.messages.fetch(messageId).then( quoteMessage => {
			quoteMessage.channel.send('\n Fair Sik... Starting a 30 Second Vote... \n > ' + quoteMessage.content + ' \n \n Vote Now!').then( voteMessage => {
				voteMessage.react('👍').then(() => voteMessage.react('👎'));
				const filter = (reaction, user) => {
					return ['👍', '👎'].includes(reaction.emoji.name);
				};

				const collector = voteMessage.createReactionCollector(filter, { max: 10, time: voteTime, errors: ['time'] });

				collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));

				collector.on('end', collected => {
					console.log(`Collected ${collected} items`)
					let upvote = 0;
					let downvote = 0;
					collected.each(voteMessage => {
						switch (voteMessage._emoji.name) {
							case '👍':
								upvote = voteMessage.count;
								break;
							case '👎':
								downvote = voteMessage.count;
								break;
						}
					});
					if (upvote > downvote) {
						quoteMessage.channel.send('Vote was successful. Uploading to Smirkyisms.com...');
						uploadQuote(quoteMessage, provokeMessage, apiAddr);
					} else {
						quoteMessage.channel.send('Vote was unsuccessful. Quote something better!');
					}
				});
			});

		}).catch(function (error) {
			console.log(error);
			message.channel.send('Message ID Not Recognized. Try Again');
		});
		return;
	}

	if (message.content.toLowerCase().startsWith('.help')) {
	    var embed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Heyup ' + message.author.username + '!')
			.setDescription('Here are the commands I know')
			.addField(commandQuote + ' <message id here>', 'This will initiate a vote to quote something and upload to Smirkyisms!')
			.addField('\u200B', '\u200B')
			.addField('How do I get the Message ID?', 'First you must enable developer mode on Discord and then you can right click a message and click "Copy ID". EZ PZ')
			.setFooter('Smirkyisms')
		message.channel.send(embed);
	}
});

async function uploadQuote(quoteMessage, provokeMessage, apiAddr) {
	console.log('message');
	console.log(provokeMessage);
	axios.post('https://smirkyisms.eu.auth0.com/oauth/token',
		{
			client_id: auth0ClientId,
			client_secret: auth0ClientSecret,
			audience: auth0Audience,
			grant_type: "client_credentials"
		}
	)
	.then(function (auth) {
		axios.post(apiAddr + '/quote', {
				text: quoteMessage.cleanContent,
				type: 'discord',
				quote_by: quoteMessage.author.username,
				discord_submitted_by: provokeMessage.author.username,
				discord_server_name: quoteMessage.channel.guild.name,
				discord_channel_name: quoteMessage.channel.name,
				submitted_by: auth0BotUserId
			},
			{
	      headers: {
	        Authorization: `Bearer ${auth.data.access_token}`
	      }
	    }
    ).then(function (response) {
			console.log(response);
		    var embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.addField('Quote', quoteMessage.content)
				.addField('Quote By', quoteMessage.author.username)
				.addField('Submitted By', provokeMessage.author.username)
				.addField('Go Check it out!', 'https://smirkyisms.com')
				.setFooter('Smirkyisms')
				.setTimestamp();
			provokeMessage.channel.send(embed);
		})
		.catch(function (error) {
			console.log(error);
			provokeMessage.channel.send('There was a error! ' + error);
		})
	});

}
