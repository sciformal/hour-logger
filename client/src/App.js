import { createBrowserHistory } from "history";
import React from "react";
import { Switch } from "react-router";
import { Link, Route, Router } from "react-router-dom";
import Admin from "./components/Admin";
import Forgot from "./components/auth/Forgot.js";
import Register from "./components/auth/Register";
import Reset from "./components/auth/Reset.js";
import Landing from "./components/Landing.js";
import Manager from "./components/Manager.js";
import User from "./components/User";
// Styles
import "./styles/App.css";



const NoMatch = ({ location }) => (
  <div>
    <h3 className="AppTitle">404 Page Not Found</h3>
    <div className="center">
      <Link className="" to="/">
        Go Home
      </Link>
    </div>
  </div>
);

const hist = createBrowserHistory();

export default function App() {
  return (
    <Router history={hist}>
      <>
        {/* <Nav /> */}
        <Switch>
          {/* Landing Page (TODO: Landing page only if not signed in) */}
          <Route exact path="/" component={Landing} />

          {/* Auth Routes */}
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={Forgot} />
          <Route path="/reset/:token" component={Reset} />

          <Route path="/manager" component={Manager} />
          <Route path="/user" component={User} />
          <Route path="/admin" component={Admin} />

          <Route component={NoMatch} />
        </Switch>
      </>
    </Router>
  );
}
