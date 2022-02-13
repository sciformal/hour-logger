import API from '@aws-amplify/api';
import { useEffect, useState } from 'react';
import Loader from '../components/global/Loader';
import Requests from '../components/requests/RequestTable';

export const RequestsPage = () => {
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const requests = await API.get('hour-logger', '/requests', {});
    setRequests(requests);
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
        <h2>Requests</h2>
        <br />
        <br />
        <Requests requests={requests} />
      </div>
    );
  }
};
