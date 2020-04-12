/**
 * Quote.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'quotes',
  datastore: 'default',
  attributes: {
    user_id: { type: 'string', allowNull: true },
    quote_by: { type: 'string', required: true },
    submitted_by: { type: 'string', required: true },
    // discord_submitted_by: { type: 'string', required: true },
    discord_channel_name: { type: 'string' },
    discord_server_name: { type: 'string' },
    type: { type: 'string', required: true },
    text: { type: 'string', required: true }

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝



  },
  getRandom: async function () {
    var quote = await Quote.count()
      .then(count => Quote.find().limit(1).skip(parseInt(Math.random() * count)))
      .catch(sails.log.error);

    if (quote[0].user_id !== null) {
      user = await sails.helpers.getUser(quote[0].user_id);
      quote[0].name = user.name;
    }

    return quote[0];
  },

  getAll: async function () {
    var quotes = await Quote.find();
  
    for (var index in quotes) {
      user = await sails.helpers.getUser(quotes[index].user_id);
      quotes[index].name = user.name;
    }

    return quotes;
  },

  getOne: async function (quoteId) {
    var quote = await Quote.findOne({id: quoteId});
  
    user = await sails.helpers.getUser(quote.user_id);
    quote.name = user.name;

    return quote;
  },

};
