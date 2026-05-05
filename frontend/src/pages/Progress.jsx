import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProgress, getLessons } from '../services/api';
import Navbar from '../components/Navbar';
import './Progress.css';

export default function Progress() {
  // Ignore ERROR here. Code is just finnicky
  const { token, user } = useAuth();

  const [progress,  setProgress]  = useState([]);
  const [zones,     setZones]     = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [progressData, lessonsData] = await Promise.all([
          getProgress(token),
          getLessons(token),
        ]);

        setProgress(Array.isArray(progressData) ? progressData : []);

        // Build zone map from dynamic lesson list
        const zoneMap = new Map();
        for (const lesson of lessonsData) {
          const zoneId = lesson.zone?.id ?? 'uncategorised';
          if (!zoneMap.has(zoneId)) {
            zoneMap.set(zoneId, {
              id:       zoneId,
              label:    lesson.zone?.label    ?? 'Other',
              subtitle: lesson.zone?.subtitle ?? '',
              modules:  [],
            });
          }
          zoneMap.get(zoneId).modules.push({ id: lesson.id, title: lesson.title });
        }
        setZones(Array.from(zoneMap.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const progressMap = progress.reduce((acc, p) => {
    acc[p.lesson_id] = p;
    return acc;
  }, {});

  const totalLessons     = zones.reduce((sum, z) => sum + z.modules.length, 0);
  const completedLessons = progress.filter(p => p.completed).length;
  const percent          = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

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
                  const p    = progressMap[mod.id];
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