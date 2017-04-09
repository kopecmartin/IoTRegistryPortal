let mongoose = require('mongoose');
let conf = require('../../config/config.js');
let Api_key = require('../../models/API_key.js');
let Device = require('../../models/device.js');
let DeviceGroup = require('./../../models/deviceGroup.js');
let InfluxDatabase = require('./../../models/influxDatabase.js');
let InfluxDatabaseMem = require('./../../models/influxDatabaseDeviceMem.js');
let User = require('../../models/user.js');
let UserGroup = require('../../models/userGroup.js');
let UserGroupMem = require('../../models/userGroupMem.js');
let Token = require('../../models/token.js');


describe('Testing Middleware', function () {

    before(function (done) {
        mongoose.connect(conf.database.url);

        Device.remove({}, function () {
            DeviceGroup.remove({}, function () {
                User.remove({}, function () {
                    UserGroup.remove({}, function () {
                        UserGroupMem.remove({}, function () {
                            Token.remove({}, function () {
                                Api_key.remove({}, function () {
                                    InfluxDatabase.remove({}, function () {
                                        InfluxDatabaseMem.remove({}, function () {
                                            done();
                                        });
                                    });
                                });
                            });
                        });
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