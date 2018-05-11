import React, { Component } from 'react';
import '../css/query.css';

class Query extends Component {
  constructor() {
    super();
    this.state = {
      'input': '',
      'chr': '',
      'start': '', 
      'end': ''
    };
    this.submitQuery = this.submitQuery.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  handleInputChange(event) {
    this.setState({input: event.target.value});
  }
  
  submitQuery(e) {
    e.preventDefault();
    var input = this.state.input.toLowerCase();
    if (input.includes(":")) {
        var position = input.substring(input.indexOf(":"));
        this.setState({'chr': input.substring(0, input.indexOf(":"))});
      if (input.includes("-")) {
        this.setState({'start': position.substring(1, position.indexOf("-"))});
        this.setState({'end': position.substring(position.indexOf("-")+1)});
      } else {
        this.setState({'start': position.substring(1)});
        this.setState({'end': position.substring(1)});
      }
    } else {
      this.setState({'chr': input});
    }
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
              Chromosome: Start Position-End Position
              <input type="text" onChange={this.handleInputChange}/>
            </label>
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default Query;
