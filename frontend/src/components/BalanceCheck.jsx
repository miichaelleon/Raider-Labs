import { useState } from 'react';
import './BalanceCheck.css';

const scenarios = [
  { balance: 120, item: 'Movie ticket', cost: 15 },
  { balance: 50, item: 'Sneakers', cost: 80 },
  { balance: 250, item: 'Headphones', cost: 200 },
  { balance: 90, item: 'Concert ticket', cost: 100 },
  { balance: 500, item: 'Phone case', cost: 25 },
];

export default function BalanceCheck() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = scenarios[index];
  const canAfford = scenario.balance >= scenario.cost;
  const isCorrect = (answer === 'yes' && canAfford) || (answer === 'no' && !canAfford);

  const handleNext = () => {
    setIndex((index + 1) % scenarios.length);
    setAnswer(null);
    setSubmitted(false);
  };

  return (
    <div className="bc-container">
      <div className="bc-header">
        <h3>Can You Afford It?</h3>
        <p>Look at your balance and the cost. Decide if you can afford the purchase.</p>
      </div>

      <div className="bc-scenario">
        <div className="bc-card">
          <div className="bc-card-label">Your Balance</div>
          <div className="bc-card-value">${scenario.balance}</div>
        </div>
        <div className="bc-vs">vs</div>
        <div className="bc-card">
          <div className="bc-card-label">{scenario.item}</div>
          <div className="bc-card-value cost">${scenario.cost}</div>
        </div>
      </div>

      {!submitted ? (
        <div className="bc-buttons">
          <button
            className={`bc-btn yes ${answer === 'yes' ? 'selected' : ''}`}
            onClick={() => setAnswer('yes')}
          >
            ✓ Yes, I can afford it
          </button>
          <button
            className={`bc-btn no ${answer === 'no' ? 'selected' : ''}`}
            onClick={() => setAnswer('no')}
          >
            ✕ No, I can't afford it
          </button>
          <button className="bc-submit" onClick={() => setSubmitted(true)} disabled={!answer}>
            Submit
          </button>
        </div>
      ) : (
        <div className="bc-feedback">
          {isCorrect
            ? <p className="correct">✅ Correct! {canAfford ? 'You have enough.' : 'You don\'t have enough.'}</p>
            : <p className="incorrect">❌ Not quite. {canAfford
                ? `$${scenario.balance} is more than $${scenario.cost}, so you CAN afford it.`
                : `$${scenario.balance} is less than $${scenario.cost}, so you CAN'T afford it.`}</p>
          }
          <button className="bc-submit" onClick={handleNext}>Next Scenario</button>
        </div>
      )}
    </div>
  );
}
