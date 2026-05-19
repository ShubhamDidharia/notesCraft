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
      <Link to="/" className="brand" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
        <span>📝</span> NoteCraft
      </Link>
      <nav className="nav-links">
        {!isAuthenticated ? (
          <>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/auth" 
              className={({ isActive }) => `nav-link btn-primary ${isActive ? 'active' : ''}`}
              style={{ backgroundColor: '#d14d36', color: '#ffffff' }}
            >
              Sign In
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to="/notes" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Notes
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Profile
            </NavLink>
            <button 
              type="button" 
              onClick={handleLogout} 
              className="nav-link"
              style={{ color: '#1f1f1b' }}
            >
              Logout ({user?.name?.split(' ')[0] || 'User'})
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
