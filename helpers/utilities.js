/*
 * Title: Utilites Helper
 * Description: All Important Utilities function or methods
 * Author: Limon Rana
 * Date: 10/03/2021
 *
 */

// Dependencies
const crypto = require('crypto');
const envConfig = require('./environments');

// Module scaffolding
const utilities = {};

// Parse JSON string to object
utilities.parseJSON = (jsonData) => {
    let output;

    try {
        output = JSON.parse(jsonData);
    } catch {
        output = {};
    }
    return output;
};

// HASH string
utilities.hash = (strData) => {
    if (typeof strData === 'string' && strData.length > 0) {
        const hash = crypto.createHmac('sha256', envConfig.secretKey).update(strData).digest('hex');
        return hash;
    }
    return false;
};

// Create random string
utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const rand = Math.random() * possibleCharacters.length;
            const randomCharacter = possibleCharacters.charAt(Math.floor(rand));
            output += randomCharacter;
        }
        return output;
    }
    return false;
};

// Export module
module.exports = utilities;
