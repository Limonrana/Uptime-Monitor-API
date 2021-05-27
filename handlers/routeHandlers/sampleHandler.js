/*
 * Title: Sample Handler
 * Description: Sample handler manage from here
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Module Scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is sample url',
    });
};

module.exports = handler;
