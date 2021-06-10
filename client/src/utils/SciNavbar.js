import React, { Component } from 'react';
import { Navbar, Form, FormControl, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';
import Nav from 'react-bootstrap/Nav';
import engsoclogo from '../img/EngSoc-Logo-Black-2.png';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';

class SciNavbar extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/"><img src={engsoclogo} className="nav-logo" /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <h1>Ava Little</h1>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            {(this.props.link)?(<Link to='/User' onClick={(e) => {e.preventDefault();this.props.linkAction()}}>{this.props.link}</Link>):(<span></span>)}
                        </Nav>
                        <Nav className="ml-auto">
                            <Link to='/' className="Nav-text" onClick={(e) => {logout(e, this.props.redirect)}}>Logout</Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }

}

const logout = (event, callback) => {
   axios.get('/api/logout').then((res) => {
       console.log(res);
       if(!res.data.success){
           console.log('preventing redirect');
            event.preventDefault();
       }
       else{
           callback();
       }
   }).catch(event.preventDefault());
}

export default SciNavbar;