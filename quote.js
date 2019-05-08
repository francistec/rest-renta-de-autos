
const moment = require('moment');
const core = require('./modules/quote');
const content = require('./modules/content');

module.exports.handler = async (event) => {

  return new Promise(async (resolve, reject) => {

    let qs = event.queryStringParameters;
    let from = moment(qs.from, 'YYYY-MM-DD').toDate();
    let to = moment(qs.to, 'YYYY-MM-DD').toDate();
    let type = event.pathParameters.type;

    let rates = await core.Quote(from, to, type);
    let info = await content.GetType(type);

    let response = {
      statusCode: 200,
      body: JSON.stringify({
        total: rates.total,
        content: info
      }),
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
