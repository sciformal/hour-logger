import Auth from '@aws-amplify/auth';
import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React, { useState } from 'react';
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
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
  };

  if (step === 1) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="emailInput"
              label="Email Address"
              name="emailInput"
              autoComplete="emailInput"
              autoFocus
              onChange={handleEmailInputChange}
              value={emailInput}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleForgotPassword}
            >
              Forgot Password
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
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Forgot Password Confirmation Code
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="confirmationCodeInput"
              label="Confirmation Code"
              name="confirmationCodeInput"
              autoComplete="confirmationCodeInput"
              autoFocus
              onChange={handleConfirmationCodeInputChange}
              value={confirmationCodeInput}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="current-password"
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
              Update Password
            </Button>
          </form>
        </div>
      </Container>
    );
  }
};
