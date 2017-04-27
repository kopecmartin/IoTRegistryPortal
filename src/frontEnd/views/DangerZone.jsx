import InputLabelFormat from '../components/Forms/InputLabelForm.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import React from 'react';
import {sendDeleteRequest, sendPutRequest} from '../helpers/HTTP_requests.js';


export default class DangerZone extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            deviceID: "",
            newOwnerEmail: "",

            addDevice: false,
            pending: false,
            msg: null,
        }
    }

    addDeviceTrigger() {
        this.setState({addDevice: !this.state.addDevice});
    }

    handlerOnChange(name, evt) {
        let state = {};
        state[name] = evt.target.value;
        this.setState(state);
    }

    deleteDevice() {
        this.setState({pending: true});
        sendDeleteRequest("DELETE_DEVICE", {id: this.state.deviceID}).then((data) => {
            console.log("device deleted", JSON.parse(data.text));
            this.setState({pending: false, deviceID: ""});
        }, (err) => {

        });
    }

    passDeviceAnotherUser() {
        this.setState({pending: true});
        let data = {
            id: this.state.databaseName,
            newOwnerEmail: this.state.newOwnerEmail,
        };
        sendPutRequest("PASS_DEVICE_ANOTHER_USER", data).then((data) => {
            console.log("device passed to another user", JSON.parse(data.text));
            let msg = (
                <strong className="alert alert-success"
                        style={{marginLeft: 50}}>
                    Device has deleted successfully
                </strong>
            );
            this.setState({pending: false, deviceID: "", newOwnerEmail: "", msg: msg});
        }, (err) => {

        });
    }

    render() {
        return (
            <div>
                <h1>Danger Zone</h1>

                <h2>Devices</h2>



                <p>Choose a device</p>
                <InputLabelFormat required={true}
                                  placeholder={this.state.deviceID}
                                  help="ID of a device to work with"
                                  onChange={this.handlerOnChange.bind(this, "deviceID")}
                                  //onClick={this.addDeviceTrigger.bind(this)}
                                  label="Device"/>

                {
                    this.state.deviceID !== "" ?
                        <div>
                            <button type="button"
                                    onClick={this.deleteDevice.bind(this)}
                                    className="btn btn-danger">
                                Delete the device
                            </button>
                            <button type="button"
                                    onClick={this.passDeviceAnotherUser.bind(this)}
                                    className="btn btn-warning">
                                Pass the device to another user
                            </button>

                        </div>
                        :
                        null
                }

                {
                    this.state.msg === null ?
                        null
                        :
                        null
                }

                {
                    this.state.addDevice ?
                        <PopupAddNew close={this.addDeviceTrigger.bind(this)}
                                     title="Choose a device">
                            <div>

                            </div>
                        </PopupAddNew>
                        :
                        null
                }
            </div>
        )
    }
};