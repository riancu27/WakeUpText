'use strict';

const data = require('./dummy.json');
const weather = require('./weather');


module.exports = {
    handler: function clothes(info, context, callback) {
        return new Promise(function(resolve, reject) {
            // !!!change this to a call to weather's handler!!!
            const info = JSON.parse(data);
            return resolve(info);
        }).then(function(info){
            
        });
    }
}