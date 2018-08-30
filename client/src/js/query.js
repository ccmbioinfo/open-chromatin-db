import React, { Component } from 'react';
import FileSaver from 'file-saver';
import './../css/datatables.min.css';
import './../css/fixedColumns.dataTables.min.css';

const $ = require('jquery');
$.DataTable = require('datatables.net');
require('datatables.net-buttons');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.flash.js');
require('datatables.net-fixedcolumns-dt');
const queryString = require('query-string');

class Query extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      inputError: '',
      inputValid: true,
      jbrowse: false,
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
  
  componentWillMount() {
    var parsed = queryString.parse(this.props.location.search);
    if (parsed.search !== undefined) {
      var searchValue = parsed.search;
      this.setState({
        input: searchValue,
        disabledInput: true,
        jbrowse: true
      });
      this.makeQuery();
    }
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
      scrollX: true,
      scrollCollapse: true,
      fixedColumns:   {
        leftColumns: 3
      },
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
    this.setState({input: e.target.value.replace(/\s+/g, '')});
  }
  
  isValidInput() {
    if (!this.state.input.match(/^chr([1-9]|[1][0-9]|2[012])(?:|:\d+-\d+)$/i) && this.state.input !== "") {
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
    if (this.state.inputValid && this.state.input !== "") {
      this.makeQuery();
    }
  }
  
  makeQuery() {
    this.setState({
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
          input: this.state.input,
          jbrowse: this.state.jbrowse
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
        {!this.state.jbrowse &&
          <div>
            <h3>Query</h3>
            <div className={this.state.loading + " loading"}>
              <h3>Loading...</h3>
            </div>
            <fieldset disabled={this.state.disabledInput ? true : false}>
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
            </fieldset>
            <p className={!this.state.inputValid ? "alert alert-danger" : ""}>{this.state.inputError}</p>
          </div>
        }
        <div>
          <table ref="main" className="display" />
        </div>
      </div>
    );
  }
}

export default Query;
