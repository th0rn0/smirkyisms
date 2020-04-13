module.exports = {


  friendlyName: 'FormatQuote',


  description: 'Format a Quote with the User Data',


  inputs: {
    quote: {
      description: 'Quote Object.',
      type: {},
      required: true
    }
  },


  exits: {
    success: {
      outputFriendlyName: 'Quote',
    }
  },


  fn: async function (inputs) {

    var name;
    if (inputs.quote.type == 'discord') {
      name = inputs.quote.discord_submitted_by;
    } else {
     	user = await sails.helpers.getUser(inputs.quote.submitted_by);
      name = user.username;
    }

    inputs.quote.submitted_by = name;

    return inputs.quote;
  }


};

