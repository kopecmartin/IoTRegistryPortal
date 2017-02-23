let express = require('express');
let _ = require('underscore');
let bodyParser = require('body-parser');
//let cors = require('cors');     //allows cross-origin HTTP requests
let mongoose = require('mongoose');
let morgan = require('morgan');

let PORT = process.env.PORT || 3000;
let app = express();

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
//app.use(cors());

// use morgan for request debug output
app.use(morgan('dev'));

// set secret variable used to create tokens
app.set('superSecret', 'too_secret!');  // TODO use users' keys


require('./backEnd/middlewares/login_logut.js')(app, _);
require('./backEnd/middlewares/register.js')(app, _);


// Connect to the db
mongoose.connect("mongodb://localhost:33333", function (err) {
    if (err) {
        console.log("Couldn't connect to the database!");
        console.log(err);
        return;
    }

    console.log("Connection to the database was made successfully.");

    app.listen(PORT, function () {
        console.log('Express listening on port ' + PORT + '!');
    });
});
