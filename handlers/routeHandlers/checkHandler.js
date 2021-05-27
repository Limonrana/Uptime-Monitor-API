/*
 * Title: Check Handler
 * Description: Check handler for manage user related input from here
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Dependencies
const data = require('../../lib/data');
const { parseJSON, createRandomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');
// Module Scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        // Methods here
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            error: 'OPPS! Method is not allowed!',
        });
    }
};

// Private Methods Module Scaffolding
handler._check = {};

// POST Methods
handler._check.post = (requestProperties, callback) => {
    // Validate inputs
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

    const successCode =
        typeof requestProperties.body.successCode === 'object' &&
        requestProperties.body.successCode instanceof Array
            ? requestProperties.body.successCode
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 10
            ? requestProperties.body.timeoutSeconds
            : false;

    if (protocol && url && method && successCode && timeoutSeconds) {
        // Token check
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;
        // Find token data from database
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                // FInd User data from database
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (toknIsValid) => {
                            if (toknIsValid) {
                                const userObject = parseJSON(userData);
                                const userChecks =
                                    typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];
                                if (userChecks.length < maxChecks) {
                                    const checkId = createRandomString(11);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCode,
                                        timeoutSeconds,
                                    };

                                    // save check data in database
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add or update check it to user database
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // Now update
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error:
                                                            'There was a problem in the server side!',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error: 'There was a problem in the server side!',
                                            });
                                        }
                                    });
                                } else {
                                    callback(403, {
                                        error: 'OPPS, User has already reached max check limit!',
                                    });
                                }
                            } else {
                                callback(403, {
                                    error: 'OPPS, Authentication failed!',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error: 'OPPS, User not found!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'OPPS, Token does not exist!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request!',
        });
    }
};

// GET Methods
handler._check.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 11
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        // Find Check from database
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const checkObject = parseJSON(checkData);
                // Token check
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, checkObject);
                    } else {
                        callback(400, {
                            error: 'OPPS, Authentication failed!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'OPPS, Not found your checks!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'OPPS, Check ID length less then 11 or not string!',
        });
    }
};

// PUT Methods
handler._check.put = (requestProperties, callback) => {
    // Validate inputs
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 11
            ? requestProperties.body.id
            : false;

    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
            ? requestProperties.body.method
            : false;

    const successCode =
        typeof requestProperties.body.successCode === 'object' &&
        requestProperties.body.successCode instanceof Array
            ? requestProperties.body.successCode
            : false;

    const timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 10
            ? requestProperties.body.timeoutSeconds
            : false;

    // Token check
    const token =
        typeof requestProperties.headersObject.token === 'string'
            ? requestProperties.headersObject.token
            : false;

    if (id) {
        if (protocol || url || method || successCode || timeoutSeconds) {
            data.read('checks', id, (err, checkData) => {
                if (!err && checkData) {
                    const checkObject = parseJSON(checkData);
                    tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCode) {
                                checkObject.successCode = successCode;
                            }
                            if (timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds;
                            }
                            // Update the check from database
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, checkObject);
                                } else {
                                    callback(500, {
                                        error: 'OPPS, Server error found!',
                                    });
                                }
                            });
                        } else {
                            callback(400, {
                                error: 'OPPS, Authentication failed!',
                            });
                        }
                    });
                } else {
                    callback(500, {
                        error: 'OPPS, Server error found!',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'OPPS, All empty field!',
            });
        }
    } else {
        callback(400, {
            error: 'OPPS, Check ID length must be 11 and string!',
        });
    }
};

// DELETE Methods
handler._check.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 11
            ? requestProperties.queryStringObject.id
            : false;

    if (id) {
        // Find Check from database
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                const checkObject = parseJSON(checkData);
                // Token check
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        // Delete check form database
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                data.read('users', checkObject.userPhone, (err3, userData) => {
                                    const userObject = parseJSON(userData);
                                    if (!err3 && userData) {
                                        const userCheck =
                                            typeof userObject.checks === 'object' &&
                                            userObject.checks instanceof Array
                                                ? userObject.checks
                                                : [];

                                        // Remove the deleted checks id from users row
                                        const checkPosition = userCheck.indexOf(id);
                                        if (checkPosition > -1) {
                                            userCheck.splice(checkPosition, 1);
                                            // Resave the user data
                                            userObject.checks = userCheck;
                                            // Update user in database
                                            data.update(
                                                'users',
                                                userObject.phone,
                                                userObject,
                                                (err4) => {
                                                    if (!err4) {
                                                        callback(200, {
                                                            message: 'Check successfully deleted!',
                                                        });
                                                    } else {
                                                        callback(500, {
                                                            error:
                                                                'OPPS, The check id not found in user field!',
                                                        });
                                                    }
                                                }
                                            );
                                        } else {
                                            callback(500, {
                                                error:
                                                    'OPPS, The check id not found in user field!',
                                            });
                                        }
                                    } else {
                                        callback(500, {
                                            error: 'OPPS, Server error found!',
                                        });
                                    }
                                });
                            } else {
                                callback(500, {
                                    error: 'OPPS, Server error found!',
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            error: 'OPPS, Authentication failed!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'OPPS, Not found your checks!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'OPPS, Check ID length must be 11 and string!',
        });
    }
};

module.exports = handler;
