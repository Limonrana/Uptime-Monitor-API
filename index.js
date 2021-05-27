/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFull API to monitor up or down time of user defined links
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const envConfig = require('./helpers/environments');
const { sendSMS } = require('./helpers/notifications');
// const lib = require('./lib/data');

// App object - module scaffolding
const app = {};

// Test SMS
// sendSMS('01303787634', 'Hello Rana, Hope you are well. are you interested? Thanks', (err) => {
//     console.log('This is the error', err);
// });

// Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(envConfig.port, () => {
        console.log(`Server listening to port ${envConfig.port}`);
    });
};

// Request & Response Hanlde Function
app.handleReqRes = handleReqRes;

// Start the server
app.createServer();
