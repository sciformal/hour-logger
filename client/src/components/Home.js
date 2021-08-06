import { Button } from "@material-ui/core";
import { Auth } from "aws-amplify";
import { useAuthenticationContext, useUserContext } from "libs/contextLib";
import React, { useEffect } from "react";
import "../styles/Home.css";
import SignInForm from "./auth/SignInForm";
import Countdown from "./global/Countdown";
import User from "./roles/User";
export default function Home() {
  const { isAuthenticated, userHasAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();

  useEffect(() => {
    console.log(user);
    if (user == null) {
      console.log("User has not been loaded yet");

    }
  }, [user]);

  const handleLogout = async () => {
    await Auth.signOut();
    userHasAuthenticated(false);
  }
  // Signed in
  if (isAuthenticated) {

    // Render User Component
    if (user?.type === 'USER') {
      return (
        <div className="landing">
           <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          <User user={user} />
        </div>
      )
    }
  } else { // Show sign in form
    return (
      <div className="landing">
      <div style={{ textAlign: "center", margin: "auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>Countdown</h2>
        <Countdown />
      </div>
      <SignInForm />
    </div>
    </div>
    )
  }
}
