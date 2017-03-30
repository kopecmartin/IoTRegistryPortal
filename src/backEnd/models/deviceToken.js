let mongoose = require('mongoose');


// create a schema
let tokenSchema = new mongoose.Schema({
    id: {type: String, required: true},  // device id
    token: {type: String, required: true, unique: true},
    created_at: {type: Date, default: Date.now},
});

//create a model
let DeviceToken = mongoose.model('DeviceToken', tokenSchema);

module.exports = DeviceToken;