import React, { Component } from 'react';

class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'input': '',
      'chr': '',
      'start': '', 
      'end': ''
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
      }).catch(error => {
        throw(error);
      }).then((res) => {
        console.log(res);
        return res.json();
      }).then((data) => {
        console.log(data);
          this.setState({
            'downloadUrl': data.url
          });
        });
    });
  }
  
  render() {  
    return (
      <div className="query">
        <form onSubmit={this.handleSubmit}>
          <label>
            Region of Interest:
            <input type="text" onChange={this.handleInputChange} />
            <p className="help">Please format input as following: {"\n"} Chromosome:StartPos-EndPos</p>
          </label>
          <input className="btn" type="submit" />
        </form>
        <div className="query-download">
          <DownloadButton url={this.state.downloadUrl}/>
        </div>
      </div>
    );
  }
}

class DownloadButton extends Component {
  render() {
    return (
      <a className="btn" href={window.location.origin + "/files/" + this.props.url} download="Query-result.bed">Download</a>
    )
  }
}

export default Query;
