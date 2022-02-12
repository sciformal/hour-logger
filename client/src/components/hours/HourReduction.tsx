import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { API } from 'aws-amplify';
import { useEffect } from 'react';
import { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import { useUserContext } from '../../libs/contextLib';
import Loader from '../global/Loader';

export const HourReduction = () => {
  const { user, setUser } = useUserContext();
  const reductionRequests = user.requests?.filter(
    request => request.type === 'REDUCTION',
  );

  useEffect(() => {}, [user]);

  const addRequest = request => {
    setUser({
      ...user,
      requests: [...user.requests, request],
    });
  };

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
          <HourReductionForm user={user} addRequest={addRequest} />
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
            {reductionRequests.map(request => {
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
          <div>No hour reduction requests yet.</div>
        )}
      </div>
    </div>
  );
};

const HourReductionForm = ({ user, addRequest }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setMessage(e.target.value);
  };

  const handleRequest = async () => {
    if (message.length < 1) {
      setErr('Please enter a reason for your request.');
      return;
    }

    setSubmitting(true);

    const userId = user.userId;
    const firstName = user.firstName;
    const lastName = user.lastName;

    const request = {
      message: message,
      userId,
      firstName,
      lastName,
      type: 'REDUCTION',
    };

    try {
      const response = await API.post('hour-logger', '/requests', {
        body: request,
      });
      setSubmitted(true);
      setErr('');
      addRequest(response);
    } catch (err: any) {
      console.log(err);
      setErr(err.message);
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  const clearRequestForm = () => {
    setMessage('');
    setSubmitted(false);
    setSubmitting(false);
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
          <br />
          <br />

          <Button onClick={() => clearRequestForm()}>
            Submit another request? &#8594;
          </Button>
        </div>
      );
    } else {
      return (
        <>
          {err !== '' && (
            <>
              <Alert
                variant="danger"
                style={{ width: '80%', textAlign: 'center', margin: 'auto' }}
              >
                {err}
              </Alert>
              <br />
              <br />
            </>
          )}
          <Form.Label>
            <b>Why should we reduce your hours?</b>
          </Form.Label>
          <Form.Control
            autoFocus
            onChange={handleMessageChange}
            value={message}
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
