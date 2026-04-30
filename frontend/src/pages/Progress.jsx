import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProgress } from '../services/api';
import Navbar from '../components/Navbar';
import './Progress.css';

const zones = [
  {
    id: 'basics',
    label: 'Basics',
    subtitle: 'Foundation',
    modules: [
      { id: '0.1', title: 'Money' },
      { id: '0.2', title: 'Income' },
      { id: '0.3', title: 'Taxes' },
    ],
  },
  {
    id: 'thinking',
    label: 'Zone A',
    subtitle: 'Strategic Planning — Thinking',
    modules: [
      { id: '1.1', title: 'Needs vs. Wants' },
      { id: '1.2', title: 'The 4 Step Budgeting Routine' },
      { id: '1.3', title: 'Recording Transactions in a Register' },
    ],
  },
  {
    id: 'doing',
    label: 'Zone B',
    subtitle: 'Tactical Execution — Doing',
    modules: [
      { id: '2.1', title: 'Endorsing & Depositing Checks' },
      { id: '2.2', title: 'Managing Online Banking & Balances' },
    ],
  },
];

export default function Progress() {
  const { token, user } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProgress(token);
        setProgress(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const progressMap = (Array.isArray(progress) ? progress : []).reduce((acc, p) => {
    acc[p.lesson_id] = p;
    return acc;
  }, {});

  const totalLessons = zones.reduce((sum, z) => sum + z.modules.length, 0);
  const completedLessons = (Array.isArray(progress) ? progress : []).filter(p => p.completed).length;
  const percent = Math.round((completedLessons / totalLessons) * 100);

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="progress-page">

        <div className="progress-header">
          <h1 className="progress-title">Your Progress</h1>
          <p className="progress-sub">
            {completedLessons} of {totalLessons} lessons completed
          </p>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
          </div>
          <p className="progress-percent">{percent}% complete</p>
        </div>

        {loading ? (
          <p className="progress-loading">Loading...</p>
        ) : (
          zones.map(zone => (
            <div key={zone.id} className="progress-zone">
              <div className="progress-zone-header">
                <h2>{zone.label}</h2>
                <span className="progress-zone-subtitle">{zone.subtitle}</span>
              </div>
              <div className="progress-modules">
                {zone.modules.map(mod => {
                  const p = progressMap[mod.id];
                  const done = p?.completed;
                  return (
                    <div key={mod.id} className={`progress-module ${done ? 'done' : ''}`}>
                      <span className="progress-check">
                        {done ? '✓' : '○'}
                      </span>
                      <div className="progress-module-info">
                        <span className="progress-module-id">{mod.id}</span>
                        <span className="progress-module-title">{mod.title}</span>
                      </div>
                      {p && (
                        <span className="progress-score">
                          Score: {p.score} · {p.attempts} {p.attempts === 1 ? 'attempt' : 'attempts'}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

      </div>
    </>
  );
}