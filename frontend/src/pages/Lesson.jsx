import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TutorChat from '../components/TutorChat';
import { saveProgress } from '../services/api';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import './Lesson.css';
import MoneyDragDrop from '../components/MoneyDragDrop';
import IncomeCalculator from '../components/IncomeCalculator';
import TaxCalculator from '../components/TaxCalculator';
import NeedsWantsDrag from '../components/NeedsWantsDrag';
import BudgetBuilder from '../components/BudgetBuilder';
import RegisterPractice from '../components/RegisterPractice';
import CheckSteps from '../components/CheckSteps';
import BalanceCheck from '../components/BalanceCheck';

const lessons = {
  '0.1': {
    title: 'Money',
    tabs: {
      showMe: {
        heading: 'What is Money?',
        paragraphs: [
          'Money is anything widely accepted as payment for goods and services. It serves three main purposes: a medium of exchange, a store of value, and a unit of account. These three roles are what make money so useful in everyday life — without money, every trade would be a complicated swap of one good for another.',
          'Before money, people used a system called bartering — directly trading items like a chicken for a pair of shoes. The problem was finding someone who had what you needed AND wanted what you had. Money solves this by giving everyone a common, accepted way to pay. Today, money can be physical (cash and coins) or digital (numbers in your bank account).',
        ],
        diagrams: ['money_diagram', 'barter_diagram'],
        example: 'Example: Instead of trading a chicken for shoes, you use money — it makes buying and selling much easier.',
      },
      practice: {
        heading: 'Money in Action',
        instruction: 'Think about the three roles of money and answer with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Money Check',
        questions: [
          {
            question: 'Which of the following best describes money\'s role as a "medium of exchange"?',
            options: [
              'Money holds its value over time',
              'Money is used to buy and sell goods and services',
              'Money measures the value of things',
              'Money is printed by the government',
            ],
            correct: 1,
          },
          {
            question: 'What does "store of value" mean?',
            options: [
              'Money can be saved and used later',
              'Money is kept inside a store',
              'Money is exchanged for goods',
              'Money is printed on paper',
            ],
            correct: 0,
          },
          {
            question: 'Which is an example of money being used as a "unit of account"?',
            options: [
              'Buying groceries with cash',
              'Saving $100 for a phone',
              'A shirt is priced at $20',
              'Trading a chicken for shoes',
            ],
            correct: 2,
          },
          {
            question: 'Why is money better than trading items directly (bartering)?',
            options: [
              'Bartering is illegal',
              'Money makes buying and selling easier',
              'Money is more colorful',
              'Bartering is faster',
            ],
            correct: 1,
          },
          {
            question: 'Who decides what is used as money in a country?',
            options: [
              'Local stores',
              'The government and central bank',
              'Each person individually',
              'Banks only',
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  '0.2': {
    title: 'Income',
    tabs: {
      showMe: {
        heading: 'What is Income?',
        paragraphs: [
          'Income is money you receive in exchange for work or services. The most common types are wages (paid by the hour), salary (a fixed amount per year), tips (extra money from customers), and allowance (regular money usually given to younger people). Each type works differently, but they all add up to what you actually earn.',
          'When you get a paycheck, the amount you actually take home is usually less than what you earned. That\'s because taxes and other deductions come out before you receive it. Your gross pay is the total before deductions, and your net pay is what you actually get to keep — the take-home pay you can spend or save.',
        ],
        diagrams: ['income_types', 'gross_net_diagram'],
        example: 'Example: If you work 10 hours at $12/hour, your gross income is $120. After 15% taxes ($18), your net income is $102.',
      },
      practice: {
        heading: 'Types of Income',
        instruction: 'Talk through different income scenarios with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Income Check',
        questions: [
          {
            question: 'You earn $15 per hour and work 8 hours. What is your gross income for the day?',
            options: ['$100', '$120', '$150', '$180'],
            correct: 1,
          },
          {
            question: 'What is the difference between a wage and a salary?',
            options: [
              'They are the same thing',
              'Wages are hourly, salaries are a fixed yearly amount',
              'Salaries are hourly, wages are yearly',
              'Wages are only for kids',
            ],
            correct: 1,
          },
          {
            question: 'A waiter earns $50 in tips. Is this considered income?',
            options: ['No, tips are gifts', 'Yes, tips are income', 'Only if it\'s over $100', 'Only on weekends'],
            correct: 1,
          },
          {
            question: 'You make $20/hour and work 40 hours. What is your weekly gross income?',
            options: ['$600', '$700', '$800', '$900'],
            correct: 2,
          },
          {
            question: 'Which of the following is NOT typically a source of income?',
            options: ['Wages', 'Salary', 'Tips', 'Spending money'],
            correct: 3,
          },
        ],
      },
    },
  },
  '0.3': {
    title: 'Taxes',
    tabs: {
      showMe: {
        heading: 'What are Taxes?',
        paragraphs: [
          'Taxes are money the government collects from people and businesses to pay for things everyone uses. Schools, roads, hospitals, public parks, fire departments, and police all rely on tax money to keep running. Without taxes, none of these public services would exist.',
          'When you earn money from a job, the government takes a portion as tax before you ever see your paycheck. This is called a deduction. The amount you earn before taxes is your gross pay, and what you actually take home is your net pay. Different earnings get taxed at different rates, which is why your paycheck is always less than the total you worked for.',
        ],
        diagrams: ['taxes_uses', 'tax_flow'],
        example: 'Example: If you earn $100 and your tax rate is 10%, you pay $10 in taxes and keep $90. The $90 is your net pay.',
      },
      practice: {
        heading: 'Understanding Taxes',
        instruction: 'Work through tax scenarios with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Taxes Check',
        questions: [
          {
            question: 'You earn $200 and your tax rate is 15%. How much do you take home after taxes?',
            options: ['$200', '$185', '$170', '$150'],
            correct: 2,
          },
          {
            question: 'What is the difference between gross pay and net pay?',
            options: [
              'They\'re the same',
              'Gross is before taxes, net is after taxes',
              'Net is before taxes, gross is after taxes',
              'Gross is yearly, net is monthly',
            ],
            correct: 1,
          },
          {
            question: 'What do taxes typically pay for?',
            options: [
              'Only military spending',
              'Only the President\'s salary',
              'Public services like schools, roads, and hospitals',
              'Private businesses',
            ],
            correct: 2,
          },
          {
            question: 'You earn $1,000 and your tax rate is 20%. How much tax do you pay?',
            options: ['$100', '$200', '$300', '$500'],
            correct: 1,
          },
          {
            question: 'When are taxes usually deducted from your paycheck?',
            options: [
              'After you receive your paycheck',
              'Before you receive your paycheck',
              'Only at the end of the year',
              'Never',
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  '1.1': {
    title: 'Needs vs. Wants',
    tabs: {
      showMe: {
        heading: 'Understanding Needs vs. Wants',
        paragraphs: [
          'A need is something essential for your survival and well-being — like rent, food, water, electricity, and medicine. Without these, you can\'t live safely. A want is something nice to have but not essential — like video games, eating out, designer shoes, or movie tickets. You can live without wants, even though they make life more enjoyable.',
          'When money is limited, needs always come first. Pay your rent before you buy a new game. Buy groceries before you go out to a restaurant. Once your needs are covered, whatever money is left over can go toward wants or savings. This priority system is the foundation of smart money management.',
        ],
        diagrams: ['needs_wants', 'priority_pyramid'],
        example: 'Example: You have $50 left. Your phone bill is $40 due today. A movie outing costs $15. The phone bill is a need — pay it first.',
      },
      practice: {
        heading: 'Priority Sort',
        instruction: 'Talk through needs and wants scenarios with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Scenario Assessment',
        questions: [
          {
            question: 'You have $50 left this week. Your phone bill is $40 and is due today. A friend invites you to a movie that costs $15. What should you do?',
            options: [
              'Pay the phone bill and skip the movie',
              'Go to the movie and pay the phone bill late',
              'Split the $50 between both',
              'Ask a friend to cover the movie',
            ],
            correct: 0,
          },
          {
            question: 'Which of these is a NEED?',
            options: ['Latest video game', 'Rent', 'Designer shoes', 'Concert tickets'],
            correct: 1,
          },
          {
            question: 'Which of these is a WANT?',
            options: ['Groceries', 'Electric bill', 'New phone case', 'Medicine'],
            correct: 2,
          },
          {
            question: 'When money is tight, what should you pay first?',
            options: ['Wants', 'Whatever is most fun', 'Needs', 'The cheapest thing'],
            correct: 2,
          },
          {
            question: 'You have $100. Rent ($80) and a new game ($60) are both due. Can you afford both?',
            options: ['Yes', 'No, only the rent', 'No, only the game', 'Yes, with $40 left over'],
            correct: 1,
          },
        ],
      },
    },
  },
  '1.2': {
    title: 'The 4 Step Budgeting Routine',
    tabs: {
      showMe: {
        heading: 'How to Build a Monthly Budget',
        paragraphs: [
          'A budget is a plan for how you\'ll spend and save your money each month. Building one takes four simple steps: First, list all your sources of income. Second, sort all your bills by how often you pay them — monthly, yearly, or every few months. Third, convert everything to a monthly amount so they\'re all on the same time scale.',
          'Finally, subtract your total monthly bills from your monthly income. The number left over is what you have to spend on wants or save for the future. If the number is negative, your bills are more than your income, and you need to cut back. A budget gives you control — you decide where your money goes instead of wondering where it went.',
        ],
        diagrams: ['budget_steps', 'budget_breakdown'],
        example: 'Example: Income $2,000. Fixed bills: Rent $700, Utilities $150, Phone $50, Groceries $200 = $1,100. Remaining: $900.',
      },
      practice: {
        heading: 'Budget Builder',
        instruction: 'Work through building a budget with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Sinking Fund Calculation',
        questions: [
          {
            question: 'You have a yearly car insurance bill of $600. How much should you set aside each month so you are ready when it is due?',
            options: ['$600', '$100', '$50', '$200'],
            correct: 2,
          },
          {
            question: 'What is the FIRST step in building a budget?',
            options: [
              'Pay all your bills',
              'List all sources of income',
              'Buy something fun',
              'Open a savings account',
            ],
            correct: 1,
          },
          {
            question: 'Income $2,000. Bills total $1,500. How much do you have left?',
            options: ['$200', '$300', '$500', '$800'],
            correct: 2,
          },
          {
            question: 'A bill is paid every 3 months and costs $90. How much per month should you save?',
            options: ['$10', '$30', '$45', '$90'],
            correct: 1,
          },
          {
            question: 'Why is it useful to convert all bills to a monthly amount?',
            options: [
              'It looks nicer on paper',
              'So you can plan and save evenly each month',
              'The bank requires it',
              'It makes bills smaller',
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  '1.3': {
    title: 'Recording Transactions in a Register',
    tabs: {
      showMe: {
        heading: 'How to Use a Transaction Register',
        paragraphs: [
          'A transaction register is a simple table that tracks every dollar going in and out of your account. Each row records one transaction — the date, what it was for, the amount, and your new balance after it. Deposits add to your balance. Withdrawals subtract from it. Doing this every time keeps you in control of your money.',
          'There\'s an important difference between what your bank shows and what you actually have available. If you wrote a check that hasn\'t cleared yet, the bank still shows the old balance — but in reality you have less. Your true available balance is your bank balance minus any pending checks or charges. Always go by your true available balance before spending.',
        ],
        diagrams: ['register_table', 'available_balance'],
        example: 'Example: Starting balance $500. Write check for $120 rent. New balance: $500 - $120 = $380.',
      },
      practice: {
        heading: 'Record Mock Transactions',
        instruction: 'Practice recording transactions with your AI tutor.',
        items: ['Check #101: $120 to Landlord', 'Check #102: $45 to Electric Company', 'Check #103: $30 to Grocery Store'],
      },
      assess: {
        heading: 'Available Balance',
        questions: [
          {
            question: 'Your register shows a balance of $300. You wrote a check for $80 that has not cleared yet. What is your true available balance?',
            options: ['$300', '$380', '$220', '$80'],
            correct: 2,
          },
          {
            question: 'Starting balance: $500. You deposit $200. What is your new balance?',
            options: ['$300', '$500', '$700', '$1,000'],
            correct: 2,
          },
          {
            question: 'Starting balance: $400. You write a check for $150. What is your new balance?',
            options: ['$150', '$250', '$400', '$550'],
            correct: 1,
          },
          {
            question: 'What does a transaction register track?',
            options: [
              'Only deposits',
              'Only withdrawals',
              'Every deposit and withdrawal',
              'Only checks',
            ],
            correct: 2,
          },
          {
            question: 'You have $600. You write checks for $100 and $200. What is your new balance?',
            options: ['$200', '$300', '$400', '$500'],
            correct: 1,
          },
        ],
      },
    },
  },
  '2.1': {
    title: 'Endorsing & Depositing Checks',
    tabs: {
      showMe: {
        heading: 'How to Endorse a Check',
        paragraphs: [
          'When someone gives you a check, you can\'t just deposit it as-is — you have to endorse it first. Endorsing simply means signing your name on the back to authorize the deposit. Three steps: flip the check over, find the line that says "endorse here," and sign your name exactly as it appears on the front of the check.',
          'Once endorsed, you have two ways to deposit it. The first is going to your bank in person and handing it to a teller. The second is mobile deposit — open your bank\'s app, take a photo of the front and back of the check, and submit. Mobile deposit is faster and you can do it from anywhere.',
        ],
        diagrams: ['check_endorsement', 'deposit_options'],
        example: 'Remember: Flip → Find the line → Sign.',
      },
      practice: {
        heading: 'Virtual Check Signing',
        instruction: 'Walk through endorsing a check with your AI tutor.',
        items: ['Flip the check over', 'Find the endorsement line', 'Sign your name'],
      },
      assess: {
        heading: 'Check Deposit Assessment',
        questions: [
          {
            question: 'Where do you sign to endorse a check for deposit?',
            options: [
              'On the front where it says "Pay to the order of"',
              'On the back on the endorsement line',
              'Anywhere on the front',
              'On the memo line',
            ],
            correct: 1,
          },
          {
            question: 'What does "endorsing" a check mean?',
            options: [
              'Throwing it away',
              'Signing the back to deposit it',
              'Giving it to a friend',
              'Reading it carefully',
            ],
            correct: 1,
          },
          {
            question: 'What is the FIRST step in endorsing a check?',
            options: ['Sign your name', 'Flip the check over', 'Take it to the bank', 'Write the amount'],
            correct: 1,
          },
          {
            question: 'How should you sign your name on a check endorsement?',
            options: [
              'A quick scribble',
              'Exactly as it appears on the front',
              'Just your initials',
              'In all capital letters',
            ],
            correct: 1,
          },
          {
            question: 'After endorsing a check, what can you do with it?',
            options: [
              'Throw it away',
              'Deposit it at the bank or by mobile app',
              'Keep it forever',
              'Mail it to anyone',
            ],
            correct: 1,
          },
        ],
      },
    },
  },
  '2.2': {
    title: 'Managing Online Banking & Balances',
    tabs: {
      showMe: {
        heading: 'Navigating Online Banking',
        paragraphs: [
          'Online banking lets you manage your money from your phone or computer. To check your balance, log into your bank\'s app or website, navigate to Account Summary, and find the available balance for each account. You can also see recent transactions, transfer money between accounts, and pay bills — all without going to a physical bank.',
          'Always check your available balance before making a purchase. If your balance is greater than the cost of what you want, you can afford it. If the cost is more than your balance, you should wait or save up — buying anyway can cause overdrafts and fees. This simple habit of checking before buying is one of the most important parts of managing money well.',
        ],
        diagrams: ['online_banking', 'can_afford'],
        example: 'Example: Your available balance is $120. You want to buy something for $40. Since $120 > $40, you have enough.',
      },
      practice: {
        heading: 'Balance Check Simulator',
        instruction: 'Practice checking balances with your AI tutor.',
        items: [],
      },
      assess: {
        heading: 'Balance Comparison',
        questions: [
          {
            question: 'Account A has $85. Account B has $120. You need to transfer $100. Which account has enough for the transfer?',
            options: ['Account A', 'Account B', 'Both accounts', 'Neither account'],
            correct: 1,
          },
          {
            question: 'Why should you check your balance before making a purchase?',
            options: [
              'For fun',
              'To make sure you have enough money',
              'The bank requires it',
              'You don\'t need to',
            ],
            correct: 1,
          },
          {
            question: 'You have $200. You want to buy a $250 item. What should you do?',
            options: [
              'Buy it anyway',
              'Wait until you have enough money',
              'Use someone else\'s money',
              'Ignore the price',
            ],
            correct: 1,
          },
          {
            question: 'Where do you find your account balance in online banking?',
            options: ['Profile page', 'Help page', 'Account Summary', 'Login page'],
            correct: 2,
          },
          {
            question: 'Your available balance is $50. You want to buy a $30 shirt. Can you afford it?',
            options: ['No', 'Yes', 'Only if it\'s on sale', 'Only with a credit card'],
            correct: 1,
          },
        ],
      },
    },
  },
};

const TABS = ['showMe', 'practice', 'assess'];
const TAB_LABELS = { showMe: 'Show Me', practice: 'Practice', assess: 'Assess' };
const PASS_THRESHOLD = 0.8;

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('showMe');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [tutorMessages, setTutorMessages] = useState([]);

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
  const isAssess = activeTab === 'assess';
  const questions = isAssess ? tab.questions : null;
  const currentQuestion = isAssess ? questions[questionIndex] : null;
  const isLastQuestion = isAssess && questionIndex === questions.length - 1;
  const allDone = isAssess && answers.length === questions.length;
  const correctCount = answers.filter(a => a).length;
  const percent = questions ? correctCount / questions.length : 0;
  const passed = percent >= PASS_THRESHOLD;

  const handleSubmit = async () => {
    if (selected === null) return;
    const isCorrect = selected === currentQuestion.correct;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setSubmitted(true);
    if (isCorrect) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    }
    
    if (newAnswers.length === questions.length) {
      const finalCount = newAnswers.filter(a => a).length;
      try {
        await saveProgress(token, id, finalCount);
      } catch (err) {
        console.error('Failed to save progress', err);
      }
      if (finalCount / questions.length >= PASS_THRESHOLD) {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
    }
  };

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      const finalCount = [...answers].filter(a => a).length;
      const finalPercent = finalCount / questions.length;
      const finalPassed = finalPercent >= PASS_THRESHOLD;
      try {
        await saveProgress(token, id, finalCount);
      } catch (err) {
        console.error('Failed to save progress', err);
      }
      if (finalPassed) {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
      setSubmitted(true);
    } else {
      setQuestionIndex(questionIndex + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  const handleNext = () => {
    const currentIndex = TABS.indexOf(activeTab);
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1]);
      setSelected(null);
      setSubmitted(false);
      setQuestionIndex(0);
      setAnswers([]);
    } else {
      navigate('/dashboard');
    }
  };

  const handleRetry = () => {
    setQuestionIndex(0);
    setSelected(null);
    setSubmitted(false);
    setAnswers([]);
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
                onClick={() => {
                  setActiveTab(t);
                  setSelected(null);
                  setSubmitted(false);
                  setQuestionIndex(0);
                  setAnswers([]);
                }}
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
              {tab.paragraphs ? (
                tab.paragraphs.map((para, i) => (
                  <div key={i}>
                    <p>{para}</p>
                    {tab.diagrams && tab.diagrams[i] && (
                      <img
                        src={new URL(`../assets/images/${tab.diagrams[i]}.svg`, import.meta.url).href}
                        alt=""
                        className="lesson-diagram"
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>{tab.content}</p>
              )}
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
              {id === '0.1' && <MoneyDragDrop />}
              {id === '0.2' && <IncomeCalculator />}
              {id === '0.3' && <TaxCalculator />}
              {id === '1.1' && <NeedsWantsDrag />}
              {id === '1.2' && <BudgetBuilder />}
              {id === '1.3' && <RegisterPractice />}
              {id === '2.1' && <CheckSteps />}
              {id === '2.2' && <BalanceCheck />}
              <div className="practice-footer">
                <button className="next-btn" onClick={handleNext}>Next: Assess →</button>
              </div>
              <TutorChat
                lessonId={id}
                lessonTitle={lesson.title}
                lessonContext={tab.instruction}
                messages={tutorMessages}
                setMessages={setTutorMessages}
              />
            </div>
          )}

          {activeTab === 'assess' && !allDone && (
            <div className="assess">
              <div className="assess-progress">
                Question {questionIndex + 1} of {questions.length}
              </div>
              <h2>{tab.heading}</h2>
              <p className="assess-question">{currentQuestion.question}</p>
              <div className="options">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`option-btn
                      ${selected === i ? 'selected' : ''}
                      ${submitted && i === currentQuestion.correct ? 'correct' : ''}
                      ${submitted && selected === i && i !== currentQuestion.correct ? 'incorrect' : ''}
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
                  {selected === currentQuestion.correct
                    ? <p className="feedback-correct">✅ Correct!</p>
                    : <p className="feedback-incorrect">❌ The correct answer is: {currentQuestion.options[currentQuestion.correct]}</p>
                  }
                  <button className="next-btn" onClick={handleNextQuestion}>
                    {isLastQuestion ? 'Finish Quiz →' : 'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assess' && allDone && (
            <div className="assess-results">
              <h2>{passed ? '🎉 Module Passed!' : 'Almost There!'}</h2>
              <div className="score-circle">
                <span className="score-percent">{Math.round(percent * 100)}%</span>
                <span className="score-detail">{correctCount} / {questions.length} correct</span>
              </div>
              {passed ? (
                <p className="result-message pass">Great job! You scored {Math.round(percent * 100)}% — you've mastered this module.</p>
              ) : (
                <p className="result-message fail">You need 80% to pass. Try again or review the Show Me section.</p>
              )}
              <div className="result-buttons">
                {!passed && <button className="next-btn" onClick={handleRetry}>Try Again</button>}
                <button className="next-btn" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </>
  );
}