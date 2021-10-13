import { API, Auth } from "aws-amplify";
import Loader from "components/global/Loader";
import React, { useEffect, useState } from "react";
import Routes from "Routes";
import { AuthenticationContext, UserContext } from "./libs/contextLib";
import "./styles/App.css";

export default function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true); // has the users session loaded yet?
  const [isAuthenticated, userHasAuthenticated] = useState(false); // is the user signed in?
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserInformation();
  }, []);

  const loadUserInformation = async () => {
    try {
      if (await Auth.currentSession()) {
        let user;

        let cognitoUserInfo = await Auth.currentUserInfo();
        const userId = cognitoUserInfo.username;
        const studentNumber = "000000000000";
        const { given_name, family_name, email } = cognitoUserInfo.attributes; // desctructure the cognito user info object.
        const { status, data } = await API.get("hour-logger", `/users/${userId}`, { response: true });

        if (status === 204) { // User doesnt exist in DB, create new user
          user = await API.post("hour-logger", "/users/create", {
            body: {
              userId,
              email,
              studentNumber,
              "firstName" : given_name,
              "lastName" : family_name,
            }});
        } else {
          user = data;
        }

        setUser(user);
        userHasAuthenticated(true);
      } 
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isAuthenticating) {
    return (
      <div className="App">
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
            <Routes />
          </UserContext.Provider>
        </AuthenticationContext.Provider>
      </div>
    );
  }
}
