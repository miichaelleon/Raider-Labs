import { Link } from 'react-router-dom';
import './Footer.css';
import eduLogo from '../assets/images/edu-logo.png';
import engLogo from '../assets/images/eng-logo.png';


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logos">
        <a href="https://www.depts.ttu.edu/coe/">
          <img src={engLogo} alt="College of Engineering" className="footer-logo" />
        </a>
        <a href="https://www.depts.ttu.edu/education/">
          <img src={eduLogo} alt="College of Education" className="footer-logo" />
        </a>      
      </div>
      <div className="hero-credit">
        <p className="hero-credit-text">
          Developed by the students of Group 25 at Texas Tech University under the guidance of{' '}
          <strong>Dr. Fethi Inan</strong>, Professor of Instructional Technology.{' '}
          <Link to="/about" className="hero-credit-link">Meet the team</Link>
        </p>
      </div>
    </footer>
  );
}