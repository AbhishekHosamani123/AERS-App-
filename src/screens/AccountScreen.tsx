/* ============================================================
   My Account — reference layout:
   navy header (User · phone · member-since · stats trio) ·
   wallet card (balance + expiry) · language chips · menu groups
   (My details / Payments / More / Preferences)
   ============================================================ */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { TextField } from '../components/ui/TextField';
import { Icon, type IconName } from '../components/icons/Icon';
import { BRAND, BRAND_COPY } from '../branding/brand';
import { useAuth, updateProfile } from '../state/authStore';
import { listBookings } from '../services/api';
import { showToast } from '../state/toastStore';
import './AccountScreen.css';

/** Language chips (reference: English / ಕನ್ನಡ (Kannada) / मराठी (Marathi)) */
const LANGUAGES = ['English', 'ಕನ್ನಡ (Kannada)', 'मराठी (Marathi)'];

export function AccountScreen() {
  const navigate = useNavigate();
  const session = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [tripsCount, setTripsCount] = useState<number | null>(null);
  const [name, setName] = useState(session?.name ?? '');
  const [email, setEmail] = useState(session?.email ?? '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    listBookings().then((b) => setTripsCount(b.length));
  }, []);

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
      {/* Navy header (reference: #12122A with white text + stats trio) */}
      <header className="account__header">
        <div className="account__id">
          <h1>{session.name ?? 'User'}</h1>
          <span>+91 {session.phone}</span>
          <small>{memberSince}</small>
        </div>
        <button className="account__edit" onClick={() => setEditOpen(true)} aria-label="Edit profile">
          <Icon name="edit" size={16} />
        </button>
      </header>
      <div className="account__stats">
        <div>
          <strong>{tripsCount ?? 0}</strong>
          <span>Total trips</span>
        </div>
        <div>
          <strong>{(tripsCount ?? 0) * 370} km</strong>
          <span>Travelled</span>
        </div>
        <div>
          <strong>{(tripsCount ?? 0) * 39} kg</strong>
          <span>Carbon saving</span>
        </div>
      </div>

      <div className="account__scroll">
        {/* Wallet card (reference: balance + orange expiry note) */}
        <section className="account__wallet" aria-label="Wallet">
          <h2 className="account__wallet-title">
            <Icon name="wallet" size={16} /> Wallet
          </h2>
          <strong className="account__wallet-amt">₹202.00</strong>
          <span className="account__wallet-label">Wallet balance</span>
          <p className="account__wallet-expiry">₹202.00 expires by 06 Feb 2027</p>
        </section>

        {/* Language chips (reference: "Try redBus in your language") */}
        <section className="account__lang" aria-label="Language">
          <h2>Try {BRAND.APP_NAME} in your language</h2>
          <div className="account__lang-chips">
            {LANGUAGES.map((l, i) => (
              <button
                key={l}
                className={`account__lang-chip ${i === 0 ? 'is-active' : ''}`}
                onClick={() => showToast(`${l} coming soon — English stays for now`, 'info')}
              >
                {l}
              </button>
            ))}
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
