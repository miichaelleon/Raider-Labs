import { useState } from 'react';
import './MoneyDragDrop.css';

const scenarios = [
  { id: 1, text: 'Buying coffee with cash', role: 'exchange' },
  { id: 2, text: 'Saving $100 in your bank account', role: 'store' },
  { id: 3, text: 'A shirt is priced at $20', role: 'unit' },
  { id: 4, text: 'Paying for a movie ticket', role: 'exchange' },
  { id: 5, text: 'Holding $500 to use next year', role: 'store' },
  { id: 6, text: 'Comparing the cost of two phones', role: 'unit' },
];

const buckets = [
  { id: 'exchange', label: 'Medium of Exchange', color: '#cc0000' },
  { id: 'store', label: 'Store of Value', color: '#5b8dd9' },
  { id: 'unit', label: 'Unit of Account', color: '#4a9e6b' },
];

export default function MoneyDragDrop() {
  const [items, setItems] = useState(scenarios.map(s => ({ ...s, placed: null })));
  const [dragging, setDragging] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleDragStart = (id) => setDragging(id);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (bucketId) => {
    if (dragging === null) return;
    setItems(items.map(item =>
      item.id === dragging ? { ...item, placed: bucketId } : item
    ));
    setDragging(null);
  };

  const handleCheck = () => {
    const allPlaced = items.every(i => i.placed);
    if (!allPlaced) {
      setFeedback('Place all the cards first!');
      return;
    }
    const correct = items.filter(i => i.placed === i.role).length;
    setFeedback(`You got ${correct} out of ${items.length} correct!`);
  };

  const handleReset = () => {
    setItems(scenarios.map(s => ({ ...s, placed: null })));
    setFeedback('');
  };

  const unplaced = items.filter(i => !i.placed);

  return (
    <div className="dragdrop-container">
      <div className="dragdrop-header">
        <h3>Sort each scenario into the correct role of money</h3>
        <p>Drag each card into one of the three buckets below.</p>
      </div>

      <div className="dragdrop-pool">
        {unplaced.map(item => (
          <div
            key={item.id}
            className="dragdrop-card"
            draggable
            onDragStart={() => handleDragStart(item.id)}
          >
            {item.text}
          </div>
        ))}
        {unplaced.length === 0 && (
          <p className="dragdrop-empty">All cards placed!</p>
        )}
      </div>

      <div className="dragdrop-buckets">
        {buckets.map(bucket => (
          <div
            key={bucket.id}
            className="dragdrop-bucket"
            style={{ borderColor: bucket.color }}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(bucket.id)}
          >
            <div className="dragdrop-bucket-label" style={{ color: bucket.color }}>
              {bucket.label}
            </div>
            <div className="dragdrop-bucket-items">
              {items.filter(i => i.placed === bucket.id).map(item => (
                <div
                  key={item.id}
                  className="dragdrop-card placed"
                  style={{ borderColor: bucket.color }}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="dragdrop-actions">
        <button className="dragdrop-btn" onClick={handleCheck}>Check Answers</button>
        <button className="dragdrop-btn secondary" onClick={handleReset}>Reset</button>
      </div>

      {feedback && <p className="dragdrop-feedback">{feedback}</p>}
    </div>
  );
}
