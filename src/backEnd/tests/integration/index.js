let mongoose = require('mongoose');
let conf = require('../../../config.js');
let DeviceGroup = require('./../../models/deviceGroup.js');


describe('Testing Middleware', function () {

    before(function (done) {
        mongoose.connect(conf.database.url);

        DeviceGroup.remove({}, function () {
            done();
        });
    });


    describe('DeviceGroups', function () {
        require('./deviceGroups.js');
    });


});