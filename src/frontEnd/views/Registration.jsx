import Highlight from 'react-syntax-highlight';
import React from 'react';

import AssociateDB from '../components/Forms/AssociateDB.jsx';
import InputLabelFormat from '../components/Forms/InputLabelForm.jsx';
import ObtainAPIKey from '../components/ObtainAPIKey.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import {sendPostRequest, sendDeleteRequest, sendPutRequest} from '../helpers/HTTP_requests.js';


class Registration extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            databaseName: "test",
            APIKeyObject: null,

            addInfluxDB: false,
            pending: false,
            timedOut: false,
        };
    }

    addDatabaseTrigger() {
        this.setState({addInfluxDB: !this.state.addInfluxDB});
    }

    getAPIKey() {
        this.setState({pending: true});
        sendPostRequest("GET_API_KEY", {databaseName: this.state.databaseName}).then((data) => {
            console.log("got API key", JSON.parse(data.text));
            this.setState({pending: false, APIKeyObject: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    timedOut() {
        this.setState({APIKeyObject: null, timedOut: true});
    }

    deleteAPIKey() {
        this.setState({pending: true});
        sendDeleteRequest("DELETE_API_KEY", {api_key: this.state.APIKeyObject.api_key}).then((data) => {
            console.log("deleted", JSON.parse(data.text));
            this.setState({pending: false, APIKeyObject: null});
        }, (err) => {

        });
    }

    extendAPIKeyLife() {
        this.setState({pending: true});
        sendPutRequest("UPDATE_API_KEY", {api_key: this.state.APIKeyObject.api_key}).then((data) => {
            console.log("updated", JSON.parse(data.text));
            this.setState({pending: false, APIKeyObject: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    render() {
        // TODO center it better!
        let timedOutMsg = (
            <strong className="form-text alert alert-danger"
                                  style={{marginLeft: "40%"}}>
                The API key has expired, generate new one.
            </strong>
        );

        return (
            <div>
                <h1>Registration</h1>

                <h2>Step 1</h2>
                <p>Associate an Influx database with a device.</p>
                <InputLabelFormat required={true}
                                  help="Choose a database where a device will send measurements to."
                                  onClick={this.addDatabaseTrigger.bind(this)}
                                  label="Influx Database"/>

                {
                    this.state.databaseName !== "" ?
                        <div>
                            <h2>Step 2</h2>
                            <p>Generate an API key for a device.</p>
                            <ObtainAPIKey getApiKey={this.getAPIKey.bind(this)}
                                          deleteApiKey={this.deleteAPIKey.bind(this)}
                                          extendApiKeyLife={this.extendAPIKeyLife.bind(this)}
                                          timedOut={this.timedOut.bind(this)}
                                          APIKeyObject={this.state.APIKeyObject}/>
                            {this.state.timedOut ?  timedOutMsg : null}
                        </div>
                        :
                        null
                }

                {
                    this.state.APIKeyObject === null ?
                        null
                        :
                        <div>
                            <h2>Step 3</h2>
                            <p>Now you have all information needed for device registration.</p>
                            <Highlight lang="javascript"
                                       value={
                                           "{\n"+
                                           "\tid: // Your device's ID\n" +
                                           "\tioFeatures: // Schema of your device's input/output features\n" +
                                           "\tAPIKey:" + this.state.APIKeyObject.api_key+"\n" +
                                           "}"
                                       }
                            />
                        </div>
                }


                {
                    this.state.addInfluxDB ?
                        <PopupAddNew close={this.addDatabaseTrigger.bind(this)}
                                     title="Associate a database">
                            <AssociateDB/>
                        </PopupAddNew>
                        :
                        null
                }
            </div>
        )
    }
}

export default Registration;