module.exports = {

	friendlyName: 'Show User Videos',

	description: 'Show Video for User',

	inputs: {
		userId: {
  		description: 'The ID of a User to look up.',
  		type: 'string',
  		required: true
  	}
	},

	exits: {
		success: {
		  outputFriendlyName: 'Video',
		  contentType: 'file'
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
  	var videos = await Video.find({
			where: { submitted_by: inputs.userId }, 
  		select: ['id', 'submitted_by', 'discord_submitted_by', 'type']
  	});
    if (!videos) {
    	return exits.notFound();
    }

  	var returnVideos = [];

    for (var index in videos) {
      returnVideos.push(await sails.helpers.formatVideoInfo(videos[index]));
    }

    return exits.success(returnVideos);
	}
};
