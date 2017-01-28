import ImageLoader from 'react-imageloader';
import React from 'react';

import Login from './Login.jsx';
import Register from './Register.jsx';

import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import './style.css';


export default class LoginPageComponent extends React.Component {

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
        let data = {
            username: this.state.username,
            password: this.state.password
        };
        this.props.loginOnClick(data);
    }

    register() {
        let data = {
            username: this.state.username,
            password: this.state.password
        };
        this.props.registerOnClick(data);
    }

    render() {
        let form;
        if(this.state.loginForm) {
            form = (
                <Login usernameOnChange={this.handlerOnChange.bind(this, "name")}
                       passwordOnChange={this.handlerOnChange.bind(this, "password")}
                       toggle={this.toggle.bind(this)}
                       login={this.login.bind(this)}/>
            )
        } else {
            form = (
                <Register register={this.register.bind(this)}/>
            )
        }

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
                        {form}
                    </div>
                </div>
            </div>
        )
    }
}