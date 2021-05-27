/*
 * Title: .ENV variable
 * Description: All .ENV variable in here
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Module Scaffolding
const envConfig = {};

envConfig.staging = {
    port: 3030,
    envName: 'staging',
    secretKey: 'ghgjhgjhgjkhfdgdffg',
    maxChecks: 5,
    twilio: {
        fromPhone: '+16507708885',
        accountSid: 'AC31f3cd3bbd35eab60dc93e3d009f6320',
        authToken: 'e9cd0c65af867821d07da7e0a4fc690f',
    },
};

envConfig.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'ghgjhgjhgjkfdfgddfgdfh',
    maxChecks: 5,
    twilio: {
        fromPhone: '+16507708885',
        accountSid: 'AC31f3cd3bbd35eab60dc93e3d009f6320',
        authToken: 'e9cd0c65af867821d07da7e0a4fc690f',
    },
};

// Determine which env was passed
const currentEnvConfig =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environment object
const envConfigExport =
    typeof envConfig[currentEnvConfig] === 'object'
        ? envConfig[currentEnvConfig]
        : envConfig.staging;

// Export Module
module.exports = envConfigExport;
