import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Don't show navigation on login/register pages
  if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
    return null;
  }

  return (
    <nav className="nav-bottom safe-area-bottom">
      <div className="container">
        <div className="flex justify-between">
          <Link
            to="/"
            className={`nav-bottom-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <div className="nav-icon">🎵</div>
            <span>Request</span>
          </Link>

          {isAuthenticated() ? (
            <Link
              to="/artist/dashboard"
              className={`nav-bottom-item ${location.pathname === '/artist/dashboard' ? 'active' : ''}`}
            >
              <div className="nav-icon">🎤</div>
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/artist/login"
              className={`nav-bottom-item ${location.pathname === '/artist/login' ? 'active' : ''}`}
            >
              <div className="nav-icon">👤</div>
              <span>Artist</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;