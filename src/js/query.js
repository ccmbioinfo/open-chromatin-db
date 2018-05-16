import React, { Component } from 'react';

class Query extends Component {
  constructor() {
    super();
    this.state = {
      'input': '',
      'chr': '',
      'start': '', 
      'end': '',
      'showDownload': false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  handleInputChange(e) {
    this.setState({input: e.target.value});
  }
  
  handleSubmit(e) {
    e.preventDefault();
    var input = this.state.input.toLowerCase();
    var chr = ''; var start = ''; var end = '';
    if (input.includes(":")) {
      var position = input.substring(input.indexOf(":"));
      chr = input.substring(0, input.indexOf(":"));
      if (input.includes("-")) {
        start = position.substring(1, position.indexOf("-"));
        end = position.substring(position.indexOf("-")+1);
      } else {
        start = position.substring(1);
        end = position.substring(1);
      }
    } else {
      chr = input;
    }
    this.setState({
      'chr': chr,
      'start': start,
      'end': end
    }, function() {
      fetch('/search', {
        headers: new Headers({
          'Content-Type': 'application/json'
        }), 
        method: 'POST', 
        body: JSON.stringify({
          'chr': this.state.chr,
          'start': this.state.start,
          'end': this.state.end
        }) 
      });
    });
  }
  
  render() {
    return (
      <div className="Query">
        <form onSubmit={this.handleSubmit}>
          <label>
            Chromosome: Start Position-End Position
            <input type="text" onChange={this.handleInputChange} />
          </label>
          <input type="submit" />
        </form>
        <div className="Query-download">
          <DownloadButton />
        </div>
      </div>
    );
  }
}

class DownloadButton extends Component {
  render() {
    return (
      <a href={window.location.origin + "/files/Query-result.bed"} download="Query-result.bed">Download</a>
    )
  }
}

export default Query;
