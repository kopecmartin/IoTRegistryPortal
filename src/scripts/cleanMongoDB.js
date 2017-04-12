let mongoose = require('mongoose');
let API_key = require('../backEnd/models/API_key.js');
let Device = require('../backEnd/models/device.js');
let DeviceGroup = require('../backEnd/models/deviceGroup.js');
let DeviceGroupMem = require('../backEnd/models/deviceGroupMem.js');
let DeviceToken = require('../backEnd/models/deviceToken.js');
let InfluxDatabase = require('../backEnd/models/influxDatabase.js');
let InfluxDatabaseMem = require('../backEnd/models/influxDatabaseDeviceMem.js');
let User = require('../backEnd/models/user.js');
let UserGroup = require('../backEnd/models/userGroup.js');
let UserGroupMem = require('../backEnd/models/userGroupMem.js');
let Token = require('../backEnd/models/token.js');


// Connect to the db
mongoose.connect("mongodb://localhost:33333");

API_key.remove({}, function () {
    Device.remove({}, function () {
        DeviceGroup.remove({}, function () {
            DeviceGroupMem.remove({}, function () {
                DeviceToken.remove({}, function () {
                    User.remove({}, function () {
                        UserGroup.remove({}, function () {
                            UserGroupMem.remove({}, function () {
                                Token.remove({}, function () {
                                    InfluxDatabase.remove({}, function () {
                                        InfluxDatabaseMem.remove({}, function () {
                                            console.log("The database was cleaned successfully!");
                                            mongoose.connection.close();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});