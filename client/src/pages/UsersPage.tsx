import API from '@aws-amplify/api';
import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
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
  const [usersCheckedIn, setUsersCheckedIn] = useState(0);
  const [users, setUsers] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // TODO: Sort users by name alphabetically
    loadUsers();
  }, [query]);

  const loadUsers = async () => {
    const users = await API.get('hour-logger', '/users', {});
    let totalUsersCheckedIn = 0;

    users.forEach(user => {
      totalUsersCheckedIn += user.isCheckedIn ? 1 : 0;
    });

    setUsersCheckedIn(totalUsersCheckedIn);
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
      <div style={{ textAlign: 'center', paddingTop: '40px' }}>
        <h2>All Users</h2>
        <br />
        <br />

        <h4>
          <b>Total Checked In Users</b>: {usersCheckedIn}
        </h4>
        <br />
        <br />

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

        <h4>My Hours</h4>
        <br />

        <div style={{ width: '60%', margin: 'auto' }}>
          <UsersTable users={users} headers={usersHeaders} />
          {/* TODO: Make pagable */}
        </div>
      </div>
    );
  }
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
