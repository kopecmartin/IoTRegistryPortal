let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');
let requests = require('../API_test_requests.js');

let conf = require('../../config/config.js');
let DeviceGroup = require('./../../models/deviceGroup.js');


it('create a new device group', function (done) {
    let body = {
        email: 'test@test.com',
        name: 'testName',
    };

    requests.postRequest('/deviceGroup', body, 201).then((res) => {
    }).then(done, done);
});


it('create a new group with existing name - error', function (done) {
    let body = {
        email: 'test@test.com',
        name: 'testName',
    };

    requests.postRequest('/deviceGroup', body, 400).then((res) => {
    }).then(done, done);
});


it('create a new group without required email - error', function (done) {

    let body = {
        name: 'testName',
    };

    requests.postRequest('/deviceGroup', body, 500).then((res) => {
    }).then(done, done);
});


describe('Update - delete - find', function () {

    let data = DeviceGroup({
        email: 'testUD@test.com',
        name: 'testNameUpdate',
    });
    let id = 0;

    beforeEach(function (done) {
        request(conf.server.url)
            .post('/deviceGroup')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                id = res.body._id;
                done();
            });
    });

    afterEach(function (done) {
        DeviceGroup.remove({email: data.email}, function () {
            done();
        });
    });


    it("update group's name", function (done) {

        let body = {
            email: data.email,
            id: id,
            name: "newName"
        };

        requests.putRequest('/deviceGroup', body, 200).then((res) => {
            res.body.name.should.be.equal("newName");
            res.body.updated_at.should.not.equal(res.body.created_at);
        }).then(done, done);
    });


    it("update group which doesn't exist - error", function (done) {

        let body = {
            email: data.email,
            id:  mongoose.Types.ObjectId(),
            name: "newName"
        };

        requests.putRequest('/deviceGroup', body, 404).then((res) => {
        }).then(done, done);
    });


    it("update group by not the owner - error", function (done) {
        let body = {
            email: "doesNotExist@mail.com",
            id:  id,
            name: "newName"
        };

        requests.putRequest('/deviceGroup', body, 403).then((res) => {
        }).then(done, done);
    });


    it('delete the group', function (done) {
        let body = {
            email: data.email,
            id: id
        };

        requests.delRequest('/deviceGroup', body, 200).then((res) => {
            res.body.email.should.be.equal(body.email);
            res.body._id.should.be.equal(body.id);
        }).then(done, done);
    });


    it('delete group which does not exist - error ', function (done) {
        let body = {
            email: data.email,
            id:  mongoose.Types.ObjectId()
        };

        requests.delRequest('/deviceGroup', body, 404).then((res) => {
        }).then(done, done);
    });


    it('delete group by not the owner - error', function (done) {
        let body = {
            email: "doesNotExist@mail.com",
            id: id
        };

        requests.delRequest('/deviceGroup', body, 403).then((res) => {
        }).then(done, done);
    });


    it('get device groups', function (done) {
        let body = {
            email: data.email
        };

        requests.postRequest('/getDeviceGroups', body, 200).then((res) => {
            res.body[0].email.should.be.equal(data.email);
            res.body[0].name.should.be.equal(data.name);
            res.body.length.should.be.equal(1);
        }).then(done, done);
    });

    it('get device groups - empty list', function (done) {
        let body = {
            email: "doesNotExist@mail.com"
        };

        requests.postRequest('/getDeviceGroups', body, 200).then((res) => {
            res.body.length.should.be.equal(0);
        }).then(done, done);
    });
});





