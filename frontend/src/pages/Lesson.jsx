import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TutorChat from '../components/TutorChat';
import { getLesson, saveProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import './Lesson.css';

import MoneyDragDrop     from '../components/MoneyDragDrop';
import IncomeCalculator  from '../components/IncomeCalculator';
import TaxCalculator     from '../components/TaxCalculator';
import NeedsWantsDrag    from '../components/NeedsWantsDrag';
import BudgetBuilder     from '../components/BudgetBuilder';
import RegisterPractice  from '../components/RegisterPractice';
import CheckSteps        from '../components/CheckSteps';
import BalanceCheck      from '../components/BalanceCheck';

const PRACTICE_COMPONENTS = {
  '0.1': <MoneyDragDrop />,
  '0.2': <IncomeCalculator />,
  '0.3': <TaxCalculator />,
  '1.1': <NeedsWantsDrag />,
  '1.2': <BudgetBuilder />,
  '1.3': <RegisterPractice />,
  '2.1': <CheckSteps />,
  '2.2': <BalanceCheck />,
};

const TABS       = ['showMe', 'practice', 'assess'];
const TAB_LABELS = { showMe: 'Show Me', practice: 'Practice', assess: 'Assess' };
const PASS_THRESHOLD = 0.8;

export default function Lesson() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const { token }   = useAuth();

  // Lesson content fetched from backend
  const [lesson,  setLesson]  = useState(null);
  const [fetching, setFetching] = useState(true);
  const [fetchErr, setFetchErr] = useState(null);

  // Quiz state
  const [activeTab,      setActiveTab]      = useState('showMe');
  const [questionIndex,  setQuestionIndex]  = useState(0);
  const [selected,       setSelected]       = useState(null);
  const [submitted,      setSubmitted]      = useState(false);
  const [answers,        setAnswers]        = useState([]);
  const [tutorMessages,  setTutorMessages]  = useState([]);

  useEffect(() => {
    if (!token || !id) return;
    // Ignore ERROR it is just a cascading issue with the database, will not break system.
    setFetching(true);
    setFetchErr(null);
    getLesson(token, id)
      .then(data => setLesson(data))
      .catch(err => setFetchErr(err.message))
      .finally(() => setFetching(false));
  }, [token, id]);

  // Loading / error / not-found states
  if (fetching) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <div className="lesson-layout">
          <main className="lesson-main">
            <p style={{ padding: '2rem', color: '#888' }}>Loading lesson…</p>
          </main>
        </div>
      </>
    );
  }

  if (fetchErr || !lesson) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <div className="lesson-not-found">
          <h2>Lesson not found</h2>
          <p style={{ color: '#888', marginBottom: '1rem' }}>{fetchErr}</p>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </>
    );
  }

  const tab             = lesson.tabs[activeTab];
  const isAssess        = activeTab === 'assess';
  const questions       = isAssess ? tab.questions : null;
  const currentQuestion = isAssess ? questions[questionIndex] : null;
  const isLastQuestion  = isAssess && questionIndex === questions.length - 1;
  const allDone         = isAssess && answers.length === questions.length;
  const correctCount    = answers.filter(Boolean).length;
  const percent         = questions ? correctCount / questions.length : 0;
  const passed          = percent >= PASS_THRESHOLD;

  const goToTab = (t) => {
    setActiveTab(t);
    setSelected(null);
    setSubmitted(false);
    setQuestionIndex(0);
    setAnswers([]);
  };

  const handleNext = () => {
    const idx = TABS.indexOf(activeTab);
    if (idx < TABS.length - 1) goToTab(TABS[idx + 1]);
    else navigate('/dashboard');
  };

  const handleSubmit = async () => {
    if (selected === null) return;
    const isCorrect = selected === currentQuestion.correct;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setSubmitted(true);
    if (isCorrect) confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });

    if (newAnswers.length === questions.length) {
      const finalCount = newAnswers.filter(Boolean).length;
      try { await saveProgress(token, id, finalCount); }
      catch (err) { console.error('Failed to save progress', err); }
      if (finalCount / questions.length >= PASS_THRESHOLD) {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      const finalCount = answers.filter(Boolean).length;
      try { await saveProgress(token, id, finalCount); }
      catch (err) { console.error('Failed to save progress', err); }
      if (finalCount / questions.length >= PASS_THRESHOLD) {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
      setSubmitted(true);
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const handleRetry = () => {
    setQuestionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers([]);
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="lesson-layout">

        <aside className="lesson-sidebar">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h3 className="lesson-sidebar-title">{id} — {lesson.title}</h3>
          <nav className="lesson-nav">
            {TABS.map(t => (
              <button
                key={t}
                className={`lesson-nav-btn ${activeTab === t ? 'active' : ''}`}
                onClick={() => goToTab(t)}
              >
                <span className={`lesson-nav-dot ${activeTab === t ? 'active' : ''}`} />
                {TAB_LABELS[t]}
              </button>
            ))}
          </nav>
        </aside>

        <main className="lesson-main">

          {activeTab === 'showMe' && (
            <div className="show-me">
              <h2>{tab.heading}</h2>
              {tab.paragraphs?.map((para, i) => (
                <div key={i}>
                  <p>{para}</p>
                  {tab.diagrams?.[i] && (
                    <img
                      src={new URL(`../assets/images/${tab.diagrams[i]}.svg`, import.meta.url).href}
                      alt=""
                      className="lesson-diagram"
                      onError={e => { e.currentTarget.style.display = 'none'; }}
                    />
                  )}
                </div>
              ))}
              {tab.example && (
                <div className="example-box">
                  <strong>💡 {tab.example}</strong>
                </div>
              )}
              <button className="next-btn" onClick={handleNext}>
                Next: Practice →
              </button>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="practice">
              <h2>{tab.heading}</h2>
              <p>{tab.instruction}</p>

              {/* Render a custom interactive component if one exists for this id */}
              {PRACTICE_COMPONENTS[id] ?? null}

              <div className="practice-footer">
                <button className="next-btn" onClick={handleNext}>
                  Next: Assess →
                </button>
              </div>
              <TutorChat
                lessonId={id}
                lessonTitle={lesson.title}
                lessonContext={tab.instruction}
                messages={tutorMessages}
                setMessages={setTutorMessages}
              />
            </div>
          )}

          {activeTab === 'assess' && !allDone && (
            <div className="assess">
              <div className="assess-progress">
                Question {questionIndex + 1} of {questions.length}
              </div>
              <h2>{tab.heading}</h2>
              <p className="assess-question">{currentQuestion.question}</p>
              <div className="options">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn
                      ${selected === i ? 'selected' : ''}
                      ${submitted && i === currentQuestion.correct ? 'correct' : ''}
                      ${submitted && selected === i && i !== currentQuestion.correct ? 'incorrect' : ''}
                    `}
                    onClick={() => !submitted && setSelected(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {!submitted ? (
                <button className="next-btn" onClick={handleSubmit} disabled={selected === null}>
                  Submit
                </button>
              ) : (
                <div className="feedback">
                  {selected === currentQuestion.correct
                    ? <p className="feedback-correct">✅ Correct!</p>
                    : <p className="feedback-incorrect">❌ The correct answer is: {currentQuestion.options[currentQuestion.correct]}</p>
                  }
                  <button className="next-btn" onClick={handleNextQuestion}>
                    {isLastQuestion ? 'Finish Quiz →' : 'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          )}
          {activeTab === 'assess' && allDone && (
            <div className="assess-results">
              <h2>{passed ? '🎉 Module Passed!' : 'Almost There!'}</h2>
              <div className="score-circle">
                <span className="score-percent">{Math.round(percent * 100)}%</span>
                <span className="score-detail">{correctCount} / {questions.length} correct</span>
              </div>
              {passed
                ? <p className="result-message pass">Great job! You scored {Math.round(percent * 100)}% — you've mastered this module.</p>
                : <p className="result-message fail">You need 80% to pass. Try again or review the Show Me section.</p>
              }
              <div className="result-buttons">
                {!passed && <button className="next-btn" onClick={handleRetry}>Try Again</button>}
                <button className="next-btn" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}