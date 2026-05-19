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
      <Link to="/" className="brand flex items-center gap-2 font-bold text-lg hover:opacity-80 transition-opacity">
        <span>📝</span> NoteCraft
      </Link>
      <nav className="nav-links">
        {!isAuthenticated ? (
          <>
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link px-3 py-2 rounded-full text-sm transition-all ${
                isActive ? 'border border-border bg-white/40' : ''
              }`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/auth" 
              className={({ isActive }) => `nav-link btn-primary px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                isActive ? 'opacity-90' : ''
              }`}
            >
              Sign In
            </NavLink>
          </>
        ) : (
          <>
            <NavLink 
              to="/notes" 
              className={({ isActive }) => `nav-link px-3 py-2 rounded-full text-sm transition-all ${
                isActive ? 'border border-border bg-white/40' : ''
              }`}
            >
              Notes
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => `nav-link px-3 py-2 rounded-full text-sm transition-all ${
                isActive ? 'border border-border bg-white/40' : ''
              }`}
            >
              Profile
            </NavLink>
            <button 
              type="button" 
              onClick={handleLogout} 
              className="nav-link px-3 py-2 rounded-full text-sm hover:border hover:border-border hover:bg-white/40 transition-all hover:text-red-600"
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
