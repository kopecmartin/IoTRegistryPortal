let mongoose = require('mongoose');
let conf = require('../../../config.js');
let Device = require('../../models/device.js');
let DeviceGroup = require('./../../models/deviceGroup.js');
let User = require('../../models/user.js');


describe('Testing Middleware', function () {

    before(function (done) {
        mongoose.connect(conf.database.url);

        Device.remove({}, function () {
            DeviceGroup.remove({}, function () {
                User.remove({}, function () {
                    done();
                })
            });
        });
    });


    describe('Devices', function () {
        require('./devices.js');
    });

    describe('DeviceGroups', function () {
        require('./deviceGroups.js');
    });

    describe('Users', function () {
        require('./users.js');
    });

});