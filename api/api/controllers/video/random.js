module.exports = {

  friendlyName: 'Index',

  description: 'Get Random Video',

  inputs: {
  
  },

  exits: {
    success: {
      outputFriendlyName: 'Video',
    },
    serverError: {
      description: `Failed to download the file`,
      responseType: 'serverError',
    }
  },

  fn: async function (inputs, exits) {
    var video = await Video.getRandom();
    if (!video) {
      return exits.notFound();
    }
    sails.helpers.formatVideoInfo(video).then(video => {
      return exits.success(video);
    });
  }
};
