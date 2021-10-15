import { Link, Route, Switch } from 'react-router-dom';
import { ForgotPassword } from './components/auth/ForgotPassword';
import SignUp from './components/auth/Register';
import HourLoggerNav from './components/global/Nav';
import CheckIn from './pages/CheckIn';
import Home from './pages/Home';

export default function Routes() {
  return (
    <>
      <HourLoggerNav />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/check-in" component={CheckIn} />
        <Route exact path="/register" component={SignUp} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route component={NoMatch} />
      </Switch>
    </>
  );
}

const NoMatch = () => (
  <div>
    <h3 className="AppTitle">404 Page Not Found</h3>
    <div className="center">
      <Link className="" to="/">
        Go Home
      </Link>
    </div>
  </div>
);
