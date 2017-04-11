let mongoose = require('mongoose');


// create a schema
let userGroupSchema = new mongoose.Schema({
    // TODO check email validity
    email: {type: String, required: true},  // email of the owner
    name: {type: String, required: true},
    description: String,
    path: {type: String, default: "/"},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

//create a model
let UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = UserGroup;