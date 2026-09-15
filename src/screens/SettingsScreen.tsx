/* ============================================================
   Settings — toggles, language, currency
   ============================================================ */

import { useNavigate } from 'react-router-dom';
import { AppBar } from '../components/ui/AppBar';
import { Icon } from '../components/icons/Icon';
import { BRAND } from '../branding/brand';
import { useSettings, updateSetting } from '../state/settingsStore';
import { setSession } from '../state/authStore';
import { showToast } from '../state/toastStore';
import './SettingsScreen.css';

const LANGUAGES = ['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'मराठी'];
const CURRENCIES = ['INR ₹', 'USD $', 'EUR €'];

export function SettingsScreen() {
  const navigate = useNavigate();
  const settings = useSettings();

  return (
    <div className="settings">
      <AppBar tone="surface" onBack={() => navigate('/account')} title="Settings" />

      <div className="settings__scroll">
        <section className="settings__group">
          <h4>Notifications</h4>
          <ToggleRow
            icon="bell"
            label="Push notifications"
            hint="Trip reminders & updates"
            checked={settings.notifications}
            onChange={(v) => updateSetting('notifications', v)}
          />
          <ToggleRow
            icon="offer"
            label="Offers & deals"
            hint="Coupons and sale alerts"
            checked={settings.offersAlerts}
            onChange={(v) => updateSetting('offersAlerts', v)}
          />
          <ToggleRow
            icon="pin"
            label="Trip alerts"
            hint="Departure delays & bus location"
            checked={settings.tripAlerts}
            onChange={(v) => updateSetting('tripAlerts', v)}
          />
        </section>

        <section className="settings__group">
          <h4>Preferences</h4>
          <SelectRow
            icon="globe"
            label="Language"
            options={LANGUAGES}
            value={settings.language}
            onSelect={(v) => updateSetting('language', v)}
          />
          <SelectRow
            icon="wallet"
            label="Currency"
            options={CURRENCIES}
            value={settings.currency === 'INR' ? 'INR ₹' : settings.currency === 'USD' ? 'USD $' : 'EUR €'}
            onSelect={(v) => updateSetting('currency', v.split(' ')[0])}
          />
        </section>

        <section className="settings__group">
          <h4>App info</h4>
          <div className="settings__row">
            <Icon name="info" size={18} />
            <span>Version</span>
            <small>1.0.0 (prototype)</small>
          </div>
          <div className="settings__row">
            <Icon name="bus" size={18} />
            <span>App</span>
            <small>{BRAND.APP_NAME}</small>
          </div>
        </section>

        <button
          className="settings__logout"
          onClick={() => {
            setSession(null);
            showToast('Logged out', 'info');
            navigate('/account', { replace: true });
          }}
        >
          <Icon name="logout" size={17} /> Log out
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  checked,
  onChange,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="settings__row">
      <Icon name={icon} size={18} />
      <span className="settings__row-text">
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

function SelectRow({
  icon,
  label,
  options,
  value,
  onSelect,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="settings__row">
      <Icon name={icon} size={18} />
      <span className="settings__row-text">
        <strong>{label}</strong>
      </span>
      <button
        className="settings__select"
        onClick={() => {
          /* simple cycler — taps advance to next option */
          const idx = options.indexOf(value);
          const next = options[(idx + 1) % options.length];
          onSelect(next);
          showToast(`${label}: ${next}`, 'info');
        }}
      >
        {value} <Icon name="chevron-down" size={13} />
      </button>
    </div>
  );
}
