module.exports = {

	friendlyName: 'Show Image Index',

	description: 'Show Images',

	inputs: {
	
	},

	exits: {
		success: {
		  outputFriendlyName: 'Image',
		  contentType: 'image/png'
		},
	    serverError: {
	    	description: `Failed to download the file`,
	    	responseType: 'serverError',
	  	}
	},

	fn: async function (inputs, exits) {
	  	var images = await Image.find({select: ['id', 'submitted_by', 'discord_submitted_by', 'type']});
	    if (!images) {
	    	return exits.notFound();
	    }

	  	var returnImages = [];

	    for (var index in images) {
	      returnImages.push(await sails.helpers.formatImageInfo(images[index]));
	    }

	    return exits.success(returnImages);
	}
};
