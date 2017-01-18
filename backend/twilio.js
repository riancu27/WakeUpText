'use strict';

const moment = require('moment');
const Promise = require('bluebird');
const request = require('request');
const twilio = require('twilio');

const config = require('./config.json');

let twilioClient = twilio(config.Twilio.AccountSid, config.Twilio.AuthToken);


function sendTwilioMessage(payload) {
    return new Promise(function(resolve, reject) {
        twilioClient.messages.create({
            from: config.Twilio.MessagingServiceSid,
            to: payload.PhoneNumber,
            body: payload.Body,
            mediaUrl: payload.Media.map(function(media) {
                return media.MediaUrl
            })
        }, function(error, data) {
            if (error) {
                console.error(JSON.stringify(error, null, 2));
            }
        });
    });
}


module.exports = {
    handler: function messageHandler(event, context, callback) {
        console.log(JSON.stringify(event, null, 2));

        sendTwilioMessage({
            PhoneNumber: event.PhoneNumber,
            Body: event.Body || null,
            Media: event.Media,
            Payloads: [{
                CreatedAt: moment.utc().unix(),
            }],
            CreatedAt: moment.utc().unix()
        }).then(function() {
            callback(null, {
                ok: true
            });
        }).catch(function(error) {
            console.error(JSON.stringify(error, null, 2));
            callback(JSON.stringify(error));
        });
    }
};
