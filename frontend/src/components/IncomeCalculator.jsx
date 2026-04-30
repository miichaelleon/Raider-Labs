import { useState } from 'react';
import './IncomeCalculator.css';

export default function IncomeCalculator() {
  const [hours, setHours] = useState('');
  const [rate, setRate] = useState('');
  const [taxRate, setTaxRate] = useState(15);

  const gross = (Number(hours) || 0) * (Number(rate) || 0);
  const taxes = gross * (taxRate / 100);
  const net = gross - taxes;

  return (
    <div className="calc-container">
      <div className="calc-header">
        <h3>Paycheck Calculator</h3>
        <p>Enter your hours and rate to see your gross and net income.</p>
      </div>

      <div className="calc-inputs">
        <div className="calc-field">
          <label>Hours worked</label>
          <input
            type="number"
            value={hours}
            onChange={e => setHours(e.target.value)}
            placeholder="40"
          />
        </div>
        <div className="calc-field">
          <label>Hourly rate ($)</label>
          <input
            type="number"
            value={rate}
            onChange={e => setRate(e.target.value)}
            placeholder="15"
          />
        </div>
        <div className="calc-field">
          <label>Tax rate ({taxRate}%)</label>
          <input
            type="range"
            min="0"
            max="40"
            value={taxRate}
            onChange={e => setTaxRate(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="calc-results">
        <div className="calc-row">
          <span className="calc-label">Gross Pay</span>
          <span className="calc-value gross">${gross.toFixed(2)}</span>
        </div>
        <div className="calc-row">
          <span className="calc-label">Taxes ({taxRate}%)</span>
          <span className="calc-value tax">- ${taxes.toFixed(2)}</span>
        </div>
        <div className="calc-row total">
          <span className="calc-label">Net Pay (Take-home)</span>
          <span className="calc-value net">${net.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
