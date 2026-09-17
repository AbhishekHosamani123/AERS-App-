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

        {/* Menu groups (reference: My details / Payments / More / Preferences) */}
        <section className="account__group" aria-label="My details">
          <h2 className="account__grouptitle">My details</h2>
          <MenuRow icon="ticket" label="Bookings" onClick={() => navigate('/trips')} />
          <MenuRow icon="offer" label="Scratch Card" onClick={() => showToast('Scratch cards coming soon', 'info')} />
          <MenuRow icon="user" label="Personal information" onClick={() => setEditOpen(true)} />
          <MenuRow icon="user" label="Passengers" onClick={() => showToast('Saved passengers coming soon', 'info')} />
          <MenuRow
            icon="route"
            label="Irctc Details"
            hint="Create IRCTC ID & get ₹80 in wallet"
            onClick={() => showToast('IRCTC onboarding coming soon', 'info')}
          />
        </section>

        <section className="account__group" aria-label="Payments">
          <h2 className="account__grouptitle">Payments</h2>
          <MenuRow icon="card" label="Gift Card" badge="New" onClick={() => showToast('Gift cards coming soon', 'info')} />
          <MenuRow icon="wallet" label={`${BRAND.APP_NAME} Wallet`} onClick={() => navigate('/offers')} />
          <MenuRow icon="card" label="Payment methods" onClick={() => showToast('Saved payment methods coming soon', 'info')} />
          <MenuRow icon="info" label="GST details" onClick={() => showToast('GST details coming soon', 'info')} />
        </section>

        <section className="account__group" aria-label="More">
          <h2 className="account__grouptitle">More</h2>
          <MenuRow icon="offer" label="Offers" onClick={() => navigate('/offers')} />
          <MenuRow icon="user" label="Referrals" onClick={() => showToast('Referral program coming soon', 'info')} />
          <MenuRow icon="star-filled" label="Rate app" onClick={() => showToast('Thanks for the love!', 'success')} />
          <MenuRow icon="help" label="Help" onClick={() => navigate('/help')} />
        </section>

        <section className="account__group" aria-label="Preferences">
          <h2 className="account__grouptitle">Preferences</h2>
          <MenuRow icon="globe" label="Country" hint="India" onClick={() => navigate('/account/settings')} />
          <MenuRow icon="card" label="Currency" hint="INR" onClick={() => navigate('/account/settings')} />
          <MenuRow icon="globe" label="Language" hint="English" onClick={() => navigate('/account/settings')} />
          <MenuRow icon="moon" label="Appearance" hint="Light" onClick={() => navigate('/account/settings')} />
        </section>

        <nav className="account__group" aria-label="Account actions">
          <MenuRow icon="bell" label="Notifications" onClick={() => navigate('/notifications')} />
          <MenuRow icon="settings" label="Account settings" onClick={() => navigate('/account/settings')} />
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
        </nav>

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
    </div>
  );
}

/* ------------------------------- Menu row ---------------------------------- */

function MenuRow({
  icon,
  label,
  hint,
  badge,
  onClick,
  danger,
}: {
  icon: IconName;
  label: string;
  hint?: string;
  badge?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button className={`menurow ${danger ? 'menurow--danger' : ''}`} onClick={onClick}>
      <span className="menurow__icon">
        <Icon name={icon} size={18} />
      </span>
      <span className="menurow__label">
        {label}
        {badge && <sup className="menurow__badge">{badge}</sup>}
      </span>
      {hint ? (
        <span className="menurow__hint">{hint}</span>
      ) : undefined}
      <Icon name="chevron-right" size={16} />
    </button>
  );
}
