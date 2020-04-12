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
    submitted_by: { type: 'string', required: true }, // ID of user submitting the Quote. If bot, bot ID will be used.
    quote_by: { type: 'string', required: true }, // Name of the Person being Quoted
    discord_submitted_by: { type: 'string', allowNull: true }, // If bot, name of the discord user Submitting the Quote.
    discord_channel_name: { type: 'string', allowNull: true },
    discord_server_name: { type: 'string', allowNull: true },
    type: { type: 'string', required: true },
    text: { type: 'string', required: true }
  },
  getRandom: async function () {
    var quote = await Quote.count()
      .then(count => Quote.find().limit(1).skip(parseInt(Math.random() * count)))
      .catch(sails.log.error);

    user = await sails.helpers.getUser(quote[0].submitted_by);
    quote[0].name = user.name;

    return quote[0];
  },

  getAll: async function () {
    var quotes = await Quote.find();
  
    for (var index in quotes) {
      user = await sails.helpers.getUser(quotes[index].submitted_by);
      quotes[index].name = user.name;
    }

    return quotes;
  },

  getOne: async function (quoteId) {
    var quote = await Quote.findOne({id: quoteId});
  
    user = await sails.helpers.getUser(quote.submitted_by);
    quote.name = user.name;

    return quote;
  },

};
