import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { User } from '../../types/database/User';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

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

      <div style={{ width: '80%', margin: 'auto' }}>
        <UsersTable users={filteredUsers} />
      </div>
    </div>
  );
};

export function UsersTable({ users }) {
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
              <b>Hours Completed</b>
            </TableCell>
            <TableCell align="right">
              <b>Hours Required</b>
            </TableCell>
            <TableCell align="right">
              <b>User Type</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: User) => (
            <UserRow user={user} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function UserRow(props) {
  const user: User = props.user;
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
          {user.firstName + ' ' + user.lastName}
        </TableCell>
        <TableCell align="right">{user.hours + user.finalHours}</TableCell>
        <TableCell align="right">
          {user.regularHoursNeeded + user.finalHoursNeeded}
        </TableCell>
        <TableCell align="right">{user.userType}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Current Hours Logged
              </Typography>
              {user.transactions.length > 0 ? (
                <UserTransactions transactions={user.transactions} />
              ) : (
                <div>The user has no hours logged yet. </div>
              )}

              <br />

              <Typography variant="h6" gutterBottom component="div">
                Requests
              </Typography>
              {/* @ts-ignore */}
              {user.requests?.length > 0 ? (
                <UserTransactions transactions={user.transactions} />
              ) : (
                <div>The user has no requests yet. </div>
              )}
              <br />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function UserTransactions(props) {
  const { transactions } = props;
  return (
    <Table size="small" aria-label="purchases">
      <TableHead>
        <TableRow>
          <TableCell>Check In</TableCell>
          <TableCell>Check Out</TableCell>
          <TableCell align="right">Time: </TableCell>
          <TableCell align="right"></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {transactions.map((transaction, idx) => (
          <TableRow key={idx}>
            <TableCell component="th" scope="row">
              {transaction.checkIn}
            </TableCell>
            <TableCell>{transaction.checkOut}</TableCell>
            <TableCell align="right">100</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AllUsers;
