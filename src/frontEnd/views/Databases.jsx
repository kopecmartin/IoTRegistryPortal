import React from 'react';

import List from '../components/ItemList/List.jsx';
import Loading from '../components/Loading.jsx';
import NewInfluxDB from '../components/Forms/AddNewInfluxDB.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';
import UpperToolbar from '../components/UpperToolbar.jsx';


export default class Databases extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            addNewItemClicked: false,
            pendingOwnDatabases: false,
            pendingOtherDatabases: false,
            ownDatabases: [],
            otherDatabases: [],
        }
    }

    componentDidMount() {
        this.fetchOwnDatabases();
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

    addNewItemTrigger() {
        this.setState({addNewItemClicked: !this.state.addNewItemClicked});
        this.fetchOwnDatabases();  // TODO optimization - this is now triggered always
    }

    render() {
        const style = {
            clear: "both",
            paddingTop: 20,
        };

        return (
            <div>
                <h1>Influx Databases</h1>
                <UpperToolbar addNewItemTrigger={this.addNewItemTrigger.bind(this)}/>

                <div style={style}>
                    <h2>My Databases</h2>
                    {this.state.pendingOwnDatabases ? <Loading/> : <List data={this.state.ownDatabases}/>}
                    <h2>Other Databases</h2>
                    {this.state.pendingOtherDatabases ? <Loading/> : <List data={this.state.otherDatabases}/>}
                </div>

                {
                    this.state.addNewItemClicked ?
                        <PopupAddNew close={this.addNewItemTrigger.bind(this)}
                                     title="Create a new Influx database">
                            <NewInfluxDB cancel={this.addNewItemTrigger.bind(this)}/>
                        </PopupAddNew>
                        :
                        null
                }
            </div>
        )
    }
};
