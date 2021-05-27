/*
 * Title: User Handler
 * Description: User handler for manage user related everything from here
 * Author: Limon Rana
 * Date: 09/03/2021
 *
 */

// Dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

// Module Scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        // Methods here
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            error: 'OPPS! Method is not allowed!',
        });
    }
};

// Private Methods Module Scaffolding
handler._user = {};

// POST Methods
handler._user.post = (requestProperties, callback) => {
    // Check validation
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

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

    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement === true
            ? requestProperties.body.tosAgreement
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // Store the user to database
                data.create('users', phone, userObject, (error) => {
                    if (!error) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, {
                            error: 'Could not create user',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'User already exists with this phone number!',
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
handler._user.get = (requestProperties, callback) => {
    // Check the phone number if valid
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        // Verify Token
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // Find user
                data.read('users', phone, (error, u) => {
                    const user = { ...parseJSON(u) };
                    if (!error && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'OPPS! User does not exists',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'OPPS, Authentication failed!',
                });
            }
        });
    } else {
        callback(404, {
            error: 'OPPS! User does not exists',
        });
    }
};

// PUT Methods
handler._user.put = (requestProperties, callback) => {
    // Check validation
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;

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

    if (phone) {
        // Verify Token
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                if (firstName || lastName || password) {
                    // find user from database
                    data.read('users', phone, (err, uData) => {
                        const userData = { ...parseJSON(uData) };
                        if (!err && userData) {
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = hash(password);
                            }
                            // Update user to database
                            data.update('users', phone, userData, (error) => {
                                if (!error) {
                                    callback(200, {
                                        message: 'User was updated successfully!',
                                    });
                                } else {
                                    callback(500, {
                                        error: 'There was a problem in the server side!',
                                    });
                                }
                            });
                        } else {
                            callback(404, {
                                error: 'OPPS, User does not exist!',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'OPPS, You have a problem in your request!',
                    });
                }
            } else {
                callback(403, {
                    error: 'OPPS, Authentication failed!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'OPPS, Invalid phone number!',
        });
    }
};

// DELETE Methods
handler._user.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryStringObject.phone === 'string' &&
        requestProperties.queryStringObject.phone.trim().length === 11
            ? requestProperties.queryStringObject.phone
            : false;

    if (phone) {
        // Verify Token
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                // Find user from database for delete
                data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        // Delete user
                        data.delete('users', phone, (error) => {
                            if (!error) {
                                callback(200, {
                                    message: 'User was deleted successfully!',
                                });
                            } else {
                                callback(500, {
                                    error: 'There was a problem in the server side!',
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            error: 'OPPS! User does not exist!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error: 'OPPS, Authentication failed!',
                });
            }
        });
    } else {
        callback(400, {
            message: 'OPPS! User does not exist!',
        });
    }
};

module.exports = handler;
