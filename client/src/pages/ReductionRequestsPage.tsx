import API from "@aws-amplify/api";
import { useEffect, useState } from "react";
import Loader from "../components/global/Loader";
import RequestCard from "../components/requests/RequestCard";

export const ReductionRequestsPage = () => { 
  const [requests, setRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    loadRequests();
  }, []);
  
  const loadRequests = async () => { 
    const requests = await API.get('hour-logger', '/requests', {});

    const pendingRequests = requests.filter(request => request.status === 'PENDING');

    setRequests(pendingRequests);
    setLoading(false);
  }

  if (loading) {
    return <Loader />
  } else {
    return (
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ textAlign: 'center', padding: '50px' }}>View Reduction Requests</h1>
          {/* @ts-ignore */}
          <div style={{width: "70%", margin: 'auto', display: 'flex', gap: '50px', flexWrap: 'wrap', justifyContent: 'center'}}>
          {
            requests.map(request => (
              <RequestCard request={request}/>
            ))
          }
          </div>
        </div>
    );
  }
}