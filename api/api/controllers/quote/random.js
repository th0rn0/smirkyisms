module.exports = {


  friendlyName: 'Random',


  description: 'Get Random Quote.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    var quote = await Quote.getRandom();
    
    return quote;
  }
};
