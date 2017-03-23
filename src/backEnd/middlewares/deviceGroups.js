let authenticateUser = require('../helpers/authenticateUser.js');
let DeviceGroup = require('./../models/deviceGroup.js');
let getTranslation = require('../helpers/translations.js');
let messageTypes = require('../helpers/messageTypes.js');


module.exports = function (app, _) {

    app.post('/deviceGroup', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'name', 'description', 'path');

        authenticateUser(body.token).then((email) => {

            // check if the user doesn't have already a group with the name
            DeviceGroup.find({email: email, name: body.name}, function (err, groups) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (groups.length > 0) {
                    res.status(400).json({msg: getTranslation(messageTypes.GROUP_ALREADY_EXISTS)});
                }
                else {
                    // create a new group
                    let newGroup = DeviceGroup({
                        email: email,
                        name: body.name,
                        description: body.description,
                        path: body.path,
                    });

                    // save the group
                    newGroup.save(function (err) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        } else {
                            res.status(201).json(newGroup); //return the newly created group object
                        }
                    });
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.put('/deviceGroup', function (req, res) {
        // for now, only the owner can update the group  // TODO ?
        // retrieve information
        let body = _.pick(req.body, 'token', 'id', 'name', 'description', 'path');

        authenticateUser(body.token).then((email) => {

            DeviceGroup.findById(body.id, function (err, group) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!group) {
                    res.status(404).json({msg: getTranslation(messageTypes.GROUP_NOT_FOUND)});
                }
                else if (group.email !== email) {
                    res.status(403).json({msg: getTranslation(messageTypes.GROUP_UPDATE_INFO)});
                }
                else {
                    //group.email = body.email;  // TODO support transfer ownership of the group to another user???
                    if (body.name) {
                        group.name = body.name;
                    }
                    if (body.description) {
                        group.description = body.description;
                    }
                    if (body.path) {
                        group.path = body.path;
                    }
                    // if something was updated
                    if (body.name || body.description || body.path) {
                        group.updated_at = new Date();

                        group.save(function (err) {
                            if (err) {
                                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                            } else {
                                res.status(200).json(group); //return the updated group object
                            }
                        });
                    }
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.delete('/deviceGroup', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'id');

        authenticateUser(body.token).then((email) => {

            DeviceGroup.findById(body.id, function (err, group) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!group) {
                    res.status(404).json({msg: getTranslation(messageTypes.GROUP_NOT_FOUND)});
                }
                else if (group.email !== email) {
                    res.status(403).json({msg: getTranslation(messageTypes.GROUP_DELETE_INFO)});
                }
                else {
                    // TODO check if the group contains devices, if so, move them to / group

                    DeviceGroup.findByIdAndRemove(body.id, function (err, group) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else {
                            res.status(200).json(group);
                        }
                    });
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.post('/getDeviceGroups', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, "token");

        authenticateUser(body.token).then((email) => {

            DeviceGroup.find({email: email}, function (err, groups) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else {
                    res.status(200).json(groups);
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    /*
     app.post('/addDeviceToGroup', function (req, res) {
     // not needed!!, update device is enough!!
     });


     app.post('/removeDeviceFromGroup', function (req, res) {
     // not needed!!, update device is enough!!
     });


     app.post('/getDevicesInGroup', function (req, res) {
     // not needed!!, update device is enough!!
     });
     */

    // For debug purposes
    app.post('/getDeviceGroups', function (req, res) {

        DeviceGroup.find({}, function (err, groups) {
            console.log(groups);
            res.status(200).json(groups);
        });
    });
};