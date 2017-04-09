let io = require('socket.io-client');

let serverUrl = 'http://localhost:3000';
let token = "token_6s4f6asf1sf3s3df4as";

// create a connection
let conn = io.connect(serverUrl, { query: "token=" + token });


let msg = 'hello';
conn.emit('test', msg);

