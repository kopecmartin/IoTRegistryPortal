import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';

import Layout from './frontEnd/Layout.jsx';
import LoginPage from './frontEnd/views/LoginPage.jsx';
import PreLoginLayout from './frontEnd/PreLoginLayout.jsx';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './frontEnd/reducers/index';

const store = createStore(reducer);


ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={PreLoginLayout}>
                <IndexRoute component={LoginPage}/>
                <Route path="/dashboard" component={Layout}>

                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);