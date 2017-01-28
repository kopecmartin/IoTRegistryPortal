import React from 'react';


export default class RememberHelp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="form-group">
                <div className="col-xs-8 col-sm-offset-2 col-sm-6 col-md-offset-2 col-md-6">
                    <div className="checkbox">
                        <label>
                            <input type="checkbox" tabIndex="3"/>
                            Remember username
                        </label>
                    </div>
                    <span className="help-block">
                        Forgot
                        <a href="#" tabIndex="5">username</a> or
                        <a href="#" tabIndex="6">password</a>?
                    </span>
                </div>
                {this.props.children}
            </div>
        )
    }
}