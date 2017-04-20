let API_key = require('../models/API_key.js');
let authenticateUser = require('../helpers/authenticateUser.js');
let config = require('../config/config.js');
let crypto = require("crypto");
let getTranslation = require('../helpers/translations.js');
let messageTypes = require('../helpers/messageTypes.js');
let request = require('request');


module.exports = function (app, _) {

    app.post('/APIKey', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'databaseName');

        authenticateUser(body.token).then((email) => {

            let API = crypto.randomBytes(config.database.API_keyLength).toString('hex');

            let newAPI_key = new API_key({
                api_key: API,
                email: email,
                databaseName: body.databaseName,
            });

            // save the API key
            newAPI_key.save(function (err) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else {
                    //return the newly created API_key object
                    res.status(201).json(newAPI_key);
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.put("/APIKey", function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'api_key', 'databaseName');

        authenticateUser(body.token).then((email) => {

            API_key.findOne({api_key: body.api_key}, function (err, key) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!key) {
                    res.status(403).json({msg: getTranslation(messageTypes.ACCESS_DENIED)});
                }
                else if (key.email !== email) {
                    res.status(403).json({msg: getTranslation(messageTypes.ACCESS_DENIED)});
                }
                else {
                    // extends expiration interval
                    key.resetExpiration();

                    // update database name if it's changed
                    if (body.databaseName !== key.databaseName) {
                        key.databaseName = body.databaseName;
                    }

                    // save the API key
                    key.save(function (err) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else {
                            //return the updated API_key object
                            res.status(201).json(key);
                        }
                    });
                }
            });

        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.delete("/APIKey", function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'api_key');

        authenticateUser(body.token).then((email) => {

            // find the API key
            API_key.findOne({api_key: body.api_key}, function (err, key) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (key.email !== email) {
                    res.status(403).json({msg: getTranslation(messageTypes.ACCESS_DENIED)});
                }
                else {
                    // remove the key
                    API_key.remove({api_key: body.api_key, email: email}, function (err, removed) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else {
                            // return the deleted object
                            res.status(200).json(removed);
                        }
                    });
                }

            });
        }, (errCode) => {
            res.status(403).json({});
        });

    });

};