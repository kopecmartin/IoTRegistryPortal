let mongoose = require('mongoose');
let should = require('should');
let assert = require('assert');
let request = require('supertest');
let requests = require('../API_test_requests.js');

let conf = require('../../config/config.js');
let User = require('./../../models/user.js');


it('register a new user', function (done) {
    let body = {
        email: "test@test.mail",
        password: "password",
    };

    requests.postRequest('/register', body, 201).then((res) => {
        res.body.email.should.be.equal(body.email);
        res.body.password.should.be.equal(body.password);
    }).then(done, done);
});


it('register a new user with the same email', function (done) {
    let body = {
        email: "test@test.mail",
        password: "password",
    };

    requests.postRequest('/register', body, 400).then((res) => {
    }).then(done, done);
});


describe('Login', function () {

    let data = {
        email: "test22@test.mail",
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
        User.remove({email: data.email}, function () {
            done();
        });
    });


    it('login', function (done) {
        let body = {
            email: "test@test.mail",
            password: "password",
        };

        requests.postRequest('/login', body, 200).then((res) => {
            res.body.token.should.exist;
            // reason why token length is doubled is explained in the config file
            res.body.token.length.should.be.equal(conf.database.tokenLength*2);
        }).then(done, done);
    });


    it('login - wrong password', function (done) {

        let body = {
            email: data.email,
            password: "wrong"
        };

        requests.postRequest('/login', body, 403).then((res) => {
        }).then(done, done);
    });


    it('login - not registered user', function (done) {
        let body = {
            email: "notRegistered@mail.com",
            password: "password"
        };

        requests.postRequest('/login', body, 403).then((res) => {
        }).then(done, done);
    });


    it('update user', function (done) {

        let newInfo = {
            name: "Name",
            firstName: "first",
            lastName: "last",
            age: 99,
        };

        let body = {
            email: data.email,
            name: newInfo.name,
            firstName: newInfo.firstName,
            lastName: newInfo.lastName,
            age: newInfo.age,
        };

        requests.postRequest('/login', {email: data.email, password: data.password}, 200).then((res) => {
            body['token'] = res.body.token;
            requests.putRequest('/updateUser', body, 200).then((res) => {
                res.body.email.should.be.equal(data.email);
                res.body.name.should.be.equal(newInfo.name);
                res.body.meta.firstName.should.be.equal(newInfo.firstName);
                res.body.meta.lastName.should.be.equal(newInfo.lastName);
                res.body.meta.age.should.be.equal(newInfo.age);
                res.body.updated_at.should.not.equal(res.body.created_at);
            }).then(done, done);
        });
    });

});





