module.exports = {


  friendlyName: 'Random',


  description: 'Random quote.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    var quote = await Quote.count()
      .then(count => Quote.find().limit(1).skip(parseInt(Math.random() * count)))
      .catch(sails.log.error);

    return quote[0];
  }


};
