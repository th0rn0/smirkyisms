// Dependencies
require('dotenv').config();
const { Client, MessageAttachment, MessageEmbed } = require('discord.js');
const client = new Client();
const axios = require('axios').default;
const request = require(`request`);
const fs = require(`fs`);
const FormData = require('form-data'); 

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




			if (quoteMessage.attachments.size > 0) {
				if (message.attachments.every(attachIsImage)){
					console.log(quoteMessage.attachments.first().url);
					var attachment = new MessageAttachment(quoteMessage.attachments.first().url);
			    }
			}


			console.log(attachment);

			quoteMessage.channel.send('\n Fair Sik... Starting a 30 Second Vote... \n > ' + quoteMessage.content + ' \n \n Vote Now!', attachment).then( voteMessage => {
				voteMessage.react('👍').then(() => voteMessage.react('👎'));
				const filter = (reaction, user) => {
					return ['👍', '👎'].includes(reaction.emoji.name);
				};

				const collector = voteMessage.createReactionCollector(filter, { max: 10, time: voteTime, errors: ['time'] });

				collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));




				if (quoteMessage.attachments.size > 0) {

					if (message.attachments.every(attachIsImage)){
						console.log(quoteMessage.attachments.first().url);

				    }
				}




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
						



						if (quoteMessage.attachments.size > 0) {
							if (message.attachments.every(attachIsImage)){
						    	uploadImage(quoteMessage, provokeMessage, apiAddr);
						    }
						} else {
							uploadQuote(quoteMessage, provokeMessage, apiAddr);
						}




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

	// Get Quote
	if (message.content.toLowerCase().startsWith(commandGet)) {
		message.channel.send('TBC');
	}

	// Get Random
	if (message.content.toLowerCase().startsWith(commandRandom)) {
		getRandom(message, apiAddr);
	}

	if (message.content.toLowerCase().startsWith('.help')) {
	    var embed = new Discord.MessageEmbed()
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

async function uploadImage(quoteMessage, provokeMessage, apiAddr) {
	console.log('image');
	console.log(provokeMessage);

	// First Download the image to local storage for upload later
	// var image = await fs.createWriteStream('tmp/file.png');
	// console.log(image);
	axios({
  		method: 'get',
  		url: quoteMessage.attachments.first().url,
  		responseType: 'stream'
	}).then(function (response) {
    	response.data.pipe(fs.createWriteStream('tmp/file.png'));
  	});

	console.log('IMAGE HERE');
	axios.post('https://smirkyisms.eu.auth0.com/oauth/token',
		{
			client_id: auth0ClientId,
			client_secret: auth0ClientSecret,
			audience: auth0Audience,
			grant_type: "client_credentials"
		}
	).then(function (auth) {


		var formData = new FormData();
        formData.append('image', fs.createReadStream('tmp/file.png'));
        // formData.append('image', request(quoteMessage.attachments.first().url));
        formData.append('type', 'discord');
        formData.append('submitted_by', 'auth0BotUserId');

  //       formData.submit(apiAddr + '/image', function(error, res) {
		// 	// res.resume();
  //       	if (error) {
		// 		console.log(error);
		// 		provokeMessage.channel.send('There was a error! ' + error);
  //       	}
  //       	console.log(res);
		//     var embed = new MessageEmbed()
		// 		.setColor('#0099ff')
		// 		.addField('Submitted By', provokeMessage.author.username)
		// 		.addField('Go Check it out!', 'https://smirkyisms.com/images/' + res.data.id)
		// 		.setFooter('Smirkyisms')
		// 		.setTimestamp();
		// 	provokeMessage.channel.send(embed);
		// });

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
		  //   var embed = new Discord.MessageEmbed()
				// .setColor('#0099ff')
				// .addField('Image', quoteMessage)
				// .addField('Submitted By', provokeMessage.author.username)
				// .addField('Go Check it out!', 'https://smirkyisms.com/images/' + response.data.id)
				// .setFooter('Smirkyisms')
				// .setTimestamp();
			// provokeMessage.channel.send(embed);
		}).catch(function (error) {
			console.log(error);
			provokeMessage.channel.send('There was a error! ' + error);
		})
	});

}

async function getBase64(url) {
  return axios
    .get(url, {
      responseType: 'arraybuffer'
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
}

function attachIsImage(msgAttach) {
    var url = msgAttach.url;
    console.log(url)
    //True if this url is a png image.
    return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1;
}

async function getRandom(message, apiAddr) {
	axios.get(apiAddr + '/quote/random')
	.then(function (response) {
		console.log(response);
		if (response.data.type == 'site') {
			var embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.addField('Quote', response.data.text)
				.addField('Quote By', response.data.quote_by)
				.addField('Submitted By', response.data.submitted_by)
				.addField('Go Check it out!', 'https://smirkyisms.com/quotes/' + response.data.id)
				.setFooter('Smirkyisms')
				.setTimestamp();
		} else if (response.data.type == 'discord') {
			var embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.addField('Quote', response.data.text)
				.addField('Quote By', response.data.quote_by)
				.addField('Submitted By', response.data.discord_submitted_by)
				.addField('Go Check it out!', 'https://smirkyisms.com/quotes/' + response.data.id)
				.setFooter('Smirkyisms')
				.setTimestamp();	
		} else {
			var embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.addField('Quote', "Type not supported. Bug Th0rn0")
				.setFooter('Smirkyisms')
				.setTimestamp();	
		}
		message.channel.send(embed);
	});
}
