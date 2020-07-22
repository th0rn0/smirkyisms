module.exports = {

	friendlyName: 'Upload',

	description: 'Upload Video',

	inputs: {
  	video: {
  		description: 'Video to upload',
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
    	outputDescription: 'The newly Uploaded Video.',
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

	files: ['video'],

	fn: async function (inputs, exits) {
    const FileType = require('file-type');
    const allowedFileTypes = ['mp4','m4v','avi','mpg'];
    const fs = require('fs');
  	inputs.video.upload({
			noop: false,
	    // don't allow the total upload size to exceed ~10MB
	    maxBytes: 10000000,
	    maxTimeToBuffer: 10000,
	    dirname: require('path').resolve(sails.config.custom.uploadDir + '/videos')
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
      var videoMeta = await FileType.fromFile(uploadedFiles[0].fd);
      if (!allowedFileTypes.includes(videoMeta['ext'])) {
        await fs.unlinkSync(uploadedFiles[0].fd);
        return exits.badFileType();
      }

      // Create thumbnail
      const ThumbnailGenerator = require('video-thumbnail-generator').default;
      const tg = new ThumbnailGenerator({
        sourcePath: uploadedFiles[0].fd,
        thumbnailPath: sails.config.custom.uploadDir + '/videos/thumbnail',
        tmpDir: sails.config.custom.uploadDir + '/videos/tmp' //only required if you can't write to /tmp/ and you need to generate gifs
      });

      tg.generateGifCb({
        fps: 0.75, //how many frames per second you want in your gif
        scale: 500, //the smaller the number, the smaller the thumbnail
        speedMultiple: 4, //this is 4x speed
        deletePalette: true //to delete the palettefile that was generated to create the gif once gif is created 
      }, async (err, result) => {
        if (err) {
          return exits.serverError(err);
        }
  	    var video = await Video.create({
  	    	submitted_by: inputs.submitted_by,
  				type: inputs.type,
  				video_path: uploadedFiles[0].fd,
          thumbnail_path: result,
          discord_submitted_by: inputs.discord_submitted_by
  			}).fetch();

  			return exits.success(video);
      });
    });
	}
};
