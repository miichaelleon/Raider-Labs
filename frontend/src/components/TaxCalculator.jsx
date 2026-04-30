import { useState } from 'react';
import './TaxCalculator.css';

const scenarios = [
  { gross: 50, rate: 10 },
  { gross: 100, rate: 15 },
  { gross: 200, rate: 20 },
  { gross: 500, rate: 25 },
];

export default function TaxCalculator() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scenario = scenarios[scenarioIndex];
  const correctAnswer = scenario.gross - (scenario.gross * scenario.rate / 100);
  const userGuess = Number(guess);
  const isCorrect = Math.abs(userGuess - correctAnswer) < 0.01;

  const handleSubmit = () => setSubmitted(true);

  const handleNext = () => {
    setScenarioIndex((scenarioIndex + 1) % scenarios.length);
    setGuess('');
    setSubmitted(false);
  };

  return (
    <div className="taxcalc-container">
      <div className="taxcalc-header">
        <h3>Tax Take-Home Practice</h3>
        <p>Calculate the take-home pay (net) after taxes are deducted.</p>
      </div>

      <div className="taxcalc-scenario">
        <div className="taxcalc-row">
          <span>Gross Income:</span>
          <strong>${scenario.gross}</strong>
        </div>
        <div className="taxcalc-row">
          <span>Tax Rate:</span>
          <strong>{scenario.rate}%</strong>
        </div>
        <div className="taxcalc-row guess">
          <span>What is the take-home pay?</span>
          <div className="taxcalc-input-wrap">
            <span className="taxcalc-dollar">$</span>
            <input
              type="number"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              placeholder="?"
              disabled={submitted}
            />
          </div>
        </div>
      </div>

      {!submitted ? (
        <button className="taxcalc-btn" onClick={handleSubmit} disabled={!guess}>
          Check
        </button>
      ) : (
        <div className="taxcalc-feedback">
          {isCorrect ? (
            <p className="correct">✅ Correct! Take-home is ${correctAnswer.toFixed(2)}</p>
          ) : (
            <p className="incorrect">❌ Not quite. Correct answer: ${correctAnswer.toFixed(2)}</p>
          )}
          <button className="taxcalc-btn" onClick={handleNext}>Next Scenario</button>
        </div>
      )}
    </div>
  );
}
