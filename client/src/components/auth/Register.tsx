import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Auth, API } from "aws-amplify";
import React, { useState } from "react";
import { useAuthenticationContext, useUserContext } from "../../libs/contextLib";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [signUpStep, setSignUpStep] = useState(1);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // @ts-ignore
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  // @ts-ignore
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  // @ts-ignore
  const handleStudentNumberChange = (e) => {
    setStudentNumber(e.target.value);
  };

  // @ts-ignore
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // @ts-ignore
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // @ts-ignore
  const handleConfirmationCodeChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  // @ts-ignore
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsPasswordInvalid(false);
    await Auth.signUp({
      username: email,
      password: password,
      attributes: {
        given_name: firstName,
        family_name: lastName,
      },
    })
      .then(() => {
        setSignUpStep(2);
      })
      .catch((err) => {
        // TODO: Handle this
        console.log(err);
        if (err.code === "InvalidPasswordException") {
          setIsPasswordInvalid(true);
          setPasswordError(err.message);
        }
        // User already exists?
        console.log(err);
      });
  };

  // @ts-ignore
  const handleConfirmRegister = async (e) => {
    e.preventDefault();
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      let cognitoUserInfo = await Auth.currentUserInfo();
      const userId = cognitoUserInfo.username;

      const user = API.post("hour-logger", "/users", {
        body: {
          firstName,
          lastName,
          email,
          studentNumber,
          userId,
        },
      });

      setUser(user);
      userHasAuthenticated(true);
      window.location.href = "/";
    } catch (e) {
      // Expired code?
      console.log(e);
    }
  };

  if (signUpStep === 1) {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  onChange={handleFirstNameChange}
                  value={firstName}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={handleLastNameChange}
                  value={lastName}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="studentNumber"
                  label="Student Number"
                  name="studentNumber"
                  onChange={handleStudentNumberChange}
                  value={studentNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  value={email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
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
              </Grid>
            </Grid>
            {/* Show password error if the password is not valid */}
            {isPasswordInvalid && <div>{passwordError}</div>}
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
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
                <br />
                <Link
                  href="#confirm"
                  variant="body2"
                  onClick={() => setSignUpStep(2)}
                >
                  Already have a confirmation code?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  } else if (signUpStep === 2) {
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Confirm Your Account
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="confirmationCode"
                  variant="outlined"
                  required
                  fullWidth
                  id="confirmationCode"
                  label="Confirmation Code"
                  onChange={handleConfirmationCodeChange}
                  value={confirmationCode}
                  autoFocus
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handleConfirmRegister}
            >
              Confirm Registration
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}
