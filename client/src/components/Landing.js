import React from "react";
import SignInForm from "./auth/SignInForm";
import Countdown from "./Countdown";

export default function Landing() {
  return (
    <div style={{ padding: "50px" }}>
      <br />
      <div style={{ textAlign: "center" }}>
          <h2>Countdown</h2>
      <Countdown />

      </div>

      {/* TODO: Put Sign in form */}
      <div style={{ textAlign: "center", margin: "auto" }}>
        <SignInForm />
      </div>


    </div>
  );
}
