let User = require('../models/user.js');


module.exports = function (app, _) {

    app.post('/login', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'email', 'password');
        console.log("login data", body);    //DEBUG

        // try find user's email in the database
        User.find({email: body.email}, function (err, user) {
            if (err) {
                res.status(404).json({
                    msg: "Name or password is incorrect!"
                });
            }
            else {
                // then check the password
                if (user[0].password === body.password) {
                    // send a token and other information (settings, name of the user, ...)
                    // TODO: create token
                    res.status(200).json({
                        token: "token",
                        data: "some data",
                    });
                }
                else {
                    res.status(404).json({  //TODO: find out the right return number
                        msg: "Name or password is incorrect!"
                    });
                }
            }
        });
    });

    app.post('/logout', function (req, res) {

        // destroy token TODO

    });
};