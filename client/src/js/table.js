import React, { Component } from 'react';

import { AgGridReact } from 'ag-grid-react';
import './../css/ag-grid.css';
import './../css/ag-theme-balham.css';

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'columns': [],
      'data': [],
    };
    this.getData = this.getData.bind(this);
  }
  
  componentWillMount() {
    this.getData();
  }
  
  getData() {
    fetch('/tabledata')
      .then((res) => {
        return res.json();
      }).then((data) => {
        const columns = Object.keys(data[0]).map((key, id)=>{
          return {
            headerName: key,
            field: key
          }
        });
        this.setState({
          columns: columns,
          data: data
        });
        console.log(columns);
      });
  }
  
  render() {     
    return (
      <div className="ag-theme-balham">
        <AgGridReact
          columnDefs={this.state.columns}
          rowData={this.state.data}
          enableSorting={true}
          enableFilter={true}
          pagination={true}
          suppressFieldDotNotation={true}
        />
      </div>
    )
  }
}

export default Table;