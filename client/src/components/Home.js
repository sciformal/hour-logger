import React from "react";
import SignInForm from "./auth/SignInForm";
import Countdown from "./Countdown";
import User from "./roles/User";
import "../styles/Home.css";
export default function Home() {
  // TODO: Get this from cognito pool
  const userLoggedIn = false;

  const getUserInformation = () => {
    return {
      name: 'Ava',
      hours: 10,
      finalHours: 10,
      hoursNeeded: 20,
      type: "USER",
    };
  };

  // TODO: Pull this from the db table.
  const user = getUserInformation();

  // Signed in
  if (userLoggedIn) {
    if (user.type === 'USER') {
      return (
        <div className="landing">
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
