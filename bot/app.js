// Dependencies
require('dotenv').config();
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const axios = require('axios').default;
const request = require(`request`);
const fs = require(`fs`);
const FormData = require('form-data'); 
const fetch = require('node-fetch');

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

	// Quote
	if (message.content.toLowerCase().startsWith(commandQuote)) {
		var messageId = message.content.split(commandQuote + ' ')[1];
		console.log(messageId);
		const provokeMessage = message;
		message.channel.messages.fetch(messageId).then( quoteMessage => {
			var imageArray = new Array();
			console.log('checking')
			if (quoteMessage.attachments.size > 0) {
				quoteMessage.attachments.forEach(function(attachment) {
					if (attachIsImage(attachment.url)) {
						console.log('asdasdasd');
						imageArray.push(attachment.url);
					}
				});
			}
			if (quoteMessage.attachments.size > 0 && imageArray.length > 0) {
				// Image
				// Only 1 image per attachment allowed. Too lazy to fix right now. Issues with the form type as its not sending extra details over. Possible timeout.
				if (imageArray.length != 1) {
					quoteMessage.channel.send('Please only send one Image at a time. Too shit to figure out formdata shit.');
					return;
				}
				imageArray.forEach(function(url) {
					var url = quoteMessage.attachments.first().url;
					var attachment = new MessageAttachment(url);
					var voteMessageText = '\n Fair Sik... Starting a 30 Second Vote... \n \n Vote Now!';
					console.log('we are here')
					console.log(url);
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
							if (upvote < downvote) {
								quoteMessage.channel.send('Vote was unsuccessful. Quote something better!');
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
						if (upvote < downvote) {
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

	// Get Quote
	if (message.content.toLowerCase().startsWith(commandGet)) {
		message.channel.send('TBC');
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
			.addField(commandRandom, 'Get random Quote from Smirkyisms.')
			.addField('\u200B', '\u200B')
			.addField('How do I get the Message ID?', 'First you must enable developer mode on Discord and then you can right click a message and click "Copy ID". EZ PZ')
			.setFooter('Smirkyisms')
		message.channel.send(embed);
	}
});

// async function startVote(quoteMessage, provokeMessage) {

// }

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

function uploadImage(url, quoteMessage, provokeMessage, apiAddr) {
	console.log('image');
	console.log(provokeMessage);
	// First Download the image to local storage for upload later
	var randomFileName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
	axios({
  		method: 'get',
  		url: url,
  		responseType: 'stream'
	}).then(function (response) {
    	response.data.pipe(fs.createWriteStream('tmp/' + randomFileName + '.png'));
  	});

	axios.post('https://smirkyisms.eu.auth0.com/oauth/token',
		{
			client_id: auth0ClientId,
			client_secret: auth0ClientSecret,
			audience: auth0Audience,
			grant_type: "client_credentials"
		}
	).then(function (auth) {
		var formData = new FormData();
        formData.append('image', fs.createReadStream('tmp/' + randomFileName + '.png'));
        formData.append('type', 'discord');
        formData.append('submitted_by', 'auth0BotUserId');


        const headers = Object.assign({
		    'Authorization': `Bearer ${auth.data.access_token}`,
		}, formData.getHeaders());

  //       const options = {
		// 	method: 'POST',
		// 	body: formData,
		// 	headers: headers
		// };

		// (async () => {
		// 	const response = await fetch(apiAddr + '/image', options);
		// 	const json = await response.json();
			
		// 	console.log(json)
		// })();


		// fetch(apiAddr + '/image', { method: 'POST', body: formData , headers: headers})
		//     .then(function(res) {
		//         console.log(res.json());
		//     }).then(function(json) {
		//         console.log(json);
		//     });



        formData.submit(apiAddr + '/image', function(error, res) {
			// res.resume();
        	if (error) {
				console.log(error);
				provokeMessage.channel.send('There was a error! ' + error);
        	}
        	// res.end();
        	res.setEncoding('utf8');
    	  	res.on("data", function(data) {
			    console.log(data);
			    console.log(data.id);
			    var embed = new MessageEmbed()
					.setColor('#0099ff')
					.addField('Submitted By', provokeMessage.author.username)
					// .addField('Go Check it out!', 'https://smirkyisms.com/images/' + data.id)
					.setFooter('Smirkyisms')
					.setTimestamp();
				provokeMessage.channel.send(embed);
		  	});
		});

		// axios.post(
		// 	apiAddr + '/image', 
		// 	formData,
		// 	{
		//       	headers: headers
	 //    	}
	 //    ).then(function (response) {
		// 	console.log(response);
		//     var embed = new MessageEmbed()
		// 		.setColor('#0099ff')
		// 		.addField('Submitted By', provokeMessage.author.username)
		// 		.addField('Go Check it out!', 'https://smirkyisms.com/images/' + response.data.id)
		// 		.setFooter('Smirkyisms')
		// 		.setTimestamp();
		// 	provokeMessage.channel.send(embed);
		// 	// Delete the file
		// 	fs.unlinkSync('tmp/' + randomFileName + '.png');
		// }).catch(function (error) {
		// 	console.log(error);
		// 	provokeMessage.channel.send('There was a error! ' + error);
		// 	// Delete the file
		// 	fs.unlinkSync('tmp/' + randomFileName + '.png');
		// })
	});
}

function attachIsImage(url) {
    // var url = msgAttach.url;
    console.log(url)
    console.log('wewewewe')
    return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// function attachIsImage(url) {
//     console.log('atta')
//     // console.log(url.indexOf("png", url.length - "png".length /*or 3*/) !== -1)
//     //True if this url is a png image.
//     return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
// }

async function getRandom(message, apiAddr) {
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
	});
}
