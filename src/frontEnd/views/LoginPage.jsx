import LoginPageComponent from '../components/LoginPage/LoginPageComponent.jsx';
import React, { PropTypes } from 'react';
import { hashHistory } from 'react-router';

import { connect } from 'react-redux'
let actions = require('./../actions/actions.js');


class LoginPage extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    login(data) {
        console.log("login");
        console.log(data);
        //console.log(changeSite);
        this.props.changeSite("/portal/dashboard");
        hashHistory.push('/portal/dashboard');
    }

    register(data) {

    }

    render() {
        return (
            <LoginPageComponent loginOnClick={this.login.bind(this)} registerOnClick={this.register.bind(this)}/>
        )
    }
}

export default connect(
    //(state) => ({content: state.switchLanguage.content.page.login})
     null,
    (dispatch) => ({changeSite: (site) => dispatch(actions.changeSite(site))})
)(LoginPage)