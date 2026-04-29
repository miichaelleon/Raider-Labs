import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const data = await loginUser(form.email, form.password);
      login(data.user, data.access_token);
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Log in now!</h1>
        <p className="login-sub">Welcome back to Raider Finance</p>

        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="email@example.com"
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your password"
          />
        </div>

        <button className="login-btn" onClick={handleSubmit}>
          Log in
        </button>

        <p className="login-register">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Sign up</span>
        </p>
      </div>
    </div>
  );
}