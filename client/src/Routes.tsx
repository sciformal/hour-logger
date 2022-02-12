import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ForgotPassword } from './components/auth/ForgotPassword';
import SignUp from './components/auth/Register';
import SignInForm from './components/auth/SignInForm';
import HourLoggerNav from './components/global/Nav';
import { useAuthenticationContext, useUserContext } from './libs/contextLib';
import { HomePage } from './pages/HoursPage';
import { RequestsPage } from './pages/RequestsPage';
import { UnauthenticatedPage } from './pages/Unauthenticated';
import { UsersPage } from './pages/UsersPage';
import './styles/App.css';

export default function HourLoggerRoutes() {
  const { user } = useUserContext();
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
              <RequireAdmin user={user}>
                <UsersPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/requests"
          element={
            <RequireAuth>
              <RequireAdmin user={user}>
                <RequestsPage />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        <Route
          path="/login"
          element={
            <RedirectAuthenticated>
              <SignInForm />
            </RedirectAuthenticated>
          }
        />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthenticated" element={<UnauthenticatedPage />} />
        <Route element={<NoMatch />} />
      </Routes>
    </div>
  );
}

const RequireAdmin = ({ children, user }) => {
  if (user?.type === 'ADMIN') {
    return children;
  } else {
    return <Navigate to="/unauthenticated" replace />;
  }
};

const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuthenticationContext();
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
};

const RedirectAuthenticated = ({ children }) => {
  const { isAuthenticated } = useAuthenticationContext();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
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
