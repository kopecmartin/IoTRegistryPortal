import React from 'react';

import List from '../components/ItemList/List.jsx';
import Loading from '../components/Loading.jsx';
import NewGroupForm from '../components/Forms/AddNewUserGroup.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';
import UpperToolbar from '../components/UpperToolbar.jsx';


export default class UserGroups extends React.Component {

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
        this.fetchMemberInGroupsData();
    }

    fetchOwnGroupsData() {
        this.setState({pendingOwnGroups: true});
        //TODO obtain user's email from cookies/redux
        sendPostRequest("GET_GROUPS_BY_OWNERSHIP", {email: "testUser2@mail.com"}).then((data) => {
            //data = this.state.tableHeaders.concat(data);
            console.log("owner", JSON.parse(data.text));
            this.setState({pendingOwnGroups: false, ownGroupsData: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    fetchMemberInGroupsData() {
        this.setState({pendingOtherGroups: true});
        sendPostRequest("GET_GROUPS_BY_MEMBERSHIP", {email: "testUser2@mail.com"}).then((data) => {
            console.log("member", JSON.parse(data.text));
            this.setState({pendingOtherGroups: false, memberInGroupsData: JSON.parse(data.text)});
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
                <h1>User Groups</h1>
                <UpperToolbar addNewItemTrigger={this.addNewItemTrigger.bind(this)}/>

                <div style={style}>
                    <h2>My Groups</h2>
                    {this.state.pendingOwnGroups ? <Loading/> : <List data={this.state.ownGroupsData}/>}
                    <h2>Member in</h2>
                    {this.state.pendingOtherGroups ? <Loading/> : <List data={this.state.memberInGroupsData}/>}
                </div>

                {
                    this.state.addNewItemClicked ?
                    <PopupAddNew close={this.addNewItemTrigger.bind(this)}
                                 title="Create a new user group">
                        <NewGroupForm cancel={this.addNewItemTrigger.bind(this)}/>
                    </PopupAddNew>
                    :
                    null
                }
            </div>
        )
    }
};
