import React, { Component } from 'react';
import FileSaver from 'file-saver';
import './../css/datatables.min.css';

const $ = require('jquery');
$.DataTable = require('datatables.net');
require('datatables.net-buttons');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.flash.js');

class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      chr: '',
      beginning: '', 
      end: '',
      inputError: '',
      inputValid: true,
      columns: [],
      data: [],
      fileName: '',
      loading: 'invisible'
    };
    this.getData = this.getData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.makeQuery = this.makeQuery.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.mountTable = this.mountTable.bind(this);
    this.isValidInput = this.isValidInput.bind(this);
  }
  
  getData(callback) {
    fetch('/api/headers', {
      method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: this.state.fileName
        })
      }).then((res) => {
        return res.json();
      }).then((data) => {
        const columns = Object.keys(data).map((key) => {
          return {
            title: data[key],
            width: 100,
            data: key
          }
        });
        this.setState({
          columns: columns,
        });
      callback();
      });
  }
  
  mountTable() {
    $(this.refs.main).DataTable({
      dom: '<"data-table-wrapper"Brfltip>',
      columns: this.state.columns,
      ordering: false,
      serverSide: true,
      searching: false,
      processing: true,
      paging: true,
      destroy: true,
      pageLength: 10,
      ajax: {
        url: '/api/tabledata',
        type: 'POST', 
        data: {
          'file': this.state.fileName
        }
      }, 
      buttons: [
        'copy', {
          extend: 'csv',
          text: 'Download This Page',
          fieldBoundary: null,
          fieldSeparator: '\t',
          title: 'DHS-page',
          extension: '.bed'
        }, {
          text: 'Download All', 
          action: function () {
            fetch('/api/full-file', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fileName: this.state.fileName
              })
            }).then(function(response) {
              return response.blob();
            }).then(function(blob) {
              FileSaver.saveAs(blob, 'DHS.bed');
            });
          }.bind(this)
        }
      ],
      language: {
        processing: '<span class="sr-only">Loading...</span>'
      }
    });
  }
  
  componentWillUnmount() {
    $('.data-table-wrapper')
     .find('table')
     .DataTable()
     .destroy(true);
  }
  
  handleInputChange(e) {
    this.setState({input: e.target.value});
  }
  
  isValidInput() {
    if (!this.state.input.match(/^chr([1-9]|[1][0-9]|2[012]):\d+-\d+/) && !this.state.input.match(/^chr([1-9]|[1][0-9]|2[012])$/)) {
      this.setState({
        inputValid: false,
        inputError: 'Please format your query properly. For example, a valid entry would be "chr3:12350-123555".'
      });
    } else {
      this.setState({
        inputValid: true,
        inputError: ''
      });
    }
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.inputValid) {
      this.makeQuery();
    }
  }
  
  makeQuery() {
    var input = this.state.input.toLowerCase();
    var chr = ''; var beginning = ''; var end = '';
    if (input.includes(":")) {
      var position = input.substring(input.indexOf(":"));
      chr = input.substring(0, input.indexOf(":"));
      if (input.includes("-")) {
        beginning = position.substring(1, position.indexOf("-"));
        end = position.substring(position.indexOf("-")+1);
      } else {
        beginning = position.substring(1);
        end = position.substring(1);
      }
    } else {
      chr = input;
    }
    this.setState({
      chr: chr,
      beginning: beginning,
      end: end,
      loading: 'visible'
    }, function() {
      if (document.querySelector('.data-table-wrapper')) {
        $('.data-table-wrapper')
         .find('table')
         .DataTable()
         .clear();
      }  
      fetch('/api/dhs', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chr: this.state.chr,
          beginning: this.state.beginning,
          end: this.state.end
        })
      }).then((res) => {
        return res.json();
      }).then((data) => { 
        this.setState({
          fileName: data.fileName,
          loading: 'invisible'
        });
        this.getData(this.mountTable.bind(this));
      });
    });
  }
  
  render() { 
    return (
      <div>
        <h2>Query</h2>
        <div className={this.state.loading + " loading"}>
          <h2>Loading...</h2>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label className="two-third">
            Region of Interest:
            <input type="text" onChange={this.handleInputChange} onBlur={this.isValidInput}/>
            <p className="help">Please format input as following: {"\n"} Chr:StartPos-EndPos</p>
          </label>
          <label className="one-third">
            <button className="btn" type="submit">Submit</button>
          </label>
        </form>
        <p className={!this.state.inputValid ? "alert alert-danger" : ""}>{this.state.inputError}</p>
        <div>
          <table ref="main" className="display" />
        </div>
      </div>
    );
  }
}

export default Query;
