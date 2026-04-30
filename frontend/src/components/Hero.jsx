import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import tutorIcon from '../assets/icons/claude.png';
import learnIcon from '../assets/icons/bulb.png';
import moneyIcon from '../assets/icons/money.png';
import './Hero.css';

const features = [
  {
    icon: learnIcon,
    title: 'Personalized learning',
    description:
      'Students work at their own pace, building financial skills step by step with guided lessons.',
  },
  {
    icon: moneyIcon,
    title: 'Trusted content',
    description:
      'Developed in partnership with Texas Tech educators to be accessible and accurate for every learner.',
  },
  {
    icon: tutorIcon,
    title: 'AI-powered tutoring',
    description:
      'An intelligent tutor guides students through concepts without just giving away the answer.',
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleGetStarted = () => {
    navigate(token ? '/dashboard' : '/login');
  };

  return (
    <section className="hero">

      <div className="hero-intro">
        <h1 className="hero-headline">
          Raider Finance helps you understand financial literacy
        </h1>
        <p className="hero-subtext">
          A personalized learning platform built for Texas Tech students,
          designed to make financial concepts clear, approachable, and practical.
        </p>
        <button className="hero-get-started" onClick={handleGetStarted}>
          {token ? 'Go to Dashboard →' : 'Get Started →'}
        </button>
      </div>

      <div className="hero-lesson-box">
        <div className="topics-zone">
          <span className="topics-zone-label">Zone A — Thinking</span>
          <div className="topics-list">
            <div className="topic-item">📋 Needs vs. Wants</div>
            <div className="topic-item">💰 The 4 Step Budgeting Routine</div>
            <div className="topic-item">📒 Recording Transactions in a Register</div>
          </div>
        </div>
        <div className="topics-divider" />
        <div className="topics-zone">
          <span className="topics-zone-label">Zone B — Doing</span>
          <div className="topics-list">
            <div className="topic-item">✍️ Endorsing & Depositing Checks</div>
            <div className="topic-item">🏦 Managing Online Banking & Balances</div>
          </div>
        </div>
      </div>

      <div className="hero-why">
        <h2 className="why-title">Why Raider Finance works</h2>
        <div className="why-cards">
          {features.map((f) => (
            <div className="why-card" key={f.title}>
              <img src={f.icon} alt={f.title} className="why-icon" />
              <h3 className="why-card-title">{f.title}</h3>
              <p className="why-card-desc">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}