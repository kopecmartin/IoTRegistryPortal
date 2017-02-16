import actionTypes from '../actions/actionTypes.js';
import api from '../data/api.js';


const initialState = {
    content: api.getContent() // Loads default language content (en) as an initial state
};

export default function switchLanguage(state = initialState, action) {
    switch (action.type) {
        case actionTypes.SWITCH_LANGUAGE:
            return {
                content: api.getContent(action.language)
            };
        default:
            return state;
    }
}
