import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="top-nav glass">
      <Link to="/" className="brand">
        NoteCraft
      </Link>
      <nav className="nav-links">
        {!isAuthenticated ? (
          <>
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
            <NavLink to="/auth" className="nav-link nav-cta">
              Sign In
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/notes" className="nav-link">
              Notes
            </NavLink>
            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>
            <button type="button" onClick={handleLogout} className="nav-link nav-button">
              Logout ({user?.name?.split(' ')[0] || 'User'})
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
