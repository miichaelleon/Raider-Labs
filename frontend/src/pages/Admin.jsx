import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../services/api';
import Navbar from '../components/Navbar';
import './Admin.css';

export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    async function load() {
      try {
        const data = await getAllUsers(token);
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, user, navigate]);

  const filtered = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="admin-page">

        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-sub">Manage users and view progress.</p>
        </div>

        <div className="admin-stats">
          <div className="admin-stat">
            <span className="admin-stat-value">{users.length}</span>
            <span className="admin-stat-label">Total Users</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-value">{users.filter(u => u.role === 'student').length}</span>
            <span className="admin-stat-label">Students</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-value">{users.filter(u => u.role === 'admin').length}</span>
            <span className="admin-stat-label">Admins</span>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="admin-search"
        />

        {loading ? (
          <p className="admin-loading">Loading users...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-user-info">
                      <div className="admin-avatar">
                        {u.first_name[0]}{u.last_name[0]}
                      </div>
                      <span>{u.first_name} {u.last_name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-badge ${u.role}`}>{u.role}</span>
                  </td>
                  <td>{u.completed_lessons || 0} lessons</td>
                  <td>
                    <button className="admin-action-btn">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </>
  );
}