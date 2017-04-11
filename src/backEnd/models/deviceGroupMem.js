let mongoose = require('mongoose');


// create a schema
// schema implements a device-group membership
let deviceGroupMemSchema = new mongoose.Schema({
    deviceID: {type: String, required: true},
    groupID: {type: String, required: true},  // device group id
    created_at: {type: Date, default: Date.now},
});


//create a model
let DeviceGroupMem = mongoose.model('DeviceGroupMem', deviceGroupMemSchema);

module.exports = DeviceGroupMem;