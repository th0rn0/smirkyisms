module.exports = {

  friendlyName: 'GetUsers',

  description: 'Get Info for All Users',

  inputs: {

  },

  exits: {
    success: {
      outputFriendlyName: 'Users',
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

    return management.getUsers();
  }
};
