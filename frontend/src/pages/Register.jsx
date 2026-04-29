import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await registerUser({
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      const data = await loginUser(form.email, form.password);
      login(data.user, data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Create an account</h1>
        <p className="register-sub">Join Raider Finance today</p>

        {error && <p className="register-error">{error}</p>}

        <div className="register-row">
          <div className="register-field">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First name"
            />
          </div>
          <div className="register-field">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>
        </div>

        <div className="register-field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>

        <div className="register-field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter a password"
          />
        </div>

        <div className="register-field">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
        </div>

        <button className="register-btn" onClick={handleSubmit}>
          Sign up
        </button>

        <p className="register-login">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Log in</span>
        </p>
      </div>
    </div>
  );
}