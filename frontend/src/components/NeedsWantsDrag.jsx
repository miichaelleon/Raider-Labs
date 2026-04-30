import { useState } from 'react';
import './NeedsWantsDrag.css';

const items = [
  { id: 1, text: '🏠 Rent', type: 'need' },
  { id: 2, text: '🎮 New video game', type: 'want' },
  { id: 3, text: '🍎 Groceries', type: 'need' },
  { id: 4, text: '🎬 Movie ticket', type: 'want' },
  { id: 5, text: '💡 Electric bill', type: 'need' },
  { id: 6, text: '👟 Designer sneakers', type: 'want' },
  { id: 7, text: '💊 Prescription medicine', type: 'need' },
  { id: 8, text: '🍔 Eating out', type: 'want' },
];

export default function NeedsWantsDrag() {
  const [cards, setCards] = useState(items.map(i => ({ ...i, placed: null })));
  const [dragging, setDragging] = useState(null);
  const [feedback, setFeedback] = useState('');

  const handleDrop = (bucket) => {
    if (dragging === null) return;
    setCards(cards.map(c => c.id === dragging ? { ...c, placed: bucket } : c));
    setDragging(null);
  };

  const handleCheck = () => {
    if (cards.some(c => !c.placed)) {
      setFeedback('Place all the cards first!');
      return;
    }
    const correct = cards.filter(c => c.placed === c.type).length;
    setFeedback(`You got ${correct} out of ${cards.length} correct!`);
  };

  const handleReset = () => {
    setCards(items.map(i => ({ ...i, placed: null })));
    setFeedback('');
  };

  const unplaced = cards.filter(c => !c.placed);

  return (
    <div className="nw-container">
      <div className="nw-header">
        <h3>Needs vs. Wants Sorter</h3>
        <p>Drag each item into either the Needs or Wants bucket.</p>
      </div>

      <div className="nw-pool">
        {unplaced.map(item => (
          <div key={item.id} className="nw-card" draggable onDragStart={() => setDragging(item.id)}>
            {item.text}
          </div>
        ))}
        {unplaced.length === 0 && <p className="nw-empty">All sorted!</p>}
      </div>

      <div className="nw-buckets">
        <div className="nw-bucket need" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop('need')}>
          <div className="nw-bucket-label">NEEDS</div>
          {cards.filter(c => c.placed === 'need').map(c => (
            <div key={c.id} className="nw-card placed" draggable onDragStart={() => setDragging(c.id)}>
              {c.text}
            </div>
          ))}
        </div>
        <div className="nw-bucket want" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop('want')}>
          <div className="nw-bucket-label">WANTS</div>
          {cards.filter(c => c.placed === 'want').map(c => (
            <div key={c.id} className="nw-card placed" draggable onDragStart={() => setDragging(c.id)}>
              {c.text}
            </div>
          ))}
        </div>
      </div>

      <div className="nw-actions">
        <button className="nw-btn" onClick={handleCheck}>Check</button>
        <button className="nw-btn secondary" onClick={handleReset}>Reset</button>
      </div>
      {feedback && <p className="nw-feedback">{feedback}</p>}
    </div>
  );
}
