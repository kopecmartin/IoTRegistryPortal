let User = require('../models/user.js');
let jwt = require('jsonwebtoken');


module.exports = function (app, _) {

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

    app.post('/auth', function (req, res) {

        let body = _.pick(req.body, 'token');
        // verifies secret and checks exp
        // TODO this command just searches for a token, doesn't matter for which user???
        // TODO use as the secret key, user's key, which was generated when the user has registered
        jwt.verify(body.token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                res.status(403).json({  // forbidden
                    success: false,
                    message: 'Failed to authenticate token.',
                });
            } else {
                res.json({success: true});
            }
        });
    });

    app.post('/logout', function (req, res) {

        // destroy token TODO

    });
};