import { useState } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import API from "@aws-amplify/api";

export default function CheckIn() {
  const [studentNumber, setStudentNumber] = useState("");

  const handleStudentNumber = (e) => {
    setStudentNumber(e.target.value);
  };

  const handleCheckIn = async () => {
    await API.post("hour-logger", "/check-in", {
      studentNumber,
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ textAlign: "center", padding: "50px" }}>Check In Page</h1>
      <TextField
        id="outlined-basic"
        label="Student Number"
        variant="outlined"
        value={studentNumber}
        onChange={handleStudentNumber}
      />
      <br></br>
      <br></br>
      <Button onClick={handleCheckIn} variant="contained">
        Enter
      </Button>
    </div>
  );
}
