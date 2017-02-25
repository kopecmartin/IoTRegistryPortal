let mongoose = require('mongoose');


// create a schema
// schema implements a user-group membership
let userGroupMemSchema = new mongoose.Schema({
    email: {type: String, required: true},
    groupID: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
});


//create a model
let UserGroupMem = mongoose.model('UserGroupMem', userGroupMemSchema);

module.exports = UserGroupMem;