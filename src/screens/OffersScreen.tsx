/* ============================================================
   Offers — reference layout:
   logo+wallet header · service tabs + coupon strip · "Offers"
   head + View all · category chips (All/Bus/Train/Metro/Hotel) ·
   cream coupon cards (code + copy) · wallet card (balance +
   expiry warning) · Rate Us card
   ============================================================ */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/ui/StateView';
import { Icon } from '../components/icons/Icon';
import { AppHeader } from '../components/ui/AppHeader';
import { listOffers } from '../services/api';
import { setSearch } from '../state/searchStore';
import { showToast } from '../state/toastStore';
import type { Offer } from '../types';
import { currency } from '../design/tokens';
import './OffersScreen.css';

/** Coupon strip under service tabs (reference: green chips) */
const COUPON_STRIPS = ['₹300 off', '₹300 Off', 'Save 70%'];

/** Service tabs (reference: Bus · Train · Hotel with Metro hidden on this screen) */
const SERVICE_TABS = [
  { id: 'bus', label: 'Bus' },
  { id: 'train', label: 'Train' },
  { id: 'hotel', label: 'Hotel' },
] as const;

/** Category chips (reference: All · Bus · Train · Metro · Hotel) */
const CATEGORIES = ['All', 'Bus', 'Train', 'Metro', 'Hotel'] as const;

/** Weekend-getaway destinations (reference: Mysuru / Kodaikanal) */
const GETAWAYS = ['Mysuru', 'Kodaikanal'];

export function OffersScreen() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('All');

  useEffect(() => {
    listOffers().then(setOffers);
  }, []);

  function copyCode(o: Offer) {
    navigator.clipboard?.writeText(o.code).catch(() => undefined);
    showToast(`${o.code} copied — apply it at checkout`, 'success');
  }

  const visible =
    offers?.filter((o) => category === 'All' || category === 'Bus' || o.scope === 'any') ?? null;

  return (
    <div className="offers">
      {/* White header: wordmark + wallet pill + notifications (same as Home) */}
      <AppHeader />

      {/* Service tabs + coupon strip */}
      <div className="offers__svctabs" role="tablist" aria-label="Services">
        {SERVICE_TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={t.id === 'bus'}
            className={`offers__svctab ${t.id === 'bus' ? 'is-active' : ''}`}
            onClick={() => t.id !== 'bus' && showToast('Only bus offers are available in this prototype', 'info')}
          >
            <Icon name={t.id === 'bus' ? 'bus' : t.id === 'hotel' ? 'pin' : 'route'} size={20} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="offers__coupons" role="list" aria-label="Coupon offers">
        {COUPON_STRIPS.map((c) => (
          <span key={c} className="offers__coupon" role="listitem">
            {c}
          </span>
        ))}
      </div>

      <div className="offers__scroll">
        {/* Section head (reference: big "Offers" + blue View all) */}
        <div className="offers__head">
          <h1 className="offers__title">Offers</h1>
          <button className="offers__viewall" onClick={() => navigate('/home')}>
            View all
          </button>
        </div>
        <p className="offers__sub">Get best deals with great offers</p>

        {/* Category chips */}
        <div className="offers__chips" role="tablist" aria-label="Offer categories">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              className={`offers__chip ${category === c ? 'is-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Coupon cards */}
        {visible === null ? (
          <div className="offers__loading">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="app-skeleton" style={{ height: 132, borderRadius: 'var(--r-lg)' }} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState icon="offer" title="No offers right now" subtitle="Check back soon." />
        ) : (
          visible.map((o) => (
            <article key={o.id} className={`coupon coupon--${o.color}`}>
              <div className="coupon__notch coupon__notch--l" />
              <div className="coupon__notch coupon__notch--r" />
              <div className="coupon__text">
                <span className="coupon__tag">Bus</span>
                <h3>
                  {o.title} <small>{o.subtitle}</small>
                </h3>
                <p>{o.description}</p>
                <div className="coupon__fine">
                  {o.minAmount ? `Min booking ${currency.format(o.minAmount)}` : 'No minimum'}
                  {o.discountPercent ? ` · ${o.discountPercent}% off` : ''}
                  {o.upTo ? ` · up to ${currency.format(o.upTo)}` : ''} · Valid till: {formatExpiry(o.expiry)}
                </div>
              </div>
              <div className="coupon__actions">
                <button className="coupon__copy" onClick={() => copyCode(o)}>
                  {o.code}
                  <Icon name="offer" size={13} />
                </button>
                <button
                  className="coupon__go"
                  onClick={() => {
                    setSearch({ dateISO: searchStoreToday() });
                    navigate('/home');
                  }}
                >
                  Book now
                </button>
              </div>
            </article>
          ))
        )}

        {/* Wallet card (reference: balance + expiry + getaway destinations) */}
        <section className="offers__wallet" aria-label="Wallet">
          <div className="offers__wallet-body">
            <h2 className="offers__wallet-title">
              <Icon name="wallet" size={16} /> Wallet
            </h2>
            <strong className="offers__wallet-amt">₹202 in your wallet</strong>
            <p className="offers__wallet-expiry">Expires on 06 Feb, 2027</p>
            <p className="offers__wallet-note">
              Plan your trip before 06 Feb, 2027 to avoid losing your money.
            </p>
          </div>
          <div className="offers__getaway">
            <p className="offers__getaway-head">
              Hey, ready for a weekend getaway?
              <span>Handpicked for you</span>
            </p>
            <div className="offers__getaway-chips">
              {GETAWAYS.map((g) => (
                <button
                  key={g}
                  className="offers__getaway-chip"
                  onClick={() => navigate('/home')}
                >
                  <Icon name="pin" size={13} />
                  {g}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Rate Us card (reference: white card + Rate Now button) */}
        <section className="offers__rate" aria-label="Rate us">
          <h2 className="offers__rate-title">Rate Us</h2>
          <div className="offers__rate-body">
            <div>
              <strong>Enjoying AERS?</strong>
              <p>Share your experience with us and help spread the word!</p>
            </div>
            <Icon name="star-filled" size={34} className="offers__rate-star" />
          </div>
          <button
            className="offers__rate-btn"
            onClick={() => showToast('Thanks for the love! (app store rating simulated)', 'success')}
          >
            Rate Now
          </button>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------- helpers ---------------------------------- */

function formatExpiry(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en', { month: 'short' })}`;
}

function searchStoreToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
