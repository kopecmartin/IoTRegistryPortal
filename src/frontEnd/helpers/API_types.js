/*
 * API types, object contains URL address (in string) for each API
 */

// TODO create a config for frontend and store address there
const HOSTNAME = "http://192.168.88.244:3000/";

const API_types = {
    LOGIN: HOSTNAME + "login",
    REGISTER: HOSTNAME + "register",

    CREATE_USER_GROUP: HOSTNAME + "userGroup",
    UPDATE_USER_GROUP: HOSTNAME + "userGroup",
    DELETE_USER_GROUP: HOSTNAME + "userGroup",
    GET_GROUPS_BY_OWNERSHIP: HOSTNAME + "getGroupsByOwnership",
    GET_GROUPS_BY_MEMBERSHIP: HOSTNAME + "getGroupsByMembership",

    CREATE_INFLUX_DATABASE: HOSTNAME + "createInfluxDB",
    GET_OWN_INFLUX_DATABASES: HOSTNAME + "getOwnInfluxDBs",

    GET_API_KEY: HOSTNAME + "APIKey",
    UPDATE_API_KEY: HOSTNAME + "APIKey",
    DELETE_API_KEY: HOSTNAME + "APIKey",
};

export default API_types;