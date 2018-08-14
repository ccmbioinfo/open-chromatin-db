import React, { Component } from 'react';
import { Route, NavLink } from 'react-router-dom';
import DHS from './dhs';

class Application extends Component { 
  render() {
    return( 
      <div className="application">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a className="navbar-brand" href="/">rEfOCus</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink exact to="/" className="nav-link" activeClassName="active">Home</NavLink>
              </li>
              <NavDropdown name="DHS">
                <NavLink exact to="/dhs/" className="dropdown-item" activeClassName="active">Home</NavLink>
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
      <div className="tab-content">
        <h2>Welcome!</h2>
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
