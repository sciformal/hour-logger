import API from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Loader from '../components/global/Loader';
import CheckIn from '../components/users/CheckIn';
import AllUsers from '../components/users/UserTable';

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
    return (
      <div
        className="App"
        style={{ height: '100vh', lineHeight: '100vh', margin: 'auto' }}
      >
        <Loader />
      </div>
    );
  } else {
    return (
      <div style={{ padding: '5%', textAlign: 'center' }}>
        <h2>Users</h2>
        <br />
        <br />
        <Tabs defaultActiveKey="first">
          <Tab eventKey="first" title="Users">
            <AllUsers users={users} />
          </Tab>
          <Tab eventKey="second" title="Check In">
            <CheckIn users={users} />
          </Tab>
        </Tabs>
      </div>
    );
  }
};
