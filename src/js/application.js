import React, { Component } from 'react';
import Query from './query';
import Table from './table';
import Tracks from './tracks';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class Application extends Component { 
  render() {
    return(
      <BrowserRouter>
        <div className="Application">
          <div className="Application-header">
              <h1>Open Chromatin Database</h1>
          </div>
          <div className="nav">
            <ul>
              <li><Link to="/query">Query</Link></li>
              <li><Link to="/tracks">Tracks</Link></li>
              <li><Link to="/table">Table</Link></li>
            </ul>
          </div>
          <Route path="/query" component={Query} />
          <Route path="/tracks" component={Tracks} />
          <Route path="/table" component={Table} />
        </div>
      </BrowserRouter>
    );
  }
}

export default Application;
