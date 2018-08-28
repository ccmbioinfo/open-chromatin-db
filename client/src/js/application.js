import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, NavLink } from 'react-router-dom';
import DHS from './dhs';

class Application extends Component { 
  render() {
    return( 
      <div className="text-center">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a className="navbar-brand" href="/">iDOCRaSE</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
              </li>
              <NavDropdown name="DHS">
                <NavLink exact to="/dhs/download" className="dropdown-item" activeClassName="active">Download</NavLink>
                <div className="dropdown-divider"></div>
                <NavLink to="/dhs/query" className="dropdown-item" activeClassName="active">Query</NavLink>
                <div className="dropdown-divider"></div>
                <NavLink to="/dhs/tracks" className="dropdown-item" activeClassName="active">Tracks</NavLink>
              </NavDropdown>
            </ul>
          </div>
        </nav>
        <div className="tab-content">
          <Route exact path="/" component={Home} />
          <Route path="/dhs" component={DHS} />
        </div>
      </div>
    );
  }
}

class Home extends Component { 
  render() {
    return (
      <div>
        <h2>iDOCRaSE: Database of Open Chromatin Regions from SEquencing data</h2>
        <div className="row page-content">
          <div className="col-md-9 mx-auto text-left">
            <img src={"/files/Demo2.png"} alt="Open Chromatin"/>
            <strong>How is iDOCRaSE generated?</strong>

            <p>Multiple large-scale consortia-based projects, including ENCODE, REMC, Blueprint and GGR have generated thousands of sequencing data samples that capture DNase-I hypersensitive sites (DHS) on the whole genome in hundreds of cell types. Building on this immensely informative DHS datasets, we have developed an analysis pipeline that gets hundreds of pre-processed DHS data samples (i.e. in narrow peaks Bed format) as the input, aligns regions of open chromatin across samples, checks quality of each region using a replication-based test, and outputs a well-curated database of open chromatin accessibility across the whole genome.<br />Through applying our processing pipeline to 828 DHS data samples obtained from multiple public datasets, we have built a database of 1,455,046 regions across the whole genome for 828 samples comprising of 194 cell types.</p>

            <strong>Main improvements over previous datasets:</strong>
            <p>The main advantages of our iDOCRaSE over previous datasets that are available publicly (e.g. ENCODE, REMC, Blueprint and GGR) are as follows.</p>
            <ul>
              <li>In the publically available datasets the DHS peaks are identified for each individual sample separately, while our method incorporates peaks from multiple samples together, aligns them across samples, and releases them as a coherent DHS database consisting of replicable peaks from multiple samples. Since in the previous datasets, each sample is analyzed separately, a comparison of the same regulatory regions over different samples is not directly possible.</li>
              <li>Additionally, the batch effects that exist across samples due to the fact that multiple centers generate and analyze the data are not adjusted in the previous DHS datasets. While In iDOCRaSE, we removed the batch effects that exist in the data samples collected from multiple centers.</li>
              <li>We have employed our replication test that considers multiple samples from a diverse range of cell types in order to check replicability of each DHS site. This results in identifying replicable DHS that present true regulatory sites (See partitioning heritability results in Shooshtari, et.al. AJHG 2017), while preserving regulatory sites filtered by more stringent tests such as irreproducibility discovery rate (IDR).</li>
            </ul>
            <strong>How to access the data and visualize your region of interest in the genome browser?</strong>
            <p>We have made the <a href="/dhs/download">metadata</a>, entire <a href="/dhs/download">curated DHS dataset</a> and <a href="/dhs/download">data specific to each chromosome</a> downloadable at this website. Through our web interface, the user can also <a href="/dhs/query">query the database</a> by specifying a region of interest (i.e. entering a specific chromosome number and start and end coordinates). After submitting coordinates of a region of interest, an exportable table of the results matching the user input is generated.<br />Additionally, the user can <a href="/dhs/tracks">visualize the replicable DHS data</a> through JBrowse, an embeddable genome browser, by specifying coordinates of the region and cell types of interest. Information specific to each replicable DHS (e.g. intensity of the DHS for any given cell-type and genomic coordinates of the DHS) can be found in the pop-up window that opens after clicking on a given DHS. Replicable DHS are only visible if they are accessible (i.e. having non-zero intensities) at the cell types of interest. The replicable DHS that are accessible in multiple cell types get the same color on different tracks (each corresponding to a cell type) of the genome browser, to make adjacent DHS more trackable visually across several cell types.</p>

            <strong>Citations:</strong>
            <p>Please cite the following two papers when using <strong>iDOCRaSE</strong> database:</p>
            <ul>
              <li>Parisa Shooshtari, Samantha Feng, Justin Foong, Michael Brudno, Chris Cotsapas, iDOCRaSE: Database of Open Chromatin Regions from SEquencing data.</li>
              <li>Parisa Shooshtari, Hailiang Huang, Chris Cotsapas, Integrative Genetic and Epigenetic Analysis Uncovers Regulatory Mechanisms of Autoimmune Disease, Am J Hum Genet. 2017 Jul 6;101(1):75-86.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

class NavDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggleOn: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }
  
  
  handleClick(e) {
    if(!ReactDOM.findDOMNode(this).contains(e.target) && this.state.isToggleOn) {
      this.showDropdown(e);
    }
  }
  
  showDropdown(e) {
    e.preventDefault();
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
  
  render() {
    const classDropdownMenu = 'dropdown-menu' + (this.state.isToggleOn ? ' show' : '')
    return (
      <li className="nav-item dropdown">
        <NavLink className="nav-link dropdown-toggle" href="/" id="navbarDropdown" role="button" 
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
          onClick={(e) => {this.showDropdown(e)}} to="/dhs/">{this.props.name}</NavLink>
        <div className={classDropdownMenu} aria-labelledby="navbarDropdown" onClick={(e) => {this.showDropdown(e)}}>
          {this.props.children}
        </div>
      </li>
    )
  }
}

export default Application;
