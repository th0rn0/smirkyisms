module.exports = {

	friendlyName: 'showInfo',

	description: 'Show Info',

	inputs: {
		imageId: {
			description: 'The ID of a Image to look up.',
			type: 'string',
			required: true
		}
	},

	exits: {
		success: {
		  outputFriendlyName: 'Image',
		},
		notFound: {
		  description: 'No quote with the specified ID was found in the database.',
		  responseType: 'notFound'
		},
	    serverError: {
	    	description: `Failed to download the file`,
	    	responseType: 'serverError',
	  	}
	},

	fn: async function (inputs, exits) {
  	var image = await Image.findOne(
			{
				where: {
					id: inputs.imageId
				},
				select: ['id', 'submitted_by', 'discord_submitted_by', 'type']
			}
		);
    if (!image) {
    	return exits.notFound();
    }
    sails.helpers.formatImageInfo(image).then(image => {
    	return exits.success(image);
    });
	}
};
