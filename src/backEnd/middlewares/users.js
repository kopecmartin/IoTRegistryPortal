let authenticateUser = require('../helpers/authenticateUser.js');
let config = require('../config/config.js');
let crypto = require("crypto");
let getTranslation = require('../helpers/translations.js');
let messageTypes = require('../helpers/messageTypes.js');
let moment = require('moment');
let Token = require('../models/token.js');
let User = require('../models/user.js');


module.exports = function (app, _) {

    app.post('/register', function (req, res) {

        let body = _.pick(req.body, 'email', 'password');

        // try find the email, if found => error
        User.find({email: body.email}, function (err, user) {
            if (err) {
                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
            }
            else if (user.length > 0) {
                res.status(400).json({
                    msg: getTranslation(messageTypes.USER_ALREADY_REGISTERED),
                });
            }
            else {
                // create a new user
                // TODO create a key for the user, which is gonna be used for hashing passwords
                // TODO encrypt user's password
                // TODO if time left, add support for changing this key in user's settings
                let newUser = new User({
                    email: body.email,
                    password: body.password,
                });

                // save the user
                newUser.save(function (err) {
                    if (err) {
                        res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                    }
                    else {
                        // return the newly created object
                        res.status(201).json(newUser);
                    }
                });
            }
        })
    });


    app.post('/login', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'password');

        // try find user's email in the database
        User.findOne({email: body.email}, function (err, user) {
            if (err) {
                res.status(403).json({   // forbidden
                    msg: getTranslation(messageTypes.NAME_PASSWORD_INCORRECT)
                });
            }
            else if (!user) {
                res.status(403).json({   // forbidden
                    msg: getTranslation(messageTypes.NAME_PASSWORD_INCORRECT)
                });
            }
            else {
                // then check the password
                // TODO decrypt password first
                if (user.email !== body.email || user.password !== body.password) {
                    res.status(403).json({   // forbidden
                        msg: getTranslation(messageTypes.NAME_PASSWORD_INCORRECT)
                    });
                }
                else {
                    let token = crypto.randomBytes(config.database.tokenLength).toString('hex');
                    let newToken = new Token({
                        email: user.email,
                        token: token,
                    });

                    newToken.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        } else {
                            res.status(200).json({
                                token: token,
                                data: "some data",
                            });
                        }
                    });
                }
            }
        });
    });


    app.post('/login/facebook', function (req, res) {

    });


    app.post('/login/github', function (req, res) {

    });


    app.post('/login/google', function (req, res) {

    });

    app.post('/logout', function (req, res) {

        let body = _.pick(req.body, 'token');
        console.log("token", body);

        authenticateUser(body.token).then((email) => {
            Token.remove({token: body.token}, function (err) {
                res.status(200).json({msg: getTranslation(messageTypes.USER_LOGOUT)});
            });
        }, (errCode) => {
            res.status(403).json({});
        });

    });


    app.post('/findUsers', function (req, res) {

    });


    app.put('/updateUser', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'password', 'name', 'firstName', 'lastName', 'age', 'gender');

        authenticateUser(body.token).then((email) => {

            User.findOne({email: email}, function (err, user) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!user) {
                    res.status(404).json({msg: getTranslation(messageTypes.USER_NOT_FOUND)});
                }
                else {
                    //user.email = body.email;  // TODO support a change of email??
                    if (body.name) {
                        user.name = body.name;
                    }
                    if (body.password) {
                        user.password = body.password;  // TODO hash passwords
                    }
                    if (body.firstName) {
                        user.meta.firstName = body.firstName;
                    }
                    if (body.lastName) {
                        user.meta.lastName = body.lastName;
                    }
                    if (body.age) {
                        user.meta.age = body.age;
                    }
                    if (body.gender) {
                        user.meta.gender = body.gender;
                    }
                    // if something was updated
                    if (body.name || body.password || body.firstName || body.lastName || body.age || body.gender) {
                        user.updated_at = new Date();
                        user.save(function (err) {
                            if (err) {
                                res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                            } else {
                                res.status(200).json(user); //return the updated user object
                            }
                        });
                    }
                    else {
                        res.status(200).json({msg: getTranslation(messageTypes.USER_ALREADY_UPDATED)});
                    }
                }
            });
        }, (errCode) => {
            res.status(403).json({});
        });
    });


    // For debug purposes
    app.post('/getUsers', function (req, res) {

        User.find({}, function (err, users) {
            res.status(200).json(users);
        });
    });

};