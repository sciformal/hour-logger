import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ForgotPassword } from './components/auth/ForgotPassword';
import SignUp from './components/auth/Register';
import SignInForm from './components/auth/SignInForm';
import HourLoggerNav from './components/global/Nav';
import { useAuthenticationContext } from './libs/contextLib';
import { HomePage } from './pages/HoursPage';
import { RequestsPage } from './pages/RequestsPage';
import { UsersPage } from './pages/UsersPage';
import './styles/App.css';

export default function HourLoggerRoutes() {
  const { isAuthenticated } = useAuthenticationContext();

  return (
    <div className="page-container">
      {isAuthenticated && <HourLoggerNav />}
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />

        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersPage />
            </RequireAuth>
          }
        />

        <Route
          path="/requests"
          element={
            <RequireAuth>
              <RequestsPage />
            </RequireAuth>
          }
        />

        <Route path="/login" element={<SignInForm />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route element={<NoMatch />} />
      </Routes>
    </div>
  );
}

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuthenticationContext();
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

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
