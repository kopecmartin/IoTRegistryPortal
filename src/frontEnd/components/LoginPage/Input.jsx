import React from 'react';


export default class Input extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor="inputUsername"
                       className="col-sm-2 col-md-2 control-label">
                    {this.props.label}
                </label>
                <div className="col-sm-10 col-md-10">
                    <input type={this.props.type}
                           className="form-control"
                           id="inputUsername"
                           onChange={this.props.onChange}
                           placeholder=""
                           tabIndex="1"/>
                </div>
            </div>
        )
    }
}