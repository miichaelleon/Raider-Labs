import { useState } from 'react';
import userImage from '../assets/images/redraider.png';
import backdrop from '../assets/images/backdrop.jpg';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import './AboutUs.css';

const teamMembers = [
  {
    name: 'Michael Leon',
    role: 'Full-Stack Developer',
    contribution:
      'Contributed to system architecture design, backend integration, and development of core platform features.',
    image: userImage,
    github: 'https://github.com/miichaelleon',
    description:
      'Add a personal biography, accomplishments, interests, and technical background here.',
  },
  {
    name: 'Austin Perez',
    role: 'Frontend & Systems Developer',
    contribution:
      'Worked on frontend development, UI structure, and system flow implementation including lesson navigation and interaction design.',
    image: userImage,
    github: 'https://github.com/AJPerez24',
    description:
      'Add a personal biography, accomplishments, interests, and technical background here.',
  },
  {
    name: 'Gerardo Jimenez',
    role: 'Backend Developer',
    contribution:
      'Focused on backend services, API development, and database structure for tracking user progress and system data.',
    image: userImage,
    github: 'https://github.com/your-github',
    description:
      'Add a personal biography, accomplishments, interests, and technical background here.',
  },
  {
    name: 'Emmanuel Medina',
    role: 'AI Integration Specialist',
    contribution:
      'Led integration of the AI chatbot system and adaptive learning features to support personalized education.',
    image: userImage,
    github: 'https://github.com/your-github',
    description:
      'Add a personal biography, accomplishments, interests, and technical background here.',
  },
  {
    name: 'Paul Sawyers',
    role: 'Project Advisor',
    contribution:
      'Provided guidance on system design, academic direction, and overall project development.',
    image: userImage,
    github: 'https://github.com/your-github',
    description:
      'Add a personal biography, accomplishments, interests, and technical background here.',
  },
];

const sponsors = [
  {
    name: 'Dr. Fethi Inan',
    role: 'Project Sponsor & Faculty Advisor',
    image: userImage,
    link: 'https://www.depts.ttu.edu/education/our-people/Faculty/fethi_inan.php',
    description:
      'Add Dr. Inan\'s biography, project contributions, and academic background here.',
  },
  {
    name: 'Shehnaz Mohammed',
    role: 'Graduate Student Sponsor',
    image: userImage,
    link: '#',
    description:
      'Add Shehnaz Mohammed\'s biography, research interests, and project contributions here.',
  },
];

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(null);
  const { token } = useAuth();

  const hasValidGithub = (member) =>
    member.github && member.github !== 'https://github.com/your-github';
  const hasValidLink = (member) => member.link && member.link !== '#';

  return (
    <div className="about-page">

      {/* ── Navbar ── */}
      <Navbar isLoggedIn={!!token} />

      {/* ── Backdrop hero ── */}
      <div className="about-backdrop" style={{ backgroundImage: `url(${backdrop})` }}>
        <div className="about-backdrop-overlay">
          <span className="about-badge">Our Team</span>
          <h1 className="about-backdrop-title">About Us</h1>
          <p className="about-backdrop-sub">
            We are a collaborative team of developers, designers, and researchers
            focused on creating an AI-powered financial literacy platform for students
            with Autism Spectrum Disorder (ASD).
          </p>
        </div>
      </div>

      <div className="about-container">

        <section>
          <div className="section-header">
            <h2 className="section-title">Development Team</h2>
            <p className="section-description">
              Meet the students and advisors responsible for the design, development,
              and implementation of the platform.
            </p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="member-card"
                onClick={() => setSelectedMember(member)}
              >
                <img src={member.image} alt={member.name} className="member-image" />
                <h2 className="member-name">{member.name}</h2>
                <p className="member-role">{member.role}</p>
                <p className="member-description">{member.contribution}</p>
                <span className="learn-more">Learn More →</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-header">
            <span className="about-badge">Project Sponsors</span>
            <h2 className="section-title">Sponsors & Advisors</h2>
            <p className="section-description">
              This project is supported by faculty and graduate advisors whose expertise
              and mentorship help guide the educational and technical direction of the platform.
            </p>
          </div>

          <div className="sponsor-grid">
            {sponsors.map((sponsor, index) => (
              <div
                key={index}
                className="member-card"
                onClick={() => setSelectedMember(sponsor)}
              >
                <img src={sponsor.image} alt={sponsor.name} className="member-image" />
                <h2 className="member-name">{sponsor.name}</h2>
                <p className="member-role sponsor-role">{sponsor.role}</p>
                <p className="member-description">{sponsor.description}</p>
                <span className="learn-more">View Details →</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMember(null)}>
              ×
            </button>
            <div className="modal-layout">
              <img
                src={selectedMember.image}
                alt={selectedMember.name}
                className="modal-image"
              />
              <div className="modal-body">
                <h2 className="modal-name">{selectedMember.name}</h2>
                <p className="modal-role">{selectedMember.role}</p>
                <p className="modal-text">{selectedMember.description}</p>
                <div className="modal-button-group">
                  {hasValidGithub(selectedMember) && (
                    <a
                      href={selectedMember.github}
                      target="_blank"
                      rel="noreferrer"
                      className="modal-button primary"
                    >
                      View GitHub
                    </a>
                  )}
                  {hasValidLink(selectedMember) && (
                    <a
                      href={selectedMember.link}
                      target="_blank"
                      rel="noreferrer"
                      className="modal-button secondary"
                    >
                      Visit Profile
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}