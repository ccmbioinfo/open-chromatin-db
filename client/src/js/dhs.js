import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Download from './download';
import Query from './query';
import Tracks from './tracks';

class DHS extends Component {
  render() {
    return (
      <div>
        <Route path="/dhs/download" component={Download} />
        <Route path="/dhs/query" component={Query} />
        <Route path="/dhs/tracks" component={Tracks} />
      </div>
    )
  }
}

export default DHS;
