import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import DownloadGene from './download-gene';
import QueryGene from './query-gene';
import TracksGene from './tracks-gene';

class DHSGene extends Component {
  render() {
    return (
      <div>
        <Route path="/dhs-gene/download" component={DownloadGene} />
        <Route path="/dhs-gene/query" component={QueryGene} />
        <Route path="/dhs-gene/tracks" component={TracksGene} />
        <Route path="/dhs-gene/jbrowse-query" component={QueryGene} />
      </div>
    )
  }
}

export default DHSGene;
