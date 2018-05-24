import React, { Component } from 'react';
import Query from './query';
import Table from './table';
import Tracks from './tracks';
import Home from './home';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class Application extends Component { 
  render() {
    return(
      <BrowserRouter>
        <div className="application">
          <div className="application-header">
              <h1>Open Chromatin Database</h1>
          </div>
          <div className="nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/query">Query</Link></li>
              <li><Link to="/tracks">Tracks</Link></li>
              <li><Link to="/table">Table</Link></li>
            </ul>
          </div>
          <div className="tab-content">
            <Route path="/" exact={true} component={Home} />
            <Route path="/query" component={Query} />
            <Route path="/tracks" component={Tracks} />
            <Route path="/table" component={Table} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default Application;
