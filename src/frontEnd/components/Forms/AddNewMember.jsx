import React from 'react';

import InputLabelForm from './InputLabelForm.jsx';
import FormButtons from '../Buttons/FormButtons.jsx';
import {sendPostRequest, sendDeleteRequest} from '../../helpers/HTTP_requests.js';

import { connect } from 'react-redux'


class AddNewMember extends React.Component {

    constructor(props) {
        super(props);
        console.log(this.props.addMember, this.props.removeMember);

        this.state = {
            email: "",

            groupID: this.props.data._id,

            errorMsg: null,
            emailRequired: null,
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
        if (this.state[name] !== "" && this.state[name + "Required"] !== null) {
            state[name + "Required"] = null;
            this.setState(state);
        }
        return true;
    }

    handlerSubmitBtn() {
        let data = {
            // memberEmail is a backend attribute for an email of a future member
            memberEmail: this.state.email,
            // id is a group ID a new member will be added to
            id: this.state.groupID,
        };

        this.setState({pending: true});
        console.log("submitting", data);

        if (this.props.addMember) {
            sendPostRequest("ADD_GROUP_MEMBER", data).then((res) => {
                console.log("response", JSON.parse(res.text));
                this.setState({pending: false});
                this.props.cancel()
            }, (err) => {
                this.setState({errorMsg: JSON.parse(err.text).msg, pending: false});
            });
        }
        else {
            sendDeleteRequest("REMOVE_GROUP_MEMBER", data).then((res) => {
                console.log("response", JSON.parse(res.text));
                this.setState({pending: false});
                this.props.cancel()
            }, (err) => {
                this.setState({errorMsg: JSON.parse(err.text).msg, pending: false});
            });
        }
    }

    render() {
        return (
            <div>
                <form style={{clear: "both"}}>
                    <InputLabelForm label={this.props.content.email}
                                    type="text"
                                    placeholder={this.state.email}
                                    required={true}
                                    validity={this.state.emailRequired}
                                    onBlur={this.checkValidity.bind(this, "email")}
                                    onChange={this.handlerOnChange.bind(this, "email")}
                    />
                </form>

                <FormButtons submit={this.handlerSubmitBtn.bind(this)}
                             cancel={this.props.cancel}
                             errorMsg={
                                 this.state.emailRequired ?
                                     this.props.warnings.requiredFields
                                     :
                                     this.state.errorMsg}
                             pending={this.state.pending}
                />
            </div>
        )
    }
}

export default connect(
    (state) => ({
        content: state.switchLanguage.content.forms,
        warnings: state.switchLanguage.content.warnings,
    }),
    null
)(AddNewMember)
