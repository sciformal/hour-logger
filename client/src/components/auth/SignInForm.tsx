import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { API, Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  useAuthenticationContext,
  useUserContext,
} from '../../libs/contextLib';

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

export default function SignInForm() {
  const classes = useStyles();
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // @ts-ignore
  const { userHasAuthenticated } = useAuthenticationContext();

  // @ts-ignore
  const { setUser } = useUserContext();

  // @ts-ignore
  const handleEmailInputChange = e => {
    setEmailInput(e.target.value);
  };

  // @ts-ignore
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  // @ts-ignore
  const handleSignIn = async e => {
    e.preventDefault();
    setErr(''); // reset error message
    try {
      setIsSigningIn(true);
      await Auth.signIn(emailInput, password);
      let user;

      let cognitoUserInfo = await Auth.currentUserInfo();
      const userId = cognitoUserInfo.username;
      const studentNumber = cognitoUserInfo.attributes['custom:studentNumber'];
      const userType = cognitoUserInfo.attributes['custom:userType'];
      const { given_name, family_name, email } = cognitoUserInfo.attributes; // desctructure the cognito user info object.
      const { status, data } = await API.get(
        'hour-logger',
        `/users/${userId}`,
        { response: true },
      );

      if (status === 204) {
        // User doesnt exist in DB, create new user
        user = await API.post('hour-logger', '/users', {
          body: {
            userId,
            email,
            studentNumber,
            userType,
            firstName: given_name,
            lastName: family_name,
          },
        });
      } else {
        user = data;
      }

      setUser(user);
      userHasAuthenticated(true);
      navigate('/');
    } catch (err: any) {
      setErr(err.message);
      setIsSigningIn(false);
      console.log(err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign In
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
        <form className={classes.form}>
          <Form.Label>
            <b>Email address</b>
          </Form.Label>
          <Form.Control
            autoFocus
            onChange={handleEmailInputChange}
            value={emailInput}
            placeholder="Enter email"
            type="email"
          />
          <br />
          <Form.Label>
            <b>Password</b>
          </Form.Label>
          <Form.Control
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
            value={password}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Link
              href="/forgot-password"
              variant="body2"
              style={{ paddingTop: '10px' }}
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignIn}
          >
            {isSigningIn ? 'Signing in...' : 'Sign in'}
          </Button>
          <div style={{ textAlign: 'center' }}>
            Don't have an account?
            <Link href="/register" variant="body2">
              &nbsp;Create an account.
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
