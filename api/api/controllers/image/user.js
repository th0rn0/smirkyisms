module.exports = {

	friendlyName: 'Show User Images',

	description: 'Show Images for User',

	inputs: {
		userId: {
  		description: 'The ID of a User to look up.',
  		type: 'string',
  		required: true
  	}
	},

	exits: {
		success: {
		  outputFriendlyName: 'Image',
		  contentType: 'image/png'
		},
    serverError: {
    	description: `Failed to download the file`,
    	responseType: 'serverError',
  	},
		notFound: {
			description: 'No user with the specified ID was found in the database.',
			responseType: 'notFound'
		}
	},

	fn: async function (inputs, exits) {
  	var images = await Image.find({
			where: { submitted_by: inputs.userId }, 
			select: ['id', 'submitted_by', 'discord_submitted_by', 'type']
		});
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
