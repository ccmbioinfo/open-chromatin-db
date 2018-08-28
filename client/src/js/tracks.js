import React, { Component } from 'react';

class Tracks extends Component { 
  render() {
    return (
      <div>
        <h3>Tracks</h3>
        <iframe src="/jbrowse" title="JBrowse" width="95%" height="100%" />
      </div>
    );
  }
}

export default Tracks;
