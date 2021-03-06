let mongoose = require('mongoose');


// create a schema
let deviceSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},  // unique device ID
    email: {type: String, required: true},  // email of the owner
    description: String,
    ioFeatures: Object,    // device will provide a json description of its input and output features
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

//create a model
let Device = mongoose.model('Device', deviceSchema);

module.exports = Device;