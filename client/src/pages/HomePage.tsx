import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import 'react-circular-progressbar/dist/styles.css';
import SignInForm from '../components/auth/SignInForm';
import { Progress } from '../components/global/Progress';
import { HourLoggerTable } from '../components/global/Table';
import { useAuthenticationContext, useUserContext } from '../libs/contextLib';
import { formatHourTransaction } from '../util/hours';
import '../styles/CustomTabs.css';

const types = ['USER', 'ADMIN', 'MANAGER', 'BOUNCER'];
const hoursHeaders = ['Date', 'Check In', 'Check Out', 'Hours'];

export const HomePage = () => {
  // @ts-ignore
  const { isAuthenticated } = useAuthenticationContext();
  // @ts-ignore
  const { user } = useUserContext();

  // Signed in
  if (isAuthenticated && user && types.includes(user.type)) {

    return (
      <div style={{padding: '5%', width: '85%'}}>
        <h2>My Hours</h2>
        <br />
        <br />
        <Tabs defaultActiveKey="first"> 
          <Tab eventKey="first" title="Summary"> 
            <HoursSummary user={user} />
          </Tab> 
          <Tab eventKey="second" title="Hour Reduction"> 
            <HourReduction />
          </Tab> 
          <Tab eventKey="third" title="Transfer Hours"> 
            <TransferHours />
          </Tab> 
        </Tabs>

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


const HoursSummary = ({user}) => {
  const totalHours = user.regularHoursNeeded + user.finalHoursNeeded;

  const totalHoursFormatted = user.hours.toFixed(2); // round to 2 decimals


  return (
    // Container
    <div style={{display: 'flex'}}>
      {/* Left Side */}
      <div style={{width: '50%', textAlign: 'center', borderRight: '1px solid #EEEEEE'}}>
      <h4>
        <b>Hours Summary</b>: {totalHoursFormatted} / {totalHours}{' '}
      </h4>
      <br />
      <br />
          <div style={{display: 'flex', gap: '10px', justifyContent: 'space-evenly'}}>
            <div>
              <h5>Normal Hours</h5>
              <Progress max={user.regularHoursNeeded} completed={user.hours} />
            </div>
            <div>
              <h5>Final Hours</h5>
              <Progress max={user.finalHoursNeeded} completed={user.finalHours} />
            </div>

          </div>
        </div>

      {/* Right Side */}
      <div style={{width: '50%', textAlign: 'center'}}> 
      <HoursTable user={user} />
      </div>
      </div>

  );
}
const HoursTable = ({user}) => {
  const hoursEntries = user.transactions.map(transaction =>
    formatHourTransaction(transaction),
  );

  return (
    <div>
        <h4><b>My Hours</b></h4>
        <br />
        <br />

        <div style={{ width: '80%', margin: 'auto' }}>
          <HourLoggerTable rows={hoursEntries} headers={hoursHeaders} />
        </div>
    </div>
  )
}

const HourReduction = () => {
  return (
    <div>
      Hours Reduction Tab
    </div>
  )
}

const TransferHours = () => {
  return (
    <div>
      Transfer Hours Tab
    </div>
  )
}