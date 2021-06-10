import React, { Component } from 'react';
import { Switch } from 'react-router';
import 'bootstrap/dist/css/bootstrap.css';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import engsoc from './img/engsoc-s.png';
import user from './img/user2.png';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import { library } from '@fortawesome/fontawesome-svg-core';
/*import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';*/
/*import { library } from '@fontawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faIgloo } from '@fontawesome/free-solid-svg-icons';*/

//library.add(faIgloo);

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

                                <Route path="/" component={SignUpForm}>
                                </Route>
                                <Route path="/sign-in" component={SignInForm}>
                                </Route>
                            </div>
                        </Col>


                    </Container>
                </div>


            </Router>
        );
    }
}

export default Login;
