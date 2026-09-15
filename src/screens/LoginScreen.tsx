/* ============================================================
   Login — phone entry (mock OTP flow)
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Icon } from '../components/icons/Icon';
import { Logo } from '../components/brand/Logo';
import { BRAND } from '../branding/brand';
import { requestOtp } from '../services/api';
import { showToast } from '../state/toastStore';
import { validators } from '../utils/validation';
import './LoginScreen.css';

export function LoginScreen() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    const e = validators.phone(phone);
    setError(e);
    if (e) return;
    setBusy(true);
    const res = await requestOtp(phone);
    setBusy(false);
    showToast('OTP sent via SMS (simulated)', 'success');
    navigate('/account/otp', {
      state: { phone, requestId: res.requestId, debugCode: res.debugCode },
    });
  }

  return (
    <div className="login">
      <button className="login__back" onClick={() => navigate('/account')} aria-label="Back">
        <Icon name="chevron-left" size={22} />
      </button>

      <div className="login__body">
        <Logo size={40} withWordmark />

        <div className="login__copy">
          <h1>Welcome aboard</h1>
          <p>
            Enter your mobile number to log in or create a {BRAND.APP_NAME} account. We'll send a
            6-digit code to verify it's you.
          </p>
        </div>

        <TextField
          label="Mobile number"
          prefix="+91"
          placeholder="98XXXXXXXX"
          inputMode="numeric"
          autoFocus
          maxLength={10}
          value={phone}
          error={error}
          onChange={(e) => {
            setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
            setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />

        <Button block size="lg" loading={busy} onClick={submit}>
          Send OTP
        </Button>

        <p className="login__legal">
          By continuing you agree to our placeholder Terms of Service and Privacy Policy. This is a
          prototype — authentication is simulated locally.
        </p>
      </div>
    </div>
  );
}
