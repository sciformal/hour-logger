import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Auth } from "aws-amplify";
import 'bootstrap/dist/css/bootstrap.css';
import { useAuthenticationContext } from "libs/contextLib";
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

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

export default function ForgotPassword() {
  const classes = useStyles();
  const history = useHistory();

  // Form Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const { userHasAuthenticated } = useAuthenticationContext();

  // For moving between form & confirmation code.
  const [signUpStep, setSignUpStep] = useState(1);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleConfirmationCodeChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();
    try {
      await Auth.forgotPassword(email);
      setSignUpStep(2);
    } catch (err) {
    }
  };

  const handlePasswordConfirm = async (e) => {
    e.preventDefault();
    try {
      await Auth.forgotPasswordSubmit(email, confirmationCode, password);
      await Auth.signIn(email, password);
      userHasAuthenticated(true);
      
      history.push("/");
    } catch (err) {
      userHasAuthenticated(false);
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
            Password Recovery
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={handlePasswordRecovery}
            >
              Restore Password
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
                  name="password"
                  variant="outlined"
                  required
                  fullWidth
                  id="password"
                  label="New Password"
                  onChange={handlePasswordChange}
                  value={password}
                  autoFocus
                />
              </Grid>
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
              onClick={handlePasswordConfirm}
            >
              Confirm Registration
            </Button>
          </form>
        </div>
      </Container>
    );
  }
}
