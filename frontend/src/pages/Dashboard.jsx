import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLessons } from '../hooks/useLessons';
import Navbar from '../components/Navbar';
import './Dashboard.css';

import moneyIcon     from '../assets/icons/money.svg';
import walletIcon    from '../assets/icons/wallet.svg';
import calculatorIcon from '../assets/icons/calculator.svg';
import checklistIcon from '../assets/icons/checklist.svg';
import budgetIcon    from '../assets/icons/budget.svg';
import ledgerIcon    from '../assets/icons/ledger.svg';
import checkIcon     from '../assets/icons/check.svg';
import bankingIcon   from '../assets/icons/banking.svg';
import stocksIcon from '../assets/icons/stocks.svg';

const ICON_MAP = {
  money: moneyIcon,
  wallet: walletIcon,
  calculator: calculatorIcon,
  checklist: checklistIcon,
  budget: budgetIcon,
  ledger: ledgerIcon,
  check: checkIcon,
  banking: bankingIcon,
  stock: stocksIcon,
};

function getStage(progressEntry) {
  if (!progressEntry)          return 'not-started';
  if (progressEntry.completed) return 'done';
  if (progressEntry.attempts >= 2) return 'assess';
  if (progressEntry.attempts >= 1) return 'practice';
  return 'show';
}

function StageDot({ stage, number }) {
  const cls = {
    'not-started': 'dot-ns',
    show:          'dot-show',
    practice:      'dot-practice',
    assess:        'dot-assess',
    done:          'dot-done',
  }[stage] || 'dot-ns';
  return (
    <div className={`progress-dot ${cls}`}>
      {stage === 'done' ? '✓' : number}
    </div>
  );
}

function StagePill({ stage }) {
  const map = {
    'not-started': { label: 'Not started', cls: 'pill-ns'       },
    show:          { label: 'Show me',     cls: 'pill-show'      },
    practice:      { label: 'Practice',    cls: 'pill-practice'  },
    assess:        { label: 'Assess',      cls: 'pill-assess'    },
    done:          { label: 'Completed',   cls: 'pill-done'      },
  };
  const { label, cls } = map[stage] || map['not-started'];
  return <span className={`stage-pill ${cls}`}>{label}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const { zones, allModules, loading: lessonsLoading, error: lessonsError } = useLessons(token);

  const [progressMap,  setProgressMap]  = useState({});
  const [progressLoading, setProgressLoading] = useState(true);
  const [sidebarOpen,  setSidebarOpen]  = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);

  useState(() => {
    if (!token) return;
    async function fetchProgress() {
      try {
        const res = await fetch('http://localhost:8000/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch progress');
        const data = await res.json();
        const map = {};
        data.forEach(entry => { map[entry.lesson_id] = entry; });
        setProgressMap(map);
      } catch (err) {
        console.error('Progress fetch error:', err);
      } finally {
        setProgressLoading(false);
      }
    }
    fetchProgress();
  }, [token]);

  const TOTAL          = allModules.length;
  const completedCount = allModules.filter(m => progressMap[m.id]?.completed).length;
  const progressPct    = TOTAL > 0 ? Math.round((completedCount / TOTAL) * 100) : 0;

  const currentLesson  = activeLesson
    ?? allModules.find(m => !progressMap[m.id]?.completed)
    ?? allModules[0];
  const currentStage   = getStage(progressMap[currentLesson?.id]);

  if (lessonsLoading) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <div className="dashboard-shell">
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Welcome, {user?.first_name}!</h1>
              <p className="dashboard-sub">Loading lessons…</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (lessonsError) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <div className="dashboard-shell">
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1 className="dashboard-title">Welcome, {user?.first_name}!</h1>
              <p className="dashboard-sub" style={{ color: '#cc0000' }}>
                Failed to load lessons: {lessonsError}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="dashboard-shell">

        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Welcome, {user?.first_name}!</h1>
            <p className="dashboard-sub">Choose a topic to get started.</p>
          </div>

          {zones.map(zone => (
            <div key={zone.id} className="zone-section">
              <div className="zone-section-header">
                <div>
                  <h2 className="zone-section-title">{zone.label}</h2>
                  <p className="zone-section-subtitle">{zone.subtitle}</p>
                </div>
              </div>
              <div className="zone-section-tiles">
                {zone.modules.map(mod => {
                  const stage = getStage(progressMap[mod.id]);
                  return (
                    <div
                      className="tile-wrapper"
                      key={mod.id}
                      onClick={() => {
                        setActiveLesson(mod);
                        setSidebarOpen(true);
                        navigate(`/lesson/${mod.id}`);
                      }}
                    >
                      <div className={`task-tile ${stage === 'done' ? 'tile-done' : ''}`}>
                        {ICON_MAP[mod.icon] && (
                          <img src={ICON_MAP[mod.icon]} alt={mod.title} className="tile-icon" />
                        )}
                        {stage === 'done' && (
                          <span className="tile-done-badge">✓</span>
                        )}
                      </div>
                      <p className="tile-title">{mod.title}</p>
                      <StagePill stage={stage} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className={`progress-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Hide progress' : 'Show progress'}
          >
            {sidebarOpen ? '›' : '‹'}
          </button>

          {sidebarOpen && (
            <>
              <div className="sidebar-header">
                <div className="sidebar-title">Your Progress</div>
                {currentLesson && (
                  <div className="sidebar-current-lesson">{currentLesson.title}</div>
                )}
              </div>

              <div className="sidebar-label">Current Stage</div>

              <div className={`stage-item ${['show', 'not-started'].includes(currentStage) ? 'stage-active' : ''}`}>
                <StageDot stage={currentStage === 'done' ? 'done' : 'show'} number="1" />
                <div className="stage-info">
                  <div className="stage-name">Show Me</div>
                  <div className="stage-desc">Watch &amp; learn</div>
                </div>
              </div>
              <div className="stage-connector" />
              <div className={`stage-item ${currentStage === 'practice' ? 'stage-active' : ''}`}>
                <StageDot stage={['assess', 'done'].includes(currentStage) ? 'done' : 'practice'} number="2" />
                <div className="stage-info">
                  <div className="stage-name">Practice</div>
                  <div className="stage-desc">Try with hints</div>
                </div>
              </div>
              <div className="stage-connector" />
              <div className={`stage-item ${currentStage === 'assess' ? 'stage-active' : ''}`}>
                <StageDot stage={currentStage === 'done' ? 'done' : 'assess'} number="3" />
                <div className="stage-info">
                  <div className="stage-name">Assess</div>
                  <div className="stage-desc">Show mastery</div>
                </div>
              </div>

              <div className="sidebar-bottom">
                <div className="progress-label">
                  Overall — {completedCount} of {TOTAL} modules
                </div>
                <div className="sidebar-bar-track">
                  <div
                    className="sidebar-bar-fill"
                    style={{ width: progressLoading ? '0%' : `${progressPct}%` }}
                  />
                </div>
                <div className="progress-pct">{progressLoading ? '—' : `${progressPct}%`}</div>
              </div>
            </>
          )}
        </aside>

      </div>
    </>
  );
}