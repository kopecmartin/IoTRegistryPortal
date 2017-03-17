import API from './API_addresses.js';
import cookie from 'react-cookie';
import request from 'superagent';


/**
 * Sends data to a server as a post request.
 * @param url - URL address of a server/API
 * @param data - needed data to get transaction processed such as token, email, ...
 * @returns {Promise}
 */
export const sendPostRequest = function (url, data) {
    //data['token'] = cookie.load('token');

    return new Promise((resolve, reject) => {
        request
            .post(API[url])
            .set('Accept', 'application/json')
            .send(data)
            .end((err, res) => {
                console.log(res);  //debug
                if (err != null || !res.ok) {
                    console.log("error in request");
                } else {
                    resolve(res);
                }
            });
    });
};


/**
 * Sends data to a server as a put request.
 * @param url - URL address of a server/API
 * @param data - needed data to get transaction processed such as token, email, ...
 * @returns {Promise}
 */
export const sendPutRequest = function (url, data) {
    //data['token'] = cookie.load('token');

    return new Promise((resolve, reject) => {
        request
            .put(API[url])
            .set('Accept', 'application/json')
            .send(data)
            .end((err, res) => {
                console.log(res);  //debug
                if (err != null || !res.ok) {
                    console.log("error in request");
                } else {
                    resolve(res);
                }
            });
    });
};


/**
 * Sends data to a server as a delete request.
 * @param url - URL address of a server/API
 * @param data - needed data to get transaction processed such as token, email, ...
 * @returns {Promise}
 */
export const sendDeleteRequest = function (url, data) {
    //data['token'] = cookie.load('token');

    return new Promise((resolve, reject) => {
        request
            .del(API[url])
            .set('Accept', 'application/json')
            .send(data)
            .end((err, res) => {
                console.log(res);  //debug
                if (err != null || !res.ok) {
                    console.log("error in request");
                } else {
                    resolve(res);
                }
            });
    });
};


