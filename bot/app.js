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

		const provokeMessage = message;

		// Get all Messages
		getMessages(provokeMessage).then( async messages => {

			// Images
			// Send each Image individually
			messages[0].forEach( message => {
				var imageArray = new Array();
				// Only get Images
				if (message.attachments.size > 0) {
					message.attachments.forEach(function(attachment) {
						if (attachIsImage(attachment.url)) {
							imageArray.push(attachment.url);
						}
					});
				}
				if (message.attachments.size > 0 && imageArray.length > 0) {
					// Image
					imageArray.forEach(function(url) {
						var attachment = new MessageAttachment(url);
						var voteMessageText = '\n Fair Sik... Starting a 30 Second Vote... \n \n Vote Now!';
						message.channel.send(voteMessageText, attachment).then( voteMessage => {
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
									message.channel.send('Vote was unsuccessful. Image something better!');
									return;
								}
								message.channel.send('Vote was successful. Uploading to Smirkyisms.com...');
					    		uploadImage(url, message.author.username, apiAddr).then( response => {
		    						console.log(response);
								    var embed = new MessageEmbed()
										.setColor('#0099ff')
										.addField('Submitted By', message.author.username)
										.addField('Go Check it out!', 'https://smirkyisms.com/images/' + response.data.id)
										.setFooter('Smirkyisms')
										.setTimestamp();
									provokeMessage.channel.send(embed);
					    		}).catch( error => {
									console.log(error);
									provokeMessage.channel.send('There was a error! ' + error);
					    		})
							});
						});
					});
				}
			})

			// Send Text as one Quote. If they want separate they should send the IDs separately
			// Check if every message is from the same person
			messageCheck = true;
			await messages[1].forEach(message => {
				if (messages[1][0].author.username != message.author.username) {
					messages[1][0].channel.send('Messages not sent by the same person!');
					messageCheck = false;
					return;
				}
			});
			if (messageCheck) {
				concatMessages(messages[1]).then( async concatMessage => {
					var voteMessageText = '\n Fair Sik... Starting a 30 Second Vote... \n \n' + concatMessage + ' \n \n Vote Now!';
					messages[1][0].channel.send(voteMessageText).then( voteMessage => {
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
								messages[1][0].channel.send('Vote was unsuccessful. Quote something better!');
								return;
							}
							messages[1][0].channel.send('Vote was successful. Uploading to Smirkyisms.com...');
							uploadQuote(
								concatMessage,
								messages[1][0].author.username,
								provokeMessage.author.username,
								messages[1][0].channel.guild.name,
								messages[1][0].channel.name,
								apiAddr
							).then(response => {
								console.log('response');
								console.log(response);
							    var embed = new MessageEmbed()
									.setColor('#0099ff')
									.addField('Quote', concatMessage)
									.addField('Quote By', messages[1][0].author.username)
									.addField('Submitted By', provokeMessage.author.username)
									.addField('Go Check it out!', 'https://smirkyisms.com/quotes/' + response.data.id)
									.setFooter('Smirkyisms')
									.setTimestamp();
								provokeMessage.channel.send(embed);
							}).catch(error => {
								console.log(error);
								provokeMessage.channel.send('There was a error! ' + error);
							});

						});
					});
				});
			}
		}).catch( error => {
			console.log(error)
			message.channel.send('A Message ID Not Recognized. Try Again!');
		});
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

	return;
});

async function getMessages(message) {
	var messageIds = message.content.split(commandQuote + ' ')[1];
	var imageMessages = Array();
	var quoteMessages = Array();
	var messageArray = messageIds.split(' ');
	var arrayLength = messageArray.length;
	for (var i = 0; i < arrayLength; i++) {
		console.log(messageArray[i])
		// Check if the message has a File attached.
		await message.channel.messages.fetch(messageArray[i]).then( quoteMessage => {
			if (quoteMessage.attachments.size > 0) {
				imageMessages.push(quoteMessage);
			} else {
				quoteMessages.push(quoteMessage);
			}
		}).catch(function (error) {
			console.log(error);
			throw new Error('A Message ID Not Recognized');
		});
	}
	return [imageMessages, quoteMessages];
}

async function concatMessages(messages) {
	var arrayLength = messages.length;
	var concatStr = new Array();
	for (var i = 0; i < arrayLength; i++) {
		concatStr.push(messages[i].content);
	}
	return concatStr.join(',\n');
}

async function uploadQuote(quote, quoteBy, submittedBy, serverName, channelName, apiAddr) {
	console.log('message');
	return axios.post('https://smirkyisms.eu.auth0.com/oauth/token',
		{
			client_id: auth0ClientId,
			client_secret: auth0ClientSecret,
			audience: auth0Audience,
			grant_type: "client_credentials"
		}
	).then(function (auth) {
		return axios.post(
			apiAddr + '/quote', 
			{
				text: quote,
				type: 'discord',
				quote_by: quoteBy,
				discord_submitted_by: submittedBy,
				discord_server_name: serverName,
				discord_channel_name: channelName,
				submitted_by: auth0BotUserId
			},
			{
		      	headers: {
		        	Authorization: `Bearer ${auth.data.access_token}`
		      	}
		    }
	    ).then(function (response) {
	    	return response;
		}).catch(function (error) {
			console.log(error);
			throw new Error(error);
		})
	});
}

async function uploadImage(url, submittedBy, apiAddr) {
	return axios.post('https://smirkyisms.eu.auth0.com/oauth/token',
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
		formData.append('discord_submitted_by', submittedBy);
        await formData.append('image', request(url));


        const headers = Object.assign({
		    'Authorization': `Bearer ${auth.data.access_token}`,
		}, formData.getHeaders());

		return axios.post(
			apiAddr + '/image', 
			formData,
			{
		      	headers: headers
	    	}
	    ).then(function (response) {
	    	return response;
		}).catch(function (error) {
			console.log(error);
			throw new Error(error);
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
