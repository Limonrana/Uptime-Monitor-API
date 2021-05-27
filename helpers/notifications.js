/*
 * Title: Notification Helper
 * Description: All Important Notification send function or methods
 * Author: Limon Rana
 * Date: 10/03/2021
 *
 */

// Dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments');

// Module scaffolding
const notifications = {};

// send sms to user using twilio api
notifications.sendSMS = (phone, msg, callback) => {
    // Validation
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg = typeof msg === 'string' && msg.trim().length <= 1600 ? msg.trim() : false;

    if (userPhone && userMsg) {
        // config the request payload
        const payload = {
            From: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };

        // stringfiy the payload
        const stringifyPayload = querystring.stringify(payload);

        // Https Request Details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };

        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status code from send request
            const status = res.statusCode;
            // callback succesfully if the request went thoungh
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status cose retured was ${status}`);
            }
        });

        req.on('error', (e) => {
            callback(e);
        });

        req.write(stringifyPayload);
        req.end();
    } else {
        callback('Given parameters were missing or invalid!');
    }
};

// Export module
module.exports = notifications;
