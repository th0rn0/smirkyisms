module.exports = {

  friendlyName: 'FormatImageInfo',

  description: 'Format a Image Info with the User Data',

  inputs: {
    image: {
      description: 'Image Object.',
      type: {},
      required: true
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'Image',
    }
  },

  fn: async function (inputs) {
    var name;
    if (inputs.image.type == 'discord') {
      name = inputs.image.discord_submitted_by;
    } else {
     	user = await sails.helpers.getUser(inputs.image.submitted_by);
      name = user.username;
    }

    inputs.image.submitted_by = name;

    return inputs.image;
  }
};
