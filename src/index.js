import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Query from './js/query';

class Header extends Component {
  render() {
    return(
      <div className="Query">
        <div className="Query-header">
          <h1>Open Chromatin Database</h1>
        </div>
      </div>
    );
  }
}

class QueryPage extends Component {
  render() {
    return(
      <div>
        <Header />
        <Query />
      </div>
    )
  }
}

ReactDOM.render(<QueryPage />, document.getElementById('root'));
