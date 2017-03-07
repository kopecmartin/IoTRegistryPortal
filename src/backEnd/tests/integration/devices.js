let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');
let requests = require('../API_test_requests.js');

let conf = require('../../../config.js');
let Device = require('./../../models/deviceGroup.js');


it('create a new device', function (done) {
    let body = {
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

    requests.postRequest('/device', body, 201).then((res) => {
        res.body.email.should.be.equal(body.email);
        res.body.id.should.be.equal(body.id);
    }).then(done, done);
});


it('create a new device with existing id - update ioFeatures', function (done) {
    let body = {
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

    requests.postRequest('/device', body, 200).then((res) => {
        res.body.email.should.be.equal(body.email);
        res.body.id.should.be.equal(body.id);
        res.body.ioFeatures.input.should.be.equal(body.ioFeatures.input);
        res.body.ioFeatures.output.key1.should.be.equal(body.ioFeatures.output.key1);
    }).then(done, done);
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


/*
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
*/

    it('deregister a device by not the owner', function (done) {
        let body = {
            id: data.id,
            email: "notOwner@mail.com"
        };

        requests.delRequest('/device', body, 403).then((res) => {
        }).then(done, done);
    });


    it('deregister a device which is not in the database', function (done) {
        let body = {
            id: "NotInTheDatabase"
        };

        requests.delRequest('/device', body, 404).then((res) => {
        }).then(done, done);
    });


    it('update device', function (done) {
        let description = "description";
        let group = "group";

        let body = {
            id: data.id,
            email: data.email,
            description: description,
            deviceGroup: group
        };

        requests.putRequest('/device', body, 200).then((res) => {
            res.body.email.should.be.equal(data.email);
            res.body.id.should.be.equal(data.id);
            res.body.description.should.be.equal(description);
            res.body.deviceGroup.should.be.equal(group);
            res.body.updated_at.should.not.be.equal(res.body.created_at);
        }).then(done, done);
    });


    it('transfer device to another user', function (done) {

        let newOwnerEmail = "new@owner.com";

        let body = {
            id: data.id,
            email: data.email,
            newOwnerEmail: newOwnerEmail
        };

        requests.putRequest('/device', body, 200).then((res) => {
            res.body.email.should.be.equal(newOwnerEmail);
            res.body.id.should.be.equal(data.id);
        }).then(done, done);
    });


    it('update a device by not the owner', function (done) {
        let body = {
            id: data.id,
            email: "notOwner@mail.com"
        };

        requests.putRequest('/device', body, 403).then((res) => {
        }).then(done, done);
    });


    it('update a device which is not in the database', function (done) {
        let body = {
            id: "notInTheDatabase"
        };

        requests.putRequest('/device', body, 404).then((res) => {
        }).then(done, done);
    });

});





