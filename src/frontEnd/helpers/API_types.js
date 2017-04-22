/*
 * API types, object contains URL address (in string) for each API
 */

// TODO create a config for frontend and store address there
const HOSTNAME = "http://192.168.0.100:3000/";

const API_types = {
    LOGIN: HOSTNAME + "login",
    LOGOUT: HOSTNAME + "logout",
    REGISTER: HOSTNAME + "register",

    GET_USER_INFO: HOSTNAME + "getUserInfo",
    UPDATE_USER_INFO: HOSTNAME + "updateUser",
    CHANGE_PASSWORD: HOSTNAME + "changePassword",

    CREATE_USER_GROUP: HOSTNAME + "userGroup",
    UPDATE_USER_GROUP: HOSTNAME + "userGroup",
    DELETE_USER_GROUP: HOSTNAME + "userGroup",
    GET_GROUPS_BY_OWNERSHIP: HOSTNAME + "getGroupsByOwnership",
    GET_GROUPS_BY_MEMBERSHIP: HOSTNAME + "getGroupsByMembership",

    CREATE_DEVICE_GROUP: HOSTNAME + "deviceGroup",
    UPDATE_DEVICE_GROUP: HOSTNAME + "deviceGroup",
    DELETE_DEVICE_GROUP: HOSTNAME + "deviceGroup",
    GET_DEVICE_GROUPS_BY_OWNERSHIP: HOSTNAME + "getDeviceGroups",

    CREATE_INFLUX_DATABASE: HOSTNAME + "createInfluxDB",
    GET_OWN_INFLUX_DATABASES: HOSTNAME + "getOwnInfluxDBs",

    GET_API_KEY: HOSTNAME + "APIKey",
    UPDATE_API_KEY: HOSTNAME + "APIKey",
    DELETE_API_KEY: HOSTNAME + "APIKey",
};

export default API_types;