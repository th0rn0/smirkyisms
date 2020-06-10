/**
 * Image.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'images',
  datastore: 'default',
  attributes: {
    submitted_by: { type: 'string', required: true }, // ID of user submitting the Image. If bot, bot ID will be used.
    discord_submitted_by: { type: 'string', allowNull: true }, // If bot, name of the discord user Submitting the Image.
    type: { type: 'string', required: true },
    image_path: { type: 'string', required: true }, // ID of user submitting the Quote. If bot, bot ID will be used.
  },
  // getRandom: async function () {
  //   var quote = await Quote.count()
  //     .then(count => Quote.find().limit(1).skip(parseInt(Math.random() * count)))
  //     .catch(sails.log.error);

  //   return sails.helpers.formatQuote(quote[0]);
  // },

  // getAll: async function () {
  //   var quotes = await Quote.find();
  
  //   var returnQuotes = [];

  //   for (var index in quotes) {
  //     returnQuotes.push(await sails.helpers.formatQuote(quotes[index]));
  //   }

  //   return returnQuotes;
  // },

  // getOne: async function (quoteId) {
  //   var quote = await Quote.findOne({id: quoteId});
  
  //   return sails.helpers.formatQuote(quote);
  // },

};
