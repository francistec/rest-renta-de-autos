/**
 * Cotizador de autos
 * 
 * @module modules/quote
 */

const AWS = require('aws-sdk'),
    moment = require('moment'),
    utils = require('../utils');

/**
 * Cotiza un tipo de auto en especifico
 * 
 * @param pickup Fecha de Pickup
 * @param dropoff Fecha de Dropoff
 * @param type Tipo de vehiculo
 */
module.exports.Quote = (pickup, dropoff, type) => {
    return new Promise((resolve, reject) => {
        let docClient = new AWS.DynamoDB.DocumentClient();
        let dates = utils.Dates.range(pickup, dropoff);

        let seekDates = [];
        dates.forEach(date => {
            seekDates.push({
                date: moment(date).format('YYYY-MM-DD')
            });
        });

        let params = {
            RequestItems: {
                today_car_rental_rates: {
                    Keys: seekDates,
                    AttributesToGet: [
                        type
                    ],
                    ConsistentRead: false,
                },
            },
            ReturnConsumedCapacity: 'NONE',
        };

        docClient.batchGet(params, function (err, data) {
            if (err) reject(err); // an error occurred
            
            let sum = 0;
            data.Responses.today_car_rental_rates.forEach(rate => {
                sum += rate[type];
            });

            resolve({
                total: sum
            });
        });
    });
}


/**
 * Cotiza todos los tipos de autos en base a una fecha de inicio y final
 * 
 * @param pickup Fecha de Pickup
 * @param dropoff Fecha de Dropoff
 */
module.exports.QuoteList = (pickup, dropoff) => {
    return new Promise((resolve, reject) => {
        let docClient = new AWS.DynamoDB.DocumentClient();
        let dates = utils.Dates.range(pickup, dropoff);

        let seekDates = [];
        dates.forEach(date => {
            seekDates.push({
                date: moment(date).format('YYYY-MM-DD')
            });
        });

        let params = {
            RequestItems: {
                today_car_rental_rates: {
                    Keys: seekDates,
                    ConsistentRead: false,
                },
            },
            ReturnConsumedCapacity: 'NONE',
        };

        docClient.batchGet(params, function (err, data) {
            if (err) reject(err); // an error occurred
            
            //Obtenemos las llaves 

            let carKeys = Object.keys(data.Responses.today_car_rental_rates[0]);
            let carsQuote = {};

            carKeys.forEach(item=>{
                if(item != 'date'){
                    carsQuote[item] = 0;
                }
            });

            do {
                data.Responses.today_car_rental_rates.forEach(row=>{
                    let _key = Object.keys(row);
                    _key.forEach($key=>{
                        if($key != 'date'){
                            carsQuote[$key] = parseFloat(carsQuote[$key]) + parseFloat(row[$key]);
                        }
                    })
                });
            } while(data.UnprocessedKeys.length > 0);

            

            resolve(carsQuote);
        });
    });
}
