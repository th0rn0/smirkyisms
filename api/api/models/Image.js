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
    image_path: { type: 'string', required: true },
  },
  getRandom: async function () {
    var image = await Image.count()
      .then(count => Image.find({select: ['id', 'submitted_by', 'discord_submitted_by', 'type']}).limit(1).skip(parseInt(Math.random() * count)))
      .catch(sails.log.error);

    return image[0];
  },

};
