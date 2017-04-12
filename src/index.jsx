import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory, hashHistory} from 'react-router';

import DangerZone from './frontEnd/views/DangerZone.jsx';
import Dashboard from './frontEnd/views/Dashboard.jsx';
import Databases from './frontEnd/views/Databases.jsx';
import Devices from './frontEnd/views/Devices.jsx';
import Layout from './frontEnd/Layout.jsx';
import LoginPage from './frontEnd/views/LoginPage.jsx';
import NotFound from './frontEnd/views/NotFound.jsx';
import PreLoginLayout from './frontEnd/PreLoginLayout.jsx';
import Registration from './frontEnd/views/Registration.jsx';
import Settings from './frontEnd/views/Settings.jsx';
import UserGroups from './frontEnd/views/UserGroups.jsx';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './frontEnd/reducers/index';

const store = createStore(reducer);
console.log("store", store.getState());

// TODO create independent register page, so it has its own URL
ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={PreLoginLayout}>
                <IndexRoute component={LoginPage}/>
                <Route path="/portal" component={Layout}>
                    <Route path="/portal/dashboard" component={Dashboard}/>
                    <Route path="/portal/groups" component={UserGroups}/>
                    <Route path="/portal/devices" component={Devices}/>
                    <Route path="/portal/databases" component={Databases}/>
                    <Route path="/portal/registration" component={Registration}/>
                    <Route path="/portal/danger" component={DangerZone}/>
                    <Route path="/portal/settings" component={Settings}/>
                    <Route path="*" component={NotFound}/>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);