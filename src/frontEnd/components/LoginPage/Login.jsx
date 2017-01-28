import Input from './Input.jsx';
import React from 'react';
import RememberHelp from './RememberHelp.jsx';

import 'bootstrap-social';


export default class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="col-sm-7 col-md-6 col-lg-5 login">
                    <form className="form-horizontal" role="form">
                        <Input onChange={this.props.usernameOnChange}
                               label="Username"
                               type="text"/>
                        <Input onChange={this.props.passwordOnChange}
                               label="Password"
                               type="password"/>

                        <RememberHelp>
                            <div className="col-xs-4 col-sm-4 col-md-4 submit">
                                <button type="submit"
                                        onClick={this.props.login}
                                        className="btn btn-primary btn-lg"
                                        tabIndex="4">
                                    Log In
                                </button>
                            </div>
                        </RememberHelp>
                    </form>
                </div>

                <div className="col-sm-5 col-md-6 col-lg-7 details">
                    <a className="btn btn-block btn-social btn-facebook">
                        <span className="fa fa-facebook"/>
                        Sign in with Facebook
                    </a>
                    <a className="btn btn-block btn-social btn-google">
                        <span className="fa fa-google"/>
                        Sign in with Google
                    </a>
                    <a className="btn btn-block btn-social btn-github">
                        <span className="fa fa-github"/>
                        Sign in with GitHub
                    </a>

                    <div>
                        OR
                        <button type="submit"
                                  onClick={this.props.toggle}
                                  className="btn btn-primary btn-lg"
                                  tabIndex="4">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
