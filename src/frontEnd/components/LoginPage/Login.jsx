import Input from './Input.jsx';
import React , { PropTypes } from 'react';
import RememberHelp from './RememberHelp.jsx';

import 'bootstrap-social';

import { connect } from 'react-redux'
let actions = require('./../../actions/actions.js');


const Login = ({usernameOnChange, passwordOnChange, login, toggle, content, buttons, switchLanguage}) => {

    /*
    const switchL = () => {
        switchLanguage('lt');
    };
    */

    return (
        <div>
            <div className="col-sm-7 col-md-6 col-lg-5 login">
                <form className="form-horizontal" role="form">
                    <Input onChange={usernameOnChange}
                           label={content.labels.username}
                           type="text"/>
                    <Input onChange={passwordOnChange}
                           label={content.labels.password}
                           type="password"/>

                    <RememberHelp data={content.messages}>
                        <div className="col-xs-4 col-sm-4 col-md-4 submit">
                            <button type="submit"
                                    onClick={login}
                                    className="btn btn-primary btn-lg"
                                    tabIndex="4">
                                {buttons.login}
                            </button>
                        </div>
                    </RememberHelp>
                </form>
            </div>

            <div className="col-sm-5 col-md-6 col-lg-7 details">
                <a className="btn btn-block btn-social btn-facebook">
                    <span className="fa fa-facebook"/>
                    {buttons.facebook}
                </a>
                <a className="btn btn-block btn-social btn-google">
                    <span className="fa fa-google"/>
                    {buttons.google}
                </a>
                <a className="btn btn-block btn-social btn-github">
                    <span className="fa fa-github"/>
                    {buttons.github}
                </a>

                <div>
                    {content.messages.or}
                    <button type="submit"
                            onClick={toggle}
                            className="btn btn-primary btn-lg"
                            tabIndex="4">
                        {buttons.register}
                    </button>
                </div>
            </div>
        </div>
    )
};

Login.propTypes = {
    //content: PropTypes.object.isRequired,
    //switchLanguage: PropTypes.function.isRequired,
};

export default connect(
    (state) => ({
        buttons: state.switchLanguage.content.buttons,
        content: state.switchLanguage.content.page.login
    }),
    (dispatch) => ({switchLanguage: (lang) => dispatch(actions.switchLanguage(lang))})
)(Login)
