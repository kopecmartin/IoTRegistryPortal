import React from 'react';
import {hashHistory} from 'react-router';

import { connect } from 'react-redux'
let actions = require('./../actions/actions.js');


const SideBar = ({content, site, changeSite}) => {

    const changeTo = (site) => {
        changeSite(site);
        hashHistory.push(site);
    };

    return (
        <div className="nav-pf-vertical nav-pf-vertical-with-sub-menus">
            <ul className="list-group">
                <li className={site.indexOf("dashboard") >= 0 ? "list-group-item active" : "list-group-item"}
                    onClick={() => changeTo("/portal/dashboard")}>
                    <a>
                        <span className="fa fa-dashboard"/>
                        <span className="list-group-item-value">{content.dashboard}</span>
                    </a>
                </li>
                <li className={site.indexOf("groups") >= 0 ? "list-group-item active" : "list-group-item"}
                    onClick={() => changeTo("/portal/groups")}>
                    <a>
                        <span className="fa fa-users"/>
                        <span className="list-group-item-value">{content.userGroups}</span>
                    </a>
                </li>
                <li className={site.indexOf("devices") >= 0 ? "list-group-item active" : "list-group-item"}
                    onClick={() => changeTo("/portal/devices")}>
                    <a>
                        <span className="fa fa-server"/>
                        <span className="list-group-item-value">{content.devices}</span>
                    </a>
                </li>
                <li className={site.indexOf("registration") >= 0 ? "list-group-item active" : "list-group-item"}
                    onClick={() => changeTo("/portal/registration")}>
                    <a>
                        <span className="fa fa-plus"/>
                        <span className="list-group-item-value">{content.registration}</span>
                    </a>
                </li>
                <li className={site.indexOf("danger") >= 0 ? "list-group-item active" : "list-group-item"}
                    onClick={() => changeTo("/portal/danger")}>
                    <a>
                        <span className="fa fa-exclamation-circle"/>
                        <span className="list-group-item-value">{content.dangerZone}</span>
                    </a>
                </li>
                <li className={site.indexOf("settings") >= 0 ? "list-group-item active" : "list-group-item"}
                    onClick={() => changeTo("/portal/settings")}>
                    <a>
                        <span className="fa fa-cog"/>
                        <span className="list-group-item-value">{content.settings}</span>
                    </a>
                </li>
            </ul>
        </div>
    )
};

export default connect(
    (state) => ({
        content: state.switchLanguage.content.page.sidebar,
        site: state.changeSite.site
    }),
    (dispatch) => ({changeSite: (site) => dispatch(actions.changeSite(site))})
)(SideBar)
