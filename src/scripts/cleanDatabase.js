let mongoose = require('mongoose');
let Device = require('../backEnd/models/device.js');
let DeviceGroup = require('../backEnd/models/deviceGroup.js');
let User = require('../backEnd/models/user.js');
let UserGroup = require('../backEnd/models/userGroup.js');
let UserGroupMem = require('../backEnd/models/userGroupMem.js');


// Connect to the db
mongoose.connect("mongodb://localhost:33333");

Device.remove({}, function () {
    DeviceGroup.remove({}, function () {
        User.remove({}, function () {
            UserGroup.remove({}, function () {
                UserGroupMem.remove({}, function () {
                    console.log("The database was cleaned successfully!");
                    mongoose.connection.close();
                });
            });
        })
    });
});
