import React, { Component } from 'react';
import '../css/query.css';

class Query extends Component {
  constructor() {
    super();
    this.submitQuery = this.submitQuery.bind(this);
    this.handleChrChange = this.handleChrChange.bind(this);
    this.handleStartChange = this.handleStartChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
  }
  
  handleChrChange(event) {
    this.setState({chr: event.target.value});
  }
  
  handleStartChange(event) {
    this.setState({start: event.target.value});
  }
  
  handleEndChange(event) {
    this.setState({end: event.target.value});
  }
  
  submitQuery(e) {
    e.preventDefault();
    fetch('/query', {
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
  }
  
  render() {
    return (
      <div className="Query">
        <div className="Query-intro">
          <form onSubmit={this.submitQuery}>
            <label>
              Chromosome:
              <input type="text" onChange={this.handleChrChange}/>
            </label>
            <label>
              Start Position:
              <input type="text" onChange={this.handleStartChange}/>
            </label>
            <label>
              End Position:
              <input type="text" onChange={this.handleEndChange}/>
            </label>
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default Query;
