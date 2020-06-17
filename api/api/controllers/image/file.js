module.exports = {

	friendlyName: 'Show Image File',

	description: 'Show Image',

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
		  contentType: 'image/png'
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
	  	var image = await Image.findOne(inputs.imageId);
	    if (!image) {
	    	return exits.notFound();
	    }
	   	var SkipperDisk = require('skipper-disk');
	  	var fileAdapter = SkipperDisk(/* optional opts */);
	    // Stream the file down
	   	fileAdapter.read(
	   		image.image_path
			, async function whenDone(err, file) {
	      if(err) {
	        return exits.serverError(err);
	      }
	      return exits.success(Buffer.from(file).toString('base64'));
	  	});
	}
};
