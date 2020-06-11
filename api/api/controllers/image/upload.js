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
	  		required: true
	  	},
	  	submitted_by: {
	  		description: 'Whomstve dun it',
	  		type: 'string',
	  		required: true
	  	}
  	},
  	
  	exits: {
	    success: {
	      	outputDescription: 'The newly created `Thing`.',
	      	outputExample: {}
	    },

	    noFileAttached: {
	      	description: 'No file was attached.',
	      	responseType: 'badRequest'
	    },

        serverError: {
	      	description: `Failed to upload the file`,
	      	responseType: 'server error',
    	}
  	},

  	files: ['image'],

  	fn: async function (inputs, exits) {
	  	inputs.image.upload({
  			noop: false,
		    // don't allow the total upload size to exceed ~10MB
		    maxBytes: 10000000,
		    maxTimeToBuffer: 5000,
		    dirname: require('path').resolve(sails.config.appPath, 'assets/images')
	  	},async function whenDone(err, uploadedFiles) {
		    if (err) {
		      	return exits.serverError(err);
		    }
		    // If no files were uploaded, respond with an error.
		    if (uploadedFiles.length === 0){
		      	console.log('No file was uploaded');
		    	return exits.noFileAttached();
		    }
		    console.log(uploadedFiles[0]);
		    var image = await Image.create({
		    	submitted_by: inputs.submitted_by,
				type: inputs.type,
				image_path: uploadedFiles[0].fd
			}).fetch()
			console.log(image)
			return exits.success(image);
	    });
  	}
};
