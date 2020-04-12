module.exports = {


  friendlyName: 'Index',


  description: 'Get All Users.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
  	

    var users = await sails.helpers.getUsers();
    return users;
  }


};
