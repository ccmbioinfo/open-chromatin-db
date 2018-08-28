import React, { Component } from 'react';

class Tracks extends Component { 
  render() {
    return (
      <div>
        <h2>Tracks</h2>
        <iframe src="http://172.20.4.59:3002" title="JBrowse" width="95%" height="100%" />
      </div>
    );
  }
}

export default Tracks;
