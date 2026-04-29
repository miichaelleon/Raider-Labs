import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Dashboard.css';

import moneyIcon from '../assets/icons/money.svg';
import walletIcon from '../assets/icons/wallet.svg';
import calculatorIcon from '../assets/icons/calculator.svg';
import checklistIcon from '../assets/icons/checklist.svg';
import budgetIcon from '../assets/icons/budget.svg';
import ledgerIcon from '../assets/icons/ledger.svg';
import checkIcon from '../assets/icons/check.svg';
import bankingIcon from '../assets/icons/banking.svg';

const icons = {
  '0.1': moneyIcon,
  '0.2': walletIcon,
  '0.3': calculatorIcon,
  '1.1': checklistIcon,
  '1.2': budgetIcon,
  '1.3': ledgerIcon,
  '2.1': checkIcon,
  '2.2': bankingIcon,
};

const zones = [
  {
    id: 'basics',
    label: 'Basics',
    subtitle: 'Build your financial foundation',
    modules: [
      { id: '0.1', title: 'Money' },
      { id: '0.2', title: 'Income' },
      { id: '0.3', title: 'Taxes' },
    ],
  },
  {
    id: 'thinking',
    label: 'Zone A',
    subtitle: 'Strategic Planning — Thinking',
    modules: [
      { id: '1.1', title: 'Needs vs. Wants' },
      { id: '1.2', title: 'The 4 Step Budgeting Routine' },
      { id: '1.3', title: 'Recording Transactions in a Register' },
    ],
  },
  {
    id: 'doing',
    label: 'Zone B',
    subtitle: 'Tactical Execution — Doing',
    modules: [
      { id: '2.1', title: 'Endorsing & Depositing Checks' },
      { id: '2.2', title: 'Managing Online Banking & Balances' },
    ],
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="dashboard-page">

        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome, {user?.first_name}!</h1>
          <p className="dashboard-sub">Choose a topic to get started.</p>
        </div>

        {zones.map(zone => (
          <div key={zone.id} className="zone-section">
            <div className="zone-section-header">
              <div>
                <h2 className="zone-section-title">{zone.label}</h2>
                <p className="zone-section-subtitle">{zone.subtitle}</p>
              </div>
            </div>
            <div className="zone-section-tiles">
              {zone.modules.map(mod => (
            <div className="tile-wrapper" key={mod.id}>
            <div className="task-tile" onClick={() => navigate(`/lesson/${mod.id}`)}>
              {icons[mod.id] && <img src={icons[mod.id]} alt={mod.title} className="tile-icon" />}
            </div>
              <p className="tile-title">{mod.title}</p>
            </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </>
  );
}