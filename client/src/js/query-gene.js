import React, { Component } from 'react';
import FileSaver from 'file-saver';
import './../css/datatables.min.css';

const $ = require('jquery');
$.DataTable = require('datatables.net');
require('datatables.net-buttons');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.flash.js');

class QueryGene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      chr: '',
      beginning: '', 
      end: '',
      columns: [],
      data: [],
      fileName: '',
      loading: 'invisible'
    };
    this.getData = this.getData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.mountTable = this.mountTable.bind(this);
  }
  
  getData(callback) {
    fetch('/api/headers-gene', {
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
        url: '/api/tabledata-gene',
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
          extension: '.bed'
        }, {
          text: 'Download All', 
          action: function () {
            fetch('/api/full-file-gene', {
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
  
  handleSubmit(e) {
    e.preventDefault();
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
      fetch('/api/gene', {
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
      <div className="query">
        <div className={this.state.loading + " loading"}>
          <h2>Loading...</h2>
        </div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Region of Interest:
            <input type="text" onChange={this.handleInputChange} />
            <p className="help">Please format input as following: {"\n"} Chromosome:StartPos-EndPos</p>
          </label>
          <button className="btn" type="submit">Submit</button>
        </form>
        
        <div>
          <table ref="main" className="display" />
        </div>
      </div>
    );
  }
}

export default QueryGene;
