import cookie from 'react-cookie';
import LoginPageComponent from '../components/LoginPage/LoginPageComponent.jsx';
import React, { PropTypes } from 'react';
import { hashHistory } from 'react-router';
import {sendPostRequest} from '../helpers/HTTP_requests.js';

import { connect } from 'react-redux'
let actions = require('./../actions/actions.js');


class LoginPage extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    login(data) {
        console.log("login");
        console.log(data);
        sendPostRequest("LOGIN", data).then((data) => {
            //data = this.state.tableHeaders.concat(data);
            console.log("loggedIn", JSON.parse(data.text));
            cookie.save("token", JSON.parse(data.text).token);
            this.props.changeSite("/portal/dashboard");
            hashHistory.push('/portal/dashboard');
        }, (err) => {
            console.log("access denied", err);

            //TODO show error
        });
    }

    register(data) {
        console.log("register");
        console.log(data);
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