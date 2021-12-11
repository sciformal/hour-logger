import API from '@aws-amplify/api';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { makeStyles, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Alert, Form, Tab, Table, Tabs } from 'react-bootstrap';
import Loader from '../components/global/Loader';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

const usersHeaders = [
  'Name',
  'Student Number',
  'Hours Completed',
  'Hours Required',
  'Checked In',
];

export const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // TODO: Sort users by name alphabetically
    loadUsers();
  }, [query]);

  const loadUsers = async () => {
    const users = await API.get('hour-logger', '/users', {});
    setUsers(users);
    setLoading(false);
  };

  const handleQueryChange = e => {
    setQuery(e.target.value);
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div style={{ padding: '5%', width: '85%' }}>
        <h2>Users</h2>
        <br />
        <br />
        <Tabs defaultActiveKey="first">
          <Tab eventKey="first" title="Summary">
            <UsersSummary />
          </Tab>
          <Tab eventKey="second" title="Check In">
            <CheckIn />
          </Tab>
          <Tab eventKey="third" title="All Users">
            <AllUsers
              handleQueryChange={handleQueryChange}
              query={query}
              users={users}
            />
          </Tab>
        </Tabs>
      </div>
    );
  }
};

const UsersSummary = () => {
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
        Blah blah blah left side!
      </div>

      {/* Right Side */}
      <div style={{ width: '50%', textAlign: 'center' }}>
        Blah blah blah right side!
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CheckInForm = () => {
  const classes = useStyles();
  const [studentNumber, setStudentNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState('');

  // @ts-ignore
  const handleStudentNumber = e => {
    setStudentNumber(e.target.value);
  };

  const handleCheckIn = async () => {
    setSubmitting(true);
    setErr('');
    try {
      const result = await API.post('hour-logger', '/users/check-in', {
        body: {
          studentNumber,
        },
      });
      console.log(result);
      setUser(result);
      setSubmitted(true);
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        const errMessage = err.response.data.message;
        if (errMessage.indexOf('DynamoDB') >= 0) {
          const errMsg = 'The student number has already been registered.';
          setErr(errMsg);
        } else {
          setErr('User could not be checked in.');
        }
      }
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
        <>
          <div>
            <h5>
              {user.firstName} has been checked{' '}
              {user.isCheckedIn ? 'in' : 'out'}!
            </h5>
            <br />
            <CheckCircleOutlineIcon
              fontSize="large"
              style={{ width: '60%', height: '3em' }}
            />
          </div>
          <br />
          <Link
            onClick={() => {
              setErr('');
              setStudentNumber('');
              setSubmitted(false);
            }}
          >
            Check in another user?
          </Link>
        </>
      );
    } else {
      return (
        <>
          <div style={{ width: '60%', margin: 'auto' }}>
            <Form.Label style={{ textAlign: 'left', width: '100%' }}>
              <b>Student Number</b>
            </Form.Label>
            <Form.Control
              autoFocus
              onChange={handleStudentNumber}
              value={studentNumber}
            />
          </div>
          <br />
          <Button
            onClick={handleCheckIn}
            variant="contained"
            type="submit"
            className={classes.submit}
            color="primary"
          >
            Check In
          </Button>
          <br />
          <br />
          {err !== '' && (
            <Alert
              variant="danger"
              style={{ width: '80%', textAlign: 'center', margin: 'auto' }}
            >
              {err}
            </Alert>
          )}
        </>
      );
    }
  }
};

const CheckIn = () => {
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
          <b>Check In</b>
        </h4>
        <br></br>

        <CheckInForm />
      </div>

      {/* Right Side */}
      <div style={{ width: '50%', textAlign: 'center' }}>
        Show all checked in users
      </div>
    </div>
  );
};

const AllUsers = ({ handleQueryChange, query, users }) => {
  return (
    <div>
      <div style={{ width: '30%', margin: 'auto' }}>
        <TextField
          autoComplete="search"
          name="search"
          variant="outlined"
          fullWidth
          id="search"
          label="Search"
          onChange={handleQueryChange}
          value={query}
          autoFocus
        />
      </div>
      <br />
      <br />

      <div style={{ width: '60%', margin: 'auto' }}>
        <UsersTable users={users} headers={usersHeaders} />
        {/* TODO: Make pagable */}
      </div>
    </div>
  );
};

function UsersTable({ headers, users }) {
  return (
    <Table bordered>
      <thead>
        <tr>
          {
            // @ts-ignore
            headers.map(name => (
              // @ts-ignore
              <th key={name}>{name}</th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          // @ts-ignore
          users.map(user => (
            <tr key={user.userId}>
              <td>
                <a href={`/users/${user.userId}`}>
                  {user.firstName + ' ' + user.lastName}
                </a>
              </td>
              <td>{user.studentNumber}</td>
              <td>{user.hours.toFixed(2)}</td>
              <td>{user.hoursNeeded}</td>
              <td>{user.isCheckedIn ? 'Yes' : 'No'}</td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
}
