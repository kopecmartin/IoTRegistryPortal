let User = require('../models/user.js');
let moment = require('moment');


module.exports = function(app, _) {

    app.post('/register', function (req, res) {

        console.log("register");
        let body = _.pick(req, 'email', 'password');

        // try find the email, if found => error
        User.find({email: body.email}, function (err, user) {
            if (err) {
                console.log(err);
                res.status(400).json({    // TODO return value
                    msg: "Internal error",
                });
            }
            else if (user.length > 0) {
                res.status(404).json({
                    msg: "User already exists. Use a different email.",
                });
            }
            else {
                // create a new user
                let newUser = User({
                    email: body.email,
                    password: body.password,
                    created_at: new Date(),
                    updated_at: new Date(),
                });

                // save the user
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        })
    });

    app.post('/register/facebook', function (req, res) {

    });

    app.post('/register/github', function (req, res) {

    });

    app.post('/register/google', function (req, res) {

    });

};