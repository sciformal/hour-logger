import { Auth } from "aws-amplify";
import {
  useAuthenticationContext,
  useUserContext,
} from "../../libs/contextLib";
import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export default function HourLoggerNav() {
  // @ts-ignore
  const { isAuthenticated, userHasAuthenticated } = useAuthenticationContext();
  // @ts-ignore
  const { user } = useUserContext();

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
  };

  if (isAuthenticated && user !== null) {
    const type = user.type;

    return (
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">Sci Formal Hour Logger</Navbar.Brand>
          <div className="justify-content-end">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav>
                <NavDropdown id="hours-dropdown" title="Hours">
                  <NavDropdown.Item href="/">My Hours</NavDropdown.Item>
                  <NavDropdown.Item href="/reduction">
                    Hour Reduction
                  </NavDropdown.Item>

                  {(type === "ADMIN" ||
                    type === "MANAGER" ||
                    type === "COMMS") && (
                    <NavDropdown.Item href="/check-in">
                      Volunteer Check-In
                    </NavDropdown.Item>
                  )}

                  {type === "ADMIN" && (
                    <NavDropdown.Item href="/edit-hours">
                      Edit Hours
                    </NavDropdown.Item>
                  )}
                </NavDropdown>

                <Nav.Link href="/payment">Ticket Purchase</Nav.Link>

                {(type === "ADMIN" || type === "COMMS") && (
                  <Nav.Link href="/reduction-request">
                    Reduction Requests
                  </Nav.Link>
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
