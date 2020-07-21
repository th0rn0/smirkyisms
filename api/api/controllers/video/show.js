module.exports = {

	friendlyName: 'showInfo',

	description: 'Show Info',

	inputs: {
		videoId: {
			description: 'The ID of a Video to look up.',
			type: 'string',
			required: true
		}
	},

	exits: {
		success: {
		  outputFriendlyName: 'Video',
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

		var video = await Video.findOne(
			{
				where: {
					id: inputs.videoId
				},
				select: ['id', 'submitted_by', 'discord_submitted_by', 'type']
			}
		);
    if (!video) {
    	return exits.notFound();
    }
    console.log('asdasd');
    sails.helpers.formatVideoInfo(video).then(video => {
    	return exits.success(video);
    });
	}
};
