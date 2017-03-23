let mongoose = require('mongoose');
let conf = require('../config/config.js');


const minutesFromNow = function(){
    let timeObject = new Date();
    timeObject.setTime(timeObject.getTime() +  conf.database.tokenExpireIn * 1000 * 60);
    return timeObject;
};


// create a schema
let tokenSchema = new mongoose.Schema({
    email: {type: String, required: true},
    token: {type: String, required: true, unique: true},
    created_at: {type: Date, default: Date.now},
    expire_at: {type: Date, default: minutesFromNow},
});

//create a model
let Token = mongoose.model('Token', tokenSchema);

module.exports = Token;