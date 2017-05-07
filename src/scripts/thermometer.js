let conf = require('../backEnd/config/config.js');
let mqtt = require('mqtt');
let request = require('supertest');

// register the device
if (process.argv[2] === "register") {

    let url = "/device";
    let body = {
        id: "65a4s6df4sd5f4s",
        APIKey: process.argv[3],
        ioFeatures: {

        }
    };

    request(conf.server.url)
        .post(url)
        .send(body)
        .end(function (err, res) {
            if (err) {
                console.log(res);
            }
            else {
                res = JSON.parse(res.text);
                let token = res.token;
                console.log("token:", token)
            }

        });

}

// update the device - means getting a new token
else if (process.argv[2] === "update") {

    let url = "/device";
    let body = {
        id: "65a4s6df4sd5f4s",
        token: process.argv[3],
        ioFeatures: {

        }
    };

    request(conf.server.url)
        .post(url)
        .send(body)
        .end(function (err, res) {
            if (err) {
                console.log(res);
            }
            else {
                res = JSON.parse(res.text);
                let token = res.token;
                console.log("token:", token)
            }

        });

}

// publish values by device through MQTT protocol
else if (process.argv[2] === "publish_mqtt") {

    // test.moquitto.org is ONLY test server
    let client  = mqtt.connect('mqtt://test.mosquitto.org');


    client.on('connect', function () {
        // publish a message to the "presence" topic
        client.publish('presence', 'Hello mqtt');
        client.end();
    });
}

// publish values by device through Socket.io
else if (process.argv[2] === "publish_sockets") {

    // send a token right away on connect
    let socket = require('socket.io-client')("http://localhost:3000/", {query: "token=aa"});
    socket.emit("publishValue", {token: "aa", id: "dd"});
    socket.disconnect();
}

// wrong arguments
else {
    console.log("Wrong arguments");
    console.log("use:");
    console.log(" register API_KEY");
    console.log(" update TOKEN");
    console.log(" publish_mqtt TOKEN");
    console.log(" publish_sockets TOKEN");
}
