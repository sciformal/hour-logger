import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { API, Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import {
  useAuthenticationContext,
  useUserContext,
} from '../../libs/contextLib';
import { UserType } from '../../types/database/UserType';

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const { setUser } = useUserContext();
  const { userHasAuthenticated } = useAuthenticationContext();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [signUpStep, setSignUpStep] = useState(1);

  const [err, setErr] = useState('');
  const [confirming, setConfirming] = useState(false);

  // @ts-ignore
  const handleFirstNameChange = e => {
    setFirstName(e.target.value);
  };

  // @ts-ignore
  const handleLastNameChange = e => {
    setLastName(e.target.value);
  };

  // @ts-ignore
  const handleStudentNumberChange = e => {
    setStudentNumber(e.target.value);
  };

  // @ts-ignore
  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  // @ts-ignore
  const handleUserTypeChange = e => {
    setUserType(e.target.value);
  };

  // @ts-ignore
  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  // @ts-ignore
  const handleConfirmationCodeChange = e => {
    setConfirmationCode(e.target.value);
  };

  // @ts-ignore
  const handleRegister = async e => {
    e.preventDefault();
    try {
      if (studentNumber.length !== 8) {
        setErr('Student number must be 8 digits.');
        return;
      }
      await API.post('hour-logger', '/users/validate', {
        body: {
          studentNumber,
          userType,
        },
      });

      await Auth.signUp({
        username: email,
        password: password,
        attributes: {
          given_name: firstName,
          family_name: lastName,
          'custom:studentNumber': studentNumber,
          'custom:userType': userType,
        },
      });
      setSignUpStep(2);
      setErr(''); // reset error message if there was one
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        // custom response from the validate user call
        const errMessage = err.response.data.message;
        if (errMessage.indexOf('DynamoDB') >= 0) {
          const errMsg = 'The student number has already been registered.';
          setErr(errMsg);
        }

        if (errMessage.indexOf('userType') >= 0) {
          const errMsg = 'Please select a valid user type.';
          setErr(errMsg);
        }
      } else {
        setErr(err.message);
      }
    }
  };

  const handleResendConfirmationCode = async e => {
    e.preventDefault();
    setErr('');

    try {
      await Auth.resendSignUp(email);
    } catch (err: any) {
      console.log(err);
      setErr(err.message);
    }
  };

  // @ts-ignore
  // TODO: FIelds here should be taken from Cognito and not assumed frmo form
  const handleConfirmRegister = async e => {
    e.preventDefault();
    setErr('');
    setConfirming(true);

    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      let cognitoUserInfo = await Auth.currentUserInfo();
      const userId = cognitoUserInfo.username;

      const user = await API.post('hour-logger', '/users', {
        body: {
          firstName,
          lastName,
          email,
          studentNumber,
          userId,
          userType,
        },
        response: true,
      });

      setUser(user);
      userHasAuthenticated(true);
      window.location.href = '/';
    } catch (err: any) {
      if (err.message) {
        if (err.message.indexOf('Current status is CONFIRMED') >= 0) {
          window.location.href = '/';
        } else {
          setErr(err.message);
        }
      }
    } finally {
      setConfirming(false);
    }
  };

  if (signUpStep === 1) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Create An Account
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

          <form className={classes.form} noValidate autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Form.Label>
                  <b>First Name</b>
                </Form.Label>
                <Form.Control
                  autoFocus
                  onChange={handleFirstNameChange}
                  value={firstName}
                  type="firstName"
                  id="firstName"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Form.Label>
                  <b>Last Name</b>
                </Form.Label>
                <Form.Control
                  onChange={handleLastNameChange}
                  value={lastName}
                  type="lastName"
                  id="lastName"
                />
              </Grid>

              <Grid item xs={12}>
                <Form.Label>
                  <b>Student Number</b>
                </Form.Label>
                <Form.Control
                  onChange={handleStudentNumberChange}
                  value={studentNumber}
                  id="studentNumber"
                />
              </Grid>
              <Grid item xs={12}>
                <Form.Label>
                  <b>Email</b>
                </Form.Label>
                <Form.Control
                  onChange={handleEmailChange}
                  value={email}
                  placeholder="Enter email"
                  type="email"
                  id="email"
                  autoComplete="false"
                />
              </Grid>
              <Grid item xs={12}>
                <Form.Label>
                  <b>Password</b>
                </Form.Label>
                <Form.Control
                  type="password"
                  id="password"
                  onChange={handlePasswordChange}
                  value={password}
                />
              </Grid>

              <Grid item xs={12}>
                <Form.Label>
                  <b>User Type</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  id="userType"
                  value={userType}
                  onChange={handleUserTypeChange}
                >
                  <option value="">Select your user type</option>
                  <option value={UserType.ENGINEER_ENROLLED}>
                    Sci'21 or Sci'22 Student Enrolled in Classes
                  </option>
                  <option value={UserType.INTERNSHIP_KTOWN}>
                    Sci'21 or Sci'22 Student on Internship Residing in Kingston
                  </option>
                  <option value={UserType.INTERNSHIP}>
                    Sci'21 or Sci'22 Student on Internship Outside of Kingston
                  </option>
                  <option value={UserType.GUEST_QUEENS}>
                    Guest Enrolled at Queen's
                  </option>
                  <option value={UserType.GUEST}>External Guest</option>
                  <option value={UserType.SCIFORMAL}>
                    Sci Formal Committee
                  </option>
                </Form.Control>
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleRegister}
            >
              Register
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href="/" variant="body2">
                &#8592; Sign In
              </Link>
              <Link
                href="#confirm"
                variant="body2"
                onClick={() => {
                  setErr('');
                  setSignUpStep(2);
                }}
              >
                Confirm Account &#8594;
              </Link>
            </div>
          </form>
        </div>
      </Container>
    );
  } else if (signUpStep === 2) {
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Confirm Your Account
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
              <b>Confirm Email</b>
            </Form.Label>
            <Form.Control
              autoFocus
              onChange={handleEmailChange}
              value={email}
              type="email"
              id="email"
            />
            <br />
            <Form.Label>
              <b>Confirmation Code</b>
            </Form.Label>
            <Form.Control
              type="confirmationCode"
              id="confirmation"
              onChange={handleConfirmationCodeChange}
              value={confirmationCode}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleConfirmRegister}
            >
              {confirming ? 'Confirming Account...' : 'Confirm Account'}
            </Button>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link
                onClick={() => {
                  setErr('');
                  setSignUpStep(1);
                }}
                variant="body2"
              >
                &#8592; Create Account
              </Link>
              <Link
                href="#confirm"
                variant="body2"
                onClick={handleResendConfirmationCode}
              >
                Resend Code &#8635;
              </Link>
            </div>
          </form>
        </div>
      </Container>
    );
  }
}
