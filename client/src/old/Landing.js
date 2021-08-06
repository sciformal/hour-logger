import React from "react";
import SignInForm from "../components/auth/SignInForm";
import Countdown from "../components/global/Countdown";

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
