import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import QueryGene from './query-gene';
import Tracks from './tracks';

class DHSGene extends Component {
  render() {
    return (
      <div>
        <div className='nav sub-nav'>
          <ul>
            <li><NavLink exact to="/dhs-gene/">Info</NavLink></li>
            <li><NavLink to="/dhs-gene/query">Query</NavLink></li>
            <li><NavLink to="/dhs-gene/tracks">Tracks</NavLink></li>
          </ul>
        </div>
        <div className='tab-content'>
          <Route exact path={this.props.match.path} component={DHSGeneInfo} />
          <Route path="/dhs-gene/query" component={QueryGene} />
          <Route path="/dhs-gene/tracks" component={Tracks} />
        </div>
      </div>
    )
  }
}

class DHSGeneInfo extends Component { 
  render() {
    return (
      <div>
        <h2>Welcome!</h2>
        <p>Dataset TBD</p>
      </div>
    );
  }
}

export default DHSGene;
