/*
 * Title: Routes list
 * Description: All routes list
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');
const { checkHandler } = require('./handlers/routeHandlers/checkHandler');

// Routes Module Scaffolding
const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
};

module.exports = routes;
