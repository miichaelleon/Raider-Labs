import { useState } from 'react';
import './CheckSteps.css';

const steps = [
  { id: 1, label: 'Receive the check', emoji: '📨' },
  { id: 2, label: 'Flip the check over', emoji: '🔄' },
  { id: 3, label: 'Find the endorsement line', emoji: '📐' },
  { id: 4, label: 'Sign your name on the line', emoji: '✍️' },
  { id: 5, label: 'Deposit at bank or by mobile app', emoji: '🏦' },
];

const shuffled = [...steps].sort(() => Math.random() - 0.5);

export default function CheckSteps() {
  const [order, setOrder] = useState(shuffled);
  const [feedback, setFeedback] = useState('');
  const [dragging, setDragging] = useState(null);

  const handleDragStart = (i) => setDragging(i);

  const handleDrop = (targetIndex) => {
    if (dragging === null || dragging === targetIndex) return;
    const newOrder = [...order];
    const [moved] = newOrder.splice(dragging, 1);
    newOrder.splice(targetIndex, 0, moved);
    setOrder(newOrder);
    setDragging(null);
  };

  const handleCheck = () => {
    const isCorrect = order.every((step, i) => step.id === i + 1);
    setFeedback(isCorrect ? '✅ Correct order!' : '❌ Not quite. Try rearranging.');
  };

  const handleReset = () => {
    setOrder([...steps].sort(() => Math.random() - 0.5));
    setFeedback('');
  };

  return (
    <div className="cs-container">
      <div className="cs-header">
        <h3>Put the Steps in Order</h3>
        <p>Drag each step to the correct order for endorsing & depositing a check.</p>
      </div>

      <div className="cs-list">
        {order.map((step, i) => (
          <div
            key={step.id}
            className="cs-step"
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
          >
            <span className="cs-number">{i + 1}</span>
            <span className="cs-emoji">{step.emoji}</span>
            <span className="cs-label">{step.label}</span>
            <span className="cs-grip">⋮⋮</span>
          </div>
        ))}
      </div>

      <div className="cs-actions">
        <button className="cs-btn" onClick={handleCheck}>Check Order</button>
        <button className="cs-btn secondary" onClick={handleReset}>Shuffle</button>
      </div>

      {feedback && <p className="cs-feedback">{feedback}</p>}
    </div>
  );
}
