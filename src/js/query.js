import React, { Component } from 'react';
import '../css/query.css';

class Query extends Component {
  render() {
    return (
      <div className="Query">
        <div className="Query-intro">
          <form>
            <label>
              Chromosome:
              <input type="text" />
            </label>
            <label>
              Start Position:
              <input type="text" />
            </label>
            <label>
              End Position:
              <input type="text" />
            </label>
            <input type="submit" />
          </form>
        </div>
      </div>
    );
  }
}

export default Query;
