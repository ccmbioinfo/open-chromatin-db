import React, { Component } from 'react';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import DHS from './dhs';
import DHSGene from './dhs-gene';

class Application extends Component { 
  render() {
    return(
      <BrowserRouter>
          <div className="application">
            <div className="application-header">
                <h1>Open Chromatin Database</h1>
            </div>
          <div className="nav main-nav">
            <ul>
              <li><NavLink exact to="/" activeClassName="active">Home</NavLink></li>
              <li><NavLink to="/dhs" activeClassName="active">DHS</NavLink></li>
              <li><NavLink to="/dhs-gene">DHSGene</NavLink></li>
            </ul>
          </div>
          <div className="tab-content">
            <Route exact path="/" component={Home} />
            <Route path="/dhs" component={DHS} />
            <Route path="/dhs-gene" component={DHSGene} />
          </div>
          </div>
      </BrowserRouter>
    );
  }
}

class Home extends Component { 
  render() {
    return (
      <div>
        <h2>Welcome!</h2>
      </div>
    );
  }
}

export default Application;
