/*
 * Title: User Handler
 * Description: User handler for manage user related everything from here
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Dependencies
const data = require('../../lib/data');
const { hash, parseJSON, createRandomString } = require('../../helpers/utilities');

// Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        // Methods here
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            error: 'OPPS! Method is not allowed!',
        });
    }
};

// Private Methods Module Scaffolding
handler._token = {};

// POST Methods
handler._token.post = (requestProperties, callback) => {
    // Check validation
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;

    if (phone && password) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                const hashedPass = hash(password);
                if (hashedPass === parseJSON(userData).password) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        token_id: tokenId,
                        expires,
                        phone,
                    };
                    // Store the user to database
                    data.create('tokens', tokenId, tokenObject, (error) => {
                        if (!error) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                error: 'There was a problem in server side!',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'Password is invalid!',
                    });
                }
            } else {
                callback(400, {
                    error: 'User does not exists with this phone number!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'OPPS! You have a problem in your request',
        });
    }
};

// GET Methods
handler._token.get = (requestProperties, callback) => {
    // Check the tokenId number if valid
    const tokenId =
        typeof requestProperties.queryStringObject.token_id === 'string' &&
        requestProperties.queryStringObject.token_id.trim().length === 20
            ? requestProperties.queryStringObject.token_id
            : false;

    if (tokenId) {
        // Find user
        data.read('tokens', tokenId, (error, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (!error && token) {
                callback(200, token);
            } else {
                callback(404, {
                    error: 'OPPS! Token not exists',
                });
            }
        });
    } else {
        callback(404, {
            error: 'OPPS! Token not exists',
        });
    }
};

// PUT Methods
handler._token.put = (requestProperties, callback) => {
    // Check validation

    const id =
        typeof requestProperties.body.token_id === 'string' &&
        requestProperties.body.token_id.trim().length === 20
            ? requestProperties.body.token_id
            : false;

    const extend =
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
            ? requestProperties.body.extend
            : false;

    if (id && extend) {
        // find user from database
        data.read('tokens', id, (err, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if (!err && tokenObject) {
                if (tokenObject.expires > Date.now()) {
                    tokenObject.expires = Date.now() + 60 * 60 * 1000;
                    // Update token expires limit to database
                    data.update('tokens', id, tokenObject, (error) => {
                        if (!error) {
                            callback(200, {
                                message: 'Token was updated successfully!',
                                token_id: tokenObject.token_id,
                                expires: tokenObject.expires,
                            });
                        } else {
                            callback(500, {
                                error: 'There was a problem in the server side!',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'OPPS, Token already expired!',
                    });
                }
            } else {
                callback(404, {
                    error: 'OPPS, Token does not exist!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'OPPS, Invalid token id!',
        });
    }
};

// DELETE Methods
handler._token.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryStringObject.token_id === 'string' &&
        requestProperties.queryStringObject.token_id.trim().length === 20
            ? requestProperties.queryStringObject.token_id
            : false;

    if (id) {
        // Find token from database for delete
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // Delete token
                data.delete('tokens', id, (error) => {
                    if (!error) {
                        callback(200, {
                            message: 'Token was deleted successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server side!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'OPPS! Token does not exist!',
                });
            }
        });
    } else {
        callback(400, {
            message: 'OPPS! Token does not exist!',
        });
    }
};

// Verify Token
handler._token.verify = (id, phone, callback) => {
    // FInd token from database
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;
