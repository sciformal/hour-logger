import API from '@aws-amplify/api';
import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Button, Tab, Table, Tabs } from 'react-bootstrap';
import Loader from '../components/global/Loader';

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

const CheckInForm = () => {
  const [studentNumber, setStudentNumber] = useState('');

  // @ts-ignore
  const handleStudentNumber = e => {
    setStudentNumber(e.target.value);
  };

  const handleCheckIn = async () => {
    await API.post('hour-logger', '/users/check-in', {
      body: {
        studentNumber,
      },
    });
  };
  return (
    <>
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
    </>
  );
};

export const CheckIn = () => {
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
              <td>{user.hours}</td>
              <td>{user.hoursNeeded}</td>
              <td>{user.isCheckedIn ? 'Yes' : 'No'}</td>
            </tr>
          ))
        }
      </tbody>
    </Table>
  );
}
