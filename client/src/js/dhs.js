import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import Query from './query';
import Tracks from './tracks';

class DHS extends Component {
  render() {
    return (
      <div>
        <div className='nav sub-nav'>
          <ul>
            <li><NavLink exact to="/dhs/">Info</NavLink></li>
            <li><NavLink to="/dhs/query">Query</NavLink></li>
            <li><NavLink to="/dhs/tracks">Tracks</NavLink></li>
          </ul>
        </div>
        <div className='tab-content'>
          <Route exact path={this.props.match.path} component={DHSInfo} />
          <Route path="/dhs/query" component={Query} />
          <Route path="/dhs/tracks" component={Tracks} />
        </div>
      </div>
    )
  }
}

class DHSInfo extends Component { 
  render() {
    var list = [];
    for (var i = 1; i < 23 ; i++) {
      list.push(<ChrLink key={i} val={i} />);
    }
    return (
      <div>
        <h2>Welcome!</h2>
        <p>Here are links to download the dataset:</p>
        <div className="grid-container">
          <a className="grid-item" href={"/files/All-tracks-sorted.bed"} download="All-Tracks.bed">All Tracks</a>
          {list}
        </div>
      </div>
    );
  }
}

class ChrLink extends Component {
  render() {
    return (
      <a className="grid-item" href={"/files/bed/" + this.props.val + ".bed"} download={"chr" + this.props.val + ".bed"} >
        Chromosome {this.props.val}
      </a>
    );
  }
}

export default DHS;
