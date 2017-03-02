let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');

let conf = require('../../../config.js');
let Device = require('./../../models/deviceGroup.js');


it('create a new device', function (done) {
    let data = {
        id: "4D5D7sdf546c5DFioD6sd54",  // TODO, for now, there is no validation for device's ID
        email: 'test@test.com',
        // TODO, for now ioFeatures are not exactly specified, but it's gonna be an object
        ioFeatures: {
            input: "value",
            output: {
                key1: "value1",
                key2: "value2",
            }
        },
    };

    request(conf.server.url)
        .post('/device')
        .send(data)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            res.status.should.be.equal(201);
            res.body.email.should.be.equal(data.email);
            res.body.id.should.be.equal(data.id);
            done();
        });
});


it('create a new device with existing id - update ioFeatures', function (done) {
    let data = {
        id: "4D5D7sdf546c5DFioD6sd54",
        email: 'test@test.com',
        ioFeatures: {
            input: "valueNew",
            output: {
                key1: "value1New",
                key2: "value2New",
            }
        },
    };

    request(conf.server.url)
        .post('/device')
        .send(data)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            res.status.should.be.equal(200);
            res.body.email.should.be.equal(data.email);
            res.body.id.should.be.equal(data.id);
            res.body.ioFeatures.input.should.be.equal(data.ioFeatures.input);
            res.body.ioFeatures.output.key1.should.be.equal(data.ioFeatures.output.key1);
            done();
        });
});


describe('Update - delete - find', function () {

    let data = {
        id: "FF5D7sdf546c5DFioD6sd55",
        email: 'testUD@test.com',
    };

    beforeEach(function (done) {
        request(conf.server.url)
            .post('/device')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                done();
            });
    });

    afterEach(function (done) {
        Device.remove({email: data.email}, function () {
            done();
        });
    });



    it('deregister a device', function (done) {

        request(conf.server.url)
            .del('/device')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(204);
                res.body.email.should.be.equal(data.email);
                res.body.id.should.be.equal(data.id);
                done();
            });
    });


    it('deregister a device by not the owner', function (done) {

        request(conf.server.url)
            .del('/device')
            .send({
                id: data.id,
                email: "notOwner@mail.com"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(403);
                done();
            });
    });


    it('deregister a device which is not in the database', function (done) {

        request(conf.server.url)
            .del('/device')
            .send({
                id: "NotInTheDatabase"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(404);
                done();
            });
    });


    it('update device', function (done) {

        let description = "description";
        let group = "group";

        request(conf.server.url)
            .put('/device')
            .send({
                id: data.id,
                email: data.email,
                description: description,
                deviceGroup: group
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.email.should.be.equal(data.email);
                res.body.id.should.be.equal(data.id);
                res.body.description.should.be.equal(description);
                res.body.deviceGroup.should.be.equal(group);
                res.body.updated_at.should.not.be.equal(res.body.created_at);
                done();
            });
    });


    it('transfer device to another user', function (done) {

        let newOwnerEmail = "new@owner.com";

        request(conf.server.url)
            .put('/device')
            .send({
                id: data.id,
                email: data.email,
                newOwnerEmail: newOwnerEmail
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.email.should.be.equal(newOwnerEmail);
                res.body.id.should.be.equal(data.id);
                done();
            });
    });


    it('update a device by not the owner', function (done) {

        request(conf.server.url)
            .put('/device')
            .send({
                id: data.id,
                email: "notOwner@mail.com"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(403);
                done();
            });
    });


    it('update a device which is not in the database', function (done) {

        request(conf.server.url)
            .put('/device')
            .send({
                id: "notInTheDatabase"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(404);
                done();
            });
    });

});





