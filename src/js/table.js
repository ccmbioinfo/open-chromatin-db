import React, { Component } from 'react';

const $ = require('jquery');
$.DataTable = require('datatables.net');

const columns = [
  {
    title: "DHS.Chr",
    width: 180,
    data: "DHS\\.Chr"
  },
  {
    title: "DHS.Start",
    width: 180,
    data: "DHS\\.Start"
  },
  {
    title: "DHS.End",
    width: 180,
    data: "DHS\\.End"
  },
];

class Table extends Component { 
  componentDidMount() {
    $(this.refs.main).DataTable({
      "dom": '<"data-table-wrapper">',
      "columns": columns,
      "pageType": 'full_numbers',
      "processing": true,
      "serverSide": true,
      "ajax": {
        url: '/tabledata',
        dataSrc: ''
      }
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
        <table ref="main" />
      </div>
    );
  }
}

export default Table;
