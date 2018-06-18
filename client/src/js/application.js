import React, { Component } from 'react';
import Query from './query';
import Tracks from './tracks';
import Home from './home';
import { BrowserRouter, Route, Link } from 'react-router-dom';

class Application extends Component { 
  render() {
    return(
      <BrowserRouter>
        <div className="application">
          <div className="application-header fixed">
              <h1>Open Chromatin Database</h1>
          </div>
          <div className="nav fixed">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/query">Query</Link></li>
              <li><Link to="/tracks">Tracks</Link></li>
            </ul>
          </div>
          <div className="tab-content">
            <Route path="/" exact={true} component={Home} />
            <Route path="/query" component={Query} />
            <Route path="/tracks" component={Tracks} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default Application;
