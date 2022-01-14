import { render, screen } from '@testing-library/react';
import { AuthenticationContext, UserContext } from '../libs/contextLib';
import HourLoggerNav from '../components/global/Nav';
import { BrowserRouter as Router } from 'react-router-dom';

export const sampleUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@queensu.ca',
  hours: 0,
  hoursNeeded: 20,
  type: 'USER',
  isCheckedIn: false,
  transactions: [],
};

export const sampleManager = {
  ...sampleUser,
  type: 'MANAGER',
};

export const sampleAdmin = {
  ...sampleUser,
  type: 'ADMIN',
};

describe('Navigation Bar Tests', () => {
  const mockAuthContext = {
    isAuthenticated: true,
    userHasAuthenticated: () => {},
  };

  test('User navigation bar tests', () => {
    const userContext = {
      user: sampleUser,
    };

    render(
      // render with auth context to pass in user information
      <AuthenticationContext.Provider value={mockAuthContext}>
        <UserContext.Provider value={userContext}>
          <Router>
            <HourLoggerNav />
          </Router>
        </UserContext.Provider>
      </AuthenticationContext.Provider>,
    );

    const navigationItems = ['Hour Logger', 'Tickets', 'Logout'];

    navigationItems.forEach(item => {
      const htmlNode = screen.getByText(item);
      expect(htmlNode).toBeInTheDocument();
    });
  });

  test('Manager navigation bar tests', () => {
    const userContext = {
      user: sampleManager,
    };

    render(
      <AuthenticationContext.Provider value={mockAuthContext}>
        <UserContext.Provider value={userContext}>
          <Router>
            <HourLoggerNav />
          </Router>
        </UserContext.Provider>
      </AuthenticationContext.Provider>,
    );

    const navigationItems = [
      'Hour Logger',
      'My Hours',
      'Users',
      'Tickets',
      'Logout',
    ];

    navigationItems.forEach(item => {
      const htmlNode = screen.getByText(item);
      expect(htmlNode).toBeInTheDocument();
    });
  });

  test('Admin navigation bar tests', () => {
    const userContext = {
      user: sampleAdmin,
    };

    render(
      <AuthenticationContext.Provider value={mockAuthContext}>
        <UserContext.Provider value={userContext}>
          <Router>
            <HourLoggerNav />
          </Router>
        </UserContext.Provider>
      </AuthenticationContext.Provider>,
    );

    const navigationItems = [
      'Hour Logger',
      'My Hours',
      'Users',
      'Tickets',
      'Requests',
      'Logout',
    ];

    navigationItems.forEach(item => {
      const htmlNode = screen.getByText(item);
      expect(htmlNode).toBeInTheDocument();
    });
  });

  test('Logout tests', () => {
    // test interaction with logout button
  });
});
