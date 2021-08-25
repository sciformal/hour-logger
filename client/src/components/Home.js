import { useAuthenticationContext, useUserContext } from "libs/contextLib";
import React, { useEffect } from "react";
import "../styles/Home.css";
import SignInForm from "./auth/SignInForm";
import Admin from './roles/Admin';
import User from "./roles/User";
export default function Home() {
  const { isAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();

  useEffect(() => {
    console.log(user);
    if (user == null) {
      console.log("User has not been loaded yet");

    }
  }, [user]);

  // Signed in
  if (isAuthenticated) {

    // Render User Component
    if (user?.type === 'ADMIN') {
      return (
        <div className="landing">
          <Admin user={user} />
        </div>
      )
    } else {
      return (
        <div className="landing">
          <User user={user} />
        </div>
      )
    } else {
      return (
        <div>The user is not signed in yet.</div>
      )
    }
  } else { // Show sign in form
    return (
      <div className="landing">
      <SignInForm />
    </div>
    )
  }
}
