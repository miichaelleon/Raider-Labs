import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/redraider.png';
import './Navbar.css';

export default function Navbar({ isLoggedIn }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left" onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}>
        <img src={logo} alt="Raider Labs" className="navbar-logo" />
        <span className="navbar-name">Raider Labs</span>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <div className="navbar-user" ref={dropdownRef}>
            <button className="navbar-user-btn" onClick={() => setOpen(!open)}>
              <div className="navbar-avatar">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <span className="navbar-fullname">
                {user?.first_name} {user?.last_name}
              </span>
              <span className={`navbar-arrow ${open ? 'open' : ''}`}>▾</span>
            </button>

            {open && (
              <div className="navbar-dropdown">
                <button onClick={() => { navigate('/dashboard'); setOpen(false); }}>
                  Dashboard
                </button>
                <button onClick={() => { navigate('/progress'); setOpen(false); }}>
                  Progress
                </button>
                <button onClick={() => { navigate('/profile'); setOpen(false); }}>
                  Profile
                </button>
                <button className="logout" onClick={handleLogout}>
                  Log out
                </button>
                {user?.role === 'admin' && (
                <button onClick={() => { navigate('/admin'); setOpen(false); }}>
                  Admin
                </button>
              )}
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={() => navigate('/login')}>
              Log in
            </button>
            <button className="btn-signup" onClick={() => navigate('/register')}>
              Sign up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}