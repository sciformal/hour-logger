import API from '@aws-amplify/api';
import { makeStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import Loader from '../../components/global/Loader';
import { User } from '../../types/database/User';

const CheckIn = ({ users }) => {
  const [checkedInUsers, setCheckedInUsers] = useState(
    users.filter(user => user.isCheckedIn),
  );

  const addCheckedInUser = user => {
    setCheckedInUsers([...checkedInUsers, user]);
  };

  const removeCheckedInUser = user => {
    // logic to remove the checked in user.
    setCheckedInUsers(checkedInUsers.filter(u => u.userId !== user.userId));
  };

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

        <CheckInForm
          addUser={addCheckedInUser}
          removeUser={removeCheckedInUser}
        />
      </div>

      {/* Right Side */}
      <div style={{ width: '60%', textAlign: 'center', padding: 20 }}>
        <h4>
          <b>Checked In Users</b>
        </h4>

        <br />
        <br />

        {checkedInUsers && checkedInUsers.length > 0 ? (
          <CheckedInUsersTable
            users={checkedInUsers}
            removeCheckedInUser={removeCheckedInUser}
          />
        ) : (
          <div style={{ width: '80%', margin: 'auto' }}>
            No users are currently checked in.
          </div>
        )}
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const CheckInForm = props => {
  const classes = useStyles();
  const [studentNumber, setStudentNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState('');

  const { addUser, removeUser } = props;

  // @ts-ignore
  const handleStudentNumber = e => {
    setStudentNumber(e.target.value);
  };

  const handleCheckIn = async () => {
    if (studentNumber.length !== 8) {
      setErr('Student number must be 8 digits.');
      return;
    }
    setSubmitting(true);
    setErr('');
    try {
      const updatedUser = await API.post('hour-logger', '/users/check-in', {
        body: {
          studentNumber,
        },
      });
      setUser(updatedUser);
      setSubmitted(true);
      if (updatedUser.isCheckedIn) {
        addUser(updatedUser);
      } else {
        removeUser(updatedUser);
      }
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        const errMessage = err.response.data.message;
        setErr(errMessage);
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
        </>
      );
    }
  }
};

function CheckedInUsersTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell align="center">
              <b>Check In Time</b>
            </TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.users.map((user: User) => (
            <CheckedInUser
              key={user.userId}
              user={user}
              removeCheckedInUser={props.removeCheckedInUser}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CheckedInUser(props) {
  const { removeCheckedInUser } = props;

  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const user: User = props.user;

  const transaction = user.transactions[0];

  const handleCheckout = async () => {
    setCheckoutLoading(true);

    // do checkout
    try {
      const updatedUser = await API.post('hour-logger', '/users/check-in', {
        body: {
          studentNumber: user.studentNumber,
        },
      });
      setCheckoutLoading(false);
      removeCheckedInUser(updatedUser);
    } catch (err) {
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleString();
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          {user.firstName + ' ' + user.lastName}
        </TableCell>
        <TableCell align="center">{formatDate(transaction.checkIn)}</TableCell>
        <TableCell align="right">
          <Button onClick={handleCheckout}>
            {!checkoutLoading ? 'Check Out' : 'Checking out user...'}
          </Button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default CheckIn;
