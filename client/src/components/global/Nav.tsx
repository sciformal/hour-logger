import { Auth } from 'aws-amplify';
import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
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
                <Nav.Link href="/">My Hours</Nav.Link>

                {(type === 'ADMIN' || type === 'MANAGER') && (
                  <Nav.Link href="/users">Users</Nav.Link>
                )}

                <Nav.Link href="/payment">Tickets</Nav.Link>

                {type === 'ADMIN' && (
                  <Nav.Link href="/requests">Requests</Nav.Link>
                )}

                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
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
