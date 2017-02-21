let mongoose = require('mongoose');
let User = require('../backEnd/models/user.js');


// Connect to the db
mongoose.connect("mongodb://localhost:33333");

// create a new user
let newUser = User({
    name: 'Root',
    email: 'root@root.com',
    password: 'secret',
});

// save the user
newUser.save(function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Root user has been created!');

    console.log("Database initiated successfully!");
    mongoose.connection.close()
});
