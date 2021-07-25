import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { HashRouter as Router, Route } from "react-router-dom";
import engsoc from "../../img/engsoc-s.png";
import user from "../../img/user2.png";
import SignInForm from "./SignInForm";
import SignUpForm from "./Register";

class Login extends Component {
  render() {
    return (
      <Router>
        <div className="App1">
          <Container>
            <Col>
              <div className="App__Aside">
                <img src={engsoc} width="100%" className="logo" />
              </div>
            </Col>
            <Col>
              <div className="App__Form">
                <img src={user} className="user" />

                <Route path="/" component={SignUpForm}></Route>
                <Route path="/sign-in" component={SignInForm}></Route>
              </div>
            </Col>
          </Container>
        </div>
      </Router>
    );
  }
}

export default Login;
