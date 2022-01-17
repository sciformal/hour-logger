import Auth from '@aws-amplify/auth';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { useAuthenticationContext } from '../../libs/contextLib';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const ForgotPassword = () => {
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [emailInput, setEmailInput] = useState('');
  const [confirmationCodeInput, setConfirmationCodeInput] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  // @ts-ignore
  const { userHasAuthenticated } = useAuthenticationContext();

  // @ts-ignore
  const handleEmailInputChange = e => {
    setEmailInput(e.target.value);
  };

  // @ts-ignore
  const handleConfirmationCodeInputChange = e => {
    setConfirmationCodeInput(e.target.value);
  };

  // @ts-ignore
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    try {
      await Auth.forgotPassword(emailInput);
      setStep(2);
    } catch (err) {
      console.log(err);
    }
  };

  const handleConfirmForgotPassword = async e => {
    e.preventDefault();
    try {
      await Auth.forgotPasswordSubmit(
        emailInput,
        confirmationCodeInput,
        password,
      );
      await Auth.signIn(emailInput, password);
      userHasAuthenticated(true);
      // @ts-ignore
      window.location = '/';
    } catch (err: any) {
      setErr(err.message);
      console.log(err);
    }
  };

  if (step === 1) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <br />

          <Alert variant="info" style={{ width: '100%', textAlign: 'center' }}>
            If an account is found, you will be sent a confirmation code to
            reset your password.
          </Alert>

          <form className={classes.form} noValidate>
            <Form.Label>
              <b>Email address</b>
            </Form.Label>
            <Form.Control
              autoComplete="email"
              autoFocus
              onChange={handleEmailInputChange}
              value={emailInput}
              placeholder="Enter email"
              type="email"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleForgotPassword}
            >
              Reset Password
            </Button>
            {/* TODO: Return to sign in from forgot password */}
          </form>
        </div>
      </Container>
    );
  } else {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <br />
          {err !== '' && (
            <Alert
              variant="danger"
              style={{ width: '100%', textAlign: 'center' }}
            >
              {err}
            </Alert>
          )}
          <form className={classes.form} noValidate>
            <Form.Label>
              <b>Confirmation Code</b>
            </Form.Label>
            <Form.Control
              type="confirmationCode"
              id="confirmation"
              onChange={handleConfirmationCodeInputChange}
              value={confirmationCodeInput}
            />
            <br />
            <Form.Label>
              <b>New Password</b>
            </Form.Label>
            <Form.Control
              type="password"
              id="password"
              onChange={handlePasswordChange}
              value={password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleConfirmForgotPassword}
            >
              Reset Password
            </Button>
          </form>
        </div>
      </Container>
    );
  }
};
