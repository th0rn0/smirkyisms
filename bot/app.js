// Dependencies
require('dotenv').config();
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const axios = require('axios').default;
const request = require(`request`);
const fs = require(`fs`);
const FormData = require('form-data'); 

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
const commandGet = commandId + 'smirketget';
const commandRandom = commandId + 'smirketrandom';

// Bot
client.login(botToken);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('Eating Pizza Sandwiches');
});

client.on('message', message => {
	if (message.author.bot) return;

	// Quote / Image
	if (message.content.toLowerCase().startsWith(commandQuote)) {
		var messageId = message.content.split(commandQuote + ' ')[1];
		const provokeMessage = message;
		message.channel.messages.fetch(messageId).then( quoteMessage => {
			var imageArray = new Array();
			if (quoteMessage.attachments.size > 0) {
				quoteMessage.attachments.forEach(function(attachment) {
					if (attachIsImage(attachment.url)) {
						imageArray.push(attachment.url);
					}
				});
			}
			if (quoteMessage.attachments.size > 0 && imageArray.length > 0) {
				// Image
				imageArray.forEach(function(url) {
					var attachment = new MessageAttachment(url);
					var voteMessageText = '\n Fair Sik... Starting a 30 Second Vote... \n \n Vote Now!';
					quoteMessage.channel.send(voteMessageText, attachment).then( voteMessage => {
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
							if (upvote <= downvote) {
								quoteMessage.channel.send('Vote was unsuccessful. Image something better!');
								return;
							}
							quoteMessage.channel.send('Vote was successful. Uploading to Smirkyisms.com...');
				    		uploadImage(url, quoteMessage, provokeMessage, apiAddr);
						});
					});
				});
			} else {
				// Quote
				var voteMessageText = '\n Fair Sik... Starting a 30 Second Vote... \n > ' + quoteMessage.content + ' \n \n Vote Now!';
				quoteMessage.channel.send(voteMessageText).then( voteMessage => {
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
						if (upvote <= downvote) {
							quoteMessage.channel.send('Vote was unsuccessful. Quote something better!');
							return;
						}
						quoteMessage.channel.send('Vote was successful. Uploading to Smirkyisms.com...');
						uploadQuote(quoteMessage, provokeMessage, apiAddr);
					});
				});
			}

		}).catch(function (error) {
			console.log(error);
			console.log('we got error')
			message.channel.send('Message ID Not Recognized. Try Again. If you are trying images you must have one image per message!');
		});
		return;
	}

	// Get Random
	if (message.content.toLowerCase().startsWith(commandRandom)) {
		getRandom(message, apiAddr);
	}

	if (message.content.toLowerCase().startsWith('.help')) {
	    var embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Heyup ' + message.author.username + '!')
			.setDescription('Here are the commands I know')
			.addField(commandQuote + ' <message id here>', 'This will initiate a vote to quote something and upload to Smirkyisms.')
			.addField(commandRandom, 'Get random Quote or Image from Smirkyisms.')
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
	).then(function (auth) {
		axios.post(
			apiAddr + '/quote', 
			{
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
		    var embed = new MessageEmbed()
				.setColor('#0099ff')
				.addField('Quote', quoteMessage.content)
				.addField('Quote By', quoteMessage.author.username)
				.addField('Submitted By', provokeMessage.author.username)
				.addField('Go Check it out!', 'https://smirkyisms.com/quotes/' + response.data.id)
				.setFooter('Smirkyisms')
				.setTimestamp();
			provokeMessage.channel.send(embed);
		}).catch(function (error) {
			console.log(error);
			provokeMessage.channel.send('There was a error! ' + error);
		})
	});
}

async function uploadImage(url, quoteMessage, provokeMessage, apiAddr) {
	axios.post('https://smirkyisms.eu.auth0.com/oauth/token',
		{
			client_id: auth0ClientId,
			client_secret: auth0ClientSecret,
			audience: auth0Audience,
			grant_type: "client_credentials"
		}
	).then(async function (auth) {
		var formData = new FormData();
        formData.append('type', 'discord');
        formData.append('submitted_by', 'auth0BotUserId');
		formData.append('discord_submitted_by', provokeMessage.author.username);
        await formData.append('image', request(url));


        const headers = Object.assign({
		    'Authorization': `Bearer ${auth.data.access_token}`,
		}, formData.getHeaders());

		axios.post(
			apiAddr + '/image', 
			formData,
			{
		      	headers: headers
	    	}
	    ).then(function (response) {
			console.log(response);
		    var embed = new MessageEmbed()
				.setColor('#0099ff')
				.addField('Submitted By', provokeMessage.author.username)
				.addField('Go Check it out!', 'https://smirkyisms.com/images/' + response.data.id)
				.setFooter('Smirkyisms')
				.setTimestamp();
			provokeMessage.channel.send(embed);
		}).catch(function (error) {
			console.log(error);
			provokeMessage.channel.send('There was a error! ' + error);
		})
	});
}

function attachIsImage(url) {
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

async function getRandom(message, apiAddr) {
	var attachment = null;
	var randInt = Math.floor(Math.random() * 2);
    if (randInt == 1) {
		axios.get(apiAddr + '/image/random')
		.then(function (response) {
			axios.get(apiAddr + '/image/' + response.data.id + '/file')
			.then(function (fileRes) {
				console.log(fileRes.data);
				console.log(response.data);
				var attachment = new MessageAttachment(new Buffer.from(fileRes.data, 'base64'));
				if (response.data.type == 'site') {
					var embed = "Courtesy of " + response.data.submitted_by;
				} else if (response.data.type == 'discord') {
					var embed = "Courtesy of " + response.data.discord_submitted_by;
				} else {
					var embed = new MessageEmbed()
						.setColor('#0099ff')
						.addField('Quote', "Type not supported. Bug Th0rn0")
						.setFooter('Smirkyisms')
						.setTimestamp();	
				}
				message.channel.send(embed, attachment);
			}).catch(function (error) {
				message.channel.send('Sorry there was a error. Try again. ' + error);
			});
		});
	} else {
		axios.get(apiAddr + '/quote/random')
		.then(function (response) {
			console.log(response);
			if (response.data.type == 'site') {
				var embed = new MessageEmbed()
					.setColor('#0099ff')
					.addField('Quote', response.data.text)
					.addField('Quote By', response.data.quote_by)
					.addField('Submitted By', response.data.submitted_by)
					.addField('Go Check it out!', 'https://smirkyisms.com/quotes/' + response.data.id)
					.setFooter('Smirkyisms')
					.setTimestamp();
			} else if (response.data.type == 'discord') {
				var embed = new MessageEmbed()
					.setColor('#0099ff')
					.addField('Quote', response.data.text)
					.addField('Quote By', response.data.quote_by)
					.addField('Submitted By', response.data.discord_submitted_by)
					.addField('Go Check it out!', 'https://smirkyisms.com/quotes/' + response.data.id)
					.setFooter('Smirkyisms')
					.setTimestamp();	
			} else {
				var embed = new MessageEmbed()
					.setColor('#0099ff')
					.addField('Quote', "Type not supported. Bug Th0rn0")
					.setFooter('Smirkyisms')
					.setTimestamp();	
			}
			message.channel.send(embed);
		}).catch(function (error) {
			message.channel.send('Sorry there was a error. Try again. ' + error);
		});
	}
}
