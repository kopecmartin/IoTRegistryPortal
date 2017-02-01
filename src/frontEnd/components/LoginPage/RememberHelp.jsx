import React from 'react';


const RememberHelp = ({children, data}) => {
    return (
        <div className="form-group">
            <div className="col-xs-8 col-sm-offset-2 col-sm-6 col-md-offset-2 col-md-6">
                <div className="checkbox">
                    <label>
                        <input type="checkbox" tabIndex="3"/>
                        {data.remember}
                    </label>
                </div>
                <span className="help-block">
                    {data.forgot}
                </span>
            </div>
            {children}
        </div>
    )
};

export default RememberHelp;