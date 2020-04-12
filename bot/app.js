// Dependencies
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const axios = require('axios').default;

// Settings
const voteTime = 10000;
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
		var callMessage = message.content.split(commandQuote + ' ')[1];
		console.log(callMessage);
		const provokeMessage = message;
		message.channel.messages.fetch(callMessage).then( message => {
			message.channel.send('Fair Sik... Starting a 30 second Vote...');

			message.react('👍').then(() => message.react('👎'));

			const filter = (reaction, user) => {
				return ['👍', '👎'].includes(reaction.emoji.name);
			};

			const collector = message.createReactionCollector(filter, { max: 10, time: voteTime, errors: ['time'] });

			collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));

			collector.on('end', collected => {
				console.log(`Collected ${collected} items`)
				let upvote = 0;
				let downvote = 0;
				collected.each(message => {
					switch (message._emoji.name) {
						case '👍':
							upvote = message.count;
							break;
						case '👎':
							downvote = message.count;
							break;
					}
				});
				if (upvote > downvote) {
					message.channel.send('Vote was successful. Uploading to Smirkisms.com...');
					uploadQuote(message, provokeMessage, apiAddr);
				} else {
					message.channel.send('Vote was unsuccessful. Quote something better!');
				}
			});

		}).catch(function (error) {
			message.channel.send('Message ID Not Recognized. Try Again');
		});
		return;
	}
});

async function uploadQuote(message, provokeMessage, apiAddr) {
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
		axios.post(apiAddr + '/quote', 
			{
				text: message.cleanContent,
				type: 'discord',
				quote_by: message.author.username,
				submitted_by: provokeMessage.author.username,
				discord_server_name: message.channel.guild.name,
				discord_channel_name: message.channel.name,
				user_id: auth0BotUserId
			},
			{
	      headers: {
	        Authorization: `Bearer ${auth.data.access_token}`
	      }
	    }
	  )
		.then(function (response) {
			console.log(response);
			message.channel.send('Upload successful!');
		})
		.catch(function (error) {
			console.log(error);
			message.channel.send('There was a error! ' + error);
		})
	})
	.catch(function (error) {
		console.log(error);
		message.channel.send('There was a error! ' + error);
	})
}
