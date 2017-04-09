let authDevice = require('../helpers/authenticateDevice.js');
let authenticateUser = require('../helpers/authenticateUser.js');
let DeviceToken = require('../models/deviceToken.js');
let Influx = require('influx');
let InfluxDatabase = require('../models/influxDatabase.js');
let InfluxDatabaseDeviceMem = require('../models/influxDatabaseDeviceMem.js');


module.exports = function (app, io, _, onlineDevices) {

    io.on('connection', function(socket){

        // register a new online device
        console.log("new device is online: ", socket.handshake.query.token); // debug
        onlineDevices[socket.handshake.query.token] = socket;

        /**
         * Socket listener devices can publish values through. Function handles the authentication
         * of a device (checks if its token is still valid) and passing the data to an appropriate
         * Influx database.
         * @param body - object which contains device token, its ID, its input and output schema
         * @example: body object example:
         * {
         *     token: <token>,
         *     id: <id>,
         *     ioFeatures: {
         *         input: {
         *             refreshTime: Number,  // interval between updates (new data) are sent
         *             monitoring: Boolean,  // turn on/of collecting of data
         *             ...
         *         },
         *         output: {
         *             [
         *                  // influx like schema which defines type of data to be collected/measured
         *                  // it's an Array, a device may measure multiple measurements (temperature, pressure, ...)
         *                  // if a device doesn't do more measurements, it doesn't have to be an Array but in that case
         *                  // it would be converted to an Array because of the influx needs (?)
         *                 {
         *                      measurement: 'temperature',  // name of a measurement
         *                      // TODO IMPORTANT: check if fields can contain nested structures
         *                      fields: {
         *                          // influx like definition
         *                          unit: Influx.FieldType.STRING,  // celsius? fahrenheit ?
         *                          value: Influx.FieldType.INTEGER
         *                      },
         *                      tags: [
         *                          // custom tags associated with the measurement
         *                          // device describes here what tags for measurement it uses
         *                          'host',  // e.g. hostname of a device under which data in the database can be identified
         *                          ...
         *                      ],
         *                  },
         *                  ...  // next measurements definition
         *             ]
         *         },
         *         values: [
         *              // it's an Array
         *              // measured values from one or multiple definitions
         *
         *              measurement: 'temperature_room_1',
         *              fields: {
         *                  unit: 'Celsius',
         *                  value: 22
         *              },
         *              tags: {
         *                  host: 'thermometer_1_room_1,
         *                  ... // more tags if were specified in schema
         *              }
         *         ]
         *     }
         * }
         */
        socket.on('publishValue', function(body) {

            authDevice.authenticateDevice(body.token, body.id).then((id) => {

                // device output schema needs to be an Array, if it's not, convert it to an Array ??
                // NOTE: array can be useful, when a device can publish values for more measurements
                /*
                 let outputSchema = null;
                if (body.ioFeatures.output.constructor === Array) {
                    outputSchema = body.ioFeatures.output;
                }
                else {
                    outputSchema = [body.ioFeatures.output];
                }
                */

                InfluxDatabaseDeviceMem.findOne({id: id}, function(err, device) {
                    if (err) {
                        // TODO use some kind of logging here?
                        console.log("Internal server error");
                        console.log(err);
                    }
                    else if (!device) {
                        // TODO send something back? it shouldn't happen, when a device is authenticated it means
                        // TODO  it has token, which means it was registered, which means, it belongs to a database,
                        // TODO  because creating a relationship between device and a database is required there
                        console.log('Should not happen :D'); // just temporary debug output
                    }
                    else {
                        // let's find name of the device where data will be stored
                        InfluxDatabase.findById(device.influxDatabaseID, function (err, DB) {
                            if (err) {
                                // TODO use some kind of logging here?
                                console.log("Internal server error");
                                console.log(err);
                            }
                            else {
                                // create an influx object
                                const influx = new Influx.InfluxDB({
                                    // TODO use address from conf
                                    // TODO suggestion: if custom address is defined in device MongoDB, use that one ??
                                    host: 'localhost',
                                    // name of the database where the data will be stored is defined in the device object
                                    // when the device is registered
                                    database: DB.name,
                                    schema: body.ioFeatures.output,
                                });

                                console.log("writing values", body.ioFeatures.values); //debug

                                influx.writePoints(body.ioFeatures.values);
                            }
                        });

                    }
                });

            }, (errCode) => {
                res.status(403).json({});
            });
        });

        socket.on('disconnect', function(message) {
            console.log("A device has disconnected!", socket.handshake.query.token); // debug
            // delete device from online devices structure
            delete onlineDevices[socket.handshake.query.token];
        });
    });


    app.post('/sendValueToDevice', function (req, res) {
        // retrieve information
        let body = _.pick(req.body, 'token', 'id', 'data');

        authenticateUser(body.token).then((email) => {

            // TODO do a magic here and check if the user who requested this operation has permissions
            // TODO  to send something to the device

            // find token which belongs to device with id
            DeviceToken.findById(body.id, function (err, tokenRecord) {
                if (err) {
                    // TODO use some kind of logging here?
                    console.log("Internal server error");
                    console.log(err);
                }
                else {
                    // get socket of the device
                    let deviceSocket = onlineDevices[tokenRecord.token];
                    // TODO NOTE: it's really important to create a standard in communication
                    // TODO NOTE: so let's assume the device listens on socket 'input'
                    // TODO NOTE: also let's assume that the data is created according to device input schema
                    // send the data
                    deviceSocket.emit("input", body.data);
                }
            })

        }, (errCode) => {
            res.status(403).json({});
        });
    });
};