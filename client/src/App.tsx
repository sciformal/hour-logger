import { API, Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import Loader from './components/global/Loader';
import { AuthenticationContext, UserContext } from './libs/contextLib';
import HourLoggerRoutes from './Routes';
import { UserSituation } from './types/database/UserType';
import { BrowserRouter as Router } from 'react-router-dom';

export default function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true); // has the users session loaded yet?
  const [isAuthenticated, userHasAuthenticated] = useState(false); // is the user signed in?
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserInformation();
  }, []);

  const loadUserInformation = async () => {
    try {
      await Auth.currentSession();
      let user;

      let cognitoUserInfo = await Auth.currentUserInfo();
      const userId = cognitoUserInfo.username;
      const { given_name, family_name, email } = cognitoUserInfo.attributes; // desctructure the cognito user info object.
      //@ts-ignore
      const studentNumber = cognitoUserInfo.attributes['custom:studentNumber'];
      const userType = cognitoUserInfo.attributes['custom:userType'];

      const { status, data } = await API.get(
        'hour-logger',
        `/users/${userId}`,
        { response: true },
      );

      if (status === 204) {
        // User doesnt exist in DB, create new user
        user = await API.post('hour-logger', '/users', {
          body: {
            userId,
            email,
            studentNumber,
            userType,
            firstName: given_name,
            lastName: family_name,
            userSituation: UserSituation.ENGINEER_ENROLLED,
          },
        });
      } else {
        user = data;
      }
      setUser(user);
      userHasAuthenticated(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return (
      <div className="App" style={{ height: '100vh', lineHeight: '100vh' }}>
        <Loader />
      </div>
    );
  } else {
    return (
      <div className="App">
        <AuthenticationContext.Provider
          value={{ isAuthenticated, userHasAuthenticated }}
        >
          <UserContext.Provider value={{ user, setUser }}>
            <Router>
              <HourLoggerRoutes />
            </Router>
          </UserContext.Provider>
        </AuthenticationContext.Provider>
      </div>
    );
  }
}
