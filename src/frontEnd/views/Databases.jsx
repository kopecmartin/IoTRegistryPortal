import React from 'react';

import NewInfluxDB from '../components/Forms/AddNewInfluxDB.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import UpperToolbar from '../components/UpperToolbar.jsx';
import ShowInfluxDBs from '../components/ShowInfluxDBs.jsx';

import {connect} from 'react-redux';


class Databases extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            addNewItemClicked: false,
            updateSignal: 0,
        }
    }

    clickedItem(data) {
        console.log("item::", data);
    }

    addNewItemTrigger() {
        this.setState({
            addNewItemClicked: !this.state.addNewItemClicked,
            updateSignal: 1
        });
    }

    render() {

        return (
            <div>
                <h1>{this.props.content.influxDBs}</h1>
                <UpperToolbar addNewItemTrigger={this.addNewItemTrigger.bind(this)}/>

               <ShowInfluxDBs update={this.state.updateSignal} onClick={this.clickedItem.bind(this)}/>

                {
                    this.state.addNewItemClicked ?
                        <PopupAddNew close={this.addNewItemTrigger.bind(this)}
                                     title={this.props.content.createNew}>
                            <NewInfluxDB cancel={this.addNewItemTrigger.bind(this)}/>
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
        content: state.switchLanguage.content.page.databases,
    }),
    null
)(Databases)