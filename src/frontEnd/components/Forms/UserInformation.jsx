import React from 'react';

import InputLabelForm from './InputLabelForm.jsx';
import FormButtons from '../Buttons/FormButtons.jsx';
import {sendPostRequest, sendPutRequest} from '../../helpers/HTTP_requests.js';


export default class UserInformation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            pending: false,
            loadingData: false,
            userData: {},
            meta: {},
            errorMsg: null,

            name: "",
            firstName: "",
            lastName: "",
            age: "",
            gender: "",
            password: "",
            newPassword: "",
            confirmPassword: "",
            passwordFieldError: null,
        };
    }

    componentWillMount() {
        this.fetchUserInfo();
    }

    fetchUserInfo() {
        this.setState({loadingData: true});
        sendPostRequest("GET_USER_INFO", {}).then((data) => {
            console.log("user info", JSON.parse(data.text));
            this.setState({
                loadingData: false,
                userData: JSON.parse(data.text),
                meta: JSON.parse(data.text).meta
            });
        }, (err) => {

        });
    }

    changePassword() {
        let data = {
            password: this.state.password,
            newPassword: this.state.newPassword,
        };

        this.setState({pending: true});
        sendPostRequest("CHANGE_PASSWORD", {data}).then((data) => {
            console.log("password's changed", JSON.parse(data.text));
            this.setState({pending: false});
        }, (err) => {

        });
    }

    updateUserInfo() {
        // TODO add a validity check
        // NOTE: backed will update only information which has changed!
        let data = {
            name: this.state.name,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            age: this.state.age,
            gender: this.state.gender,
        };

        this.setState({pending: true});
        sendPutRequest("UPDATE_USER_INFO", {data}).then((data) => {
            console.log("updated", JSON.parse(data.text));

            if (this.state.newPassword !== "" && this.state.passwordFieldError === null) {
                this.changePassword();
            }

            this.setState({pending: false});
        }, (err) => {

        });
    }

    checkPasswordValidity() {
        if (this.state.newPassword === this.state.confirmPassword) {
            this.setState({
                passwordFieldError: null,
                errorMsg: null,
            });
        }
        else {
            this.setState({
                passwordFieldError: "has-error",
                errorMsg: "Passwords don't match!",
            });
        }
    }

    handlerOnChange(name, evt) {
        let state = {};
        state[name] = evt.target.value;
        this.setState(state);
    }

    render() {
        return (
            <div style={{padding: 15}}>
                <h2>Personal information</h2>
                <form style={{clear: "both", padding: 10}}>
                    <InputLabelForm label="Email"
                                    type="text"
                                    disabled="disabled"
                                    placeholder={this.state.userData.email}
                    />
                    <InputLabelForm label="Name"
                                    type="text"
                                    placeholder={this.state.userData.name}
                                    onChange={this.handlerOnChange.bind(this, "name")}
                    />
                    <InputLabelForm label="First Name"
                                    type="text"
                                    placeholder={this.state.meta.firstName}
                                    onChange={this.handlerOnChange.bind(this, "firstName")}
                    />
                    <InputLabelForm label="Last Name"
                                    type="text"
                                    placeholder={this.state.meta.lastName}
                                    onChange={this.handlerOnChange.bind(this, "lastName")}
                    />
                    <InputLabelForm label="Age"
                                    type="text"
                                    placeholder={this.state.meta.age}
                                    onChange={this.handlerOnChange.bind(this, "age")}
                    />
                    <InputLabelForm label="Gender"
                                    type="text"
                                    placeholder={this.state.meta.gender}
                                    onChange={this.handlerOnChange.bind(this, "gender")}
                    />
                </form>

                <h2>Password Change</h2>
                <form style={{clear: "both", padding: 10}}>
                    <InputLabelForm label="Current Password"
                                    type="password"
                                    placeholder={this.state.password}
                                    onChange={this.handlerOnChange.bind(this, "password")}
                    />
                    {
                        this.state.password !== "" ?
                            <div>
                                <InputLabelForm label="New Password"
                                                type="password"
                                                placeholder={this.state.newPassword}
                                                onBlur={this.checkPasswordValidity.bind(this)}
                                                onChange={this.handlerOnChange.bind(this, "newPassword")}
                                />
                                <InputLabelForm label="Confirm New Password"
                                                type="password"
                                                placeholder={this.state.confirmPassword}
                                                validity={this.state.passwordFieldError}
                                                onBlur={this.checkPasswordValidity.bind(this)}
                                                onChange={this.handlerOnChange.bind(this, "confirmPassword")}
                                />
                            </div>
                            :
                            null
                    }

                </form>

                <FormButtons submit={this.updateUserInfo.bind(this)}
                             submit_title="Save"
                             errorMsg={this.state.errorMsg}
                             pending={this.state.pending}
                />
            </div>
        )
    }
};
