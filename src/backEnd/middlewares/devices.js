let API_key = require('../models/API_key.js');
let authDevice = require('../helpers/authenticateDevice.js');
let authenticateUser = require('../helpers/authenticateUser.js');
let config = require('../config/config.js');
let crypto = require("crypto");
let Device = require('./../models/device.js');
let DeviceToken = require('../models/deviceToken.js');
//let Influx = require('influx');
let getTranslation =require('../helpers/translations.js');
let messageTypes = require('../helpers/messageTypes.js');


module.exports = function (app, _) {

    app.post('/getAPIKey', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token');

        authenticateUser(body.token).then((email) => {

            let API = crypto.randomBytes(config.database.API_keyLength).toString('hex');

            let newAPI_key = new API_key({
                api_key: API,
                email: email,
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


    /**
     * Generates a new device token and creates a new DeviceToken object and returns it
     * @param deviceID - id of a device token is generated for
     */
     function generateDeviceToken (deviceID) {
        let token = crypto.randomBytes(config.database.deviceTokenLength).toString('hex');
         return new DeviceToken({
            id: deviceID,
            token: token,
        });
    }

    app.post('/device', function (req, res) {

        // retrieve information
        // TODO email in the API call is just a temporary solution, it's needed to use an API key!!!
        let body = _.pick(req.body, 'id', 'APIKey', 'ioFeatures');

        authDevice.authenticateAPIKey(body.APIKey).then((email) => {

            // let's check if the id is not already in the database
            Device.findOne({id: body.id}, function (err, device) {

                if (err) {   // TODO ... is it an external error ???
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (device) {
                    // device already exists => update ioFeatures and create a new device token
                    device.ioFeatures = body.ioFeatures;
                    device.updated_at = new Date();

                    device.save(function (err) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        } else {

                            let newDeviceToken = generateDeviceToken(body.id);

                            // save the device token
                            newDeviceToken.save(function (err) {
                                if (err) {
                                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                                }
                                else {
                                    // delete the old token associated to the device
                                    DeviceToken.remove({
                                        id: device.id,
                                        created_at: {$lt: newDeviceToken.created_at}
                                        }, function (err) {
                                        if (err) {
                                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                                        } else {
                                            // add the device token to the device object to be returned
                                            let updatedDevice = {
                                                token: newDeviceToken.token,
                                                email: device.email,
                                                id: device.id,
                                                ioFeatures: device.ioFeatures,
                                                created_at: device.created_at,
                                                updated_at: device.updated_at,
                                            };
                                            // return the updated device object with the device token
                                            res.status(200).json(updatedDevice);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {  // register a new device

                    let newDevice = new Device({
                        id: body.id,
                        email: email,
                        ioFeatures: body.ioFeatures,
                    });

                    let newDeviceToken = generateDeviceToken(body.id);

                    // save the device
                    newDevice.save(function (err) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else {
                            // save the device token

                            newDeviceToken.save(function (err) {
                                if (err) {
                                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                                }
                                else {
                                    // add the device token to the device object to be returned
                                    let newDevice = {
                                        id: body.id,
                                        email: email,
                                        ioFeatures: body.ioFeatures,
                                        token: newDeviceToken.token,
                                    };
                                    //return the newly created device object with the device token
                                    res.status(201).json(newDevice);
                                }
                            });
                        }
                    });
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.delete('/device', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'id');

        // TODO delete associated data in influx database, or not ???

        authenticateUser(body.token).then((email) => {

            Device.findOne({id: body.id}, function (err, device) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!device) {
                    res.status(404).json({msg: getTranslation(messageTypes.DEVICE_NOT_FOUND)});
                }
                else if (device.email !== email) {
                    res.status(403).json({msg: getTranslation(messageTypes.DEVICE_DEREGISTER_INFO)});
                }
                else {
                    Device.findOneAndRemove({id: body.id}, function (err, device) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else {
                            // return deleted device object
                            res.status(200).json(device);
                        }
                    });
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.put('/device', function (req, res) {
        // for now, only the owner can update the device  // TODO ?
        // retrieve information
        let body = _.pick(req.body, 'token', 'id', 'deviceGroup', 'description', 'newOwnerEmail');

        authenticateUser(body.token).then((email) => {

            Device.findOne({id:body.id}, function (err, device) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!device) {
                    res.status(404).json({msg: getTranslation(messageTypes.DEVICE_NOT_FOUND)});
                }
                else if (device.email !== email) {
                    res.status(403).json({msg: getTranslation(messageTypes.DEVICE_UPDATE_INFO)});
                }
                else {
                    if (body.deviceGroup) {
                        device.deviceGroup = body.deviceGroup;
                    }
                    if (body.description) {
                        device.description = body.description;
                    }
                    if (body.newOwnerEmail) {
                        // transfer the device to an another user
                        device.email = body.newOwnerEmail;
                    }
                    // if something were updated
                    if (body.deviceGroup || body.description || body.newOwnerEmail) {
                        device.updated_at = new Date();

                        device.save(function (err) {
                            if (err) {
                                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                            } else {
                                res.status(200).json(device); //return the updated group object
                            }
                        });
                    }
                }
            })
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.post('/findDevice', function (req, res) {

    });


    app.post('/sendValueToDevice', function (req, res) {

    });


    // used by devices
    app.post('/publishValue', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'id');  // TODO what kind of data will device send???

        authDevice.authenticateDevice(body.token, body.id).then((id) => {


            }, (errCode) => {
            res.status(403).json({});
        });
    });
};