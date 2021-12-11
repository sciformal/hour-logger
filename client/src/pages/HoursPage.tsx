import API from '@aws-amplify/api';
import { TextField } from '@material-ui/core';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Autocomplete } from '@mui/material';
import React, { useState } from 'react';
import { Button, Tab, Tabs } from 'react-bootstrap';
import 'react-circular-progressbar/dist/styles.css';
import Loader from '../components/global/Loader';
import { Progress } from '../components/global/Progress';
import { HourLoggerTable } from '../components/global/Table';
import { useUserContext } from '../libs/contextLib';
import '../styles/CustomTabs.css';
import { formatHourTransaction } from '../util/hours';

const hoursHeaders = ['Date', 'Check In', 'Check Out', 'Hours'];

export const HomePage = () => {
  // @ts-ignore
  const { user } = useUserContext();

  // Signed in
  return (
    <div style={{ padding: '5%', width: '85%' }}>
      <h2>My Hours</h2>
      <br />
      <br />
      <Tabs defaultActiveKey="first">
        <Tab eventKey="first" title="Summary">
          <HoursSummary user={user} />
        </Tab>
        <Tab eventKey="second" title="Hour Reduction">
          <HourReduction user={user} />
        </Tab>
        <Tab eventKey="third" title="Transfer Hours">
          <TransferHours user={user} />
        </Tab>
      </Tabs>
    </div>
  );
};

const HoursSummary = ({ user }) => {
  const totalHours = user.regularHoursNeeded + user.finalHoursNeeded;

  const totalHoursFormatted = user.hours.toFixed(2); // round to 2 decimals

  return (
    // Container
    <div style={{ display: 'flex' }}>
      {/* Left Side */}
      <div
        style={{
          width: '50%',
          textAlign: 'center',
          borderRight: '1px solid #EEEEEE',
        }}
      >
        <h4>
          <b>Hours Summary</b>: {totalHoursFormatted} / {totalHours}{' '}
        </h4>
        <br />
        <br />
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'space-evenly',
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
      </div>

      {/* Right Side */}
      <div style={{ width: '50%', textAlign: 'center' }}>
        <HoursTable user={user} />
      </div>
    </div>
  );
};

const HoursTable = ({ user }) => {
  const hoursEntries = user.transactions.map(transaction =>
    formatHourTransaction(transaction),
  );

  return (
    <div>
      <h4>
        <b>My Hours</b>
      </h4>
      <br />
      <br />

      <div style={{ width: '80%', margin: 'auto' }}>
        <HourLoggerTable rows={hoursEntries} headers={hoursHeaders} />
      </div>
    </div>
  );
};

