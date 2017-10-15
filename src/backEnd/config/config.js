
module.exports = {
    "database": {
        "API_keyExpireIn": 30,  // in minutes
        // to string by hex code -> each byte is coded by 2 bytes, therefor length will be double
        "API_keyLength": 4, // characters
        "tokenExpireIn": 30,  // in minutes
        // 256 bytes means 512 character long token, because random bytes are converted
        // to string by hex code -> each byte is coded by 2 bytes, therefor length of a token will be double
        "tokenLength": 256,  //user tokens length
        // 256 bytes means 512 character long token, because random bytes are converted
        // to string by hex code -> each byte is coded by 2 bytes, therefor length of a token will be double
        "deviceTokenLength": 256, // device tokens length
        "url": "mongodb://localhost:33333",
    },
    "server": {
        "port": 3000,
        "url": "localhost:3000"
    },
    "test-database": {
        "url": ""
    },
    // language of backend warnings
    "language": "en" // en = English,
};