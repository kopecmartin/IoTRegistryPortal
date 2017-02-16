import { combineReducers } from 'redux'
import changeSite from './changeSite'
import switchLanguage from './switchLanguage'

export default combineReducers({
    changeSite,
    switchLanguage,
})
