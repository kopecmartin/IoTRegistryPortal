let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');
let requests = require('../API_test_requests.js');

let conf = require('../../config/config.js');
let API_key = require('../../models/API_key.js');
let Device = require('./../../models/deviceGroup.js');
let DeviceToken = require('./../../models/deviceToken.js');
let InfluxDatabase = require('./../../models/influxDatabase.js');
let InfluxDatabaseMem = require('./../../models/influxDatabaseDeviceMem.js');
let Token = require('./../../models/token.js');
let User = require('../../models/user');


describe('-- Create a new device --', function () {

    let data = {
        email: "testUser2@mail.com",
        password: "secret",
        databaseName: "testInfluxDB",
    };
    let deviceID = "4D5D7sdf546c5DFioD6sd54"; // TODO, for now, there is no validation for device's ID
    let APIKey = "";

    beforeEach(function (done) {
        request(conf.server.url)
            .post('/register')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                request(conf.server.url)
                    .post('/login')
                    .send(data)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        let token = res.body.token;

                        request(conf.server.url)
                            .post('/APIKey')
                            .send({token: token})
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                APIKey = res.body.api_key;

                                // create an influx DB
                                request(conf.server.url)
                                    .post('/createInfluxDB')
                                    .send({
                                        token: token,
                                        name: data.databaseName,
                                    })
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }
                                        // TODO check response
                                        done();
                                    });
                            });
                    });
            });
    });

    afterEach(function (done) {
        API_key.remove({}, function () {
            Device.remove({email: data.email}, function () {
                User.remove({email: data.email}, function () {
                    Token.remove({email: data.email}, function () {
                        DeviceToken.remove({}, function () {
                            InfluxDatabase.remove({email: data.email}, function () {
                                InfluxDatabaseMem.remove({}, function () {
                                    // delete data in influx DB too
                                    requests.dropInfluxDB({name: data.databaseName}).then((res) => {

                                    }).then(done, done);
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('create a new device', function (done) {
        let body = {
            id: deviceID,
            email: data.email,
            APIKey: APIKey,
            databaseName: data.databaseName,
            // TODO, for now ioFeatures are not exactly specified, but it's gonna be an object for sure
            ioFeatures: {
                input: "value",
                output: {
                    key1: "value1",
                    key2: "value2",
                }
            },
        };

        requests.postRequest('/device', body, 201).then((res) => {
            res.body.email.should.be.equal(body.email);
            res.body.id.should.be.equal(body.id);
            // reason why token length is doubled is explained in the config file
            res.body.token.length.should.be.equal(conf.database.deviceTokenLength*2);
        }).then(done, done);
    });


    it('create a new device with existing id - update ioFeatures', function (done) {
        let body = {
            id: deviceID,
            email: data.email,
            APIKey: APIKey,
            ioFeatures: {
                input: "valueNew",
                output: {
                    key1: "value1New",
                    key2: "value2New",
                }
            },
        };

        requests.postRequest('/device', body, 200).then((res) => {

            res.body.email.should.be.equal(body.email);
            res.body.id.should.be.equal(body.id);
            res.body.ioFeatures.input.should.be.equal(body.ioFeatures.input);
            res.body.ioFeatures.output.key1.should.be.equal(body.ioFeatures.output.key1);
            // reason why token length is doubled is explained in the config file
            res.body.token.length.should.be.equal(conf.database.deviceTokenLength * 2);
            // check if new token will be generated and the old one removed
            let token = res.body.token;
            requests.postRequest('/device', body, 200).then((res) => {
                res.body.token.should.not.be.equal(token);
                DeviceToken.find({}, function (err, tokens) {
                    tokens.length.should.be.equal(1);
                    tokens[0].token.should.be.equal(res.body.token);
                })
            }).then(done, done);
        });
    });
});


describe('Update - delete - find', function () {

    let user = {
        email: "testUser2@mail.com",
        password: "secret",
        databaseName: "testInfluxDB",
    };
    let dev = {
        id: "FF5D7sdf546c5DFioD6sd55",
        ioFeatures: {
            input: "value",
            output: {
                key1: "value1",
                key2: "value2",
            }
        }
    };

    let userToken = "";
    let devToken = "";
    let APIKey = "";

    beforeEach(function (done) {
        request(conf.server.url)
            .post('/register')
            .send(user)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                request(conf.server.url)
                    .post('/login')
                    .send(user)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        userToken = res.body.token;

                        request(conf.server.url)
                            .post('/APIKey')
                            .send({token: userToken})
                            .end(function (err, res) {
                                if (err) {
                                    throw err;
                                }
                                APIKey = res.body.api_key;

                                // create an influx DB
                                request(conf.server.url)
                                    .post('/createInfluxDB')
                                    .send({
                                        token: userToken,
                                        name: user.databaseName,
                                    })
                                    .end(function (err, res) {
                                        if (err) {
                                            throw err;
                                        }

                                        request(conf.server.url)
                                            .post('/device')
                                            .send({
                                                id: dev.id,
                                                APIKey: APIKey,
                                                databaseName: user.databaseName,
                                                ioFeatures: dev.ioFeatures,
                                            })
                                            .end(function (err, res) {
                                                if (err) {
                                                    throw err;
                                                }
                                                devToken = res.body.token;
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });

    afterEach(function (done) {
        API_key.remove({}, function () {
            Device.remove({email: user.email}, function () {
                User.remove({email: user.email}, function () {
                    Token.remove({email: user.email}, function () {
                        DeviceToken.remove({}, function () {
                            InfluxDatabase.remove({email: user.email}, function () {
                                InfluxDatabaseMem.remove({}, function () {
                                    // delete data in influx DB too
                                    requests.dropInfluxDB({name: user.databaseName}).then((res) => {

                                    }).then(done, done);
                                });
                            });
                        });
                    });
                });
            });
        });
    });


    it('deregister a device', function (done) {
        let body = {
            token: userToken,
            id: dev.id,
        };

        requests.delRequest('/device', body, 200).then((res) => {
            res.body.email.should.be.equal(user.email);
            res.body.id.should.be.equal(dev.id);
        }).then(done, done);
    });


    it('deregister a device by not the owner', function (done) {
        let body = {
            token: "notOwnerToken",
            id: dev.id,
        };

        requests.delRequest('/device', body, 403).then((res) => {
        }).then(done, done);
    });


    it('deregister a device which is not in the database', function (done) {
        let body = {
            token: userToken,
            id: "NotInTheDatabase"
        };

        requests.delRequest('/device', body, 404).then((res) => {
        }).then(done, done);
    });


    it('update a device', function (done) {
        let description = "description";

        let body = {
            token: userToken,
            id: dev.id,
            description: description,
        };

        requests.putRequest('/device', body, 200).then((res) => {
            res.body.email.should.be.equal(user.email);
            res.body.id.should.be.equal(body.id);
            res.body.description.should.be.equal(description);
            res.body.updated_at.should.not.be.equal(res.body.created_at);
        }).then(done, done);
    });


    it('transfer device to another user', function (done) {

        let newOwnerEmail = "new@owner.com";

        let body = {
            token: userToken,
            id: dev.id,
            newOwnerEmail: newOwnerEmail
        };

        requests.putRequest('/device', body, 200).then((res) => {
            res.body.email.should.be.equal(newOwnerEmail);
            res.body.id.should.be.equal(body.id);
        }).then(done, done);
    });


    it('update a device by not the owner', function (done) {
        let body = {
            token: "notOwnerToken",
            id: dev.id,
        };

        requests.putRequest('/device', body, 403).then((res) => {
        }).then(done, done);
    });


    it('update a device which is not in the database', function (done) {
        let body = {
            token: userToken,
            id: "notInTheDatabase"
        };

        requests.putRequest('/device', body, 404).then((res) => {
        }).then(done, done);
    });

});





