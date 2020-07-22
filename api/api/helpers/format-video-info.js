module.exports = {

  friendlyName: 'FormatVideoInfo',

  description: 'Format a Video Info with the User Data',

  inputs: {
    video: {
      description: 'Video Object.',
      type: {},
      required: true
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'Video',
    }
  },

  fn: async function (inputs) {
    var name;
    if (inputs.video.type == 'discord') {
      name = inputs.video.discord_submitted_by;
    } else {
     	user = await sails.helpers.getUser(inputs.video.submitted_by);
      name = user.username;
    }
    inputs.video.submitted_by = name;

    return inputs.video;
  }
};
