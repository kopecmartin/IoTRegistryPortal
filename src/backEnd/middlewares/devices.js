let API_key = require('../models/API_key.js');
let authDevice = require('../helpers/authenticateDevice.js');
let authenticateUser = require('../helpers/authenticateUser.js');
let config = require('../config/config.js');
let crypto = require("crypto");
let Device = require('./../models/device.js');
let DeviceToken = require('../models/deviceToken.js');
let getTranslation =require('../helpers/translations.js');
let Influx = require('influx');
let InfluxDatabase = require('../models/influxDatabase.js');
let InfluxDatabaseDeviceMem = require('./../models/influxDatabaseDeviceMem.js');
let messageTypes = require('../helpers/messageTypes.js');
let request = require('request');


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
     * Generates a new device token and returns a new DeviceToken object
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
        // TODO suggestion: add one more argument, where can be specified device schema (ioFeatures description)
        // TODO suggestion:  by user, for devices which can't send this information or it would be easier for a user
        // TODO suggestion: use influx database address specified by user => add one more argument to _.pick(),
        // TODO suggestion:  if so, use this user's address to the device object in MongoDB
        // TODO suggestion: databaseName could be an array - if it would be wanted, a device can publish values
        // TODO suggestion:  in multiple databases
        let body = _.pick(req.body, 'id', 'APIKey', 'hostname', 'databaseName', 'ioFeatures');

        authDevice.authenticateAPIKey(body.APIKey).then((email) => {

            // let's check if the id is not already in the database
            Device.findOne({id: body.id}, function (err, device) {

                if (err) {   // TODO ... is it an external error ???
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (device) {
                    // device already exists => update ioFeatures and create a new device token
                    device.ioFeatures = body.ioFeatures;
                    // TODO: maybe update a hostname too?
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
                                                hostname: device.hostname,
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
                        hostname: body.hostname,
                        ioFeatures: body.ioFeatures,  // it's actually database schema
                    });

                    // save the device
                    newDevice.save(function (err) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else {
                            // find the influx database device will send information to
                            InfluxDatabase.findOne({name: body.databaseName}, function (err, DB) {
                                console.log("not even here? ", err, DB);
                                if (err) {
                                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                                }
                                else if (!DB) {
                                    res.status(404).json({msg: getTranslation(messageTypes.DATABASE_NOT_FOUND)});
                                }
                                // only the owner of the database can register a new device to publish its values there
                                else if (DB.email !== email) {
                                    res.status(403).json({msg: getTranslation(messageTypes.ACCESS_DENIED)});
                                }
                                else {

                                    // create a new InfluxDevice membership object
                                    let newDeviceDBMem = new InfluxDatabaseDeviceMem({
                                        id: body.id,
                                        influxDatabaseID: DB.name,
                                    });

                                    // create the new Membership - device <-> influxDB
                                    newDeviceDBMem.save(function (err) {
                                        if (err) {
                                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                                        }
                                        else {
                                            // create a new device token
                                            let newDeviceToken = generateDeviceToken(body.id);
                                            // save the device token
                                            newDeviceToken.save(function (err) {
                                                if (err) {
                                                    res.status(500).json({
                                                        msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)
                                                    });
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


    // ------ communication with devices ------
    // TODO implement it through sockets - socket.io


    app.post('/sendValueToDevice', function (req, res) {

    });


    // used by devices
    app.post('/publishValue', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'id', 'ioFeatures');  // device will send json in ioFeatures

        authDevice.authenticateDevice(body.token, body.id).then((id) => {
            

        }, (errCode) => {
            res.status(403).json({});
        });
    });
};