# IoTRegistryPortal
It's a web application allowing users to register and maintain their Internet of Things (IoT) devices.
Backend of the portal is implemented in Express - javascript framework of Node.js. As a database is used MongoDB and for 
time series data InfluxDB database. Frontend is implemented in React.js using Redux for storing state of the application.


## Installation
 
 [1.] Install packages: 
 
    $ npm install
     
 [2.] Translate react.js to "normal" javascript by:
 
    $ npm run build
    
 The command will generate `bundle.js` file in `/public/` repository.
 
 [3.] Start MongoDB database and server:
 
    $ npm run database
    $ npm run server-watch
 
 Or by one command:
    
    $ npm run start

 **Note:** after this database stored in `/src/backEnd/database/\*` is used by default.
 
 After the steps, application is available on `localhost:3000`
 

## Tests
Integration tests for middleware can be run as follows:

[1.] Start test database:

    $ npm run test-database

[2.] Start server:

    $ npm run server-watch
    
[3.] Run tests:

    $ npm run test
    
**Note:** after this, test database is created under `/src/backEnd/tests/database/\*` directory
by default.


