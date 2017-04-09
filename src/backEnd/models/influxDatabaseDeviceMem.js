let mongoose = require('mongoose');


// create a schema
// schema implements a device-influxDB membership
let influxDatabaseDeviceMem = new mongoose.Schema({
    id: {type: String, required: true, unique: true},  // unique device ID
    influxDatabaseID: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
});


//create a model
let InfluxDatabaseDeviceMem = mongoose.model('InfluxDatabaseDeviceMem', influxDatabaseDeviceMem);

module.exports = InfluxDatabaseDeviceMem;