import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './css/index.css';
import Application from './js/application';

ReactDOM.render((
  <BrowserRouter>
    <Application />
  </BrowserRouter>
  ), document.getElementById('root'));
