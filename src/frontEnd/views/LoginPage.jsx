import LoginPageComponent from '../components/LoginPage/LoginPageComponent.jsx';
import React from 'react';


export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            error: false,
            loginClicked: false,
            hoverLoginForm: false,
            pending: false
        };
    }

    login(data) {

    }

    register(data) {

    }

    render() {
        return (
            <LoginPageComponent loginOnClick={this.login.bind(this)} registerOnClick={this.register.bind(this)}/>
        )
    }
}