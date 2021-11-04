import API from '@aws-amplify/api';
import { TextField } from '@material-ui/core';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import * as React from 'react';

export default function RequestCard({request}) {
  const [isEnterNums, setIsEnterNums] = React.useState(false);
  const [numHoursReduced, setNumHoursReduced] = React.useState('');

    
    const handleApprove = async () => {
      await API.put('hour-logger', `/requests/${request.requestId}`, {
        body: {
          numHoursReduced,
          status: "APPROVED"
        }
      });
    };
    
    const handleApprovalFlow = () => {
      setIsEnterNums(true);
    }

    const handleDeny = async () => {
      await API.put('hour-logger', `/requests/${request.requestId}`, {
        body: {
          status: "DENIED"
        }
      });
    }
    
    const handleInputChange = e => {
      setNumHoursReduced(e.target.value);
    }

  return (
    <Card sx={{ width: 300 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {request.firstName} {request.lastName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Status : {request.status}
        </Typography>
        <Typography variant="body2">
          {request.message}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleApprovalFlow} size="small" style={{color: "green"}}>Approve</Button>
        <Button onClick={handleDeny} size="small" style={{color: "red"}}>Deny</Button>
      </CardActions>
      {
        isEnterNums && (
          <>
          <TextField value={numHoursReduced} onChange={handleInputChange} placeholder="enter the number hours"/>
          <Button onClick={handleApprove} size="small" style={{color: "green"}}>Submit</Button>
          </>
        )
      }
      <br/>
      <br/>
      <br/>
    </Card>
  );
}