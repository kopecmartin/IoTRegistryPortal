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
    createdAt: {type: Date, default: Date.now},
    expireAt: {type: Date, default: minutesFromNow},
});


tokenSchema.method('resetExpiration', function () {
    this.expireAt = minutesFromNow();
    return this;
});


//create a model
let Token = mongoose.model('Token', tokenSchema);

module.exports = Token;