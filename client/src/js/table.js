import React, {Component} from 'react';

import './../css/datatables.min.css';

const $ = require('jquery');
$.DataTable = require('datatables.net');
require('datatables.net-buttons');
require('datatables.net-buttons/js/buttons.html5.js');
require('datatables.net-buttons/js/buttons.flash.js');

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'columns': [],
      'data': [],
    };
    this.getData = this.getData.bind(this);
  }
  
  getData(callback) {
    fetch('/headers')
      .then((res) => {
        return res.json();
      }).then((data) => {
        const columns = Object.keys(data[0]).map((key, id)=>{
          var formattedKey = key.replace('.', '\\.');
          return {
            title: key,
            width: 100,
            data: formattedKey
          }
        });
        this.setState({
          columns: columns,
        });
      callback();
      });
  }
  
  componentDidMount() {
    this.getData(this.mountTable.bind(this));
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
      lengthMenu: [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
      pageLength: 100,
      ajax: {
        url: '/tabledata',
        type: 'POST'
      }, 
      buttons: [
        'copy', {
          extend: 'csv',
          fieldBoundary: null,
          fieldSeparator: '\t',
          extension: '.bed'
        }
       ]
    });
  }
  
  componentWillUnmount(){
     $('.data-table-wrapper')
     .find('table')
     .DataTable()
     .destroy(true);
  }
  
  shouldComponentUpdate() {
      return false;
  }

  render() {
    return (
      <div>
          <table ref="main" className="display" />
      </div>
    )
  }
}

export default Table;