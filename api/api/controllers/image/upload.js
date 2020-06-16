module.exports = {

	friendlyName: 'Upload',

	description: 'Upload Image',

	inputs: {
  	image: {
  		description: 'Image to upload',
  		type: 'ref'
  	},
  	type: {
  		description: 'Type of upload',
  		type: 'string',
  	},
  	submitted_by: {
  		description: 'Whomstve dun it',
  		type: 'string',
  	}
	},
	
	exits: {
    success: {
    	outputDescription: 'The newly Uploaded Image.',
    	outputExample: {}
    },
    noFileAttached: {
    	description: 'No file was attached.',
    	responseType: 'badRequest'
    },
    serverError: {
    	description: `Failed to upload the file`,
    	responseType: 'serverError',
  	}
	},

	files: ['image'],

	fn: function (inputs, exits) {
    console.log('we here');
    console.log(inputs);
  	inputs.image.upload({
			noop: false,
	    // don't allow the total upload size to exceed ~10MB
	    maxBytes: 10000000,
	    maxTimeToBuffer: 10000,
	    dirname: require('path').resolve(sails.config.appPath, 'assets/images')
  	},async function whenDone(err, uploadedFiles) {
	    if (err) {
      	return exits.serverError(err);
	    }

	    // If no files were uploaded, respond with an error.
	    if (uploadedFiles.length === 0){
      	console.log('No file was uploaded');
	    	return exits.noFileAttached('no files');
	    }

	    var image = await Image.create({
	    	submitted_by: inputs.submitted_by,
				type: inputs.type,
				image_path: uploadedFiles[0].fd
			}).fetch();

			return exits.success(image);
    });
	}
};
