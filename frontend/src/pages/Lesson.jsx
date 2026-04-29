import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TutorChat from '../components/TutorChat';
import { saveProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import './Lesson.css';

const lessons = {
  '0.1': {
    title: 'Money',
    tabs: {
      showMe: {
        heading: 'What is Money?',
        content: 'Money is anything widely accepted as payment for goods and services. It serves three main purposes: a medium of exchange (used to buy and sell), a store of value (holds worth over time), and a unit of account (measures the value of things).',
        example: 'Example: Instead of trading a chicken for shoes, you use money — it makes buying and selling much easier.',
      },
      practice: {
        heading: 'Money in Action',
        instruction: 'Think about the three roles of money and answer with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Money Check',
        question: 'Which of the following best describes money\'s role as a "medium of exchange"?',
        options: [
          'Money holds its value over time',
          'Money is used to buy and sell goods and services',
          'Money measures the value of things',
          'Money is printed by the government',
        ],
        correct: 1,
      },
    },
  },
  '0.2': {
    title: 'Income',
    tabs: {
      showMe: {
        heading: 'What is Income?',
        content: 'Income is money you receive in exchange for work or services. The most common types are wages (paid by the hour), salary (fixed amount per year), tips (extra money from customers), and allowance (money given regularly, often to younger people).',
        example: 'Example: If you work 10 hours at $12/hour, your income for that week is $120 before taxes.',
      },
      practice: {
        heading: 'Types of Income',
        instruction: 'Talk through different income scenarios with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Income Check',
        question: 'You earn $15 per hour and work 8 hours. What is your gross income for the day?',
        options: ['$100', '$120', '$150', '$180'],
        correct: 1,
      },
    },
  },
  '0.3': {
    title: 'Taxes',
    tabs: {
      showMe: {
        heading: 'What are Taxes?',
        content: 'Taxes are money collected by the government from individuals and businesses. They fund public services like schools, roads, and hospitals. When you earn money, a portion is taken out as tax before you receive your paycheck — this is called a deduction.',
        example: 'Example: If you earn $100 and your tax rate is 10%, you pay $10 in taxes and keep $90. The $90 is your net pay.',
      },
      practice: {
        heading: 'Understanding Taxes',
        instruction: 'Work through tax scenarios with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Taxes Check',
        question: 'You earn $200 and your tax rate is 15%. How much do you take home after taxes?',
        options: ['$200', '$185', '$170', '$150'],
        correct: 2,
      },
    },
  },
  '1.1': {
    title: 'Needs vs. Wants',
    tabs: {
      showMe: {
        heading: 'Understanding Needs vs. Wants',
        content: 'A need is something essential for survival — like rent, food, or utilities. A want is something you would like but can live without — like a video game or eating out. When money is limited, needs always come first.',
        example: 'Example: You have $50 left. Your phone bill is $40 due today. A movie outing costs $15. The phone bill is a need — pay it first.',
      },
      practice: {
        heading: 'Priority Sort',
        instruction: 'Talk through needs and wants scenarios with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Scenario Assessment',
        question: 'You have $50 left this week. Your phone bill is $40 and is due today. A friend invites you to a movie that costs $15. What should you do?',
        options: [
          'Pay the phone bill and skip the movie',
          'Go to the movie and pay the phone bill late',
          'Split the $50 between both',
          'Ask a friend to cover the movie',
        ],
        correct: 0,
      },
    },
  },
  '1.2': {
    title: 'The 4 Step Budgeting Routine',
    tabs: {
      showMe: {
        heading: 'How to Build a Monthly Budget',
        content: 'Step 1: List all sources of income. Step 2: Sort your bills by frequency (monthly, yearly, etc.). Step 3: Convert all bills to a monthly amount. Step 4: Subtract total bills from income to find your remaining balance.',
        example: 'Example: Income $2,000. Fixed bills: Rent $700, Utilities $150, Phone $50, Groceries $200 = $1,100. Remaining: $900.',
      },
      practice: {
        heading: 'Budget Builder',
        instruction: 'Work through building a budget with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Sinking Fund Calculation',
        question: 'You have a yearly car insurance bill of $600. How much should you set aside each month so you are ready when it is due?',
        options: ['$600', '$100', '$50', '$200'],
        correct: 2,
      },
    },
  },
  '1.3': {
    title: 'Recording Transactions in a Register',
    tabs: {
      showMe: {
        heading: 'How to Use a Transaction Register',
        content: 'A transaction register is a record of every deposit and withdrawal from your account. Each time you spend or receive money, you record the amount and subtract or add it to your running balance.',
        example: 'Example: Starting balance $500. Write check for $120 rent. New balance: $500 - $120 = $380.',
      },
      practice: {
        heading: 'Record Mock Transactions',
        instruction: 'Practice recording transactions with your AI tutor.',
        items: ['Check #101: $120 to Landlord', 'Check #102: $45 to Electric Company', 'Check #103: $30 to Grocery Store'],
      },
      assess: {
        heading: 'Available Balance',
        question: 'Your register shows a balance of $300. You wrote a check for $80 that has not cleared yet. What is your true available balance?',
        options: ['$300', '$380', '$220', '$80'],
        correct: 2,
      },
    },
  },
  '2.1': {
    title: 'Endorsing & Depositing Checks',
    tabs: {
      showMe: {
        heading: 'How to Endorse a Check',
        content: 'To endorse a check: flip it over, find the endorsement line on the back, and sign your name exactly as it appears on the front. Then take it to your bank or use mobile deposit.',
        example: 'Remember: Flip → Find the line → Sign.',
      },
      practice: {
        heading: 'Virtual Check Signing',
        instruction: 'Walk through endorsing a check with your AI tutor.',
        items: ['Flip the check over', 'Find the endorsement line', 'Sign your name'],
      },
      assess: {
        heading: 'Check Deposit Assessment',
        question: 'Where do you sign to endorse a check for deposit?',
        options: [
          'On the front where it says "Pay to the order of"',
          'On the back on the endorsement line',
          'Anywhere on the front',
          'On the memo line',
        ],
        correct: 1,
      },
    },
  },
  '2.2': {
    title: 'Managing Online Banking & Balances',
    tabs: {
      showMe: {
        heading: 'Navigating Online Banking',
        content: 'To check your balance online: log into your bank app or website, navigate to Account Summary, and find your available balance. Always check your available balance before making a purchase.',
        example: 'Example: Your available balance is $120. You want to buy something for $40. Since $120 > $40, you have enough.',
      },
      practice: {
        heading: 'Balance Check Simulator',
        instruction: 'Practice checking balances with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Balance Comparison',
        question: 'Account A has $85. Account B has $120. You need to transfer $100. Which account has enough for the transfer?',
        options: ['Account A', 'Account B', 'Both accounts', 'Neither account'],
        correct: 1,
      },
    },
  },
};

const TABS = ['showMe', 'practice', 'assess'];
const TAB_LABELS = { showMe: 'Show Me', practice: 'Practice', assess: 'Assess' };

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('showMe');
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const lesson = lessons[id];

  if (!lesson) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <div className="lesson-not-found">
          <h2>Lesson not found</h2>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </>
    );
  }

  const tab = lesson.tabs[activeTab];

  const handleSubmit = async () => {
    if (selected !== null) {
      setSubmitted(true);
      const score = selected === tab.correct ? 1 : 0;
      
      if (selected === tab.correct) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      try {
        await saveProgress(token, id, score);
      } catch (err) {
        console.error('Failed to save progress', err);
      }
    }
  };

  const handleNext = () => {
    const currentIndex = TABS.indexOf(activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1]);
      setSelected(null);
      setSubmitted(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="lesson-layout">

        <aside className="lesson-sidebar">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          <h3 className="lesson-sidebar-title">{id} — {lesson.title}</h3>
          <nav className="lesson-nav">
            {TABS.map((t) => (
              <button
                key={t}
                className={`lesson-nav-btn ${activeTab === t ? 'active' : ''}`}
                onClick={() => { setActiveTab(t); setSelected(null); setSubmitted(false); }}
              >
                <span className={`lesson-nav-dot ${activeTab === t ? 'active' : ''}`} />
                {TAB_LABELS[t]}
              </button>
            ))}
          </nav>
        </aside>

        <main className="lesson-main">
          {activeTab === 'showMe' && (
            <div className="show-me">
              <h2>{tab.heading}</h2>
              <p>{tab.content}</p>
              <div className="example-box">
                <strong>💡 {tab.example}</strong>
              </div>
              <button className="next-btn" onClick={handleNext}>Next: Practice →</button>
            </div>
          )}

          {activeTab === 'practice' && (
            <div className="practice">
              <h2>{tab.heading}</h2>
              <p>{tab.instruction}</p>
              <button className="next-btn" onClick={handleNext}>Next: Assess →</button>
              <TutorChat
                lessonId={id}
                lessonTitle={lesson.title}
                lessonContext={tab.instruction}
              />
            </div>
          )}

          {activeTab === 'assess' && (
            <div className="assess">
              <h2>{tab.heading}</h2>
              <p className="assess-question">{tab.question}</p>
              <div className="options">
                {tab.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn
                      ${selected === i ? 'selected' : ''}
                      ${submitted && i === tab.correct ? 'correct' : ''}
                      ${submitted && selected === i && i !== tab.correct ? 'incorrect' : ''}
                    `}
                    onClick={() => !submitted && setSelected(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {!submitted ? (
                <button className="next-btn" onClick={handleSubmit} disabled={selected === null}>
                  Submit
                </button>
              ) : (
                <div className="feedback">
                  {selected === tab.correct
                    ? <p className="feedback-correct">✅ Correct! Great job.</p>
                    : <p className="feedback-incorrect">❌ Not quite. The correct answer is: {tab.options[tab.correct]}</p>
                  }
                  <button className="next-btn" onClick={handleNext}>Finish Lesson →</button>
                </div>
              )}
            </div>
          )}
        </main>

      </div>
    </>
  );
}