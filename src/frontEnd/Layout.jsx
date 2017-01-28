import React from 'react';
import {hashHistory} from 'react-router';
import cookie from 'react-cookie';


export default class Layout extends React.Component {

    componentWillMount() {
        //if (!cookie.load('loggedIn')) {
        //    hashHistory.push('/');
        //}
    }

    render() {
        return (
            <div>
                Layout after log in
                {this.props.children}
            </div>
        );
    }
}
