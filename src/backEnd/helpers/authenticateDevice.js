let DeviceToken = require('../models/deviceToken.js');
let API_key = require('../models/API_key.js');

/**
 * Find the device id related to the token. If provided ID matches the found one,
 * returns device ID, otherwise returns error number 403 (forbidden)
 * @param token - unique device token
 * @param deviceID - unique device ID
 * @returns {Promise}
 */
const authenticateDevice = function (token, deviceID) {

    return new Promise((resolve, reject) => {

        DeviceToken.find({token: token}, function (err, tokenRecord) {

            if (err) {
                console.log(err);
                reject(500);
            }
            else if (tokenRecord.length !== 1) {
                reject(403);  // forbidden
            }
            else if (tokenRecord.id !== deviceID) {     // TODO ?
                reject(403);  // forbidden
            }
            else {
                resolve(tokenRecord[0].id);
            }
        });
    });
};


/**
 * Finds the owner of the API key and returns his email
 * Note: API is generated only for device registration process
 * and it's valid for only limited period of time
 * Note: As soon as it's used, it expires
 * @param API
 * @returns {Promise}
 */
const authenticateAPIKey = function (API) {

    return new Promise((resolve, reject) => {

        API_key.find({api_key: API}, function (err, API_Record) {

            if (err) {
                console.log(err);
                reject(500);
            }
            else if (API_Record.length !== 1) {
                reject(403);  // forbidden
            }
            else {
                // API verified, now delete the API key
                API_Record[0].expireNow();
                resolve(API_Record[0].email);  // return user's email
            }
        });
    });
};

exports.authenticateDevice = authenticateDevice;
exports.authenticateAPIKey = authenticateAPIKey;