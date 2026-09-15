/* ============================================================
   Passenger details — per-seat forms with validation,
   contact info, promo code, fare breakdown. Step 2.
   ============================================================ */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../components/ui/AppBar';
import { Button } from '../components/ui/Button';import { Sheet } from '../components/ui/Sheet';
import { TextField } from '../components/ui/TextField';
import { Icon } from '../components/icons/Icon';
import { StepIndicator } from '../components/booking/StepIndicator';
import { computeFare, listOffers, validateOffer } from '../services/api';
import { setContact, setOffer, updatePassenger, useDraft } from '../state/draftStore';
import { useAuth } from '../state/authStore';
import { listBookings } from '../services/api';
import { showToast } from '../state/toastStore';
import type { Offer, Passenger } from '../types';
import { currency } from '../design/tokens';
import { isWeekend } from '../utils/datetime';
import { validators } from '../utils/validation';
import './PassengerDetailsScreen.css';

type Gender = 'male' | 'female';

interface PaxErrors {
  name?: string;
  age?: string;
  gender?: string;
}

export function PassengerDetailsScreen() {
  const navigate = useNavigate();
  const draft = useDraft();
  const session = useAuth();

  const [errors, setErrors] = useState<Record<string, PaxErrors>>({});
  const [contactErrors, setContactErrors] = useState<{ email?: string; phone?: string }>({});
  const [offerSheet, setOfferSheet] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [promoInput, setPromoInput] = useState('');
  const [promoChecking, setPromoChecking] = useState(false);
  const [firstBooking, setFirstBooking] = useState(false);

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

  /* Preload offers + first-booking status when sheet opens */
  function openOffers() {
    setOfferSheet(true);
    listOffers().then(setOffers);
    listBookings().then((b) => setFirstBooking(b.length === 0));
  }

  if (!draft.bus || draft.seats.length === 0) {
    navigate('/home', { replace: true });
    return null;
  }

  function validateAll(): boolean {
    const nextErrors: Record<string, PaxErrors> = {};
    let ok = true;

    draft.passengers.forEach((p) => {
      const e: PaxErrors = {};
      const n = validators.name(p.name ?? '');
      if (n) e.name = n;
      const a = validators.age(p.age?.toString() ?? '');
      if (a) e.age = a;
      if (!p.gender) e.gender = 'Select gender';
      if (Object.keys(e).length) {
        nextErrors[p.seatId] = e;
        ok = false;
      }
    });
    setErrors(nextErrors);

    const ce: { email?: string; phone?: string } = {};
    const em = validators.email(draft.contact.email);
    const ph = validators.phone(draft.contact.phone);
    if (em) ce.email = em;
    if (ph) ce.phone = ph;
    if (em || ph) ok = false;
    setContactErrors(ce);

    if (!ok) showToast('Please complete the highlighted fields', 'error');
    return ok;
  }

  function proceed() {
    if (!validateAll()) return;
    navigate('/booking/payment');
  }

  function applyPromo(code: string) {
    setPromoChecking(true);
    validateOffer(code, fare.base)
      .then((res) => {
        if (res.valid && res.offer) {
          setOffer(res.offer.code);
          showToast(`${res.offer.code} applied`, 'success');
          setOfferSheet(false);
        } else {
          showToast(res.reason ?? 'Code not applicable', 'error');
        }
      })
      .finally(() => setPromoChecking(false));
  }

  return (
    <div className="pax">
      <AppBar
        tone="surface"
        onBack={() => navigate('/booking/seats')}
        title="Passenger details"
        subtitle={`${draft.seats.length} seat${draft.seats.length > 1 ? 's' : ''} · ${draft.bus.operatorName}`}
      />

      <StepIndicator current={2} />

      <div className="pax__scroll">
        {/* Contact prefill from logged-in session */}
        {session && (
          <div className="pax__prefill">
            <Icon name="user" size={15} />
            Using details from your profile
          </div>
        )}

        {/* Per-seat passenger forms */}
        {draft.passengers.map((p, i) => (
          <PassengerForm
            key={p.seatId}
            index={i}
            passenger={p}
            seatLabel={seatLabel(draft.seats, p.seatId)}
            errors={errors[p.seatId] ?? {}}
            onChange={(patch) => updatePassenger(p.seatId, patch)}
          />
        ))}

        {/* Contact info */}
        <section className="pax__card">
          <h3 className="pax__cardtitle">Contact details</h3>
          <p className="pax__cardsub">Ticket & trip updates are sent here</p>
          <div className="pax__grid">
            <TextField
              label="Email"
              type="email"
              icon="mail"
              placeholder="you@example.com"
              value={draft.contact.email}
              error={contactErrors.email}
              onChange={(e) => setContact({ ...draft.contact, email: e.target.value })}
            />
            <TextField
              label="Mobile number"
              inputMode="numeric"
              prefix="+91"
              maxLength={10}
              placeholder="98XXXXXXXX"
              value={draft.contact.phone}
              error={contactErrors.phone}
              onChange={(e) =>
                setContact({ ...draft.contact, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })
              }
            />
          </div>
        </section>

        {/* Fare breakdown */}
        <section className="pax__fare">
          <h3 className="pax__cardtitle">Fare summary</h3>
          <div className="fare-row">
            <span>Seat fare ({draft.seats.length})</span>
            <span>{currency.format(fare.base)}</span>
          </div>
          {fare.concession > 0 && (
            <div className="fare-row fare-row--save">
              <span>
                Discount ({fare.offer?.code})
                <button className="fare-remove" onClick={() => setOffer(null)} aria-label="Remove offer">
                  remove
                </button>
              </span>
              <span>−{currency.format(fare.concession)}</span>
            </div>
          )}
          <div className="fare-row">
            <span>GST (5%)</span>
            <span>{currency.format(fare.gst)}</span>
          </div>
          <div className="fare-row fare-row--total">
            <span>Total payable</span>
            <span>{currency.format(fare.total)}</span>
          </div>
          <button className="pax__offerbtn" onClick={openOffers}>
            <Icon name="offer" size={16} />
            {draft.offerCode ? `Applied: ${draft.offerCode}` : 'Apply an offer code'}
            <Icon name="chevron-right" size={14} />
          </button>
        </section>
      </div>

      {/* Sticky bar */}
      <div className="pax__bar">
        <div>
          <span>Total</span>
          <strong>{currency.format(fare.total)}</strong>
        </div>
        <Button onClick={proceed}>Continue to payment</Button>
      </div>

      {/* Offers sheet */}
      <Sheet open={offerSheet} onClose={() => setOfferSheet(false)} title="Apply offer">
        <div className="promo">
          <TextField
            placeholder="Enter code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
            error={null}
          />
          <Button
            size="sm"
            loading={promoChecking}
            onClick={() => promoInput && applyPromo(promoInput)}
          >
            Apply
          </Button>
        </div>
        <ul className="offers-mini">
          {offers.map((o) => (
            <li key={o.id} className="offers-mini__item">
              <div>
                <span className="offers-mini__code">{o.code}</span>
                <p className="offers-mini__title">{o.title} · {o.subtitle}</p>
                <p className="offers-mini__desc">{o.description}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => applyPromo(o.code)}>
                Apply
              </Button>
            </li>
          ))}
        </ul>
      </Sheet>
    </div>
  );
}

