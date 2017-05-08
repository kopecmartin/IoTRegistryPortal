import React from 'react';

import List from '../components/ItemList/List.jsx';
import Loading from '../components/Loading.jsx';
import NewDeviceGroupForm from '../components/Forms/AddNewDeviceGroup.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';
import UpperToolbar from '../components/UpperToolbar.jsx';


export default class Devices extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            addNewItemClicked: false,
            pendingDevices: false,
            pendingOwnGroups: false,
            pendingOtherGroups: false,
            devicesData: [],
            ownGroupsData: [],
            memberInGroupsData: [],
        }
    }

    componentDidMount() {
        this.fetchDevices();
        this.fetchOwnGroupsData();
    }

    fetchDevices() {
        // fetch only devices which belong to main (/ - root) group
        // root group is default, a device is added there automatically
        // after registration
        this.setState({pendingDevices: true});

        sendPostRequest("GET_DEVICES", {groupID: ""}).then((data) => {
            console.log("devices", JSON.parse(data.text));
            this.setState({pendingDevices: false, devicesData: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    fetchOwnGroupsData() {
        this.setState({pendingOwnGroups: true});
        sendPostRequest("GET_DEVICE_GROUPS_BY_OWNERSHIP", {}).then((data) => {
            console.log("own", JSON.parse(data.text));
            this.setState({pendingOwnGroups: false, ownGroupsData: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    addNewItemTrigger() {
        this.setState({addNewItemClicked: !this.state.addNewItemClicked});
        this.fetchOwnGroupsData();
    }

    render() {
        const style = {
            clear: "both",
            paddingTop: 20,
        };

        return (
            <div>
                <h1>Devices</h1>
                <UpperToolbar addNewItemTrigger={this.addNewItemTrigger.bind(this)}/>

                <div style={style}>
                    <h2>My Devices</h2>
                    {this.state.pendingDevices ? <Loading/> : <List data={this.state.devicesData}/>}
                </div>

                <div style={style}>
                    <h2>My Device Groups</h2>
                    {this.state.pendingOwnGroups ? <Loading/> : <List data={this.state.ownGroupsData}/>}
                </div>

                {
                    this.state.addNewItemClicked ?
                        <PopupAddNew close={this.addNewItemTrigger.bind(this)}
                                     title="Create a new device group">
                            <NewDeviceGroupForm cancel={this.addNewItemTrigger.bind(this)}/>
                        </PopupAddNew>
                        :
                        null
                }
            </div>
        )
    }
};
