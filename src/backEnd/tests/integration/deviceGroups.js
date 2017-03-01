let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');

let conf = require('../../../config.js');
let DeviceGroup = require('./../../models/deviceGroup.js');


it('create a new device group', function (done) {
    let data = {
        email: 'test@test.com',
        name: 'testName',
    };

    request(conf.server.url)
        .post('/deviceGroup')
        .send(data)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            res.status.should.be.equal(201);
            done();
        });
});


it('should return error, create a new group with existing name', function (done) {
    let data = {
        email: 'test@test.com',
        name: 'testName',
    };

    request(conf.server.url)
        .post('/deviceGroup')
        .send(data)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            res.status.should.be.equal(400);
            done();
        });
});


it('should return error, create a new group without required email', function (done) {
    let data = {
        name: 'testName',
    };

    request(conf.server.url)
        .post('/deviceGroup')
        .send(data)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            res.status.should.be.equal(500);
            done();
        });
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
        DeviceGroup.remove({email: 'testUD@test.com'}, function () {
            done();
        });
    });


    it("update group's name", function (done) {

        request(conf.server.url)
            .put('/deviceGroup')
            .send({
                email: data.email,
                id: id,
                name: "newName"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.name.should.be.equal("newName");
                res.body.updated_at.should.not.equal(res.body.created_at);
                done();
            });
    });


    it("update group which doesn't exist - error", function (done) {

        request(conf.server.url)
            .put('/deviceGroup')
            .send({
                email: data.email,
                id:  mongoose.Types.ObjectId(),
                name: "newName"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(404);
                done();
            });
    });


    it("update group by not the owner - error", function (done) {

        request(conf.server.url)
            .put('/deviceGroup')
            .send({
                email: "doesNotExist@mail.com",
                id:  id,
                name: "newName"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(403);
                done();
            });
    });


    it('delete the group', function (done) {

        request(conf.server.url)
            .del('/deviceGroup')
            .send({
                email: data.email,
                id: id
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(204);
                done();
            });
    });


    it('delete group which does not exist - error ', function (done) {

        request(conf.server.url)
            .del('/deviceGroup')
            .send({
                email: data.email,
                id:  mongoose.Types.ObjectId()
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(404);
                done();
            });
    });


    it('delete group by not the owner - error', function (done) {

        request(conf.server.url)
            .del('/deviceGroup')
            .send({
                email: "doesNotExist@mail.com",
                id: id
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(403);
                done();
            });
    });


    it('get device groups', function (done) {

        request(conf.server.url)
            .post('/getDeviceGroups')
            .send({
                email: data.email
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body[0].email.should.be.equal(data.email);
                res.body[0].name.should.be.equal(data.name);
                res.body.length.should.be.equal(1);
                done();
            });
    });

    it('get device groups - empty list', function (done) {

        request(conf.server.url)
            .post('/getDeviceGroups')
            .send({
                email: "doesNotExist@mail.com"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.length.should.be.equal(0);
                done();
            });
    });
});





