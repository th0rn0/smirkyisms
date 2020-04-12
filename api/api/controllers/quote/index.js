module.exports = {


  friendlyName: 'Index',


  description: 'Get All Quotes.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    var quotes = await Quote.getAll();
    
    return quotes;
  }
};
