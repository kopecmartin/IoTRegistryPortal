import React from 'react';
import InputLabelForm from './InputLabelForm.jsx';
import FormButtons from './FormButtons.jsx';


export default class UserGroups extends React.Component {

    constructor(props) {
        super(props);
    }

    handlerSubmitBtn() {
        this.props.submit(data);
    }

    render() {
        return (
            <div>
                <form style={{clear: "both"}}>
                    <InputLabelForm label="Group Name"
                                    type="text"
                                    //placeholder={this.state.firstName}
                                    required={true}
                                    //validity={this.state.firstNameRequired}
                                    //onBlur={this.checkValidity.bind(this, "firstName")}
                                    //onChange={this.handlerOnChange.bind(this, "firstName")}
                                    //errorMsg={this.state.firstNameRequired == null ? null : required}
                    />
                </form>

                <FormButtons submit={this.handlerSubmitBtn.bind(this)}
                             cancel={this.props.cancel}
                             //errorMsg={this.props.errorMsg}
                             //pending={this.props.pending}
                />
            </div>
        )
    }
};
