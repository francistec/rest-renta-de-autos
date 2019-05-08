/**
 * Modulo para obtener el conenido de los autos
 * 
 * @module modules/content
 * 
 */
const AWS = require('aws-sdk');

/**
 * @param pickup Fecha de Pickup
 * @param dropoff Fecha de Dropoff
 * @param type Tipo de vehiculo
 */
module.exports.GetType = (type) => {
    return new Promise((resolve, reject) => {
        let docClient = new AWS.DynamoDB.DocumentClient();
   
        let params = {
            TableName: "car_content",
            //ProjectionExpression: "#slug, title, info.rating",
            FilterExpression: "#slug = :slug",
            ExpressionAttributeNames: {
                "#slug": "slug",
            },
            ExpressionAttributeValues: {
                 ":slug": type
            }
        };

        docClient.scan(params, function (err, data) {
            if(err) reject(err);
            if(data.Items.length > 0){
                resolve(data.Items[0]);
            }
        });
    });
}

/**
 * Obtiene todos los autos con sus caracteristicas
 */
module.exports.GetAll = () => {
    return new Promise((resolve, reject) => {
        let docClient = new AWS.DynamoDB.DocumentClient();
   
        let params = {
            TableName: "car_content"
        };

        docClient.scan(params, function (err, data) {
            if(err) {
                console.log(err);
                reject(err)
            };
            resolve(data.Items);
        });
    });
}