const HourReductionForm = ({ user }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleRequest = async () => {
    setSubmitting(true);

    const userId = user.userId;
    const firstName = user.firstName;
    const lastName = user.lastName;

    try {
      await API.post('hour-logger', '/requests', {
        body: {
          message: message,
          userId,
          firstName,
          lastName,
          type: 'REDUCTION',
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.log(err);
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return <Loader />;
  } else {
    if (submitted) {
      return (
        <div>
          <h5>Your hour reduction request was submitted!</h5>
          <br />
          <CheckCircleOutlineIcon
            fontSize="large"
            style={{ width: '60%', height: '5em' }}
          />
        </div>
      );
    } else {
      return (
        <>
          <TextField
            style={{ width: '80%', margin: 'auto' }}
            multiline
            rows={4}
            id="outlined-basic"
            label="Why should we reduce your hours?"
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
          />
          <br></br>
          <br></br>
          <Button onClick={handleRequest} variant="contained">
            Submit
          </Button>
        </>
      );
    }
  }
};

const HourReduction = ({ user }) => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Left Side */}
      <div
        style={{
          width: '50%',
          textAlign: 'center',
          borderRight: '1px solid #EEEEEE',
        }}
      >
        <h4>
          <b>New Reduction Request</b>
        </h4>
        <br></br>
        <br></br>

        <div style={{ textAlign: 'center' }}>
          <HourReductionForm user={user} />
        </div>
      </div>

      {/* Right Side */}
      <div style={{ width: '50%', textAlign: 'center' }}>
        <h4>
          <b>My Requests</b>
        </h4>

        <br />
        <br />

        {user.requests?.length > 0 ? (
          <div
            style={{
              width: '80%',
              margin: 'auto',
              display: 'flex',
              gap: '10px',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {user.requests.map(request => {
              const rawDate = new Date(request.date);
              const date = rawDate.toDateString();

              return (
                <div
                  key={request.requestId}
                  style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'row',
                    border: '1px solid #eeeeee',
                    borderRadius: '5px',
                    width: '100%',
                    padding: '5px',
                  }}
                >
                  {/* Left Side */}
                  <div
                    style={{ textAlign: 'left', width: '70%', margin: '10px' }}
                  >
                    <h5>{date}</h5>
                    <p>{request.message}</p>
                  </div>

                  {/* Right Side */}
                  <div style={{ margin: 'auto' }}>{request.status}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No hour reduction requests yet.</div>
        )}
      </div>
    </div>
  );
};

const TransferHoursForm = ({ user }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleRequest = async () => {
    setSubmitting(true);

    const userId = user.userId;
    const firstName = user.firstName;
    const lastName = user.lastName;

    try {
      await API.post('hour-logger', '/requests', {
        body: {
          message: message,
          userId,
          firstName,
          lastName,
          type: 'TRANSFER',
        },
      });
      setSubmitted(true);
    } catch (err) {
      console.log(err);
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  const names = ['Brent Champion', 'Ava Little'];

  if (submitting) {
    return <Loader />;
  } else {
    if (submitted) {
      return (
        <div>
          <h5>Your request to transfer hours was submitted!</h5>
          <br />
          <CheckCircleOutlineIcon
            fontSize="large"
            style={{ width: '60%', height: '5em' }}
          />
        </div>
      );
    } else {
      return (
        <>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={names}
            style={{ width: '80%', margin: 'auto' }}
            renderInput={params => <TextField {...params} label="Name" />}
          />
          <br />
          <br />
          <TextField
            style={{ width: '80%', margin: 'auto' }}
            multiline
            rows={4}
            id="outlined-basic"
            label="Why are you transferring your hours?"
            variant="outlined"
            value={message}
            onChange={handleMessageChange}
          />
          <br></br>
          <br></br>
          <Button onClick={handleRequest} variant="contained">
            Submit
          </Button>
        </>
      );
    }
  }
};

const TransferHours = ({ user }) => {
  return (
    <div style={{ display: 'flex' }}>
      {/* Left Side */}
      <div
        style={{
          width: '50%',
          textAlign: 'center',
          borderRight: '1px solid #EEEEEE',
        }}
      >
        <h4>
          <b>New Transfer Hours Request</b>
        </h4>
        <br></br>
        <br></br>

        <div style={{ textAlign: 'center' }}>
          <TransferHoursForm user={user} />
        </div>
      </div>

      {/* Right Side */}
      <div style={{ width: '50%', textAlign: 'center' }}>
        <h4>
          <b>My Hour Transfers</b>
        </h4>

        <br />
        <br />

        {user.requests?.length > 0 ? (
          <div
            style={{
              width: '80%',
              margin: 'auto',
              display: 'flex',
              gap: '10px',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {user.requests.map(request => {
              const rawDate = new Date(request.date);
              const date = rawDate.toDateString();

              return (
                <div
                  key={request.requestId}
                  style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    flexDirection: 'row',
                    border: '1px solid #eeeeee',
                    borderRadius: '5px',
                    width: '100%',
                    padding: '5px',
                  }}
                >
                  {/* Left Side */}
                  <div
                    style={{ textAlign: 'left', width: '70%', margin: '10px' }}
                  >
                    <h5>{date}</h5>
                    <p>{request.message}</p>
                  </div>

                  {/* Right Side */}
                  <div style={{ margin: 'auto' }}>{request.status}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>No transfer hours requests yet.</div>
        )}
      </div>
    </div>
  );
};
