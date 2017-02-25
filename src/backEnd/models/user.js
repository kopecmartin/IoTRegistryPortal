let mongoose = require('mongoose');


// create a schema
let userSchema = new mongoose.Schema({
    // TODO check email validity
    email: { type: String, required: true, unique: true },
    // TODO set minimum length of a password
    password: { type: String, required: true },
    name: String,
    meta: {
        firstName: String,
        lastName: String,
        age: Number,
        gender: String,
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

//create a model
let User = mongoose.model('User', userSchema);

module.exports = User;