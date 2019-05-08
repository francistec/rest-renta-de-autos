const moment = require('moment');
const content = require('./modules/content');
const quote = require('./modules/quote');

module.exports.handler = async (event) => {
  return new Promise(async (resolve, reject) => {

    let info  = await content.GetAll();

    let qs = event.queryStringParameters;
    let from = moment(qs.from, 'YYYY-MM-DD').toDate();
    let to = moment(qs.to, 'YYYY-MM-DD').toDate();

    let rates = await quote.QuoteList(from, to);

    info.forEach(element => {
      element.price = rates[element.slug];
    });

    let response = {
      statusCode: 200,
      body: JSON.stringify(info),
      headers:{
        "X-Requested-With": '*',
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'POST,GET,OPTIONS'
      }
    };

    resolve(response);

  });
};
