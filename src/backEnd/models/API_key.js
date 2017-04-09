let config = require('../config/config.js');
let mongoose = require('mongoose');


// create a schema
let API_keySchema = new mongoose.Schema({
    api_key: {type: String, required: true, unique: true},
    // email of the owner
    email: {type: String, required: true},
    // expiration in minutes
    createdAt: { type: Date, expires: config.database.API_keyExpireIn * 60 , default: Date.now },

});

API_keySchema.method('expireNow', function () {
    let timeObject = new Date();
    this.expireAt = timeObject.setTime(timeObject.getTime());
    return this;
});

//create a model
let API_key = mongoose.model('API_key', API_keySchema);

module.exports = API_key;