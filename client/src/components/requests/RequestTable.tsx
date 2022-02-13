import { CircularProgress } from '@material-ui/core';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { API } from 'aws-amplify';
import * as React from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const Requests = ({ requests }) => {
  const [query, handleQuery] = useState('');

  const handleQueryChange = (e: any) => {
    handleQuery(e.target.value);
  };

  const testField = value => {
    return value.toLowerCase().indexOf(query.toLowerCase()) >= 0;
  };

  const isMatch = user => {
    return testField(user.firstName) || testField(user.lastName);
  };

  const filteredRequests = !query ? requests : requests.filter(isMatch);

  return (
    <div>
      <div style={{ width: '30%', margin: 'auto' }}>
        <Form.Label>
          <b>Search</b>
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

      <div style={{ width: '80%', margin: 'auto' }}>
        <RequestsTable requests={filteredRequests} />
      </div>
    </div>
  );
};

export function RequestsTable({ requests }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <b>Name</b>
            </TableCell>
            <TableCell align="right">
              <b>Request Type</b>
            </TableCell>
            <TableCell align="right">
              <b>Status</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map(request => (
            <RequestRow key={request.requestId} request={request} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const RequestRow = ({ request }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {request.firstName + ' ' + request.lastName}
        </TableCell>
        <TableCell align="right">{request.type}</TableCell>
        <TableCell align="right">{request.status}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '50%' }}>
                  {request.type === 'TRANSFER' && (
                    <>
                      <Typography variant="h6" gutterBottom component="div">
                        To: {request.toFirstName + ' ' + request.toLastName}
                      </Typography>
                      <Typography variant="h6" gutterBottom component="div">
                        Hours: {request.numHours}
                      </Typography>
                    </>
                  )}

                  <Typography variant="subtitle1" gutterBottom component="div">
                    <b>Request Message</b>
                  </Typography>

                  <Typography variant="body1" gutterBottom component="div">
                    {request.message}
                  </Typography>
                </div>
                <div style={{ width: '10%' }} />
                {request.status === 'PENDING' ? (
                  <RequestFeedback request={request} />
                ) : (
                  <div style={{ paddingTop: '20px', margin: 'auto' }}>
                    <Typography variant="body1" gutterBottom component="div">
                      The request has been approved!
                    </Typography>
                  </div>
                )}
              </div>
              <br />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const RequestFeedback = ({ request }) => {
  const [notes, setNotes] = useState('');
  const [numHours, setNumHours] = useState(request.numHours || 0);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');

  const handleNotesChange = e => {
    setNotes(e.target.value);
  };

  const handleHoursChange = e => {
    setNumHours(e.target.value);
  };
  const handleRequest = async (isApproved: boolean) => {
    setErr('');
    setSubmitting(true);

    try {
      await API.put('hour-logger', `/requests/${request.requestId}`, {
        body: {
          status: isApproved ? 'APPROVED' : 'DENIED',
          numHours: numHours,
          notes,
        },
      });
    } catch (err) {
      setErr('There was an error updating the request.');
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div style={{ margin: 'auto' }}>
        <CircularProgress />
      </div>
    );
  } else {
    return (
      <div style={{ width: '40%', paddingTop: '20px' }}>
        <Form.Control
          autoFocus
          onChange={handleHoursChange}
          value={numHours}
          placeholder="Number of hours"
          type="lname"
        />
        <br />
        <Form.Control
          autoFocus
          onChange={handleNotesChange}
          value={notes}
          as="textarea"
          placeholder="Comments"
          type="lname"
        />
        <div
          style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            paddingTop: '10px',
          }}
        >
          <Button
            variant="success"
            type="submit"
            onClick={() => handleRequest(true)}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            type="submit"
            onClick={() => handleRequest(false)}
          >
            Reject
          </Button>
        </div>
        {err && (
          <>
            <br />
            <div style={{ color: 'red' }}>{err}</div>
          </>
        )}
      </div>
    );
  }
};

export default Requests;
