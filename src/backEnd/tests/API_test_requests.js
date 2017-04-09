let request = require('supertest');
let requestForInflux = require('request');
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

    /**
     * Temporary function for deleting influx DBs till an interface is created.
     * @param body
     * @returns {Promise}
     */
    dropInfluxDB: function (body) {
        return new Promise((resolve, reject) => {

            let createFlag = 'q=DROP DATABASE';

            let uri = 'http://localhost:8086/query?' + createFlag + body.name;

            let options = {
                uri: uri,
                method: 'POST',
            };

            // send request to influxDB server to create a new database
            requestForInflux(options, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
    },
};
