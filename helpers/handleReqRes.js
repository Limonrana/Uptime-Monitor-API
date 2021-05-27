/*
 * Title: Handle Request Response
 * Description: Handle Request and Response
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

// handler object - module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
    // request handling
    // get the url and parse
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statusCode, payload) => {
            const getStatusCode = typeof statusCode === 'number' ? statusCode : 500;
            const getPayload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(getPayload);

            // return the final response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(getStatusCode);
            res.end(payloadString);
        });
        // console.log(realData);
        // response handle
        // res.end('Hello programmer! How are you doing?');
    });
};

module.exports = handler;
