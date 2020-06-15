module.exports = {

  friendlyName: 'Show',

  description: 'Show Quote.',

  inputs: {
  	quoteId: {
  		description: 'The ID of a Quote to look up.',
  		type: 'string',
  		required: true
  	}
  },

  exits: {
    success: {
      outputFriendlyName: 'Quote',
    },
		notFound: {
		  description: 'No quote with the specified ID was found in the database.',
		  responseType: 'notFound'
		}
  },

  fn: async function (inputs, exits) {
    var quote = await Quote.findOne({id: inputs.quoteId});
    if (!quote) {
      return exits.notFound();
    }
    
    sails.helpers.formatQuote(quote).then(quote => {
      return exits.success(quote);
    });
  }
};
