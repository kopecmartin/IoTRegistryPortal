import React from 'react';


const Input = ({label, type, onChange}) => {
    return (
        <div className="form-group">
            <label htmlFor="inputUsername"
                   className="col-sm-2 col-md-2 control-label">
                {label}
            </label>
            <div className="col-sm-10 col-md-10">
                <input type={type}
                       className="form-control"
                       onChange={onChange}
                       placeholder=""
                       tabIndex="1"/>
            </div>
        </div>
    )
};

export default Input;