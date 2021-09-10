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
    if (await Auth.currentSession()) {
      userHasAuthenticated(true);
      const user = await API.get("hour-logger", "/users/me");
      setUser(user);
    }
    setIsAuthenticating(false);
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
