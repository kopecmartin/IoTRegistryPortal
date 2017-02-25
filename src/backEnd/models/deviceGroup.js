let mongoose = require('mongoose');


// create a schema
let deviceGroupSchema = new mongoose.Schema({
    // TODO check email validity
    email: {type: String, required: true},  //email of the group owner
    name: {type: String, required: true},
    description: String,
    path: {type: String, default: "/"},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

//create a model
let DeviceGroup = mongoose.model('DeviceGroup', deviceGroupSchema);

module.exports = DeviceGroup;