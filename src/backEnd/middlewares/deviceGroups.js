let authenticateUser = require('../helpers/authenticateUser.js');
let Device = require('./../models/device.js');
let DeviceGroup = require('./../models/deviceGroup.js');
let DeviceGroupMem = require('./../models/deviceGroupMem.js');
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
                        parentID: null,     // TODO parent ID
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
        // TODO parent ID
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



     app.post('/deviceGroupMember', function (req, res) {

         // retrieve information
         let body = _.pick(req.body, "token", "deviceID", "groupID");

         authenticateUser(body.token).then((email) => {
             // find the device
             Device.findOne({id: body.deviceID}, function (err, device) {
                 if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                 }
                 else if (!device) {
                    res.status(404).json({msg: getTranslation(messageTypes.DEVICE_NOT_FOUND)});
                 }
                 // TODO check permissions to the device
                 else {
                     // find the group
                     DeviceGroup.findById(body.groupID, function (err, group) {
                         if (err) {
                             res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                         }
                         else if (!group) {
                             res.status(404).json({msg: getTranslation(messageTypes.GROUP_NOT_FOUND)});
                         }
                         // TODO check permissions to the group
                         else {
                             let deviceGroupMem = new DeviceGroupMem({
                                 deviceID: device.id,
                                 groupID: group._id,
                             });

                             deviceGroupMem.save(function (err) {
                                 if (err) {
                                     res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                                 }
                                 else {
                                     // return the newly created member object
                                     res.status(201).json(deviceGroupMem);
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


    app.delete('/deviceGroupMember', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, "token", "deviceID", "groupID");

        authenticateUser(body.token).then((email) => {
            // find the device
            Device.findOne({id: body.deviceID}, function (err, device) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!device) {
                    res.status(404).json({msg: getTranslation(messageTypes.DEVICE_NOT_FOUND)});
                }
                // TODO check permissions to the device
                else {
                    // find the group
                    DeviceGroup.findById(body.groupID, function (err, group) {
                        if (err) {
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else if (!group) {
                            res.status(404).json({msg: getTranslation(messageTypes.GROUP_NOT_FOUND)});
                        }
                        // TODO check permissions to the group
                        else {

                            DeviceGroupMem.findOneAndRemove({
                                deviceID: body.deviceID,
                                groupID: body.groupID,
                            }, function (err, membership) {
                                if (err) {
                                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                                }
                                else {
                                    // return deleted membership object
                                    res.status(200).json(membership);
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


    /**
     * Returns a list of devices.
     * @param body - object of required information (groupID)
     * @returns {Promise}
     */
    function getDeviceGroupMembers (body) {

        return new Promise((resolve, reject) => {
            // let's get a list of objects where IDs belongs to members of the group specified by gropupID
            DeviceGroupMem.find({groupID: body.groupID}, 'email', function (err, IDs) {
                if (err) {
                    reject(500)
                }
                else {
                    let arrDevices = [];
                    for (let i = 0; i < IDs.length; i++) {
                        arrDevices.push(IDs[i].email);
                    }

                    Device.find({id: {$in: arrDevices}}, function (err, devices) {
                        if (err) {
                            reject(500)
                        }
                        else if (!devices) {
                            reject(404)
                        }
                        // TODO check permissions
                        else {
                            // return a list of devices
                            resolve(arrDevices)
                        }
                    });
                }
            });
        });
    }


    app.post('/getDeviceGroupMembers', function (req, res) {

         // retrieve information
         let body = _.pick(req.body, "token", "groupID");

         authenticateUser(body.token).then((email) => {

             getDeviceGroupMembers(body).then((devices) => {
                 res.status(200).json(devices);
             }, (errCode) => {
                 switch (errCode) {
                     case 500:
                         res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                         break;
                     case 404:
                         res.status(404).json({msg: getTranslation(messageTypes.DEVICE_NOT_FOUND)});
                         break;
                     //case 403:
                     //    res.status(403).json(
                     //        //TODO true/false?
                     //        {msg: getTranslation(messageTypes.USER_GROUP_ACCESS_MEMBER_LIST_INFO)}
                     //    );
                 }
             });
         }, (errCode) => {
             res.status(403).json({});
         });
     });


    // For debug purposes
    app.post('/getDeviceGroups', function (req, res) {

        DeviceGroup.find({}, function (err, groups) {
            console.log(groups);
            res.status(200).json(groups);
        });
    });
};