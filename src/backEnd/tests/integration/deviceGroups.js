let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');
let requests = require('../API_test_requests.js');

let conf = require('../../config/config.js');
let DeviceGroup = require('./../../models/deviceGroup.js');


describe('Create', function () {

    let body = {
        email: "test@test.com",
        password: "secret"
    };

    let token = "";

    before(function (done) {
        request(conf.server.url)
            .post('/register')
            .send(body)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                request(conf.server.url)
                    .post('/login')
                    .send(body)
                    .end(function (err, res) {
                        if (err) {
                            throw err;
                        }
                        token = res.body.token;
                        done();
                    });
            });
    });


    it('create a new device group', function (done) {
        let body = {
            token: token,
            name: 'testName',
        };

        requests.postRequest('/deviceGroup', body, 201).then((res) => {
        }).then(done, done);
    });


    it('create a new group with existing name - error', function (done) {
        let body = {
            token: token,
            name: 'testName',
        };

        requests.postRequest('/deviceGroup', body, 400).then((res) => {
        }).then(done, done);
    });


    it('create a new group without required token - error', function (done) {

        let body = {
            name: 'testName',
        };

        requests.postRequest('/deviceGroup', body, 403).then((res) => {
        }).then(done, done);
    });
});


describe('Update - delete - find', function () {

    let data = {
        email: 'testUD@test.com',
        name: 'testNameUpdate',
    };

    let id = 0;
    let token = "";


    before(function (done) {
        let user = {
            email: 'testUD@test.com',
            password: "secret"
        };
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
                        token = res.body.token;
                        done();
                    });
            });
    });

    beforeEach(function (done) {
        data["token"] = token;
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
            token: token,
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
            token: token,
            id: mongoose.Types.ObjectId(),
            name: "newName"
        };

        requests.putRequest('/deviceGroup', body, 404).then((res) => {
        }).then(done, done);
    });


    it("update group by not the owner - error", function (done) {
        let body = {
            token: "doesNotExistToken",
            id: id,
            name: "newName"
        };

        requests.putRequest('/deviceGroup', body, 403).then((res) => {
        }).then(done, done);
    });


    it('delete the group', function (done) {
        let body = {
            token: token,
            id: id
        };

        requests.delRequest('/deviceGroup', body, 200).then((res) => {
            res.body.email.should.be.equal(data.email);
            res.body._id.should.be.equal(body.id);
        }).then(done, done);
    });


    it('delete group which does not exist - error ', function (done) {
        let body = {
            token: token,
            id: mongoose.Types.ObjectId()
        };

        requests.delRequest('/deviceGroup', body, 404).then((res) => {
        }).then(done, done);
    });


    it('delete group by not the owner - error', function (done) {
        let body = {
            token: "doesNotExistToken",
            id: id
        };

        requests.delRequest('/deviceGroup', body, 403).then((res) => {
        }).then(done, done);
    });


    it('get device groups', function (done) {
        let body = {
            token: token,
        };

        requests.postRequest('/getDeviceGroups', body, 200).then((res) => {
            res.body[0].email.should.be.equal(data.email);
            res.body[0].name.should.be.equal(data.name);
            res.body.length.should.be.equal(1);
        }).then(done, done);
    });


    it('get device groups - empty list', function (done) {
        let body = {
            token: token,
        };

        // delete existed group, so that there is no need to create another user with no
        // groups to test this functionality
        DeviceGroup.remove({email: data.email}, function () {
            requests.postRequest('/getDeviceGroups', body, 200).then((res) => {
                res.body.length.should.be.equal(0);
            }).then(done, done);
        });
    });
});





