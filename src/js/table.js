import React, { Component } from 'react';

const $ = require('jquery');
$.DataTable = require('datatables.net');

const columns = [
  {
    title: 'DHS.Chr',
    width: 120,
    data: 'DHS.Chr'
  },
  {
    title: 'DHS.Start',
    width: 180,
    data: 'DHS.Start'
  },
];

class Table extends Component { 
  componentDidMount() {
    $(this.refs.main).DataTable({
       dom: '<"data-table-wrapper"t>',
       data: this.props.names,
       columns,
       ordering: false
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
