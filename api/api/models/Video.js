/**
 * Video.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'videos',
  datastore: 'default',
  attributes: {
    submitted_by: { type: 'string', required: true }, // ID of user submitting the Video. If bot, bot ID will be used.
    discord_submitted_by: { type: 'string', allowNull: true }, // If bot, name of the discord user Submitting the Video.
    type: { type: 'string', required: true },
    video_path: { type: 'string', required: true },
    thumbnail_path: { type: 'string', required: true },
  },
  getRandom: async function () {
    var video = await Video.count()
      .then(count => Video.find({select: ['id', 'submitted_by', 'discord_submitted_by', 'type']}).limit(1).skip(parseInt(Math.random() * count)))
      .catch(sails.log.error);

    return video[0];
  },

};
