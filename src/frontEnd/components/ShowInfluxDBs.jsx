import React from 'react';

import List from './ItemList/List.jsx';
import Loading from './Loading.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';

import {connect} from 'react-redux';


class ShowInfluxDBs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            pendingOwnDatabases: false,
            pendingOtherDatabases: false,
            ownDatabases: [],
            otherDatabases: [],
        };
    }

    componentDidMount() {
        this.fetchOwnDatabases();
    }

    componentWillReceiveProps() {
       this.fetchOwnDatabases();
    }


    fetchOwnDatabases() {
        this.setState({pendingOwnDatabases: true});
        //TODO obtain user's email from cookies/redux
        sendPostRequest("GET_OWN_INFLUX_DATABASES", {}).then((data) => {
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
                <h2>{this.props.content.myDatabases}</h2>
                {this.state.pendingOwnDatabases ? <Loading/> : <List onClick={this.props.onClick}
                                                                     data={this.state.ownDatabases}/>}
                <h2>{this.props.content.otherDatabases}</h2>
                {this.state.pendingOtherDatabases ? <Loading/> : <List onClick={this.props.onClick}
                                                                       data={this.state.otherDatabases}/>}
            </div>
        )
    }
}

export default connect(
    (state) => ({
        content: state.switchLanguage.content.page.databases,
    }),
    null
)(ShowInfluxDBs)
