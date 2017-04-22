import Input from './Input.jsx';
import React from 'react';

import {connect} from 'react-redux'


class Register extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            password: "",
            passwordCheck: "",
            valid: null,
        };
    }

    passwordsOnChange(type, evt) {
        switch (type) {
            case "password":
                this.setState({password: evt.target.value});
                this.props.passwordOnChange(evt);
                break;
            case "passwordCheck":
                this.setState({passwordCheck: evt.target.value});
                console.log(evt.target.value);
                break;
        }
    }

    render() {
        return (
            <div>
                <div className="col-sm-7 col-md-6 col-lg-5 login">
                    <form className="form-horizontal" role="form">
                        <Input onChange={this.props.usernameOnChange}
                               label={this.props.content.labels.username}
                               type="text"/>
                        <Input onChange={this.passwordsOnChange.bind(this, "password")}
                               label={this.props.content.labels.password}
                               type="password"/>
                        <Input onChange={this.passwordsOnChange.bind(this, "passwordCheck")}
                               label={this.props.content.labels.confirmPassword}
                               type="password"/>

                        <div className="col-xs-4 col-sm-4 col-md-4 submit">
                            <button type="submit"
                                    onClick={this.props.register}
                                    className="btn btn-primary btn-lg"
                                    tabIndex="4">
                                {this.props.buttons.register}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="col-sm-5 col-md-6 col-lg-7 details">
                    <div>
                        {this.props.content.messages.haveAccount}
                        <button type="submit"
                                onClick={this.props.toggle}
                                className="btn btn-primary btn-lg"
                                tabIndex="4">
                            {this.props.buttons.login}
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state) => ({
        buttons: state.switchLanguage.content.buttons,
        content: state.switchLanguage.content.page.login
    }),
    null
)(Register)
