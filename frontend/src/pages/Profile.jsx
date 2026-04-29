import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('account');

  const [accountForm, setAccountForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [message, setMessage] = useState('');

  const handleAccountSave = () => {
    setMessage('Account updated! (Backend coming soon.)');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordSave = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage('Password updated! (Backend coming soon.)');
    setPasswordForm({ current: '', new: '', confirm: '' });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="profile-layout">

        <aside className="profile-sidebar">
          <div className="profile-avatar-large">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </div>
          <div className="profile-name">
            {user?.first_name} {user?.last_name}
          </div>
          <div className="profile-email">{user?.email}</div>

          <nav className="profile-nav">
            <button
              className={`profile-nav-btn ${activeSection === 'account' ? 'active' : ''}`}
              onClick={() => setActiveSection('account')}
            >
              Account
            </button>
            <button
              className={`profile-nav-btn ${activeSection === 'password' ? 'active' : ''}`}
              onClick={() => setActiveSection('password')}
            >
              Password
            </button>
            <button
              className={`profile-nav-btn ${activeSection === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveSection('preferences')}
            >
              Preferences
            </button>
            <button className="profile-nav-btn logout" onClick={handleLogout}>
              Log out
            </button>
          </nav>
        </aside>

        <main className="profile-content">

          {message && <p className="profile-message">{message}</p>}

          {activeSection === 'account' && (
            <div className="profile-section">
              <h1>Account</h1>
              <p className="profile-section-sub">Update your name and email.</p>

              <div className="profile-row">
                <div className="profile-field">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={accountForm.first_name}
                    onChange={e => setAccountForm({ ...accountForm, first_name: e.target.value })}
                  />
                </div>
                <div className="profile-field">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={accountForm.last_name}
                    onChange={e => setAccountForm({ ...accountForm, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={e => setAccountForm({ ...accountForm, email: e.target.value })}
                />
              </div>

              <button className="profile-save-btn" onClick={handleAccountSave}>
                Save changes
              </button>
            </div>
          )}

          {activeSection === 'password' && (
            <div className="profile-section">
              <h1>Password</h1>
              <p className="profile-section-sub">Change your password.</p>

              <div className="profile-field">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
                />
              </div>

              <div className="profile-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
                />
              </div>

              <div className="profile-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                />
              </div>

              <button className="profile-save-btn" onClick={handlePasswordSave}>
                Update password
              </button>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="profile-section">
              <h1>Preferences</h1>
              <p className="profile-section-sub">Customize your learning experience.</p>
              <p className="profile-coming-soon">Coming soon — preferences for tutor style, difficulty level, and notifications.</p>
            </div>
          )}

        </main>

      </div>
    </>
  );
}