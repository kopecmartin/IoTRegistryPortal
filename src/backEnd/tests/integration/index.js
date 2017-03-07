let mongoose = require('mongoose');
let conf = require('../../../config.js');
let Device = require('../../models/device.js');
let DeviceGroup = require('./../../models/deviceGroup.js');
let User = require('../../models/user.js');
let UserGroup = require('../../models/userGroup.js');


describe('Testing Middleware', function () {

    before(function (done) {
        mongoose.connect(conf.database.url);

        Device.remove({}, function () {
            DeviceGroup.remove({}, function () {
                User.remove({}, function () {
                    UserGroup.remove({}, function () {
                        done();
                    });
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

    describe('UserGroups', function () {
        require('./userGroups.js');
    });

});