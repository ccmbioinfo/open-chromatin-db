import React, { Component } from 'react';

class Download extends Component { 
  render() {
    var list = [];
    for (var i = 1; i < 23 ; i++) {
      list.push(<ChrLink key={i} val={i} />);
    }
    return (
      <div>
        <h2>Download</h2>
        <div className="row page-content">
          <div className="col-md-6 mx-auto">
            <p className="text-left">Metadata describing file accession ID, cell type, project, assembly and file download URL can be accessed at <a href={"/files/DHS-Metadata.xlsx"} download="DHS-Metadata.xlsx">Metadata</a>. We have also made our entire curated DHS database to download by clicking at <a href={"/files/All-tracks-sorted.bed"} download="iDOCRaSE.bed">iDOCRaSE</a>. Data specific to each chromosome is also downloadable below.</p>
            <div className="grid-container">
              {list}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ChrLink extends Component {
  render() {
    return (
      <a className="grid-item" href={"/files/chr" + this.props.val + ".bed"} download={"chr" + this.props.val + ".bed"} >
        Chr {this.props.val}
      </a>
    );
  }
}

export default Download;