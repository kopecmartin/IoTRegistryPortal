let mongoose = require('mongoose');


// create a schema
let influxDatabaseSchema = new mongoose.Schema({
    email: {type: String, required: true},  // email of the owner
    name: {type: String, required: true},
    description: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

//create a model
let InfluxDatabase = mongoose.model('InfluxDatabase', influxDatabaseSchema);

module.exports = InfluxDatabase;