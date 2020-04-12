module.exports = {


  friendlyName: 'Show',


  description: 'Get Quote.',


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


  fn: async function ({quoteId}) {

    var quote = await Quote.getOne(quoteId);

    if (!quote) { throw 'notFound'; }

    return quote;
  }
};
