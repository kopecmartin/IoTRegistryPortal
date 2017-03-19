let request = require('supertest');
let conf = require('../config/config.js');


module.exports = {

    postRequest: function (url, body, returnCode) {
        return new Promise((resolve, reject) => {

            request(conf.server.url)
                .post(url)
                .send(body)
                .end(function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        res.status.should.be.equal(returnCode);
                    }
                    resolve(res);
                });
        });
    },

    putRequest: function (url, body, returnCode) {
        return new Promise((resolve, reject) => {

            request(conf.server.url)
                .put(url)
                .send(body)
                .end(function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        res.status.should.be.equal(returnCode);
                    }
                    resolve(res);
                });
        });
    },

    delRequest: function (url, body, returnCode) {
        return new Promise((resolve, reject) => {

            request(conf.server.url)
                .del(url)
                .send(body)
                .end(function (err, res) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        res.status.should.be.equal(returnCode);
                    }
                    resolve(res);
                });
        });
    },
};
