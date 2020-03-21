require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.TOKEN;

client.login(TOKEN);

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
	client.user.setActivity('Eating Pizza Sandwiches');

});

client.on('message', message => {
	if (message.author.bot) return;
	if (message.content.startsWith('SMIRKET PIN!')) {
		message.channel.send('Fair Sik...');
		return;
	}
	if (message.content.toLowerCase().indexOf('smirket pin') != -1) {
		console.log(message.cleanContent);


		message.channel.messages.fetch('690748280728059945')
		.then( message => {
			message.react('👍').then(() => message.react('👎'));

			const filter = (reaction, user) => {
				return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
			};

			const upvote = 0;
			

			const collector = message.createReactionCollector(filter, { max: 3, time: 10000, errors: ['time'] })
			collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
			collector.on('end', collected => console.log(`Collected ${collected.size} items`));


		// 	message.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
		// 		.then(collected => {
		// 			const reaction = collected.first();

		// 			if (reaction.emoji.name === '👍') {
		// 				message.reply('you reacted with a thumbs up.');
		// 			} else {
		// 				message.reply('you reacted with a thumbs down.');
		// 			}
		// 			console.log(`Collected ${collected.size} reactions`);
		// 		})
		// 		.catch(collected => {
		// 			message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
		// 		})
		// 		// console.log(message);
		// 		// console.log('asdasd');
		// 		// message.awaitReactions({ time: 60 })
		// 		// .then(collected => {
		// 		// 	console.log(collected)
		// 		// });
		});
	 	// console.log(message.channel.messages.fetch('690640627532169336'));
		message.channel.send('Fair Sik...');
		return;
	}
});

async function getMessages(channel, limit = 100) {
	const messageCount =[];
  let lastId;
	client.user.setActivity('Searching in ' + channel.name + '!');
 	while (true) {
    const options = { limit: 1 };
    if (lastId) {
      options.before = lastId;
    }
    const messages = await channel.fetchMessage(690635718023708729);
    messages.forEach((message) => {
    	console.log(message.reactions)
    });
  }
}


async function getMessage(channel, id) {
	const message = await channel.messages.fetch('690640627532169336');
	return message
}	