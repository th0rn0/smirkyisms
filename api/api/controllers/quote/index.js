module.exports = {

  friendlyName: 'Index',

  description: 'Get All Quotes.',

  inputs: {

  },

  exits: {
    success: {
      outputFriendlyName: 'Quotes',
    }
  },

  fn: async function (inputs, exits) {
    var quotes = await Quote.find();
    if (!quotes) {
      return exits.notFound();
    }

    var returnQuotes = [];
    for (var index in quotes) {
      returnQuotes.push(await sails.helpers.formatQuote(quotes[index]));
    }

    return exits.success(returnQuotes);
  }
};
