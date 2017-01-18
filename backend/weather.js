'use strict';

const http = require('http');
const config = require('./config');

let options = {
  host: 'api.apixu.com',
  port: 80,
  path: '/v1/current.json?key=' + config.Weather.Key + '&q=',
  method: 'GET'
};

//Query is zip code; noOfDays should be 1
let forecastWeather = function forecastWeather(query, noOfDays, callback){
    options.path = '/v1/forecast.json?key=' + config.Weather.Key + '&q=' + query + '&days=' + noOfDays;
    http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        res.data += chunk;
      });
      res.on('end', function (chunk) {
        callback(null, res.data)
      });
    }).on('error', function(err) {
        // handle errors with the request itself
        console.error('Error with the request:', err.message);
        callback(err, {});
    }).end();
};

module.exports = {
    handler: function getWeather(query, noOfDays, callback) {
        return new Promise(function(resolve, reject) {
            forecastWeather(query, noOfDays, function(err, data) {
                if (err) {
                    console.log('\n\nrejected');
                    return reject(err);
                } else {
                    return resolve(data);
                }
            });
        }).then(function(unparsedJSON){
            let weatherObj = JSON.parse(unparsedJSON.slice(9,unparsedJSON.length), 'utf8');
            let today = weatherObj.forecast.forecastday[0];
            let hours = today.hour;
            let conditions = [];
            let precipitation = [];
            for (let i = 0; i < hours.length; i++){
                conditions.push(hours[i].condition.text);
                precipitation.push({
                    rain: hours[i].will_it_rain,
                    snow: hours[i].will_it_snow
                });
                console.log(precipitation[i]);
            }


            let info = {
                name: weatherObj.location.name,
                avg: today.day.avgtemp_f,
                max: today.day.maxtemp_f,
                min: today.day.mintemp_f,
                wind: today.day.maxwind_mph,
                precipitation: today.day.totalprecip_in,
                condition: today.day.condition.text,
                hourly: {
                    conditions: conditions,
                    precipitation: precipitation
                }
            };
            return info;
        }).catch(function(error){
            console.log('error:     ' + error);
        });
    }
}

module.exports.handler(90048, 1, {})