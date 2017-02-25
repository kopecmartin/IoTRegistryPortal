let User = require('../models/user.js');
let jwt = require('jsonwebtoken');
let moment = require('moment');

// TODO in each API request check if token is valid and if the user has rights to get an response


module.exports = function (app, _) {

    app.post('/register', function (req, res) {

        console.log("register", _.pick(req, 'email', 'password'));
        let body = _.pick(req.body, 'email', 'password');

        // try find the email, if found => error
        User.find({email: body.email}, function (err, user) {
            if (err) {
                res.status(500).json({msg: "Internal error"});
            }
            else if (user.length > 0) {
                res.status(400).json({
                    msg: "User already exists. Use a different email.",
                });
            }
            else {
                // create a new user
                // TODO create a key for the user, which is gonna be used for hashing tokens
                // TODO encrypt user's password
                // TODO if time left, add support for changing this key in user's settings
                let newUser = new User({
                    email: body.email,
                    password: body.password,
                });

                // save the user
                newUser.save(function (err) {
                    if (err) {
                        res.status(500).json({msg: "Internal database error"});
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
        console.log("login data", body);    //DEBUG

        // try find user's email in the database
        User.findOne({email: body.email}, function (err, user) {
            if (err) {
                res.status(403).json({   // forbidden
                    msg: "Name or password is incorrect!"
                });
            }
            else {
                // then check the password
                // TODO decrypt password first
                if (user.password != body.password) {
                    res.status(403).json({   // forbidden
                        msg: "Name or password is incorrect!"
                    });
                }
                else {
                    // send a token and other information (settings, name of the user, ...)
                    let token = jwt.sign(user, app.get('superSecret'), {
                        expiresIn: 1800  // in seconds => expires in 30 minutes
                    });
                    res.status(200).json({
                        token: token,
                        data: "some data",
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


    app.post('/auth', function (req, res) {

        let body = _.pick(req.body, 'token');
        // verifies secret and checks exp
        // TODO this command just searches for a token, doesn't matter for which user???
        // TODO use as the secret key, user's key, which was generated when the user has registered
        jwt.verify(body.token, app.get('superSecret'), function (err, decoded) {
            if (err) {
                res.status(403).json({  // forbidden
                    success: false,
                    msg: 'Failed to authenticate token.',
                });
            } else {
                res.json({success: true});
            }
        });
    });

    app.post('/logout', function (req, res) {

        // destroy token TODO
    });


    app.post('/findUsers', function (req, res) {

    });


    app.put('/updateUser', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'password', 'name', 'firstName', 'lastName', 'age', 'gender');

        User.findOne({email: body.email}, function (err, user) {
            if (err) {
                res.status(500).json({msg: "Internal error"});
            }
            else if (!user) {
                res.status(404).json({msg: "User not found!"});
            }
            // TODO verify token ...
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
                            res.status(500).json({msg: "Internal database error!"});
                        } else {
                            res.status(200).json(user); //return the updated user object
                        }
                    });
                }
                else {
                    res.status(200).json({msg: "User is already updated."});
                }
            }
        })
    });


    // For debug purposes
    app.post('/getUsers', function (req, res) {

        User.find({}, function (err, users) {
            res.status(200).json(users);
        });
    });

};