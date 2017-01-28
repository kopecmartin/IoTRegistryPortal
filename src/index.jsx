import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import Layout from './frontEnd/Layout.jsx';
import LoginPage from './frontEnd/views/LoginPage.jsx';
import PreLoginLayout from './frontEnd/PreLoginLayout.jsx';


ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={PreLoginLayout}>
            <IndexRoute component={LoginPage}/>
            <Route path="/dashboard" component={Layout}>

            </Route>
        </Route>
    </Router>,
    document.getElementById('app')
);