let express = require('express');
let _ = require('underscore');
let bodyParser = require('body-parser');
let cors = require('cors');     //allows cross-origin HTTP requests
let mongoose = require('mongoose');
let morgan = require('morgan');

// import config
let conf = require('./backEnd/config/config.js');

//let PORT = process.env.PORT || 3000;
let PORT = conf.server.port;
let app = express();

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(cors());

// use morgan for request debug output
app.use(morgan('dev'));

// set secret variable used to create tokens
app.set('superSecret', 'too_secret!');  // TODO use users' keys

require('./backEnd/middlewares/devices.js')(app, _);
require('./backEnd/middlewares/deviceGroups.js')(app, _);
require('./backEnd/middlewares/users.js')(app, _);
require('./backEnd/middlewares/userGroups.js')(app, _);


// Connect to the db
mongoose.connect(conf.database.url, function (err) {  //TODO move address to a config?
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
