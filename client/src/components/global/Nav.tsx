import { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { IconContext } from 'react-icons';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as FaIcons from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {
  useAuthenticationContext,
  useUserContext,
} from '../../libs/contextLib';
import '../../styles/Navbar.css';

const TICKETS_URL = 'https://tickets.scienceformal.ca';

export default function HourLoggerNav() {
  const { userHasAuthenticated } = useAuthenticationContext();
  const { user } = useUserContext();
  const type = user.adminType;

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            {/* Navbar Toggle */}
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {/* Hours Page */}
            <li key="hours" className="nav-text">
              <Link to="/">
                <BiIcons.BiTimeFive />
                <span>Hours</span>
              </Link>
            </li>

            {/* Users Page */}
            {(type === 'ADMIN' || type === 'MANAGER') && (
              <li key="users" className="nav-text">
                <Link to="/users">
                  <FiIcons.FiUsers />
                  <span>Users</span>
                </Link>
              </li>
            )}

            {/* Requests Page */}
            {type === 'ADMIN' && (
              <li key="requests" className="nav-text">
                <Link to="/requests">
                  <FaIcons.FaCartPlus />
                  <span>Requests</span>
                </Link>
              </li>
            )}

            {/* Tickets Page */}
            <li key="tickets" className="nav-text">
              <a href={TICKETS_URL} target="_blank" rel="noreferrer">
                <FiIcons.FiExternalLink />
                <span>Tickets</span>
              </a>
            </li>

            {/* Logout */}
            <li key="logout" className="nav-text">
              <Link
                to="#"
                onClick={() => {
                  Auth.signOut();
                  userHasAuthenticated(false);
                }}
              >
                <FiIcons.FiUsers />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
