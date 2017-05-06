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

// attach socket.io to Node.js HTTP server
let http = require('http').Server(app);
let io = require('socket.io')(http);

// online devices
// TODO: for now this structure is enough, but if much bigger amount of devices is connected, it's needed to use
// TODO:  a different structure with faster speed of accessibility
let onlineDevices = {};

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(cors());

// use morgan for request debug output
app.use(morgan('dev'));

require('./backEnd/middlewares/API_keys.js')(app, _);
require('./backEnd/middlewares/devices.js')(app, _);
require('./backEnd/middlewares/deviceGroups.js')(app, _);
require('./backEnd/middlewares/influxDatabases.js')(app, _);
require('./backEnd/middlewares/users.js')(app, _);
require('./backEnd/middlewares/userGroups.js')(app, _);
require('./backEnd/middlewares/socialNetRegistration.js')(app, _);

require('./backEnd/middlewares/socketComm.js')(app, io, _, onlineDevices);

// Connect to the db
mongoose.connect(conf.database.url, function (err) {  //TODO move address to a config?
    if (err) {
        console.log("Couldn't connect to the database!");
        console.log(err);
        return;
    }

    console.log("Connection to the database was made successfully.");

    http.listen(PORT, function () {
        console.log('Express listening on port ' + PORT + '!');
    });
});
