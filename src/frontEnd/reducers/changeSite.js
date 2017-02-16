import actionTypes from '../actions/actionTypes.js';


export default function changeSite(site = "/", action) {
    switch (action.type) {
        case actionTypes.CHANGE_SITE:
            return {
                site: action.site
            };
        default:
            return {site: site};
    }
}
