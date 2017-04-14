import React from 'react';

import List from './ItemList/List.jsx';
import Loading from './Loading.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';


export default class ShowInfluxDBs extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            pendingOwnDatabases: false,
            pendingOtherDatabases: false,
            ownDatabases: [],
            otherDatabases: [],
        }
    }

    fetchOwnDatabases() {
        this.setState({pendingOwnDatabases: true});
        //TODO obtain user's email from cookies/redux
        sendPostRequest("GET_OWN_INFLUX_DATABASES", {}).then((data) => {
            //data = this.state.tableHeaders.concat(data);
            console.log("owner", JSON.parse(data.text));
            this.setState({pendingOwnDatabases: false, ownDatabases: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    render() {
        const style = {
            clear: "both",
            paddingTop: 20,
        };

        return (
            <div style={style}>
                <h2>My Databases</h2>
                {this.state.pendingOwnDatabases ? <Loading/> : <List data={this.state.ownDatabases}/>}
                <h2>Other Databases</h2>
                {this.state.pendingOtherDatabases ? <Loading/> : <List data={this.state.otherDatabases}/>}
            </div>
        )
    }
}
