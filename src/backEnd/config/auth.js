let config = require('./config.js');


module.exports = {

    'facebookAuth' : {

    },

    'gitHubAuth' : {

    },

    'googleAuth' : {
        'clientID'      : 'clientID',
        'clientSecret'  : 'secret',
        'callbackURL'   : 'http://' + config.server.url + '/auth/google/callback',
    }

};