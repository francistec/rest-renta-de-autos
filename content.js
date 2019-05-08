
const content = require('./modules/content');

module.exports.handler = async (event) => {
  return new Promise(async (resolve, reject) => {

    let info  = await content.GetAll();
   
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
