let Token = require('../models/token.js');

/**
 * Find the owner of the token. If success, returns owner's email,
 * otherwise returns error number 403 (forbidden)
 * @param token
 * @returns {Promise}
 */
const authenticateUser = function (token) {

    return new Promise((resolve, reject) => {

        Token.find({token: token}, function (err, tokenRecord) {

            if (err) {
                console.log(err);
                reject(500);
            }
            else if (tokenRecord.length !== 1) {
                reject(403);  // forbidden
            }
            else {
                // update expiration date
                tokenRecord[0].resetExpiration();
                resolve(tokenRecord[0].email);
            }
        });
    });
};

module.exports = authenticateUser;