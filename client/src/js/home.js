import React, { Component } from 'react';

class Home extends Component { 
  render() {
    return (
      <div>
        <h2>Welcome!</h2>
        <p>Here's a link to the entire dataset: <a href={"files/All-tracks-sorted.bed"} download="All-Tracks.bed">All Tracks</a></p>
      </div>
    );
  }
}

export default Home;
