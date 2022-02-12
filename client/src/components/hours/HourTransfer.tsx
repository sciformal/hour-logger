import { Button, TextField } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import { API } from 'aws-amplify';
import { useEffect, useState } from 'react';
import Loader from '../global/Loader';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Form } from 'react-bootstrap';

export const TransferHours = ({ user }) => {
  const transferRequests = user.requests.filter(
    request => request.type === 'TRANSFER',
  );

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

        {transferRequests.length > 0 ? (
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
            {transferRequests.map(request => {
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
                    style={{
                      textAlign: 'left',
                      width: '70%',
                      margin: '10px',
                    }}
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

const TransferHoursForm = ({ user }) => {
  const [message, setMessage] = useState('');
  const [numHours, setNumHours] = useState('');
  const [toUserId, setToUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const users = await API.get('hour-logger', '/users/userIds', {});
      setUsers(users);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const userNames = users.map(user => user.firstName + ' ' + user.lastName);
  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleNumHoursChange = e => {
    setNumHours(e.target.value);
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
          toUserId,
          numHours,
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

  const handleUserChange = e => {
    setToUserId(users.at(e.target.value).userId);
  };

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
            onChange={handleUserChange}
            options={userNames}
            style={{ width: '80%', margin: 'auto' }}
            renderInput={params => <TextField {...params} label="Name" />}
          />
          <br />
          <br />
          <Form.Label>
            <b>Why are you transferring your hours?</b>
          </Form.Label>
          <Form.Control
            autoFocus
            onChange={handleMessageChange}
            value={message}
            type="lname"
            as="textarea"
            style={{ width: '80%', margin: 'auto' }}
          />

          <br />
          <br />
          <Form.Label>
            <b>How many hours are you transferring?</b>
          </Form.Label>
          <Form.Control
            autoFocus
            onChange={handleNumHoursChange}
            value={numHours}
            type="lname"
            as="textarea"
            style={{ width: '80%', margin: 'auto' }}
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
