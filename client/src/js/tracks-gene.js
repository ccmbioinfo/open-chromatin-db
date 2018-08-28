import React, { Component } from 'react';

class TracksGene extends Component { 
  render() {
    return (
      <div>
        <h3>Tracks</h3>
        <iframe src="/jbrowse_gene/?data=hg19" title="JBrowse" width="95%" height="100%" />
      </div>
    );
  }
}

export default TracksGene;
