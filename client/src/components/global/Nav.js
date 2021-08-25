import { Auth } from "aws-amplify";
import { useAuthenticationContext, useUserContext } from "libs/contextLib";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

export default function HourLoggerNav() {
  const { isAuthenticated, userHasAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
  }

  if (isAuthenticated && user !== null) {
    const type = user.type;
  
    return (
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Sci Formal Hour Logger</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Hours</Nav.Link>
              <Nav.Link href="/payment">Ticket Purchase</Nav.Link>

              {/* Show Volunteer Check-in for all managers */}
              {(type == "ADMIN" || type == "MANAGER" || type == "COMMS") && (
                <Nav.Link href="/check-in">Volunteer Check-In</Nav.Link>
              )}
              {(type == "ADMIN" || type == "COMMS") && (
                <Nav.Link href="/reduction-request">
                  Reduction Requests
                </Nav.Link>
              )}
              {type == "ADMIN" && (
                <Nav.Link href="/edit-hours">Edit Hours</Nav.Link>
              )}
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
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
