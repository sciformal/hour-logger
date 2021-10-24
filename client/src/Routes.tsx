import { Link, Route, Switch } from 'react-router-dom';
import { ForgotPassword } from './components/auth/ForgotPassword';
import SignUp from './components/auth/Register';
import HourLoggerNav from './components/global/Nav';
import { CheckInPage } from './pages/CheckInPage';
import { HomePage } from './pages/HomePage';
import { ReductionRequestPage } from './pages/ReductionRequestPage';
import { UserPage } from './pages/UserPage';
import { UsersPage } from './pages/UsersPage';

export default function Routes() {
  return (
    <>
      <HourLoggerNav />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/check-in" component={CheckInPage} />
        <Route exact path="/users" component={UsersPage} />
        <Route exact path="/users/:id" component={UserPage} />
        <Route exact path="/register" component={SignUp} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reduction" component={ReductionRequestPage} />
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
