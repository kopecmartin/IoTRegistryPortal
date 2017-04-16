let config = require('../config/config.js');
let mongoose = require('mongoose');


const minutesFromNow = function(){
    let timeObject = new Date();
    timeObject.setTime(timeObject.getTime() +  config.database.API_keyExpireIn * 60);
    return timeObject;
};


// create a schema
let API_keySchema = new mongoose.Schema({
    api_key: {type: String, required: true, unique: true},
    // email of the owner
    email: {type: String, required: true},
    // database name where device will send information to
    // it's temporarily saved here, so that API key is the only information
    // a user has to deliver to a device to register it
    databaseName: {type: String, required: true},
    // expiration in minutes
    ttl: {type: Number, default: config.database.API_keyExpireIn * 60},
    createdAt: {type: Date, default: Date.now},
    expireAt: {type: Date, default: minutesFromNow},
});


API_keySchema.method('expireNow', function () {
    let timeObject = new Date();
    this.expireAt = timeObject.setTime(timeObject.getTime());
    return this;
});


API_keySchema.method('resetExpiration', function () {
    this.expireAt = minutesFromNow();
    return this;
});


//create a model
let API_key = mongoose.model('API_key', API_keySchema);

module.exports = API_key;