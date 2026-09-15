/* ============================================================
   OTP — 6-digit verification with resend timer
   ============================================================ */

import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { Icon } from '../components/icons/Icon';
import { verifyOtp } from '../services/api';
import { setSession } from '../state/authStore';
import { showToast } from '../state/toastStore';
import { validators } from '../utils/validation';
import './LoginScreen.css';

interface OtpLocationState {
  phone: string;
  requestId: string;
  debugCode?: string;
}

export function OtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as OtpLocationState;
  const phone = state.phone ?? '';
  const requestId = state.requestId ?? '';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!requestId) navigate('/account/login', { replace: true });
  }, [requestId, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  if (!requestId) return null;

  async function confirm() {
    const e = validators.otp(otp);
    setError(e);
    if (e) return;
    setBusy(true);
    const ok = await verifyOtp(requestId, otp);
    setBusy(false);
    if (!ok) {
      setError('Incorrect code. Check and retry.');
      showToast('Incorrect OTP', 'error');
      return;
    }
    setSession({ phone });
    showToast('Logged in successfully', 'success');
    navigate('/account', { replace: true });
  }

  return (
    <div className="login">
      <button className="login__back" onClick={() => navigate('/account/login')} aria-label="Back">
        <Icon name="chevron-left" size={22} />
      </button>

      <div className="login__body">
        <div className="login__icon">
          <Icon name="phone" size={28} />
        </div>

        <div className="login__copy">
          <h1>Verify your number</h1>
          <p>
            Enter the 6-digit code sent to <strong>+91 {phone}</strong>
          </p>
        </div>

        <TextField
          placeholder="• • • • • •"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          value={otp}
          error={error}
          className="otp-input"
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
            setError(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && confirm()}
        />

        {/* Six boxes visual */}
        <div className="otp-boxes" aria-hidden="true" onClick={() => inputRef.current?.focus()}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={`otp-box ${otp.length > i ? 'is-filled' : ''} ${otp.length === i ? 'is-cursor' : ''}`}>
              {otp[i] ?? ''}
            </span>
          ))}
        </div>

        {state.debugCode && (
          <p className="otp-debug">
            <Icon name="info" size={13} /> Demo code: <strong>{state.debugCode}</strong> (simulated SMS)
          </p>
        )}

        <Button block size="lg" loading={busy} onClick={confirm} disabled={otp.length < 6}>
          Verify & continue
        </Button>

        <p className="login__resend">
          {seconds > 0 ? (
            <>Resend code in <strong>0:{String(seconds).padStart(2, '0')}</strong></>
          ) : (
            <button
              className="otp__resendbtn"
              onClick={() => {
                setSeconds(30);
                showToast('Code resent (simulated)', 'success');
              }}
            >
              Resend code
            </button>
          )}
        </p>
      </div>
    </div>
  );
}
