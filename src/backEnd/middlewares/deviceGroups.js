let DeviceGroup = require('./../models/deviceGroup.js');
let getTranslation =require('../helpers/translations.js');
let messageTypes = require('../helpers/messageTypes.js');

// TODO in each API request check if token is valid and if the user has rights to get an response


module.exports = function (app, _) {

    app.post('/deviceGroup', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'name', 'description', 'path');

        // check if the user doesn't have already a group with the name
        DeviceGroup.find({email: body.email, name: body.name}, function (err, groups) {
            if (err) {
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else if (groups.length > 0) {
                res.status(400).json({msg: getTranslation(messageTypes.GROUP_ALREADY_EXISTS)});
            }
            else {
                // create a new group
                let newGroup = DeviceGroup({
                    email: body.email,
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
    });


    app.put('/deviceGroup', function (req, res) {
        // for now, only the owner can update the group  // TODO ?
        // retrieve information
        let body = _.pick(req.body, 'email', 'id', 'name', 'description', 'path');

        DeviceGroup.findById(body.id, function (err, group) {
            if (err) {
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else if (!group) {
                res.status(404).json({msg: getTranslation(messageTypes.GROUP_NOT_FOUND)});
            }
            else if (group.email != body.email) {
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
        })
    });


    app.delete('/deviceGroup', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'id');

        DeviceGroup.findById(body.id, function (err, group) {
            if (err) {
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else if (!group) {
                res.status(404).json({msg: getTranslation(messageTypes.GROUP_NOT_FOUND)});
            }
            else if (group.email != body.email) {
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
    });


    app.post('/getDeviceGroups', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, "email");

        DeviceGroup.find({email: body.email}, function (err, groups) {
            if (err) {
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else {
                res.status(200).json(groups);
            }
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