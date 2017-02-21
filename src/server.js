let express = require('express');
let _ = require('underscore');
let bodyParser = require('body-parser');
//let cors = require('cors');     //allows cross-origin HTTP requests
let mongoose = require('mongoose');

let PORT = process.env.PORT || 3000;
let app = express();

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
//app.use(cors());


require('./backEnd/middlewares/login_logut.js')(app, _);
require('./backEnd/middlewares/register.js')(app, _);


//var morgan = require('morgan');
//app.use(morgan('combined'));

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
