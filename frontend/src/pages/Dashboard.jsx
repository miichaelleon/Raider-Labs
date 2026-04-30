import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Dashboard.css';

import moneyIcon from '../assets/icons/money.svg';
import walletIcon from '../assets/icons/wallet.svg';
import calculatorIcon from '../assets/icons/calculator.svg';
import checklistIcon from '../assets/icons/checklist.svg';
import budgetIcon from '../assets/icons/budget.svg';
import ledgerIcon from '../assets/icons/ledger.svg';
import checkIcon from '../assets/icons/check.svg';
import bankingIcon from '../assets/icons/banking.svg';

const icons = {
  '0.1': moneyIcon,
  '0.2': walletIcon,
  '0.3': calculatorIcon,
  '1.1': checklistIcon,
  '1.2': budgetIcon,
  '1.3': ledgerIcon,
  '2.1': checkIcon,
  '2.2': bankingIcon,
};

const zones = [
  {
    id: 'basics',
    label: 'Basics',
    subtitle: 'Build your financial foundation',
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

const ALL_MODULES = zones.flatMap(z => z.modules);
const TOTAL = ALL_MODULES.length;

// ── Stage helpers ──────────────────────────────────────────
function getStage(progressEntry) {
  if (!progressEntry) return 'not-started';
  if (progressEntry.completed) return 'done';
  if (progressEntry.attempts >= 2) return 'assess';
  if (progressEntry.attempts >= 1) return 'practice';
  return 'show';
}

function StageDot({ stage, number }) {
  const stageClass = {
    'not-started': 'dot-ns',
    show:          'dot-show',
    practice:      'dot-practice',
    assess:        'dot-assess',
    done:          'dot-done',
  }[stage] || 'dot-ns';
  return (
    <div className={`progress-dot ${stageClass}`}>
      {stage === 'done' ? '✓' : number}
    </div>
  );
}

function StagePill({ stage }) {
  const map = {
    'not-started': { label: 'Not started', cls: 'pill-ns' },
    show:          { label: 'Show me',     cls: 'pill-show' },
    practice:      { label: 'Practice',    cls: 'pill-practice' },
    assess:        { label: 'Assess',      cls: 'pill-assess' },
    done:          { label: 'Completed',   cls: 'pill-done' },
  };
  const { label, cls } = map[stage] || map['not-started'];
  return <span className={`stage-pill ${cls}`}>{label}</span>;
}

// ── Main Component ─────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  // ── Progress state fetched from backend ──
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading]         = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);

  useEffect(() => {
    if (!token) return; // wait for AuthContext to hydrate from localStorage
    async function fetchProgress() {
      try {
        const res = await fetch('http://localhost:8000/progress', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch progress');
        const data = await res.json();
        const map  = {};
        data.forEach(entry => { map[entry.lesson_id] = entry; });
        setProgressMap(map);
      } catch (err) {
        console.error('Progress fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [token]);

  const completedCount = ALL_MODULES.filter(
    m => progressMap[m.id]?.completed
  ).length;

  const progressPct = TOTAL > 0 ? Math.round((completedCount / TOTAL) * 100) : 0;

  // Which lesson is currently active (most recent non-completed, or first)
  const currentLesson = activeLesson
    ?? ALL_MODULES.find(m => !progressMap[m.id]?.completed)
    ?? ALL_MODULES[0];

  const currentStage = getStage(progressMap[currentLesson?.id]);

  return (
    <>
      <Navbar isLoggedIn={true} />

      <div className="dashboard-shell">

        {/* ── Main content ── */}
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
                        {icons[mod.id] && (
                          <img src={icons[mod.id]} alt={mod.title} className="tile-icon" />
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

        {/* ── Progress Sidebar ── */}
        <aside className={`progress-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

          {/* Toggle button */}
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
                  <div className="sidebar-current-lesson">
                    {currentLesson.title}
                  </div>
                )}
              </div>

              {/* Stage tracker */}
              <div className="sidebar-label">Current Stage</div>

              <div className={`stage-item ${currentStage === 'show' || currentStage === 'not-started' ? 'stage-active' : ''}`}>
                <StageDot stage={currentStage === 'done' ? 'done' : 'show'} number="1" />
                <div className="stage-info">
                  <div className="stage-name">Show Me</div>
                  <div className="stage-desc">Watch &amp; learn</div>
                </div>
              </div>
              <div className="stage-connector" />
              <div className={`stage-item ${currentStage === 'practice' ? 'stage-active' : ''}`}>
                <StageDot
                  stage={['assess', 'done'].includes(currentStage) ? 'done' : 'practice'}
                  number="2"
                />
                <div className="stage-info">
                  <div className="stage-name">Practice</div>
                  <div className="stage-desc">Try with hints</div>
                </div>
              </div>
              <div className="stage-connector" />
              <div className={`stage-item ${currentStage === 'assess' ? 'stage-active' : ''}`}>
                <StageDot
                  stage={currentStage === 'done' ? 'done' : 'assess'}
                  number="3"
                />
                <div className="stage-info">
                  <div className="stage-name">Assess</div>
                  <div className="stage-desc">Show mastery</div>
                </div>
              </div>

              {/* Overall progress bar */}
              <div className="sidebar-bottom">
                <div className="progress-label">
                  Overall — {completedCount} of {TOTAL} modules
                </div>
                <div className="sidebar-bar-track">
                  <div
                    className="sidebar-bar-fill"
                    style={{ width: loading ? '0%' : `${progressPct}%` }}
                  />
                </div>
                <div className="progress-pct">{loading ? '—' : `${progressPct}%`}</div>
              </div>
            </>
          )}
        </aside>

      </div>
    </>
  );
}