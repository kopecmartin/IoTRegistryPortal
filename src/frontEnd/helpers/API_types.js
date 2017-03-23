/*
 * API types, object contains URL address (in string) for each API
 */

const HOSTNAME = "http://192.168.0.100:3000/";

const API_types = {
    LOGIN: HOSTNAME + "login",

    CREATE_USER_GROUP: HOSTNAME + "userGroup",
    UPDATE_USER_GROUP: HOSTNAME + "userGroup",
    DELETE_USER_GROUP: HOSTNAME + "userGroup",
    GET_GROUPS_BY_OWNERSHIP: HOSTNAME + "getGroupsByOwnership",
    GET_GROUPS_BY_MEMBERSHIP: HOSTNAME + "getGroupsByMembership",

};

export default API_types;