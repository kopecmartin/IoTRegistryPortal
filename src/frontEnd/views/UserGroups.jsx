import React from 'react';

import List from '../components/ItemList/List.jsx';
import Loading from '../components/Loading.jsx';
import NewGroupForm from '../components/Forms/AddNewUserGroup.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import {sendPostRequest, sendDeleteRequest} from '../helpers/HTTP_requests.js';
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
            editData: null,
        }
    }

    componentDidMount() {
        this.fetchOwnGroupsData();
        this.fetchMemberInGroupsData();
    }

    itemAction(type, data) {
        console.log("item action", type, data);
        switch (type) {
            case "update":
                this.setState({editData: data});
                break;
            case "delete":
                this.setState({pendingOwnGroups: true});
                sendDeleteRequest("DELETE_USER_GROUP", {id: data._id}).then((data) => {
                    console.log("deleted", JSON.parse(data.text));
                    this.setState({pendingOwnGroups: false});
                    this.fetchOwnGroupsData();
                }, (err) => {

                });
                break;
        }
    }

    fetchOwnGroupsData() {
        this.setState({pendingOwnGroups: true});
        sendPostRequest("GET_GROUPS_BY_OWNERSHIP", {}).then((data) => {
            console.log("owner", JSON.parse(data.text));
            this.setState({pendingOwnGroups: false, ownGroupsData: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    fetchMemberInGroupsData() {
        this.setState({pendingOtherGroups: true});
        sendPostRequest("GET_GROUPS_BY_MEMBERSHIP", {}).then((data) => {
            console.log("member", JSON.parse(data.text));
            this.setState({pendingOtherGroups: false, memberInGroupsData: JSON.parse(data.text)});
        }, (err) => {

        });
    }

    addNewItemTrigger(state) {
        this.setState({addNewItemClicked: state, editData: null});
        this.fetchOwnGroupsData();
    }

    render() {
        const style = {
            clear: "both",
            paddingTop: 20,
        };
        let rowActions = [
            {title: "update", onClick: this.itemAction.bind(this, "update")},
            {title: "delete", onClick: this.itemAction.bind(this, "delete")}
            ];

        return (
            <div>
                <h1>User Groups</h1>
                <UpperToolbar addNewItemTrigger={this.addNewItemTrigger.bind(this, true)}/>

                <div style={style}>
                    <h2>My Groups</h2>
                    {this.state.pendingOwnGroups ? <Loading/> : <List data={this.state.ownGroupsData}
                                                                      dropDownOptions={rowActions}
                                                                      additionalInfo={true}/>}
                    <h2>Member in</h2>
                    {this.state.pendingOtherGroups ? <Loading/> : <List data={this.state.memberInGroupsData}
                                                                        additionalInfo={true}/>}
                </div>

                {
                    this.state.addNewItemClicked || this.state.editData !== null ?
                    <PopupAddNew close={this.addNewItemTrigger.bind(this, false)}
                                 title={this.state.editData === null ?
                                     "Create a new user group"
                                     :
                                     "Update the user group"}>
                        <NewGroupForm editData={this.state.editData}
                                      cancel={this.addNewItemTrigger.bind(this, false)}/>
                    </PopupAddNew>
                    :
                    null
                }

            </div>
        )
    }
};
