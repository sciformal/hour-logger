import { Link } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Auth } from "aws-amplify";
import { useAuthenticationContext, useUserContext } from "libs/contextLib";
import React from "react";
import Countdown from "./Countdown";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  nav: {
    justifyContent: 'space-between'
  },
  navbar: {
    background : '#2E3B55'
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: 'white',
  },
}));

export default function Nav() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { isAuthenticated, userHasAuthenticated } = useAuthenticationContext();
  const { setUser } = useUserContext();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
      await Auth.signOut();
      setAnchorEl(null);
      userHasAuthenticated(false);
      setUser(null);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.navbar}>
        <Toolbar className={classes.nav}>
        <Typography>
              <Countdown />
          </Typography>
          <Typography className={classes.title}>
            <Link style={{color: 'white'}} href="/">
              Sci '22 Formal Hour Logger
            </Link>
          </Typography>
          <Typography>
              <div>Information</div>
          </Typography>
          {
              isAuthenticated ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </div>
          ) : (
              <div>
                  <Typography>
                      Register
                  </Typography>
              </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
