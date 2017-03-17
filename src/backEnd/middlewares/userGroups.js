let User = require('../models/user.js');
let UserGroup = require('../models/userGroup.js');
let UserGroupMem = require('../models/userGroupMem.js');


// TODO in each API request check if token is valid and if the user has rights to get an response

module.exports = function (app, _) {

    app.post('/userGroup', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'name', 'description', 'permissions', 'path');

        // check if the user doesn't have already a group with the name
        UserGroup.find({email: body.email, name: body.name}, function (err, groups) {
            if (err) {
                res.status(500).json({msg: "Internal database error"});
            }
            else if (groups.length > 0) {
                res.status(400).json({msg: "A user group with the name already exists!"});
            }
            // TODO check if the user exists ???
            else {
                // create a new group
                let newGroup = new UserGroup({
                    email: body.email,
                    name: body.name,
                    description: body.description,
                    permissions: body.permissions,
                    path: body.path,
                });

                // save the group
                newGroup.save(function (err) {
                    if (err) {
                        res.status(500).json({msg: "Internal database error"});
                    } else {
                        res.status(201).json(newGroup); //return the newly created group object
                    }
                });
            }
        });
    });


    app.put('/userGroup', function (req, res) {
        // for now, only the owner can update the group  // TODO ?
        // retrieve information
        let body = _.pick(req.body, 'email', 'id', 'name', 'description', 'permissions', 'path');

        UserGroup.findById(body.id, function (err, group) {
            if (err) {
                res.status(500).json({msg: "Internal error!"});
            }
            else if (!group) {
                res.status(404).json({msg: "Group not found!"});
            }
            else if (group.email != body.email) {
                res.status(403).json({msg: "Only the owner can update the user group!"});
            }
            else {
                //group.email = body.email;  // TODO support transfer ownership of the group to an another user???
                if (body.name) {
                    group.name = body.name;
                }
                if (body.description) {
                    group.description = body.description;
                }
                if (body.permissions) {
                    group.permissions = body.permissions;
                }
                if (body.path) {
                    group.path = body.path;
                }
                // if something was updated
                if (body.name || body.description || body.permissions || body.path) {
                    group.updated_at = new Date();

                    group.save(function (err) {
                        if (err) {
                            res.status(500).json({msg: "Internal database error"});
                        } else {
                            res.status(200).json(group); //return the updated group object
                        }
                    });
                }
                else {
                    res.status(200).json(group);
                }
            }
        })
    });


    app.delete('/userGroup', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'id');

        UserGroup.findById(body.id, function (err, group) {
            if (err) {
                res.status(500).json({msg: "Internal error!"});
            }
            else if (!group) {
                res.status(404).json({msg: "Group not found!"});
            }
            else if (group.email != body.email) {
                res.status(403).json({msg: "Only the group owner can delete it"});
            }
            else {
                // if there are any members of the group, end their membership
                UserGroupMem.remove({groupID: body.id}, function (err) {
                    if (err) {
                        res.status(404).json({msg: "Group not found!"});
                    }
                    else {
                        // delete the group
                        UserGroup.findByIdAndRemove(body.id, function (err, group) {
                            if (err) {
                                res.status(500).json({msg: "Internal error!"});
                            }
                            else {
                                res.status(200).json(group)
                            }
                        })
                    }
                });
            }
        });
    });


    app.post('/getGroupsByOwnership', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email');

        UserGroup.find({email: body.email}, function (err, groups) {
            if (err) {
                res.status(500).json({msg: "Internal database error"});
            }
            else {
                res.status(200).json(groups);
            }
        });
    });


    app.post('/userGroupMember', function (req, res) {
        // for now, only the owner of the group can add a new member // TODO
        // retrieve information
        let body = _.pick(req.body, 'email', 'id', 'memberEmail');

        // check if the requester is the owner
        UserGroup.findById(body.id, function (err, group) {
            if (err) {
                res.status(500).json({msg: "Internal database error."});
            }
            else if (!group) {
                res.status(404).json({msg: "No such a group!"})
            }
            else if (group.email != body.email) {
                res.status(403).json({msg: "Only the group owner can add a new member!"});
            }
            else {
                // check if the potential new member exists/is registered as an user
                User.findOne({email: body.memberEmail}, function (err, user) {
                    if (err) {
                        res.status(500).json({msg: "Internal database error."});
                    }
                    else if (!user) {
                        res.status(404).json({msg: "User does not exist!"});
                    }
                    else {
                        // user exists, now check current members of the group
                        UserGroupMem.find({email: body.memberEmail, groupID: body.id}, function (err, groups) {
                            if (err) {
                                res.status(500).json({msg: "Internal database error."});
                            }
                            else if (groups.length > 0) {
                                res.status(400).json({msg: "The member already exists!"});
                            }
                            else {
                                // add a new member
                                let newGroupMem = new UserGroupMem({
                                    email: body.memberEmail,
                                    groupID: body.id,
                                });

                                // save the group
                                newGroupMem.save(function (err) {
                                    if (err) {
                                        res.status(500).json({msg: "Internal database error."});
                                    } else {
                                        //return the newly created user group membership object
                                        res.status(201).json(newGroupMem);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });


    app.delete('/userGroupMember', function (req, res) {
        // for now, only the owner of the group can remove a member // TODO
        // retrieve information
        let body = _.pick(req.body, 'email', 'id', 'memberEmail');

        // check if requester is the owner
        UserGroup.findById(body.id, function (err, group) {
            if (err) {
                res.status(500).json({msg: "Internal database error"});
            }
            else if (!group) {
                res.status(404).json({msg: "Group does not exist!"});
            }
            else if (group.email != body.email) {
                res.status(403).json({msg: "Only the group owner can remove a member!"});
            }
            else {
                // remove the member
                UserGroupMem.findOneAndRemove({email: body.memberEmail, groupID: body.id}, function (err, removed) {
                    if (err) {
                        res.status(500).json({msg: "Internal database error"});
                    }
                    else {
                        // return deleted object
                        res.status(200).json(removed);
                    }
                });
            }
        });
    });


    app.post('/getGroupsByMembership', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email');

        // let's get list of objects where ID belongs to the group the user is member of
        UserGroupMem.find({email: body.email}, 'groupID', function (err, IDs) {
            if (err) {
                res.status(500).json({msg: "Internal database error"});
            }
            else {
                // get groupID our from objects to list => so create list of IDs
                let arrIDs = [];
                for (let i = 0; i < IDs.length; i++) {
                    arrIDs.push(IDs[i].groupID);
                }
                // let's get list of group objects
                UserGroup.find({ '_id': {$in: arrIDs}}, function (err, groups) {
                    if (err) {
                        res.status(500).json({msg: "Internal database error"});
                    }
                    else {
                        res.status(200).json(groups);
                    }
                });
            }
        });
    });


    app.post('/getUserGroupMembers', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'id');  // requester's email and id of the group

        // let's get a list of objects where emails belongs to members of the group specified by id
        UserGroupMem.find({groupID: body.id}, 'email', function (err, emails) {
            if (err) {
                res.status(500).json({msg: "Internal database error"});
            }
            else {
                let arrEmails = [];
                for (let i = 0; i < emails.length; i++) {
                    arrEmails.push(emails[i].email);
                }

                UserGroup.findById(body.id, function (err, group) {
                    if (err) {
                        res.status(500).json({msg: "Internal database error"});
                    }
                    else if (!group) {
                        res.status(404).json({msg: "No such a group!"});
                    }
                    // check if the requester is the owner or a member
                    else if (group.email != body.email && arrEmails.indexOf(body.email) === -1) {
                        //"_id": "58b2ef0bd184e92c30273f66",
                        res.status(403).json(
                            //TODO true/false?
                            {msg: "Only a member or the owner can access list of others in the group!"}
                        );
                    }
                    else {
                        // return a list of members' emails
                        res.status(200).json(arrEmails);
                    }
                });
            }
        });
    });


};