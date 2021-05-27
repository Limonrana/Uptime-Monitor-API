/*
 * Title: Not found Handler
 * Description: 404 not found handler manage from here
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Module Scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'OOPS, 404 not found!',
    });
};

module.exports = handler;
