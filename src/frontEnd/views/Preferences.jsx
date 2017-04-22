import React from 'react';

import UserInformation from '../components/Forms/UserInformation.jsx';

import { connect } from 'react-redux'


const Preferences = ({content}) => {

    return (
        <div>
            <h1>{content.preferences}</h1>

            <UserInformation/>

        </div>
    )

};

export default connect(
    (state) => ({
        content: state.switchLanguage.content.page.preferences,
    }),
    null
)(Preferences)