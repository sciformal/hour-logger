import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import SignInForm from '../components/auth/SignInForm';
import { Progress } from '../components/global/Progress';
import { HourLoggerTable } from '../components/global/Table';
import { useAuthenticationContext, useUserContext } from '../libs/contextLib';
import { formatHourTransaction } from '../util/hours';

const types = ['USER', 'ADMIN', 'MANAGER', 'BOUNCER'];
const hoursHeaders = ['Date', 'Check In', 'Check Out', 'Hours'];

export const HomePage = () => {
  // @ts-ignore
  const { isAuthenticated } = useAuthenticationContext();
  // @ts-ignore
  const { user } = useUserContext();

  let totalHoursFormatted = 0.0;
  let hoursEntries = [];

  if (isAuthenticated) {
    totalHoursFormatted = user.hours.toFixed(2); // round to 2 decimals
    hoursEntries = user.transactions.map(transaction =>
      formatHourTransaction(transaction),
    );
  }

  const totalHours = user.regularHoursNeeded + user.finalHoursNeeded;

  // Signed in
  if (isAuthenticated && user && types.includes(user.type)) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <h2>Welcome back {user.firstName}!</h2>
        <br />
        <br />

        <h4>
          <b>Hours Summary</b>: {totalHoursFormatted} / {totalHours}{' '}
        </h4>
        <br />

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100px',
            width: '80%',
            margin: 'auto',
            gap: '50px',
          }}
        >
          <div>
            <h5>Normal Hours</h5>
            <Progress max={user.regularHoursNeeded} completed={user.hours} />
          </div>

          <div>
            <h5>Final Hours</h5>
            <Progress max={user.finalHoursNeeded} completed={user.finalHours} />
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

        <h4>My Hours</h4>
        <br />

        <div style={{ width: '60%', margin: 'auto' }}>
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
};
