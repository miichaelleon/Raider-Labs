import './Footer.css';
import eduLogo from '../assets/images/edu-logo.png';
import engLogo from '../assets/images/eng-logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logos">
        <img src={eduLogo} alt="College of Education" className="footer-logo" />
      </div>
      <p className="footer-credit">
        Designed and developed by Team 25 · Texas Tech University
      </p>
    </footer>
  );
}