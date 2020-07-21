module.exports = {

	friendlyName: 'Show Video File',

	description: 'Show Video',

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
	  	contentType: 'file'
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
  	var video = await Video.findOne(inputs.videoId);
    if (!video) {
    	return exits.notFound();
    }
   	var SkipperDisk = require('skipper-disk');
  	var fileAdapter = SkipperDisk(/* optional opts */);
    // Stream the file down
   	fileAdapter.read(
   		video.video_path
		, async function whenDone(err, file) {
			if(err) {
				return exits.serverError(err);
			}
			return exits.success(Buffer.from(file).toString('base64'));
  	});
	}
};
