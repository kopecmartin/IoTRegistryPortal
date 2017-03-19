let Device = require('./../models/device.js');
let getTranslation =require('../helpers/translations.js');
let messageTypes = require('../helpers/messageTypes.js');


module.exports = function (app, _) {

    app.post('/device', function (req, res) {

        // retrieve information
        // TODO email in the API call is just a temporary solution, it's needed to use an API key!!!
        let body = _.pick(req.body, 'id', 'email', 'ioFeatures');

        // let's check if the id is not already in the database
        Device.findOne({id: body.id}, function (err, device) {
            if (err) {   // TODO ... is it an external error ???
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else if (device) {  // device already exists => update ioFeatures
                device.ioFeatures = body.ioFeatures;
                device.updated_at = new Date();

                device.save(function (err) {
                    if (err) {
                        res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                    } else {
                        res.status(200).json(device); //return the updated device object
                    }
                });
            }
            else {  // register a new device
                let newDevice = new Device({
                    id: body.id,
                    email: body.email,
                    ioFeatures: body.ioFeatures,
                });

                // save the device
                newDevice.save(function (err) {
                    if (err) {
                        res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                    }
                    else {
                        //return the newly created device object
                        res.status(201).json(newDevice);
                    }
                });
            }
        });
    });


    app.delete('/device', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'id');

        // TODO delete associated data in influx database, or not ???

        Device.findOne({id: body.id}, function (err, device) {
            if (err) {
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else if (!device) {
                res.status(404).json({msg: getTranslation(messageTypes.DEVICE_NOT_FOUND)});
            }
            else if (device.email != body.email) {
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
        })
    });


    app.put('/device', function (req, res) {
        // for now, only the owner can update the device  // TODO ?
        // retrieve information
        let body = _.pick(req.body, 'email', 'id', 'deviceGroup', 'description', 'newOwnerEmail');

        Device.findOne({id:body.id}, function (err, device) {
            if (err) {
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else if (!device) {
                res.status(404).json({msg: getTranslation(messageTypes.DEVICE_NOT_FOUND)});
            }
            else if (device.email != body.email) {
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
    });


    app.post('/findDevice', function (req, res) {

    });


    app.post('/sendValueToDevice', function (req, res) {

    });


    // used by devices
    app.post('/publishValue', function (req, res) {

    });
};