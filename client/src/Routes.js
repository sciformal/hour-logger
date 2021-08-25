import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import Home from "components/Home";
import Admin from "./old/Admin";
import Forgot from "./components/auth/Forgot.js";
import Register from "./components/auth/Register";
import Reset from "./components/auth/Reset.js";
import Manager from "./old/Manager.js";
import HourLoggerNav from "components/global/Nav";

export default function Routes() {
  return (
    <>
      <HourLoggerNav></HourLoggerNav>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/forgot-password" component={Forgot} />
        <Route exact path="/reset/:token" component={Reset} />
        <Route exact path="/manager" component={Manager} />
        <Route exact path="/admin" component={Admin} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}

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
