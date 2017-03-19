import API from './API_types.js';
import cookie from 'react-cookie';
import request from 'superagent';


/**
 * Sends data to a server as a post request.
 * @param API_TYPE - API_TYPE key in string
 * @param data - needed data to get transaction processed such as token, email, ...
 * @returns {Promise}
 */
export const sendPostRequest = function (API_TYPE, data) {
    //data['token'] = cookie.load('token');

    return new Promise((resolve, reject) => {
        request
            .post(API[API_TYPE])
            .set('Accept', 'application/json')
            .send(data)
            .end((err, res) => {
                console.log("debug", res);  //debug
                if (err != null || !res.ok) {
                    console.log(err);
                    console.log("error in request");
                    reject(res);
                } else {
                    resolve(res);
                }
            });
    });
};


/**
 * Sends data to a server as a put request.
 * @param API_TYPE - API_TYPE key in string
 * @param data - needed data to get transaction processed such as token, email, ...
 * @returns {Promise}
 */
export const sendPutRequest = function (API_TYPE, data) {
    //data['token'] = cookie.load('token');

    return new Promise((resolve, reject) => {
        request
            .put(API[API_TYPE])
            .set('Accept', 'application/json')
            .send(data)
            .end((err, res) => {
                console.log(res);  //debug
                if (err != null || !res.ok) {
                    console.log("error in request");
                    reject(res);
                } else {
                    resolve(res);
                }
            });
    });
};


/**
 * Sends data to a server as a delete request.
 * @param API_TYPE - API_TYPE key in string
 * @param data - needed data to get transaction processed such as token, email, ...
 * @returns {Promise}
 */
export const sendDeleteRequest = function (API_TYPE, data) {
    //data['token'] = cookie.load('token');

    return new Promise((resolve, reject) => {
        request
            .del(API[API_TYPE])
            .set('Accept', 'application/json')
            .send(data)
            .end((err, res) => {
                console.log(res);  //debug
                if (err != null || !res.ok) {
                    console.log("error in request");
                    reject(res);
                } else {
                    resolve(res);
                }
            });
    });
};


