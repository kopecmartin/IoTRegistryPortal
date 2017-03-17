import React from 'react';


const InputLabelForm = ({help, label, onBlur, onChange, placeholder, required, type, validity}) => {

    let valid = validity || "";

    if (help != null) {
        help = <small className="form-text text-muted">{help}</small>;
    }

    if (required != null) {
        required = <small className="form-text text-muted" style={{color: "red"}}>*</small>;
    }

    return (
        <div className={"form-group row " + valid}>
            <label className="col-xs-3 col-form-label">{label}:</label>
            {required}
            <div className="col-xs-6">
                <input
                    className="form-control"
                    type={type}
                    placeholder={placeholder || label}
                    onChange={onChange}
                    onBlur={onBlur}/>
                {help}
            </div>
        </div>
    )
};

export default InputLabelForm;