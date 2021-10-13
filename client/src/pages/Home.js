import { useAuthenticationContext, useUserContext } from "libs/contextLib";
import React from "react";
import "../styles/Home.css";
import SignInForm from "../components/auth/SignInForm";
import { Table } from "react-bootstrap";

const types = ["USER", "ADMIN", "MANAGER", "BOUNCER"];

export default function Home() {
  const { isAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();

  // Signed in
  if (isAuthenticated && user && types.includes(user.type)) {
    return <div className="landing">
      <h2 style={{textAlign: 'center'}}>Welcome back {user.firstName}!</h2>
      <br/>
      <br/>

      <h4 style={{textAlign: 'center'}}><b>Hours Summary: {user.hours}</b></h4>

      <br/>
      <br/>
      <h2 style={{textAlign: 'center'}}>My Hours</h2>
      <br/>

      <HoursTable hours={user.transactions} />
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



function HoursTable({hours}){


  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>Date</th>
          <th>Check In</th>
          <th>Check Out</th>
          <th>Hours</th>
        </tr>
      </thead>
      <tbody>
        {hours.map(transaction => 
        (
          <tr>
            <td>{transaction.checkInTime}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}