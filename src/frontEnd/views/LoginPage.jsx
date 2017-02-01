import LoginPageComponent from '../components/LoginPage/LoginPageComponent.jsx';
import React from 'react';


export default class LoginPage extends React.Component {

   constructor(props, context) {
        super(props, context);
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