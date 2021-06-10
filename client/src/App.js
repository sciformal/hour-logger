// template code
import React, { Component } from 'react';
import logo from './logo.svg';
import Login from './Login.js';
import Manager from './Manager.js';
import { Switch } from 'react-router';
import { BrowserRouter, Router, Route, Link, NavLink } from 'react-router-dom';
import { createBrowserHistory } from "history";
//import { library } from '@fortawesome/fontawesome-svg-core';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import Admin from './Admin';
import User from './User';
import Forgot from './Forgot.js';
import Reset from './Reset.js';
import './App.css';

const NoMatch = ({ location }) => (
  <div>
    <h3 className="AppTitle">404 Page Not Found</h3>
    <div className="center">
    <Link className="" to="/">Go Home</Link>
    </div>
    
  </div>
);

const hist = createBrowserHistory();


class App extends Component {

  render() {

    return (
      <Router history={hist}>
        <div>
          <Switch>
            <Route exact path="/" render={() => <SignInForm type={2}/>} />
            <Route path="/sign-up" component={SignUpForm} />
            <Route path="/manager" component={Manager} />
            <Route path="/login-manager" render={() => <SignInForm type={1}/>} />
            <Route path="/user" component={User} />
            <Route path="/admin" component={Admin} />
            <Route path="/login-admin" render={() => <SignInForm type={0}/>} />
            <Route path="/forgot" component={Forgot} />
            <Route path="/reset/:token" component={Reset} />
            <Route component={NoMatch} />
          </Switch>
          {/*<Route render={() => <Redirect to="/404" />} /> */}
        </div>


      </Router>


    );
  }
}
export default App;