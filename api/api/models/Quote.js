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

    return quote[0];
  },
};
