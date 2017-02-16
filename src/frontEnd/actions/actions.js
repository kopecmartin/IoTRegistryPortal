import actionTypes from './actionTypes.js';


export function switchLanguage(language) {
    return {
        type: actionTypes.SWITCH_LANGUAGE,
        language
    }
}

export function changeSite(site) {
    return {
        type: actionTypes.CHANGE_SITE,
        site
    }
}
