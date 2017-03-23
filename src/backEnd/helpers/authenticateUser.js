let Token = require('../models/token.js');


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
               resolve(tokenRecord[0].email);
            }
        });
    });
};

module.exports = authenticateUser;