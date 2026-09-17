/* ============================================================
   Payment — method selection, simulated gateway with
   success / failure / retry. Step 3.
   ============================================================ */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppBar } from '../components/ui/AppBar';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { TextField } from '../components/ui/TextField';
import { Icon, type IconName } from '../components/icons/Icon';
import { StepIndicator } from '../components/booking/StepIndicator';
import { computeFare, createBooking, processPayment, listBookings, type PaymentMethod } from '../services/api';
import { resetDraft, useDraft } from '../state/draftStore';
import { showToast } from '../state/toastStore';
import { cityById } from '../mock';
import { currency } from '../design/tokens';
import { isWeekend } from '../utils/datetime';
import { validators } from '../utils/validation';
import './PaymentScreen.css';

interface CardForm {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

export function PaymentScreen() {
  const navigate = useNavigate();
  const draft = useDraft();

  const [method, setMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState<string | null>(null);
  const [card, setCard] = useState<CardForm>({ number: '', name: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState<Partial<CardForm>>({});
  const [showCvv, setShowCvv] = useState(false);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<'form' | 'processing' | 'failed'>('form');
  const [failReason, setFailReason] = useState('');
  const [firstBooking, setFirstBooking] = useState(false);
  const [confirmSheet, setConfirmSheet] = useState(false);

  const fare = useMemo(
    () =>
      computeFare({
        seats: draft.seats,
        offerCode: draft.offerCode,
        isWeekend: isWeekend(draft.dateISO),
        isFirstBooking: firstBooking,
      }),
    [draft.seats, draft.offerCode, draft.dateISO, firstBooking]
  );

  useEffect(() => {
    listBookings().then((b) => setFirstBooking(b.length === 0));
  }, []);

  /* Redirect when the draft is missing (deep link / refresh). Never
     fires while a paid booking is routing to the ticket screen. */
  const leavingRef = useRef(false);
  const bus = draft.bus;
  if (!bus && !leavingRef.current && !draft.seats.length) {
    return <Navigate to="/home" replace />;
  }
  if (!bus) return null;

  const fromCity = cityById(bus.fromCityId)?.name ?? '';
  const toCity = cityById(bus.toCityId)?.name ?? '';

  function validatePaymentInput(): boolean {
    if (method === 'upi') {
      const e = validators.upiId(upiId);
      setUpiError(e);
      if (e) return false;
      return true;
    }
    if (method === 'card') {
      const errs: Partial<CardForm> = {
        number: validators.cardNumber(card.number) ?? undefined,
        name: validators.name(card.name) ?? undefined,
        expiry: validators.cardExpiry(card.expiry) ?? undefined,
        cvv: validators.cardCvv(card.cvv) ?? undefined,
      };
      setCardErrors(errs);
      return !Object.values(errs).some(Boolean);
    }
    return true; // wallet / netbanking need no input
  }

  async function pay() {
    if (!validatePaymentInput()) {
      showToast('Check the payment details', 'error');
      return;
    }
    setConfirmSheet(true);
  }

  async function confirmAndPay() {
    const bus = draft.bus;
    if (!bus) return;
    setConfirmSheet(false);
    setBusy(true);
    setStage('processing');

    const result = await processPayment({
      amount: fare.total,
      method,
      forceFailure: method === 'card' && card.number.replace(/\s/g, '').endsWith('0000'),
    });

    if (!result.ok) {
      setStage('failed');
      setFailReason(result.error ?? 'Payment failed. No amount was charged.');
      setBusy(false);
      return;
    }

    /* Mark "leaving" before any state change so the empty-draft guard
       never fires during the hand-off to the ticket screen. */
    leavingRef.current = true;
    setConfirmSheet(false);

    const booking = await createBooking({
      busId: bus.id,
      operatorName: bus.operatorName,
      busClass: bus.busClass,
      fromCity,
      toCity,
      travelDate: draft.dateISO,
      departTime: bus.departTime,
      arriveTime: bus.arriveTime,
      boardingPoint: draft.boardingPoint?.name ?? '',
      droppingPoint: draft.droppingPoint?.name ?? '',
      passengers: draft.passengers,
      seats: draft.seats.map((s) => ({ id: s.id, price: s.price, type: s.type })),
      contact: draft.contact,
      fare,
      paymentMethod: METHOD_LABEL[method],
    });

    /* Route to the ticket and clear the draft — the leavingRef above
       keeps the guard from bouncing us to Home. */
    showToast('Payment successful — ticket confirmed', 'success');
    navigate(`/ticket/${booking.id}`, { replace: true });
    resetDraft();
  }

  /* Processing overlay */
  if (stage === 'processing') {
    return (
      <div className="pay-processing">
        <div className="pay-processing__ring" />
        <h2>Processing payment</h2>
        <p>
          {currency.format(fare.total)} via {METHOD_LABEL[method]}
        </p>
        <p className="pay-processing__hint">Please do not press back or close the app</p>
      </div>
    );
  }

  return (
    <div className="pay">
      <AppBar
        tone="surface"
        onBack={() => navigate('/booking/passengers')}
        title="Payment"
        subtitle={`${fromCity} → ${toCity}`}
      />

      <StepIndicator current={3} />

      <div className="pay__scroll">
        {/* Failure banner */}
        {stage === 'failed' && (
          <div className="pay__fail" role="alert">
            <Icon name="exclamation" size={18} />
            <div>
              <strong>Payment failed</strong>
              <p>{failReason}</p>
            </div>
            <button onClick={() => setStage('form')} aria-label="Dismiss">
              <Icon name="close" size={14} />
            </button>
          </div>
        )}

        {/* Method picker */}
        <section className="pay__methods" aria-label="Payment method">
          <MethodOption
            icon="upi"
            title="UPI"
            subtitle="GPay, PhonePe, Paytm & more"
            active={method === 'upi'}
            onSelect={() => setMethod('upi')}
          />
          <MethodOption
            icon="card"
            title="Card"
            subtitle="Credit / debit / RuPay"
            active={method === 'card'}
            onSelect={() => setMethod('card')}
          />
          <MethodOption
            icon="wallet"
            title="Wallet"
            subtitle="Instant, no details needed"
            active={method === 'wallet'}
            onSelect={() => setMethod('wallet')}
          />
          <MethodOption
            icon="globe"
            title="Net banking"
            subtitle="All major banks"
            active={method === 'netbanking'}
            onSelect={() => setMethod('netbanking')}
          />
        </section>

        {/* Method-specific forms */}
        {method === 'upi' && (
          <section className="pay__form">
            <h4>Pay with UPI</h4>
            <TextField
              placeholder="yourname@bank"
              icon="upi"
              value={upiId}
              error={upiError}
              hint="A collect request will be sent to your UPI app"
              onChange={(e) => setUpiId(e.target.value)}
            />
            <div className="pay__vpa-list">
              {['@okhdfcbank', '@ybl', '@paytm', '@upi'].map((s) => (
                <button
                  key={s}
                  className="pay__vpa"
                  onClick={() => setUpiId((v) => (v.includes('@') ? v : `${v || 'name'}${s}`))}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        )}

        {method === 'card' && (
          <section className="pay__form">
            <h4>Card details</h4>
            <TextField
              label="Card number"
              placeholder="1234 5678 9012 3456"
              icon="card"
              inputMode="numeric"
              value={card.number}
              error={cardErrors.number ?? null}
              hint="Tip: any card ending in 0000 simulates a failed payment"
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
                setCard((c) => ({ ...c, number: digits.replace(/(\d{4})(?=\d)/g, '$1 ') }));
              }}
            />
            <TextField
              label="Name on card"
              placeholder="NAME ON CARD"
              value={card.name}
              error={cardErrors.name ?? null}
              onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
            />
            <div className="pay__cardrow">
              <TextField
                label="Expiry"
                placeholder="MM/YY"
                inputMode="numeric"
                value={card.expiry}
                error={cardErrors.expiry ?? null}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                  if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                  setCard((c) => ({ ...c, expiry: v }));
                }}
              />
              <div className="pay__cvv">
                <TextField
                  label="CVV"
                  type={showCvv ? 'text' : 'password'}
                  placeholder="•••"
                  inputMode="numeric"
                  maxLength={3}
                  value={card.cvv}
                  error={cardErrors.cvv ?? null}
                  onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                />
                <button
                  className="pay__cvv-eye"
                  onClick={() => setShowCvv((s) => !s)}
                  aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
                  type="button"
                >
                  <Icon name={showCvv ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>
            </div>
          </section>
        )}

        {method === 'wallet' && (
          <section className="pay__form">
            <div className="pay__wallet">
              <Icon name="wallet" size={26} />
              <div>
                <strong>AERS Wallet</strong>
                <p>Balance: {currency.format(2500)} · pays instantly</p>
              </div>
            </div>
          </section>
        )}

        {method === 'netbanking' && (
          <section className="pay__form">
            <h4>Choose your bank</h4>
            <div className="pay__banks">
              {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Yes Bank'].map((b) => (
                <button key={b} className="pay__bank">
                  {b}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Security note */}
        <p className="pay__secure">
          <Icon name="lock" size={13} /> 100% secure payments · this is a simulated gateway, no real money moves
        </p>
      </div>

      {/* Sticky pay bar */}
      <div className="pay__bar">
        <div>
          <span>Total payable</span>
          <strong>{currency.format(fare.total)}</strong>
        </div>
        <Button size="lg" loading={busy} onClick={pay}>
          Pay {currency.format(fare.total)}
        </Button>
      </div>

      {/* Confirm sheet */}
      <Sheet
        open={confirmSheet}
        onClose={() => setConfirmSheet(false)}
        title="Confirm payment"
        footer={
          <div className="pay__confirmfoot">
            <Button variant="ghost" onClick={() => setConfirmSheet(false)}>
              Back
            </Button>
            <Button onClick={confirmAndPay}>Pay {currency.format(fare.total)}</Button>
          </div>
        }
      >
        <ul className="pay__summary">
          <li>
            <span>Amount</span>
            <strong>{currency.format(fare.total)}</strong>
          </li>
          <li>
            <span>Method</span>
            <strong>{METHOD_LABEL[method]}</strong>
          </li>
          <li>
            <span>Trip</span>
            <strong>
              {fromCity} → {toCity}
            </strong>
          </li>
          <li>
            <span>Seats</span>
            <strong>{draft.seats.map((s) => s.id.replace(/^\w-/, '')).join(', ')}</strong>
          </li>
        </ul>
        <p className="pay__terms">
          By paying you accept the operator's cancellation policy and the terms of this prototype.
        </p>
      </Sheet>
    </div>
  );
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  upi: 'UPI',
  card: 'Card',
  wallet: 'Wallet',
  netbanking: 'Net banking',
};

function MethodOption({
  icon,
  title,
  subtitle,
  active,
  onSelect,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button className={`paymethod ${active ? 'is-active' : ''}`} onClick={onSelect} role="radio" aria-checked={active}>
      <span className="paymethod__icon">
        <Icon name={icon} size={20} />
      </span>
      <span className="paymethod__text">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </span>
      <span className={`paymethod__radio ${active ? 'is-on' : ''}`} aria-hidden="true" />
    </button>
  );
}
