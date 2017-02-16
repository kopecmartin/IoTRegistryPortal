import React from 'react';
import {hashHistory} from 'react-router';
import cookie from 'react-cookie';

import Header from './components/Header.jsx';
import SideBar from './components/SideBar.jsx';


export default class Layout extends React.Component {

    componentWillMount() {
        //if (!cookie.load('loggedIn')) {
        //    hashHistory.push('/');
        //}
    }

    render() {
        return (
            <div>
                <Header/>
                    <SideBar/>
                    <div style={{"marginLeft": 220}}>
                        {this.props.children}
                    </div>
            </div>
        );
    }
}
