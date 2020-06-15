module.exports = {

	friendlyName: 'Index',

	description: 'Show Images',

	inputs: {
	
	},

	exits: {
		success: {
		  outputFriendlyName: 'Image',
		},
    serverError: {
    	description: `Failed to download the file`,
    	responseType: 'serverError',
  	}
	},

	fn: async function (inputs, exits) {
    var image = await Image.getRandom();
    if (!image) {
    	return exits.notFound();
    }

    sails.helpers.formatImageInfo(image).then(image => {
    	return exits.success(image);
    });
	}
};
