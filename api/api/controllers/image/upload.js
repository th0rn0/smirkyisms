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
  	},
    discord_submitted_by: {
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
    badFileType: {
      description: 'File Type Not Allowed.',
      responseType: 'badRequest'
    },
    serverError: {
    	description: `Failed to upload the file`,
    	responseType: 'serverError',
  	}
	},

	files: ['image'],

	fn: function (inputs, exits) {
    const FileType = require('file-type');
    const allowedFileTypes = ['jpeg','jpg','gif','png'];
    const fs = require('fs');
  	inputs.image.upload({
			noop: false,
	    // don't allow the total upload size to exceed ~10MB
	    maxBytes: 10000000,
	    maxTimeToBuffer: 10000,
	    dirname: require('path').resolve(sails.config.custom.uploadDir + '/images')
  	},async function whenDone(err, uploadedFiles) {
      // Handle Errors
	    if (err) {
      	return exits.serverError(err);
	    }
	    // If no files were uploaded, respond with an error.
	    if (uploadedFiles.length === 0){
      	console.log('No file was uploaded');
	    	return exits.noFileAttached('no files');
	    }
      // Validate Video
      var imageMeta = await FileType.fromFile(uploadedFiles[0].fd);
      if (!allowedFileTypes.includes(imageMeta['ext'])) {
        await fs.unlinkSync(uploadedFiles[0].fd);
        return exits.badFileType();
      }

	    var image = await Image.create({
	    	submitted_by: inputs.submitted_by,
				type: inputs.type,
				image_path: uploadedFiles[0].fd,
        discord_submitted_by: inputs.discord_submitted_by
			}).fetch();

			return exits.success(image);
    });
	}
};
