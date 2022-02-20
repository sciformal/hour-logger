# Integration Test Cases

## Check In

- Create a new user
- Check in the user
- Verify that the users transactions are updated without a checkout time and status is checked in
- Check out the user
- Verify that the users hours, transactions are updated without a checkout time and status is checked out
- Delete user

## Reduction Requests

### Create and Approve

- Create a new user
- Submit hour reduction request
- Verify that the request exists
- Approve the reduction request
- Verify that the user is updated
- Verify that the request is updated
- Delete user
- Delete request

### Create and Reject

- Create a new user
- Submit hour reduction request
- Verify that the request exists
- Approve the reduction request
- Verify that the user is updated
- Verify that the request is updated
- Delete user
- Delete request

## Transfer Requests

### Approval flow

- Create two users
- Submit a transfer request (userA -> userB)
- Verify that the request exists
- Approve the request
- Verify that userA hours decreased
- Verify that userB hours increased
- Verify request is updated
- Delete users
- Delete request

### Rejection flow

- Create two users
- Submit a transfer request (userA -> userB)
- Verify that the request exists
- Reject the request
- Verify that the users have not changed
- Verify request is updated
- Delete users
- Delete request

### Invalid transfer flow (transferring hours that haven't been accumulated yet) - it shouldnt be possible to go into an hour deficit

-
