import { render, screen } from '@testing-library/react';
import { AuthenticationContext, UserContext } from '../libs/contextLib';
import HourLoggerNav from '../components/global/Nav';
import { BrowserRouter as Router } from 'react-router-dom';
import { User } from '../types/database/User';
import { AdminType, UserType } from '../types/database/UserType';
import { v4 as uuid } from 'uuid';

export const sampleUser: User = {
  userId: uuid(),
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@queensu.ca',
  studentNumber: '12345678',
  hours: 0,
  regularHoursNeeded: 20,
  finalHours: 0,
  finalHoursNeeded: 10,
  adminType: AdminType.USER,
  userType: UserType.ENGINEER_ENROLLED,
  isCheckedIn: false,
  transactions: [],
  requests: [],
};

export const sampleManager: User = {
  ...sampleUser,
  adminType: AdminType.MANAGER,
};

export const sampleAdmin = {
  ...sampleUser,
  adminType: AdminType.ADMIN,
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
