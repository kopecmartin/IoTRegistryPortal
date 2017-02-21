let mongoose = require('mongoose');


// create a schema
let userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    meta: {
        age: Number,
        website: String
    },
    created_at: Date,
    updated_at: Date,
});

//create a model
let User = mongoose.model('User', userSchema);

module.exports = User;