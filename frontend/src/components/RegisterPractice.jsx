import { useState } from 'react';
import './RegisterPractice.css';

const initialTransactions = [
  { id: 1, date: '3/03', description: 'Check #101 - Rent', amount: -120, type: 'withdrawal' },
  { id: 2, date: '3/10', description: 'Paycheck deposit', amount: 200, type: 'deposit' },
  { id: 3, date: '3/15', description: 'Check #102 - Utilities', amount: -45, type: 'withdrawal' },
  { id: 4, date: '3/20', description: 'Check #103 - Groceries', amount: -30, type: 'withdrawal' },
];

const STARTING_BALANCE = 500;

export default function RegisterPractice() {
  const [step, setStep] = useState(0);
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const balanceBefore = initialTransactions
    .slice(0, step)
    .reduce((sum, t) => sum + t.amount, STARTING_BALANCE);
  const txn = initialTransactions[step];
  const correctBalance = balanceBefore + (txn ? txn.amount : 0);
  const isCorrect = Number(guess) === correctBalance;

  const handleSubmit = () => setSubmitted(true);
  const handleNext = () => {
    setStep(step + 1);
    setGuess('');
    setSubmitted(false);
  };
  const handleReset = () => {
    setStep(0);
    setGuess('');
    setSubmitted(false);
  };

  if (step >= initialTransactions.length) {
    return (
      <div className="reg-container">
        <div className="reg-complete">
          <h3>🎉 All transactions recorded!</h3>
          <p>Final balance: <strong>${correctBalance}</strong></p>
          <button className="reg-btn" onClick={handleReset}>Start Over</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reg-container">
      <div className="reg-header">
        <h3>Update the Register</h3>
        <p>Calculate the new balance after each transaction.</p>
      </div>

      <div className="reg-info">
        <div className="reg-info-row">
          <span>Current balance:</span>
          <strong>${balanceBefore}</strong>
        </div>
        <div className="reg-info-row">
          <span>Date:</span>
          <strong>{txn.date}</strong>
        </div>
        <div className="reg-info-row">
          <span>Transaction:</span>
          <strong>{txn.description}</strong>
        </div>
        <div className="reg-info-row">
          <span>Amount:</span>
          <strong className={txn.amount < 0 ? 'negative' : 'positive'}>
            {txn.amount < 0 ? '- ' : '+ '}${Math.abs(txn.amount)}
          </strong>
        </div>
      </div>

      <div className="reg-guess">
        <label>What is the new balance?</label>
        <div className="reg-input-wrap">
          <span>$</span>
          <input
            type="number"
            value={guess}
            onChange={e => setGuess(e.target.value)}
            placeholder="?"
            disabled={submitted}
          />
        </div>
      </div>

      {!submitted ? (
        <button className="reg-btn" onClick={handleSubmit} disabled={!guess}>Check</button>
      ) : (
        <div className="reg-feedback">
          {isCorrect
            ? <p className="correct">✅ Correct! New balance is ${correctBalance}.</p>
            : <p className="incorrect">❌ Not quite. The correct answer is ${correctBalance}.</p>
          }
          <button className="reg-btn" onClick={handleNext}>Next Transaction</button>
        </div>
      )}

      <div className="reg-progress">Step {step + 1} of {initialTransactions.length}</div>
    </div>
  );
}
