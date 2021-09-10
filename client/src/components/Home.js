import { useAuthenticationContext, useUserContext } from "libs/contextLib";
import React from "react";
import "../styles/Home.css";
import SignInForm from "./auth/SignInForm";

const types = ["USER", "ADMIN", "MANAGER", "BOUNCER"];

export default function Home() {
  const { isAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();

  // Signed in
  if (isAuthenticated && user && types.includes(user.type)) {
    return <div className="landing">
      <h2 style={{textAlign: 'center'}}>Welcome back {user.firstName}!</h2>
      <div>Hours Summary</div>
      <div>Hours Table</div>
    </div>;
  } else {
    // Show sign in form
    return (
      <div className="landing">
        <SignInForm />
      </div>
    );
  }
}
