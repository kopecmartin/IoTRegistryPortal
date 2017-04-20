import React from 'react';

import List from '../components/ItemList/List.jsx';
import Loading from '../components/Loading.jsx';
import NewDeviceGroupForm from '../components/Forms/AddNewDeviceGroup.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';
import UpperToolbar from '../components/UpperToolbar.jsx';


export default class Devices extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            addNewItemClicked: false,
            pendingOwnGroups: false,
            pendingOtherGroups: false,
            ownGroupsData: [],
            memberInGroupsData: [],
        }
    }

    componentDidMount() {
        this.fetchOwnGroupsData();
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
