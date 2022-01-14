import API from '@aws-amplify/api';
import { makeStyles } from '@material-ui/core';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, Tab, Table, Tabs } from 'react-bootstrap';
import Loader from '../components/global/Loader';
import Link from '@material-ui/core/Link';

const usersHeaders = [
  'Name',
  'Student Number',
  'Hours Completed',
  'Hours Required',
  'Checked In',
];

const checkedInUsersHeaders = ['Name', 'Check In Time', 'Check Out'];

export const UsersPage = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(null);

  useEffect(() => {
    // TODO: Sort users by name alphabetically
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const users = await API.get('hour-logger', '/users', {});
    setUsers(users);
    setLoading(false);
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
            <CheckIn users={users} />
          </Tab>
          <Tab eventKey="third" title="All Users">
            <AllUsers users={users} />
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

const CheckIn = ({ users }) => {
  const checkedInUsers = users.filter(user => user.isCheckedIn);

  return (
    // Container
    <div style={{ display: 'flex' }}>
      {/* Left Side */}
      <div
        style={{
          width: '40%',
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
      <div style={{ width: '60%', textAlign: 'center', padding: 20 }}>
        <h4>
          <b>Checked In Users</b>
        </h4>
        <CheckedInUsersTable
          users={checkedInUsers}
          headers={checkedInUsersHeaders}
        />
      </div>
    </div>
  );
};

const AllUsers = ({ users }) => {
  const [query, handleQuery] = useState('');

  const handleQueryChange = (e: any) => {
    handleQuery(e.target.value);
  };

  const testField = value => {
    return value.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const isMatch = user => {
    return (
      testField(user.firstName) ||
      testField(user.lastName) ||
      testField(user.studentNumber) ||
      testField(user.email)
    );
  };

  const filteredUsers = !query ? users : users.filter(isMatch);

  return (
    <div>
      <div style={{ width: '30%', margin: 'auto' }}>
        <Form.Label>
          <b>Search Users</b>
        </Form.Label>
        <Form.Control
          autoFocus
          onChange={handleQueryChange}
          value={query}
          type="lname"
        />
      </div>
      <br />
      <br />

      <div style={{ width: '60%', margin: 'auto' }}>
        <UsersTable users={filteredUsers} headers={usersHeaders} />
      </div>
    </div>
  );
};

function UsersTable({ headers, users }) {
  return <div>There will be a table here.</div>;
}

function CheckedInUsersTable({ headers, users }) {
  const classes = useStyles();
  const [err, setErr] = useState('');

  const handleCheckIn = async (user: any) => {
    setErr('');
    try {
      await API.post('hour-logger', '/users/check-in', {
        body: {
          // @ts-ignore
          studentNumber: user.studentNumber,
        },
      });
    } catch (err: any) {
      console.log(err);
      setErr(err);
    }
  };
  return (
    <>
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
                <td>{user.firstName + ' ' + user.lastName}</td>
                <td>
                  {new Date(user.transactions.at(-1).checkIn).toDateString() +
                    ' ' +
                    new Date(
                      user.transactions.at(-1).checkIn,
                    ).toLocaleTimeString()}
                </td>
                <td>
                  {
                    <Button
                      onClick={() => handleCheckIn(user)}
                      variant="contained"
                      type="submit"
                      className={classes.submit}
                      color="primary"
                    >
                      Check Out
                    </Button>
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </Table>
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
