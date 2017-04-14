import React from 'react';

import NewInfluxDB from '../components/Forms/AddNewInfluxDB.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import UpperToolbar from '../components/UpperToolbar.jsx';
import ShowInfluxDBs from '../components/ShowInfluxDBs.jsx';


export default class Databases extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            addNewItemClicked: false,
        }
    }

    addNewItemTrigger() {
        this.setState({addNewItemClicked: !this.state.addNewItemClicked});
        this.fetchOwnDatabases();  // TODO optimization - this is now triggered always
    }

    render() {

        return (
            <div>
                <h1>Influx Databases</h1>
                <UpperToolbar addNewItemTrigger={this.addNewItemTrigger.bind(this)}/>

               <ShowInfluxDBs />

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
