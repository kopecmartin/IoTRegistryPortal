import Highlight from 'react-syntax-highlight';
import React from 'react';

import AssociateDB from '../components/Forms/AssociateDB.jsx';
import InputLabelForm from '../components/Forms/InputLabelForm.jsx';
import ObtainAPIKey from '../components/ObtainAPIKey.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import {sendPostRequest, sendDeleteRequest, sendPutRequest} from '../helpers/HTTP_requests.js';

import {connect} from 'react-redux';


class Registration extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            databaseName: "",
            APIKeyObject: null,

            addInfluxDB: false,
            pending: false,
            timedOut: false,
        };
    }

    clickedItem(data) {
        console.log("item:", data);
        this.setState({databaseName: data.name, addInfluxDB: false});
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
                {this.props.warnings.apiExpired}
            </strong>
        );

        return (
            <div>
                <h1>{this.props.content.registration}</h1>

                <h2>{this.props.content.step1}</h2>
                <p>{this.props.content.step1Info}</p>
                <InputLabelForm required={true}
                                help={this.props.content.step1Help}
                                placeholder={this.state.databaseName}
                                onClick={this.addDatabaseTrigger.bind(this)}
                                label={this.props.content.influxDB}/>

                {
                    this.state.databaseName !== "" ?
                        <div>
                            <h2>{this.props.content.step2}</h2>
                            <p>{this.props.content.step2Info}</p>
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
                            <h2>{this.props.content.step3}</h2>
                            <p>{this.props.content.step3Info}</p>
                            <Highlight lang="javascript"
                                       value={
                                           "{\n"+
                                           "\tid: // " + this.props.content.idHelp + "\n" +
                                           "\tioFeatures: // " + this.props.content.ioFeaturesHelp + "\n" +
                                           "\tAPIKey:" + this.state.APIKeyObject.api_key+"\n" +
                                           "}"
                                       }
                            />
                        </div>
                }


                {
                    this.state.addInfluxDB ?
                        <PopupAddNew close={this.addDatabaseTrigger.bind(this)}
                                     title={this.props.content.associateDB}>
                            <AssociateDB onClick={this.clickedItem.bind(this)}/>
                        </PopupAddNew>
                        :
                        null
                }
            </div>
        )
    }
}

export default connect(
    (state) => ({
        content: state.switchLanguage.content.page.registration,
        warnings: state.switchLanguage.content.warnings,
    }),
    null
)(Registration)