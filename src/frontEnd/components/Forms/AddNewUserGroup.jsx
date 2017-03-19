import React from 'react';
import InputLabelForm from './InputLabelForm.jsx';
import FormButtons from './FormButtons.jsx';


export default class UserGroups extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            permissions: "",

            nameRequired: null,
            pending: false,
        }
    }

    handlerOnChange(name, evt) {
        let state = {};
        state[name] = evt.target.value;
        this.setState(state);
    }

    checkValidity(name) {
        let state = {};
        if (this.state[name] === "") {
            state[name + "Required"] = "has-error";
            this.setState(state);
            return false;
        }
        if (this.state[name] != "" && this.state[name + "Required"] != null) {
            state[name + "Required"] = null;
            this.setState(state);
        }
        return true;
    }

    handlerSubmitBtn() {
        let data = {
            name: this.state.name,
            description: this.state.description,
            permissions: this.state.permissions,
        };
        // TODO add email of the user
        // TODO call backend
        this.setState({pending: true});
        console.log(data);

        //this.setState({pending: false});
        //this.props.cancel()
    }

    render() {
        let required = "Fill all required fields!";

        return (
            <div>
                <form style={{clear: "both"}}>
                    <InputLabelForm label="Group Name"
                                    type="text"
                                    //placeholder={this.state.firstName}
                                    required={true}
                                    validity={this.state.nameRequired}
                                    onBlur={this.checkValidity.bind(this, "name")}
                                    onChange={this.handlerOnChange.bind(this, "name")}
                    />
                    <InputLabelForm label="Description"
                                    type="text"
                                    //placeholder={this.state.firstName}
                                    onChange={this.handlerOnChange.bind(this, "description")}
                    />
                    <InputLabelForm label="Permissions"
                                    type="text"
                                    //placeholder={this.state.firstName}
                                    onChange={this.handlerOnChange.bind(this, "permissions")}
                                    //help={PermissionsHelp}
                    />
                </form>

                <FormButtons submit={this.handlerSubmitBtn.bind(this)}
                             cancel={this.props.cancel}
                             errorMsg={this.state.nameRequired == null ? null : required}
                             pending={this.state.pending}
                />
            </div>
        )
    }
};