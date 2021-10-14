import { render, screen } from "@testing-library/react";
import { AuthenticationContext, UserContext } from "../libs/contextLib";
import HourLoggerNav from "../components/global/Nav";

export const sampleUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@queensu.ca",
  hours: 0,
  hoursNeeded: 20,
  type: "USER",
  isCheckedIn: false,
  transactions: [],
};

export const sampleManager = {
  ...sampleUser,
  type: "MANAGER"
}

describe("Navigation Bar Tests", () => {
  const mockAuthContext = {
    isAuthenticated: true,
    userHasAuthenticated: () => {},
  };

  test("User navigation bar tests", () => {
    const userContext = {
      user: sampleUser,
    };

    render(
      // render with auth context to pass in user information
      <AuthenticationContext.Provider value={mockAuthContext}>
        <UserContext.Provider value={userContext}>
          <HourLoggerNav />
        </UserContext.Provider>
      </AuthenticationContext.Provider>
    );

    const navigationItems = [
      "Sci Formal Hour Logger",
      "Ticket Purchase",
      "Logout",
    ];

    navigationItems.forEach((item) => {
      const htmlNode = screen.getByText(item);
      expect(htmlNode).toBeInTheDocument();
    });
  });

  test("Manager navigation bar tests", () => {
    const userContext = {
      user: sampleUser,
    };

    render(
      <AuthenticationContext.Provider value={mockAuthContext}>
        <UserContext.Provider value={userContext}>
          <HourLoggerNav />
        </UserContext.Provider>
      </AuthenticationContext.Provider>
    );

    const navigationItems = [
      "Sci Formal Hour Logger",
      "Ticket Purchase",
      "Logout",
    ];

    navigationItems.forEach((item) => {
      const htmlNode = screen.getByText(item);
      expect(htmlNode).toBeInTheDocument();
    });
  });

  test("Admin navigation bar tests", () => {
    const userContext = {
      user: sampleUser,
    };

    render(
      <AuthenticationContext.Provider value={mockAuthContext}>
        <UserContext.Provider value={userContext}>
          <HourLoggerNav />
        </UserContext.Provider>
      </AuthenticationContext.Provider>
    );

    const header = screen.getByText("Sci Formal Hour Logger");
    const ticketPurchase = screen.getByText("Ticket Purchase");
    const logout = screen.getByText("Logout");

    expect(header).toBeInTheDocument();
    expect(ticketPurchase).toBeInTheDocument();
    expect(logout).toBeInTheDocument();
  });

  test("Logout tests", () => {
    // test interaction with logout button
  });
});