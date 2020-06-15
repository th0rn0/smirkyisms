module.exports = {

  friendlyName: 'Get user',

  description: 'Get a User from Auth0',

  inputs: {
    userId: {
      description: 'The ID of a User to look up.',
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'User',
    },
  },

  fn: async function (inputs) {
    var ManagementClient = require('auth0').ManagementClient;

    var management = new ManagementClient({
      domain: sails.config.auth0.domain,
      clientId: sails.config.auth0.clientId,
      clientSecret: sails.config.auth0.clientSecret,
      scope: 'read:users update:users'
    });

    user = await management.getUser({ id: inputs.userId });

    return user;
  }
};
