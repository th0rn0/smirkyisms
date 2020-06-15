module.exports = {

  friendlyName: 'Random',

  description: 'Get Random Quote.',

  inputs: {

  },

  exits: {
    success: {
      outputFriendlyName: 'Quotes',
    },
    notFound: {
      description: 'No quote with the specified ID was found in the database.',
      responseType: 'notFound'
    }
  },

  fn: async function (inputs, exits) {
    var quote = await Quote.getRandom();
    if (!quote) {
      return exits.notFound();
    }

    sails.helpers.formatImageInfo(quote).then(quote => {
      return exits.success(quote);
    });
  }
};
