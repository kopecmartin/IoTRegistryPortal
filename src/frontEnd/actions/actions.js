import actionTypes from './actionTypes.js';

let actions = {
    switchLanguage(language) {
        return {
            type: actionTypes.SWITCH_LANGUAGE,
            language
        }
    }
};

module.exports = actions;