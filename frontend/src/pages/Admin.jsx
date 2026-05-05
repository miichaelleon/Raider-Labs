import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, getUserProgress, deleteUser, getLessons, uploadLesson } from '../services/api';
import Navbar from '../components/Navbar';
import './Admin.css';

function getStage(entry) {
  if (!entry)              return 'not-started';
  if (entry.completed)     return 'completed';
  if (entry.attempts >= 2) return 'assess';
  if (entry.attempts >= 1) return 'practice';
  return 'show';
}

const STAGE_META = {
  'not-started': { label: 'Not Started', color: '#e5e7eb', text: '#6b7280' },
  'show':        { label: 'Show Me',     color: '#fca5a5', text: '#991b1b' },
  'practice':    { label: 'Practice',    color: '#6ee7b7', text: '#065f46' },
  'assess':      { label: 'Assess',      color: '#fcd34d', text: '#92400e' },
  'completed':   { label: 'Completed',   color: '#cc0000', text: '#ffffff' },
};

const STAGE_ORDER = ['not-started', 'show', 'practice', 'assess', 'completed'];

function ProgressBar({ value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="chart-bar-track">
      <div className="chart-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function AnalyticsModule({ users, allProgress, focusUser, loadingProgress, allLessons }) {
  const totalLessons = allLessons.length;

  const chartData = useMemo(() => {
    return allLessons.map(lesson => {
      const stageCounts = { 'not-started': 0, show: 0, practice: 0, assess: 0, completed: 0 };
      const targets = focusUser ? [focusUser] : users.filter(u => u.role === 'student');
      targets.forEach(u => {
        const userProgress = allProgress[u.id] || [];
        const entry = userProgress.find(p => p.lesson_id === lesson.id);
        stageCounts[getStage(entry)]++;
      });
      return { ...lesson, stageCounts, total: targets.length };
    });
  }, [users, allProgress, focusUser, allLessons]);

  const summaryStats = useMemo(() => {
    const targets = focusUser ? [focusUser] : users.filter(u => u.role === 'student');
    if (targets.length === 0) return { completionRate: 0, avgLessons: 0, fullyComplete: 0 };
    let totalCompleted = 0;
    let fullyComplete  = 0;
    targets.forEach(u => {
      const userProgress = allProgress[u.id] || [];
      const completedCount = userProgress.filter(p => p.completed).length;
      totalCompleted += completedCount;
      if (completedCount === totalLessons) fullyComplete++;
    });
    return {
      completionRate: Math.round((totalCompleted / (targets.length * totalLessons)) * 100),
      avgLessons:     (totalCompleted / targets.length).toFixed(1),
      fullyComplete,
    };
  }, [users, allProgress, focusUser, allLessons]);

  const maxStudents = focusUser ? 1 : users.filter(u => u.role === 'student').length;

  if (loadingProgress) {
    return (
      <div className="analytics-module">
        <div className="analytics-loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-module">
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">
            {focusUser
              ? `Progress — ${focusUser.first_name} ${focusUser.last_name}`
              : 'Total Student Progress Analytics'}
          </h2>
          <p className="analytics-sub">
            {focusUser
              ? 'Showing individual student lesson stages.'
              : 'Showing stage distribution across all students per lesson.'}
          </p>
        </div>
        <div className="analytics-legend">
          {STAGE_ORDER.map(s => (
            <div key={s} className="legend-item">
              <span
                className="legend-dot"
                style={{
                  background: STAGE_META[s].color,
                  border: s === 'not-started' ? '1px solid #d1d5db' : 'none',
                }}
              />
              <span className="legend-label">{STAGE_META[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="analytics-stats">
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{summaryStats.completionRate}%</span>
          <span className="analytics-stat-label">Overall Completion Rate</span>
        </div>
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{summaryStats.avgLessons}</span>
          <span className="analytics-stat-label">Avg Lessons Completed</span>
        </div>
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{summaryStats.fullyComplete}</span>
          <span className="analytics-stat-label">
            {focusUser ? 'All Lessons Done' : 'Students Fully Complete'}
          </span>
        </div>
        <div className="analytics-stat-card">
          <span className="analytics-stat-value">{maxStudents}</span>
          <span className="analytics-stat-label">
            {focusUser ? 'Student Selected' : 'Students Tracked'}
          </span>
        </div>
      </div>

      <div className="analytics-chart">
        {chartData.map(lesson => (
          <div key={lesson.id} className="chart-row">
            <div className="chart-row-label">
              <span className="chart-zone-badge">{lesson.zone?.label ?? lesson.zone}</span>
              <span className="chart-lesson-name">{lesson.title}</span>
            </div>
            <div className="chart-bars">
              {STAGE_ORDER.map(stage => {
                const count = lesson.stageCounts[stage];
                if (count === 0) return null;
                return (
                  <div key={stage} className="chart-bar-group">
                    <ProgressBar value={count} max={maxStudents} color={STAGE_META[stage].color} />
                    <span
                      className="chart-bar-count"
                      style={{ color: STAGE_META[stage].text === '#ffffff' ? '#cc0000' : STAGE_META[stage].text }}
                    >
                      {count} {STAGE_META[stage].label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="chart-row-completion">
              <span className="chart-completion-pct">
                {maxStudents > 0
                  ? `${Math.round((lesson.stageCounts['completed'] / maxStudents) * 100)}%`
                  : '—'}
              </span>
              <span className="chart-completion-label">done</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteModal({ target, onClose, onConfirmed }) {
  const [step,          setStep]          = useState(1);
  const [adminPassword, setAdminPassword] = useState('');
  const [error,         setError]         = useState('');
  const [showPassword,  setShowPassword]  = useState(false);

  function handleClose() {
    setStep(1);
    setAdminPassword('');
    setError('');
    onClose();
  }

  async function handleDelete() {
    if (!adminPassword.trim()) { setError('Please enter your admin password.'); return; }
    setStep(3);
    setError('');
    try {
      await onConfirmed(adminPassword);
      handleClose();
    } catch (err) {
      setError(err.message || 'Incorrect password or deletion failed.');
      setStep(2);
    }
  }

  if (!target) return null;

  return (
    <div className="delete-modal-overlay" onClick={handleClose}>
      <div className="delete-modal" onClick={e => e.stopPropagation()}>

        {step === 1 && (
          <>
            <div className="delete-modal-icon">⚠️</div>
            <h2 className="delete-modal-title">Delete User Account</h2>
            <p className="delete-modal-name">
              {target.first_name} {target.last_name}
              <span className="delete-modal-email">{target.email}</span>
            </p>
            <div className="delete-modal-warning">
              <p><strong>This action is permanent and cannot be undone.</strong></p>
              <p>Deleting this account will permanently remove:</p>
              <ul className="delete-warning-list">
                <li>The user's account and login credentials</li>
                <li>All lesson progress and completion records</li>
                <li>All scores and attempt history</li>
              </ul>
              <p>This data <strong>cannot be recovered</strong> after deletion.</p>
            </div>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={handleClose}>Cancel</button>
              <button className="delete-modal-next" onClick={() => setStep(2)}>
                I Understand, Continue →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="delete-modal-icon">🔐</div>
            <h2 className="delete-modal-title">Confirm Your Identity</h2>
            <p className="delete-modal-subtitle">
              Enter your admin password to authorize the deletion of{' '}
              <strong>{target.first_name} {target.last_name}</strong>'s account.
            </p>
            <div className="delete-password-field">
              <label className="delete-password-label">Admin Password</label>
              <div className="delete-password-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`delete-password-input ${error ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  value={adminPassword}
                  onChange={e => { setAdminPassword(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleDelete()}
                  autoFocus
                />
                <button
                  className="delete-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {error && <p className="delete-error">{error}</p>}
            </div>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={() => setStep(1)}>← Back</button>
              <button className="delete-modal-confirm" onClick={handleDelete}>Delete Account</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="delete-modal-icon deleting-spinner">⏳</div>
            <h2 className="delete-modal-title">Deleting Account...</h2>
            <p className="delete-modal-subtitle">
              Removing user data and progress records. Please wait.
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [users,           setUsers]           = useState([]);
  const [allLessons,      setAllLessons]      = useState([]);
  const [allProgress,     setAllProgress]     = useState({});
  const [loading,         setLoading]         = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [search,          setSearch]          = useState('');
  const [deleteTarget,    setDeleteTarget]    = useState(null);
  const [uploadStatus,    setUploadStatus]    = useState(null);
  const [uploading,       setUploading]       = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    async function load() {
      try {
        const [userData, lessonData] = await Promise.all([
          getAllUsers(token),
          getLessons(token),
        ]);
        setUsers(Array.isArray(userData) ? userData : []);
        setAllLessons(Array.isArray(lessonData) ? lessonData : []);
      } catch (err) {
        console.error(err);
        setUsers([]);
        setAllLessons([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, user, navigate]);

  useEffect(() => {
    if (users.length === 0) return;
    async function loadAllProgress() {
      setLoadingProgress(true);
      try {
        const students = users.filter(u => u.role === 'student');
        const entries  = await Promise.all(
          students.map(u => getUserProgress(token, u.id).then(p => ({ id: u.id, progress: p })))
        );
        const map = {};
        entries.forEach(({ id, progress }) => {
          map[id] = Array.isArray(progress) ? progress : [];
        });
        setAllProgress(map);
      } catch (err) {
        console.error('Progress load error:', err);
      } finally {
        setLoadingProgress(false);
      }
    }
    loadAllProgress();
  }, [users, token]);

  const filtered = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const focusUser = filtered.length === 1 && filtered[0].role === 'student'
    ? filtered[0]
    : null;

  async function handleDeleteConfirmed(adminPassword) {
    await deleteUser(token, deleteTarget.id, adminPassword);
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    setAllProgress(prev => {
      const next = { ...prev };
      delete next[deleteTarget.id];
      return next;
    });
    setDeleteTarget(null);
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.json')) {
      setUploadStatus({ type: 'error', message: 'Only .json files are accepted' });
      e.target.value = '';
      return;
    }
    setUploading(true);
    setUploadStatus(null);
    try {
      const result = await uploadLesson(token, file);
      setUploadStatus({ type: 'success', message: result.message });
      const lessonData = await getLessons(token);
      setAllLessons(Array.isArray(lessonData) ? lessonData : []);
    } catch (err) {
      setUploadStatus({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

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

        <div className="lesson-upload-panel">
          <div className="lesson-upload-header">
            <div>
              <h2 className="lesson-upload-title">Upload Lesson</h2>
              <p className="lesson-upload-sub">
                Upload a JSON file to add or update a lesson in the database.
              </p>
            </div>
            <label className={`lesson-upload-btn ${uploading ? 'uploading' : ''}`}>
              {uploading ? 'Uploading…' : '+ Upload JSON'}
              <input
                type="file"
                accept=".json,application/json,text/plain"
                onChange={handleUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
          </div>
          {uploadStatus && (
            <div className={`lesson-upload-status ${uploadStatus.type}`}>
              {uploadStatus.type === 'success' ? '✅' : '❌'} {uploadStatus.message}
            </div>
          )}
        </div>

        {!loading && (
          <AnalyticsModule
            users={users}
            allProgress={allProgress}
            focusUser={focusUser}
            loadingProgress={loadingProgress}
            allLessons={allLessons}
          />
        )}

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
                    <div className="admin-action-group">
                      <button
                        className="admin-action-btn"
                        onClick={() => setSearch(`${u.email}`)}
                      >
                        Focus
                      </button>
                      {u.role !== 'admin' && (
                        <button
                          className="admin-action-btn admin-delete-btn"
                          onClick={() => setDeleteTarget(u)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      <DeleteModal
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirmed={handleDeleteConfirmed}
      />
    </>
  );
}