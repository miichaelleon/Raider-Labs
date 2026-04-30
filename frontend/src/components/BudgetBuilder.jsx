import { useState } from 'react';
import './BudgetBuilder.css';

export default function BudgetBuilder() {
  const [income, setIncome] = useState('');
  const [bills, setBills] = useState([
    { name: 'Rent', amount: '' },
    { name: 'Utilities', amount: '' },
    { name: 'Phone', amount: '' },
    { name: 'Groceries', amount: '' },
  ]);

  const updateBill = (i, value) => {
    const newBills = [...bills];
    newBills[i].amount = value;
    setBills(newBills);
  };

  const totalBills = bills.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const incomeNum = Number(income) || 0;
  const remaining = incomeNum - totalBills;

  return (
    <div className="budget-container">
      <div className="budget-header">
        <h3>Build Your Monthly Budget</h3>
        <p>Enter your income and monthly bills. See what's left over.</p>
      </div>

      <div className="budget-section">
        <label className="budget-section-label">Monthly Income</label>
        <input
          type="number"
          value={income}
          onChange={e => setIncome(e.target.value)}
          placeholder="e.g. 2000"
          className="budget-input large"
        />
      </div>

      <div className="budget-section">
        <label className="budget-section-label">Monthly Bills</label>
        {bills.map((bill, i) => (
          <div key={i} className="budget-bill-row">
            <span className="budget-bill-name">{bill.name}</span>
            <div className="budget-input-wrap">
              <span className="budget-dollar">$</span>
              <input
                type="number"
                value={bill.amount}
                onChange={e => updateBill(i, e.target.value)}
                placeholder="0"
                className="budget-input"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="budget-summary">
        <div className="budget-summary-row">
          <span>Income</span>
          <span className="positive">${incomeNum.toFixed(0)}</span>
        </div>
        <div className="budget-summary-row">
          <span>Total Bills</span>
          <span className="negative">- ${totalBills.toFixed(0)}</span>
        </div>
        <div className={`budget-summary-row total ${remaining >= 0 ? 'good' : 'bad'}`}>
          <span>Remaining</span>
          <span>${remaining.toFixed(0)}</span>
        </div>
      </div>
    </div>
  );
}
