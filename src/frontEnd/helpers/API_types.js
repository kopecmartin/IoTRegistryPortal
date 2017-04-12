/*
 * API types, object contains URL address (in string) for each API
 */

const HOSTNAME = "http://192.168.0.100:3000/";

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
};

export default API_types;