function seatLabel(seats: { deck: string; id: string }[], seatId: string): string {
  const s = seats.find((x) => `${x.deck}:${x.id}` === seatId);
  return s ? `${s.deck} deck · seat ${s.id.replace(/^\w-/, '')}` : seatId;
}

/* ------------------------------ Pax form card ------------------------------ */

function PassengerForm({
  index,
  passenger,
  seatLabel,
  errors,
  onChange,
}: {
  index: number;
  passenger: Passenger;
  seatLabel: string;
  errors: PaxErrors;
  onChange: (patch: Partial<Passenger>) => void;
}) {
  const [touched, setTouched] = useState({ name: false, age: false });

  return (
    <section className="pax__card">
      <div className="pax__cardhead">
        <h3 className="pax__cardtitle">Passenger {index + 1}</h3>
        <span className="pax__seat">{seatLabel}</span>
      </div>
      <div className="pax__grid">
        <TextField
          label="Full name"
          placeholder="As per ID"
          value={passenger.name}
          error={touched.name || errors.name ? errors.name : null}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <TextField
          label="Age"
          inputMode="numeric"
          placeholder="e.g. 28"
          maxLength={3}
          value={passenger.age?.toString() ?? ''}
          error={touched.age || errors.age ? errors.age : null}
          onBlur={() => setTouched((t) => ({ ...t, age: true }))}
          onChange={(e) => onChange({ age: e.target.value.replace(/\D/g, '') ? Number(e.target.value) : null })}
        />
      </div>
      <div className="pax__gender">
        <span className="pax__gender-label">
          Gender {errors.gender && <em>{errors.gender}</em>}
        </span>
        <div className="pax__gender-btns" role="radiogroup" aria-label="Gender">
          {(['male', 'female'] as Gender[]).map((g) => (
            <button
              key={g}
              role="radio"
              aria-checked={passenger.gender === g}
              className={`pax__gender-btn ${passenger.gender === g ? 'is-active' : ''} ${
                g === 'female' ? 'is-female' : ''
              }`}
              onClick={() => onChange({ gender: g })}
            >
              {g === 'male' ? 'Male' : 'Female'}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
