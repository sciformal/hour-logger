import axios from 'axios';
import React, { Component } from 'react';
import { Navbar } from 'react-bootstrap';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import engsoclogo from '../img/EngSoc-Logo-Black-2.png';

class SciNavbar extends Component {
    render(){
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand href="/"><img alt="Engsoc Logo" src={engsoclogo} className="nav-logo" /></Navbar.Brand>
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