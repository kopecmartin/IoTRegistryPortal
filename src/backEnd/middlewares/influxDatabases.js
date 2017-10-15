let authenticateUser = require('../helpers/authenticateUser.js');
let getTranslation = require('../helpers/translations.js');
let Influx = require('influx');
let InfluxDatabase = require('../models/influxDatabase.js');
let InfluxDatabaseMem = require('../models/influxDatabaseDeviceMem.js');
let messageTypes = require('../helpers/messageTypes.js');
let request = require('request');


module.exports = function (app, _) {

    app.post('/createInfluxDB', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token', 'name', 'description', 'influxAddress');

        authenticateUser(body.token).then((email) => {

            let createFlag = 'q=CREATE DATABASE ';
            // TODO use database address from conf file as default
            // TODO suggestion: use database address which is specified by user

            // TODO suggestion: don't use only name given by user as a database name (?) - maybe hash,
            // TODO suggestion: or a concatenation of multiple information, if so, save this name
            // TODO suggestion: to influxDatabase object in MongoDB
            let uri = 'http://localhost:8086/query?' + createFlag + body.name;

            let options = {
                uri: uri,
                method: 'POST',
            };

            // create a new influxDB
            let newDB = new InfluxDatabase({
                email: email,
                name: body.name,
                description: body.description,
            });

            // save the database
            newDB.save(function (err) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                } else {
                    // send request to influxDB server to create a new database
                    request(options, function (err, resp, body) {
                        if (err) {
                            console.log("error", err);
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                        else if (resp.statusCode === 200) {
                            console.log(resp, body);
                            res.status(201).json(newDB); //return the newly created database object
                        }
                        else {
                            console.log("hmm:", err, resp, body);
                            res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                        }
                    });
                }
            });

        }, (errCode) => {
            res.status(403).json({});
        });
    });


    app.post('/getOwnInfluxDBs', function (req, res) {

        // retrieve information
        let body = _.pick(req.body, 'token');

        authenticateUser(body.token).then((email) => {

            InfluxDatabase.find({email: email}, function (err, DBs) {
                if (err) {
                    res.status(500).json({msg: getTranslation(messageTypes.INTERNAL_DB_ERROR)});
                }
                else if (!DBs) {
                    res.status(404).json({msg: getTranslation(messageTypes.GROUP_NOT_FOUND)});
                }
                else {
                    res.status(200).json(DBs);
                }
            });

        }, (errCode) => {
            res.status(403).json({});
        });

    });

};