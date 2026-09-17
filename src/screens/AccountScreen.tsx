/* ============================================================
   My Account — reference layout:
   navy header (User · phone · member-since · stats trio) ·
   wallet card (balance + expiry) · language chips · menu groups
   (My details / Payments / More / Preferences)
   ============================================================ */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { TextField } from '../components/ui/TextField';
import { Icon, type IconName } from '../components/icons/Icon';
import { BRAND, BRAND_COPY } from '../branding/brand';
import { useAuth, updateProfile } from '../state/authStore';
import { showToast } from '../state/toastStore';
import { PassportProgressCard } from '../components/passport/PassportProgressCard';
import bannerImg from '../assets/banner.png';
import './AccountScreen.css';

export function AccountScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const session = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [passportOpen, setPassportOpen] = useState(
    () => searchParams.get('passport') === 'true'
  );
  const [resumeOpen, setResumeOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [mentorOpen, setMentorOpen] = useState(false);
  const [mentorDoubt, setMentorDoubt] = useState('');
  const displayName = session?.name && session.name !== 'User' ? session.name : 'Krishna';
  const [name, setName] = useState(displayName);
  const [email, setEmail] = useState(session?.email ?? 'krishna@aers.in');
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('passport') === 'true') {
      setPassportOpen(true);
    }
  }, [searchParams]);

  const handleClosePassport = () => {
    setPassportOpen(false);
    if (searchParams.get('passport') === 'true') {
      const next = new URLSearchParams(searchParams);
      next.delete('passport');
      setSearchParams(next, { replace: true });
    }
  };

  if (!session) {
    return (
      <div className="account account--guest">
        <div className="account__guest">
          <div className="account__guest-icon">
            <Icon name="user" size={40} strokeWidth={1.5} />
          </div>
          <h2>Login to continue</h2>
          <p>Access your trips, saved routes and faster checkout with a {BRAND.APP_NAME} account.</p>
          <Button block size="lg" onClick={() => navigate('/account/login')}>
            Login / Sign up
          </Button>
          <p className="account__guest-note">{BRAND_COPY.demoNotice}</p>
        </div>
      </div>
    );
  }

  function saveProfile() {
    const ne = name.trim().length < 3 ? 'Name is too short' : null;
    const ee = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? 'Enter a valid email' : null;
    setNameError(ne);
    setEmailError(ee);
    if (ne || ee) return;
    updateProfile({ name: name.trim(), email: email.trim() });
    setEditOpen(false);
    showToast('Profile updated', 'success');
  }

  const memberSince = `Member since ${new Date().toLocaleString('en', { month: 'short' })} ${new Date().getFullYear()}`;

  return (
    <div className="account">
      {/* Account banner header */}
      <header
        className="account__header"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.55) 100%), url(${bannerImg})`,
        }}
      >
        <div className="account__id">
          <h1>{displayName}</h1>
          <span>+91 {session.phone}</span>
          <small>{memberSince}</small>
        </div>
        <button className="account__edit" onClick={() => setEditOpen(true)} aria-label="Edit profile">
          <Icon name="edit" size={16} />
        </button>
      </header>
      <div className="account__stats">
        <div>
          <strong>78%</strong>
          <span>Readiness</span>
        </div>
        <div>
          <strong>12 verified</strong>
          <span>Skills</span>
        </div>
        <div>
          <strong>18 submitted</strong>
          <span>Evidence</span>
        </div>
      </div>

      <div className="account__scroll">
        {/* Passport card (horizontal 3-part composition: Left Profile · Center/Right Info · Right Decoration) */}
        <section
          className="account__passport"
          aria-label="Passport: Career Readiness"
          onClick={() => setPassportOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setPassportOpen(true);
            }
          }}
        >
          {/* RIGHT — Decoration: Subtle background credential/passport illustration */}
          <svg className="account__passport-bg-watermark" viewBox="0 0 110 130" fill="none" aria-hidden="true">
            <circle cx="75" cy="65" r="42" fill="#3b82f6" fillOpacity="0.03" />
            <g transform="rotate(8 68 62)">
              <rect x="28" y="10" width="70" height="96" rx="12" fill="#ffffff" fillOpacity="0.9" />
              <rect x="28" y="10" width="70" height="96" rx="12" fill="#3b82f6" fillOpacity="0.06" stroke="#3b82f6" strokeOpacity="0.18" strokeWidth="2.2" />
              {/* Graduation cap */}
              <path d="M63 32 L79 40 L63 48 L47 40 Z" fill="#3b82f6" fillOpacity="0.3" />
              <path d="M53 45 V52 C53 56.5 73 56.5 73 52 V45" fill="#3b82f6" fillOpacity="0.3" />
              <path d="M78 42 V53" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1.8" strokeLinecap="round" />
              {/* Certificate content lines */}
              <rect x="42" y="62" width="42" height="4.5" rx="2.25" fill="#3b82f6" fillOpacity="0.22" />
              <rect x="42" y="71" width="42" height="4.5" rx="2.25" fill="#3b82f6" fillOpacity="0.22" />
            </g>
            {/* Sparkles / Diamonds */}
            <path d="M102 24 C102 26.5 105 29 105 29 C105 29 102 31.5 102 34 C102 31.5 99 29 99 29 C99 29 102 26.5 102 24 Z" fill="#3b82f6" fillOpacity="0.25" />
            <path d="M104 70 C104 72 106.5 74 106.5 74 C106.5 74 104 76 104 78 C104 76 101.5 74 101.5 74 C101.5 74 104 72 104 70 Z" fill="#3b82f6" fillOpacity="0.25" />
          </svg>

          {/* LEFT — Profile: Circular photo with prominent 78% smooth gradient blue readiness ring */}
          <div className="account__passport-avatar-wrap" title="Krishna · 78% Readiness">
            <svg className="account__passport-ring-svg" viewBox="0 0 88 88">
              <defs>
                <linearGradient id="passportBlueGrad" x1="75%" y1="0%" x2="0%" y2="50%">
                  <stop offset="0%" stopColor="#0052ff" />
                  <stop offset="35%" stopColor="#0066ff" />
                  <stop offset="70%" stopColor="#00a8ff" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              {/* 22% Unfilled soft light-blue track */}
              <circle
                cx="44"
                cy="44"
                r="38"
                fill="none"
                stroke="#dbeafe"
                strokeWidth="4.5"
              />
              {/* 78% Filled smooth gradient blue arc (Deep AERS blue → Bright royal blue → Light blue) */}
              <circle
                cx="44"
                cy="44"
                r="38"
                fill="none"
                stroke="url(#passportBlueGrad)"
                strokeWidth="4.5"
                strokeDasharray="238.76"
                strokeDashoffset="52.53"
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
              />
            </svg>
            <img
              src="/students/student1.jpg"
              alt="Krishna Profile"
              className="account__passport-avatar-img"
            />
          </div>

          {/* CENTER/RIGHT — Passport Information */}
          <div className="account__passport-content">
            <div className="account__passport-badge">
              <Icon name="shield" size={16} strokeWidth={2.2} />
              <span className="account__passport-title">Passport</span>
              <span className="account__passport-pill">6 Areas</span>
            </div>

            <div className="account__passport-stats">
              <strong className="account__passport-amt">78%</strong>
              <span className="account__passport-label">Readiness across 6 fields</span>
            </div>

            <div className="account__passport-action">
              <span>View readiness in all 6 areas →</span>
            </div>
          </div>
        </section>

        {/* Career & Readiness Hub */}
        <section className="account__group" aria-label="Career & Readiness">
          <h2 className="account__grouptitle">Career & Readiness</h2>
          {/* 1. Personal information (on top) */}
          <MenuRow
            icon="user"
            label="Personal information"
            hint={`${displayName} · +91 ${session.phone}`}
            onClick={() => setEditOpen(true)}
          />
          {/* 2. Resume builder */}
          <MenuRow
            customIcon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            }
            label="Resume builder"
            hint="Score 90/100 · ATS optimized"
            badge="ATS 90%"
            badgeColor="green"
            onClick={() => setResumeOpen(true)}
          />
          {/* 3. Jobs */}
          <MenuRow
            customIcon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            }
            label="Jobs"
            hint="14 matching openings"
            badge="14 Active"
            badgeColor="blue"
            onClick={() => setJobsOpen(true)}
          />
          {/* 4. Certificate */}
          <MenuRow
            customIcon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            }
            label="Certificate"
            hint="Module 1 Career Clarity Verified"
            badge="Verified"
            badgeColor="purple"
            onClick={() => setCertOpen(true)}
          />
          {/* 5. Placement */}
          <MenuRow
            customIcon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            }
            label="Placement"
            hint="Readiness 78% · Tier-1 Eligible"
            badge="Eligible"
            badgeColor="amber"
            onClick={() => {
              showToast('Placement eligibility confirmed: 78% readiness meets Tier-1 campus drive criteria.', 'success');
              navigate('/journey');
            }}
          />
        </section>

        {/* Communication & Student Services */}
        <section className="account__group" aria-label="Communication & Tools">
          <h2 className="account__grouptitle">Communication & Tools</h2>
          {/* 6. Messages (messages are nothing but notifications) */}
          <MenuRow
            icon="bell"
            label="Messages"
            hint="Notifications & live updates"
            badge="3 New"
            badgeColor="blue"
            onClick={() => navigate('/notifications')}
          />
          {/* 7. Calendar */}
          <MenuRow
            icon="calendar"
            label="Calendar"
            hint="Lectures, mock tests & events"
            onClick={() => navigate('/trips')}
          />
          {/* 8. Ask questions to mentor */}
          <MenuRow
            customIcon={
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            }
            label="Ask questions to mentor"
            hint="Direct faculty doubt resolution"
            badge="Online"
            badgeColor="green"
            onClick={() => setMentorOpen(true)}
          />
          {/* 9. Settings */}
          <MenuRow
            icon="settings"
            label="Settings"
            hint="App & security preferences"
            onClick={() => navigate('/account/settings')}
          />
          {/* 10. Report issue */}
          <MenuRow
            icon="help"
            label="Report issue"
            hint="Student helpdesk & support"
            onClick={() => navigate('/help')}
          />
          {/* Clear local data */}
          <MenuRow
            icon="trash"
            label="Clear local data"
            danger
            onClick={() => {
              localStorage.clear();
              showToast('Local data cleared', 'success');
              setTimeout(() => window.location.reload(), 600);
            }}
          />
        </section>

        <p className="account__about">{BRAND_COPY.aboutText}</p>
      </div>

      {/* Edit sheet */}
      <Sheet
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit profile"
        footer={
          <Button block onClick={saveProfile}>
            Save changes
          </Button>
        }
      >
        <div className="account__editform">
          <TextField
            label="Full name"
            value={name}
            error={nameError}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            icon="mail"
            value={email}
            error={emailError}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField label="Mobile number" prefix="+91" value={session.phone} disabled hint="Contact support to change your number" />
        </div>
      </Sheet>

      {/* Career Readiness Passport Sheet */}
      <Sheet
        open={passportOpen}
        onClose={handleClosePassport}
        title="Career Readiness Passport"
        footer={
          <div className="account__sheet-footer-actions">
            <Button
              variant="secondary"
              block
              onClick={handleClosePassport}
            >
              Close
            </Button>
            <Button
              variant="primary"
              block
              onClick={() => {
                handleClosePassport();
                navigate('/journey');
              }}
            >
              Improve Scores in Journey →
            </Button>
          </div>
        }
      >
        <div className="account__passport-sheet-content">
          <PassportProgressCard
            onActionClick={() => {
              handleClosePassport();
              navigate('/journey');
            }}
          />
        </div>
      </Sheet>

      {/* 1. Resume Builder Sheet */}
      <Sheet
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
        title="Resume Builder"
        footer={
          <div className="account__sheet-footer-actions">
            <Button variant="secondary" block onClick={() => setResumeOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              block
              onClick={() => {
                showToast('ATS Resume PDF downloaded successfully', 'success');
                setResumeOpen(false);
              }}
            >
              Download PDF →
            </Button>
          </div>
        }
      >
        <div className="account__resume-modal">
          <div className="account__resume-score-card">
            <div className="account__resume-score-val">90<span>/100</span></div>
            <div className="account__resume-score-info">
              <strong>High ATS Compatibility</strong>
              <p>Your resume matches 94% of keywords in Target Career Roles.</p>
            </div>
          </div>
          <div className="account__resume-sections">
            <h4>Generated Sections</h4>
            <div className="account__resume-sec-item">
              <span>✓ Profile Summary (Career Clarity aligned)</span>
              <strong>Complete</strong>
            </div>
            <div className="account__resume-sec-item">
              <span>✓ Core Competencies (6/6 Verified)</span>
              <strong>Complete</strong>
            </div>
            <div className="account__resume-sec-item">
              <span>✓ Technical Skills & Frameworks</span>
              <strong>Complete</strong>
            </div>
            <div className="account__resume-sec-item">
              <span>✓ Education & Academic Credentials</span>
              <strong>Complete</strong>
            </div>
          </div>
        </div>
      </Sheet>

      {/* 2. Jobs Sheet */}
      <Sheet
        open={jobsOpen}
        onClose={() => setJobsOpen(false)}
        title="Jobs & Campus Openings"
        footer={
          <Button block variant="secondary" onClick={() => setJobsOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="account__jobs-list">
          <div className="account__job-card">
            <div className="account__job-header">
              <div>
                <h4>Associate Software Engineer</h4>
                <p>Infosys BPM · Bengaluru / Hybrid</p>
              </div>
              <span className="account__job-match">92% Match</span>
            </div>
            <div className="account__job-meta">
              <span>CTC: ₹4.5 – ₹6.5 LPA</span>
              <span>Deadline: 25 Sep</span>
            </div>
            <Button
              size="sm"
              variant="primary"
              block
              onClick={() => {
                showToast('Application submitted with AERS Passport Profile!', 'success');
                setJobsOpen(false);
              }}
            >
              1-Click Apply with Passport
            </Button>
          </div>

          <div className="account__job-card">
            <div className="account__job-header">
              <div>
                <h4>Business Technology Analyst</h4>
                <p>Deloitte India · Hyderabad</p>
              </div>
              <span className="account__job-match">88% Match</span>
            </div>
            <div className="account__job-meta">
              <span>CTC: ₹6.0 – ₹8.2 LPA</span>
              <span>Deadline: 30 Sep</span>
            </div>
            <Button
              size="sm"
              variant="primary"
              block
              onClick={() => {
                showToast('Application submitted with AERS Passport Profile!', 'success');
                setJobsOpen(false);
              }}
            >
              1-Click Apply with Passport
            </Button>
          </div>
        </div>
      </Sheet>

      {/* 3. Certificate Sheet */}
      <Sheet
        open={certOpen}
        onClose={() => setCertOpen(false)}
        title="Verified Certificate"
        footer={
          <div className="account__sheet-footer-actions">
            <Button variant="secondary" block onClick={() => setCertOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              block
              onClick={() => {
                showToast('Certificate PDF downloaded!', 'success');
                setCertOpen(false);
              }}
            >
              Download PDF →
            </Button>
          </div>
        }
      >
        <div className="account__cert-modal">
          <div className="account__cert-card">
            <div className="account__cert-seal">★ OFFICIAL VERIFIED CREDENTIAL ★</div>
            <h3>Certificate of Achievement</h3>
            <p className="account__cert-awarded">Awarded to</p>
            <h2 className="account__cert-name">{displayName}</h2>
            <p className="account__cert-desc">
              For successfully mastering all 4 levels of <strong>Module 1: Career Clarity and Self Discovery</strong>, demonstrating excellence in self-awareness, skill alignment, and SMART action planning.
            </p>
            <div className="account__cert-footer">
              <div>
                <small>ISSUED BY</small>
                <strong>AERS Academic Council</strong>
              </div>
              <div>
                <small>LEDGER ID</small>
                <code>AERS-CC-2026-9842</code>
              </div>
            </div>
          </div>
        </div>
      </Sheet>

      {/* 4. Ask Questions to Mentor Sheet */}
      <Sheet
        open={mentorOpen}
        onClose={() => setMentorOpen(false)}
        title="Ask Questions to Mentor"
        footer={
          <div className="account__sheet-footer-actions">
            <Button variant="secondary" block onClick={() => setMentorOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              block
              onClick={() => {
                if (!mentorDoubt.trim()) {
                  showToast('Please type your question or doubt first', 'error');
                  return;
                }
                showToast('Question sent to Prof. K. Venkatesh. You will receive an alert in Messages.', 'success');
                setMentorDoubt('');
                setMentorOpen(false);
              }}
            >
              Submit Question →
            </Button>
          </div>
        }
      >
        <div className="account__mentor-modal">
          <div className="account__mentor-info">
            <div className="account__mentor-avatar">KV</div>
            <div>
              <strong>Prof. K. Venkatesh</strong>
              <p>Dean of Placement & Industry Readiness · Online</p>
            </div>
          </div>
          <label className="account__mentor-label" htmlFor="mentor-doubt-textarea">
            Your Question or Doubt:
          </label>
          <textarea
            id="mentor-doubt-textarea"
            className="account__mentor-textarea"
            rows={4}
            placeholder="E.g., How should I frame my Strength-to-Career mapping for technical consulting interviews?"
            value={mentorDoubt}
            onChange={(e) => setMentorDoubt(e.target.value)}
          />
          <small className="account__mentor-note">
            Mentors usually respond within 2 to 4 hours. Response will appear in your <strong>Messages</strong> tab.
          </small>
        </div>
      </Sheet>
    </div>
  );
}

/* ------------------------------- Menu row ---------------------------------- */

function MenuRow({
  icon,
  customIcon,
  label,
  hint,
  badge,
  badgeColor,
  onClick,
  danger,
}: {
  icon?: IconName;
  customIcon?: React.ReactNode;
  label: string;
  hint?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'amber' | 'purple';
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button className={`menurow ${danger ? 'menurow--danger' : ''}`} onClick={onClick}>
      <span className="menurow__icon">
        {customIcon ? customIcon : icon ? <Icon name={icon} size={18} /> : null}
      </span>
      <span className="menurow__label">
        {label}
        {badge && (
          <sup className={`menurow__badge ${badgeColor ? `menurow__badge--${badgeColor}` : ''}`}>
            {badge}
          </sup>
        )}
      </span>
      {hint ? (
        <span className="menurow__hint">{hint}</span>
      ) : undefined}
      <Icon name="chevron-right" size={16} />
    </button>
  );
}
