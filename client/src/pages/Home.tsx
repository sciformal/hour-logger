import React from "react";
import SignInForm from "../components/auth/SignInForm";
import { HourLoggerTable } from "../components/global/Table";
import { useAuthenticationContext, useUserContext } from "../libs/contextLib";
// import "../styles/Home.css";

const types = ["USER", "ADMIN", "MANAGER", "BOUNCER"];
const hoursHeaders = ["Date", "Check In", "Check Out", "Hours"];

export default function Home() {
  // @ts-ignore
  const { isAuthenticated } = useAuthenticationContext();
  // @ts-ignore
  const { user } = useUserContext();

  let totalHoursFormatted = 0.00;
  let hoursEntries = [];

  if (isAuthenticated) {
    totalHoursFormatted = user.hours.toFixed(2); // round to 2 decimals
    hoursEntries = user.transactions.map((transaction) =>
    formatHourTransaction(transaction)
  );
  }

  // @ts-ignore
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
