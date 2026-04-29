import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendAIMessage } from '../services/api';
import tutorIcon from '../assets/images/crab.svg';
import './TutorChat.css';

export default function TutorChat({ lessonId, lessonTitle, lessonContext }) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I'm here to help you with ${lessonTitle}. What questions do you have?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const history = newMessages.slice(0, -1).map(m => ({
      role: m.role,
      content: m.text
    }));

    try {
      const data = await sendAIMessage(token, userMessage, lessonId, lessonTitle, lessonContext, history);
      setMessages([...newMessages, { role: 'assistant', text: data.response }]);
    } catch {
      setMessages([...newMessages, { role: 'assistant', text: 'Sorry, something went wrong. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="tutor-container">
      {open ? (
        <div className="tutor-expanded">
          <div className="tutor-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`tutor-message ${msg.role}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {loading && (
              <div className="tutor-message assistant">
                <p className="tutor-typing">Thinking...</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="tutor-input-area">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="tutor-input"
            />
            <button className="tutor-send" onClick={handleSend} disabled={loading}>
              →
            </button>
          </div>
        </div>
      ) : (
        <div className="tutor-speech" onClick={() => setOpen(true)}>
          Need a hint? Ask me!
        </div>
      )}
      <img
        src={tutorIcon}
        alt="AI Tutor"
        className="tutor-img"
        onClick={() => setOpen(!open)}
      />
    </div>
  );
}