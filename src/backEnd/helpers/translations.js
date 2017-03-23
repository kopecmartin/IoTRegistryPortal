/*
 * Translations for backend
 */

// import config
let conf = require('./../config/config.js');


const getTranslation = function (messageType) {
    switch (conf.language) {
        case "en":
            return MessagesEN[messageType];
            break;

        default:
            return MessagesEN[messageType];
    }

};

const MessagesEN = {
    INTERNAL_DB_ERROR: "Internal database error",
    NAME_PASSWORD_INCORRECT: "Name or password is incorrect!",
    USER_ALREADY_REGISTERED: "This email is already registered. Use a different email.",
    USER_LOGOUT: "The user has been logged out.",

    GROUP_ALREADY_EXISTS: "A group with the name already exists!",
    GROUP_NOT_FOUND: "No such a group!",
    GROUP_UPDATE_INFO: "Only the owner can update the group!",
    GROUP_DELETE_INFO: "Only the group owner can delete the group!",

    USER_GROUP_ADD_MEMBER_INFO: "Only the group owner can add a new member!",
    USER_GROUP_REMOVE_MEMBER_INFO: "Only the group owner can remove a member!",
    USER_GROUP_ACCESS_MEMBER_LIST_INFO: "Only a group member or the owner can access a list of others in the group!",

    USER_NOT_FOUND: "User does not exist!",
    USER_ALREADY_UPDATED: "The user is already updated.",

    MEMBER_ALREADY_EXISTS: "The member already exists!",

    DEVICE_NOT_FOUND: "Device was not found!",
    DEVICE_DEREGISTER_INFO: "Only the owner can deregister the device!",
    DEVICE_UPDATE_INFO: "Only the owner of the device can update it!"
};

module.exports = getTranslation;