import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css'

import App from './App';
import './App.css';

ReactDOM.render(
    <Router>
        <App config={window.appConfig}/>
    </Router>,
  document.getElementById('root')
);
