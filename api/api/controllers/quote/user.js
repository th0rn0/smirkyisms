module.exports = {

  friendlyName: 'Show User Quotes',

  description: 'Show Quote for User.',

  inputs: {
  	userId: {
  		description: 'The ID of a User to look up.',
  		type: 'string',
  		required: true
  	}
  },

  exits: {
    success: {
      outputFriendlyName: 'Quote',
    },
	notFound: {
	  description: 'No user with the specified ID was found in the database.',
	  responseType: 'notFound'
	}
  },

  fn: async function (inputs, exits) {
 		var quotes = await Quote.find({submitted_by: inputs.userId});
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
