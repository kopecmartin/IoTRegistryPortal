import cookie from 'react-cookie';
import { hashHistory } from 'react-router';
import ImageLoader from 'react-imageloader';
import React from 'react';

import Login from '../components/LoginPage/Login.jsx';
import Register from '../components/LoginPage/Register.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';

import { connect } from 'react-redux'
let actions = require('./../actions/actions.js');

import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import '../components/LoginPage/style.css';


class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            loginForm: true
        };
    }

    handlerOnChange(type, evt) {
        switch (type) {
            case "name":
                this.setState({username: evt.target.value});
                console.log(evt.target.value);
                break;
            case "password":
                this.setState({password: evt.target.value});
                console.log(evt.target.value);
                break;
        }
    }

    toggle() {
        this.setState({loginForm: !this.state.loginForm});
    }

    login() {
        console.log("login");
        let data = {
            email: this.state.username,
            password: this.state.password
        };
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

    register() {
        console.log("register");
        let data = {
            email: this.state.username,
            password: this.state.password
        };
        console.log(data);
        sendPostRequest("REGISTER", data).then((data) => {
            //data = this.state.tableHeaders.concat(data);
            console.log("registered", JSON.parse(data.text));

            this.toggle();
        }, (err) => {
            console.log("registration failed", err);

            // TODO handle error
        });
    }

    render() {
        return (
            <div className="login-pf login-background">

                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div id="brand">
                                <ImageLoader src={require("patternfly/dist/img/brand.svg")}
                                             alt="PatternFly Enterprise Application"/>
                            </div>
                        </div>

                        {this.state.loginForm ? (
                            <Login usernameOnChange={this.handlerOnChange.bind(this, "name")}
                                   passwordOnChange={this.handlerOnChange.bind(this, "password")}
                                   toggle={this.toggle.bind(this)}
                                   login={this.login.bind(this)}/>
                        ) : (
                            <Register usernameOnChange={this.handlerOnChange.bind(this, "name")}
                                      passwordOnChange={this.handlerOnChange.bind(this, "password")}
                                      toggle={this.toggle.bind(this)}
                                      register={this.register.bind(this)}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    //(state) => ({content: state.switchLanguage.content.page.login})
     null,
    (dispatch) => ({changeSite: (site) => dispatch(actions.changeSite(site))})
)(LoginPage)