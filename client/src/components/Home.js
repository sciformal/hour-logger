import { useAuthenticationContext, useUserContext } from "libs/contextLib";
import React from "react";
import "../styles/Home.css";
import SignInForm from "./auth/SignInForm";
import { HourLoggerTable } from "./global/Table";

const types = ["USER", "ADMIN", "MANAGER", "BOUNCER"];
const hoursHeaders = ["Date", "Check In", "Check Out", "Hours"];

export default function Home() {
  const { isAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();

  const totalHoursFormatted = user.hours.toFixed(2); // round to 2 decimals

  const formatHourTransaction = (transaction) => {
    const checkIn = new Date(transaction.checkIn);
    const checkOut = new Date(transaction.checkOut);
    const date = checkIn.toDateString();
    const checkInTime = checkIn.toLocaleTimeString();
    const checkOutTime = checkOut.toLocaleTimeString();
    const hours = (
      (Date.parse(transaction.checkOut) - Date.parse(transaction.checkIn)) /
      (60 * 60 * 1000)
    ).toFixed(2);

    return [date, checkInTime, checkOutTime, hours];
  };

  const hoursEntries = user.transactions.map((transaction) =>
    formatHourTransaction(transaction)
  );

  // Signed in
  if (isAuthenticated && user && types.includes(user.type)) {
    return (
      <div className="landing" style={{ textAlign: "center" }}>
        <h2>Welcome back {user.firstName}!</h2>
        <br />
        <br />

        <h4>
          <b>Hours Summary</b>: {totalHoursFormatted} / {user.hoursNeeded}{" "}
        </h4>
        <br />
        <br />

        <h4>My Hours</h4>
        <br />

        <div style={{ width: "60%", margin: "auto" }}>
          <HourLoggerTable rows={hoursEntries} headers={hoursHeaders} />
        </div>
      </div>
    );
  } else {
    // Show sign in form
    return (
      <div className="landing">
        <SignInForm />
      </div>
    );
  }
}
