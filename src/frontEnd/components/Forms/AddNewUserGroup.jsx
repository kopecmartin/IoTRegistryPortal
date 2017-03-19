import React from 'react';

import InputLabelForm from './InputLabelForm.jsx';
import FormButtons from './FormButtons.jsx';
import {sendPostRequest} from '../../helpers/HTTP_requests.js';


export default class UserGroups extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            permissions: "",

            errorMsg: null,
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
        //TODO obtain user's email from cookies/redux
        let data = {
            email: "testUser2@mail.com",
            name: this.state.name,
            description: this.state.description,
            permissions: 666,// this.state.permissions,
            //path: this.state.path,
        };
        // TODO add email of the user
        // TODO call backend
        this.setState({pending: true});
        console.log("submitting", data);

        sendPostRequest("CREATE_USER_GROUP", data).then((res) => {
            console.log("created", JSON.parse(res.text));
            this.setState({pending: false});
            this.props.cancel()
        }, (err) => {
            this.setState({errorMsg: JSON.parse(err.text).msg, pending: false});
        });
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
                             errorMsg={this.state.nameRequired ? required : this.state.errorMsg}
                             pending={this.state.pending}
                />
            </div>
        )
    }
};
