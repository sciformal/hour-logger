import { Button } from '@material-ui/core';
import { Auth } from 'aws-amplify';
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  useAuthenticationContext,
  useUserContext,
} from '../../libs/contextLib';

export default function HourLoggerNav() {
  const { isAuthenticated, userHasAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
  };

  if (isAuthenticated && user !== null) {
    const type = user.type;

    return (
      <Navbar
        bg="light"
        expand="lg"
        style={{ alignItems: 'flex-start', width: '15%', paddingLeft: '20px' }}
      >
        <Container style={{ display: 'block', paddingTop: '50px' }}>
          <Navbar.Brand href="/">Hour Logger</Navbar.Brand>
          <div style={{ paddingTop: '100px' }} className="justify-content-end">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="flex-column">
                <Link to="/">My Hours</Link>

                {(type === 'ADMIN' || type === 'MANAGER') && (
                  <Link to="/users">Users</Link>
                )}

                <Link to="/payment">Tickets</Link>

                {type === 'ADMIN' && <Link to="/requests">Requests</Link>}

                <Button onClick={handleLogout}>Logout</Button>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    );
  } else {
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Sci Formal Hour Logger</Navbar.Brand>
        </Container>
      </Navbar>
    );
  }
}
