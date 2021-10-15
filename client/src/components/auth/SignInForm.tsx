import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { API, Auth } from 'aws-amplify';
import React, { useState } from 'react';
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

  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');

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
    try {
      await Auth.signIn(emailInput, password);
      let user;

      let cognitoUserInfo = await Auth.currentUserInfo();
      const userId = cognitoUserInfo.username;
      const studentNumber = cognitoUserInfo.attributes['custom:studentNumber'];
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
            firstName: given_name,
            lastName: family_name,
          },
        });
      } else {
        user = data;
      }

      setUser(user);
      userHasAuthenticated(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
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
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordChange}
            value={password}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignIn}
          >
            Sign In
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
              <br />
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
