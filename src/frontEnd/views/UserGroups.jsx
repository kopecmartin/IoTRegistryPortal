import React from 'react';
import UpperToolbar from '../components/UpperToolbar.jsx';
import List from '../components/ItemList/List.jsx';
import PopupAddNew from '../components/PopupAddNew.jsx';
import NewGroupForm from '../components/Forms/AddNewUserGroup.jsx';


export default class UserGroups extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            addNewItemClicked: false,
        }
    }

    addNewItemTrigger() {
        this.setState({addNewItemClicked: !this.state.addNewItemClicked});
    }

    render() {
        const style = {
            clear: "both",
            paddingTop: 20,
        };

        const data = [
            {
                name: "TestGroup",
                description: "Description",
                additionalInfoLst: [
                    {
                        name: "Members",
                        number: "8"
                    },
                    {
                        name: "Subgroups",
                        number: "0"
                    }
                ]
            },
        ];

        return (
            <div>
                <h1>User Groups</h1>
                <UpperToolbar addNewItemTrigger={this.addNewItemTrigger.bind(this)}/>

                <div style={style}>
                    <h2>My Groups</h2>
                    <List data={data}/>
                    <h2>Member in</h2>
                    <List data={data}/>
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
