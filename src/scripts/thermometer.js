let request = require('supertest');
let conf = require('../backEnd/config/config.js');


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
else if (process.argv[2] === "publish") {

}
else {
    console.log("Wrong arguments");
    console.log("use:");
    console.log(" register API_KEY");
    console.log(" update TOKEN");
    console.log(" publish TOKEN");
}
