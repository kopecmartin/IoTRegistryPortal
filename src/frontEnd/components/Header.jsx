import cookie from 'react-cookie';
import {hashHistory} from 'react-router';
import React from 'react';

import DropDown from '../components/Dropdown/DropDown.jsx';
import {sendPostRequest} from '../helpers/HTTP_requests.js';

import {connect} from 'react-redux'
let actions = require('./../actions/actions.js');


const Header = ({changeSite}) => {
    const iconStyle = {
        "color": "#fff",
        "fontSize": 20,
        "margin": 3,
    };

    const userInfoStyle = {
        "float": "right",
        "marginRight": 25,
        "marginTop": 10,
        "cursor": "pointer",
    };

    const logout = () => {
        sendPostRequest("LOGOUT", {}).then((data) => {
            console.log("logging out", JSON.parse(data.text));
            cookie.remove("token");
            hashHistory.push('/');
        }, (err) => {

        });
    };

    const preferences = () => {
        changeSite("/portal/preferences");
        hashHistory.push('/portal/preferences');
    };

    const items = [
        {title: "Preferences", onClick: preferences},
        {title: "Logout", onClick: logout},
    ];

    return (
        <nav className="navbar navbar-pf-vertical">
            <div className="navbar-header">
                <a href="/" className="navbar-brand">
                    <img className="navbar-brand-name" alt="IoT Registry Portal"/>
                </a>
            </div>
            <div style={userInfoStyle}>
                <DropDown button={
                    <div>
                        <span className="fa fa-user" style={iconStyle}/>
                        <span className="fa fa-angle-down" style={iconStyle}/>
                    </div>
                } items={items}/>

            </div>
        </nav>
    )
};

export default connect(
    null,
    (dispatch) => ({changeSite: (site) => dispatch(actions.changeSite(site))})
)(Header)
