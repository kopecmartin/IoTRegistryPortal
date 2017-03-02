let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');

let conf = require('../../../config.js');
let Device = require('./../../models/deviceGroup.js');


it('register a new user', function (done) {
    let data = {
        email: "test@test.mail",
        password: "password",
    };

    request(conf.server.url)
        .post('/register')
        .send(data)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            res.status.should.be.equal(201);
            res.body.email.should.be.equal(data.email);
            res.body.password.should.be.equal(data.password);
            done();
        });
});


it('register a new user with the same email', function (done) {
    let data = {
        email: "test@test.mail",
        password: "password",
    };

    request(conf.server.url)
        .post('/register')
        .send(data)
        .end(function (err, res) {
            if (err) {
                throw err;
            }
            res.status.should.be.equal(400);
            done();
        });
});


describe('Login', function () {

    let data = {
        email: "test2@test.mail",
        password: "password",
    };

    beforeEach(function (done) {
        request(conf.server.url)
            .post('/register')
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


    it('login', function (done) {

        request(conf.server.url)
            .post('/login')
            .send(data)
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.token.should.exist;
                done();
            });
    });


    it('login - wrong password', function (done) {

        request(conf.server.url)
            .post('/login')
            .send({
                email: data.email,
                password: "wrong"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(403);
                done();
            });
    });


    it('login - not registered user', function (done) {

        request(conf.server.url)
            .post('/login')
            .send({
                email: "notRegistered@mail.com",
                password: "password"
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(403);
                done();
            });
    });


    it('update user', function (done) {

        let newInfo = {
            name: "Name",
            password: "newOne",
            firstName: "first",
            lastName: "last",
            age: 99,
        };

        request(conf.server.url)
            .put('/updateUser')
            .send({
                email: data.email,
                password: newInfo.password,
                name: newInfo.name,
                firstName: newInfo.firstName,
                lastName: newInfo.lastName,
                age: newInfo.age,
            })
            .end(function (err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.be.equal(200);
                res.body.email.should.be.equal(data.email);
                res.body.password.should.be.equal(newInfo.password);
                res.body.name.should.be.equal(newInfo.name);
                res.body.meta.firstName.should.be.equal(newInfo.firstName);
                res.body.meta.lastName.should.be.equal(newInfo.lastName);
                res.body.meta.age.should.be.equal(newInfo.age);
                res.body.updated_at.should.not.equal(res.body.created_at);
                done();
            });
    });

});





