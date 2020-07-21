module.exports = {

	friendlyName: 'Show Video Index',

	description: 'Show Video',

	inputs: {
	
	},

	exits: {
		success: {
		  outputFriendlyName: 'Video',
		  contentType: 'file'
		},
	    serverError: {
	    	description: `Failed to download the file`,
	    	responseType: 'serverError',
	  	}
	},

	fn: async function (inputs, exits) {
  	var videos = await Video.find({select: ['id', 'submitted_by', 'discord_submitted_by', 'type']});
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
