/* ============================================================
   Help — reference layout:
   "Help" title · trip card with "Need help with this trip? /
   View all" · Recent issues (View all) · FAQ 2x2 grid
   (Bus/Train/Hotels/Metro) · FAQ accordion · Other topics +
   Browse other topics · support chat
   ============================================================ */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '../components/icons/Icon';
import { Logo } from '../components/brand/Logo';
import { BRAND, BRAND_COPY } from '../branding/brand';
import { FAQ_ITEMS } from '../mock';
import { listBookings } from '../services/api';
import { showToast } from '../state/toastStore';
import type { Booking } from '../types';
import { timeTo12h, fromISODate } from '../utils/datetime';
import './HelpScreen.css';

/** FAQ service tiles (reference: Bus · Train / Hotels · Metro grid) */
const FAQ_TILES = [
  { id: 'bus', label: 'Bus FAQ', icon: 'bus' },
  { id: 'train', label: 'Train FAQ', icon: 'route' },
  { id: 'hotels', label: 'Hotels FAQ', icon: 'pin' },
  { id: 'metro', label: 'Metro FAQ', icon: 'route' },
] as const;

/** Other topics (reference: Technical Issues / New bus booking help / redBus Wallet Help) */
const OTHER_TOPICS: { label: string; icon: IconName }[] = [
  { label: 'Technical Issues', icon: 'exclamation' },
  { label: 'New bus booking help', icon: 'help' },
  { label: 'Wallet Help', icon: 'wallet' },
];

export function HelpScreen() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [chatSheet, setChatSheet] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [lastTrip, setLastTrip] = useState<Booking | null>(null);
  const [chatLog, setChatLog] = useState<{ from: 'me' | 'bot'; text: string }[]>([
    { from: 'bot', text: `Hi, this is ${BRAND.APP_NAME} support. How can I help you today?` },
  ]);

  /* Trip card shows the most recent booking (reference: Bengaluru → Belagavi) */
  useEffect(() => {
    listBookings().then((all) => {
      if (all.length) setLastTrip(all[all.length - 1]);
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_ITEMS;
    return FAQ_ITEMS.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="help">
      {/* Screen title (reference: big black "Help" heading) */}
      <h1 className="help__title">Help</h1>

      <div className="help__scroll">
        {/* Trip card + section head (reference) */}
        <section className="help__trip" aria-label="Need help with this trip">
          <div className="help__section-head">
            <h2>Need help with this trip?</h2>
            <button className="help__viewall" onClick={() => navigate('/trips')}>
              View all
            </button>
          </div>
          {lastTrip ? (
            <button className="help__tripcard" onClick={() => navigate(`/ticket/${lastTrip.id}`)}>
              <span className="help__tripcard-logo">
                <Logo size={22} />
              </span>
              <span className="help__tripcard-body">
                <strong>
                  {lastTrip.fromCity} → {lastTrip.toCity}
                </strong>
                <span>{formatTripDate(lastTrip)}</span>
                <span>Bus · {lastTrip.operatorName}</span>
              </span>
              <Icon name="chevron-right" size={16} />
            </button>
          ) : (
            <button className="help__tripcard help__tripcard--empty" onClick={() => navigate('/home')}>
              <span className="help__tripcard-logo">
                <Logo size={22} />
              </span>
              <span className="help__tripcard-body">
                <strong>No trips yet</strong>
                <span>Book a ticket and get help with it here</span>
              </span>
              <Icon name="chevron-right" size={16} />
            </button>
          )}
        </section>

        {/* Recent issues (reference: "No recent issues") */}
        <section className="help__recent" aria-label="Recent issues">
          <div className="help__section-head">
            <h2>Recent issues</h2>
            <button className="help__viewall" onClick={() => showToast('No issues filed yet', 'info')}>
              View all
            </button>
          </div>
          <p className="help__noissues">No recent issues</p>
        </section>

        {/* Search */}
        <div className="help__search">
          <Icon name="search" size={17} />
          <input
            placeholder="Search help articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear">
              <Icon name="close" size={15} />
            </button>
          )}
        </div>

        {/* FAQ tiles grid (reference: 2x2 service tiles with logos) */}
        <section aria-label="FAQ categories">
          <h2 className="help__grouptitle">FAQ</h2>
          <div className="help__faqgrid">
            {FAQ_TILES.map((t) => (
              <button
                key={t.id}
                className="help__faqticle"
                onClick={() => showToast(`${t.label} — browsing Bus FAQ in this prototype`, 'info')}
              >
                <span className="help__faqtile-logo">
                  <Logo size={20} />
                </span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* FAQ accordion */}
        {filtered.length === 0 ? (
          <p className="help__noissues">No matches — try different keywords</p>
        ) : (
          filtered.map((f) => {
            const key = `${f.category}:${f.q}`;
            const open = openKey === key;
            return (
              <div key={key} className={`faq ${open ? 'is-open' : ''}`}>
                <button
                  className="faq__q"
                  onClick={() => setOpenKey(open ? null : key)}
                  aria-expanded={open}
                >
                  <span>{f.q}</span>
                  <Icon name="chevron-down" size={15} />
                </button>
                <div className="faq__a" role="region">
                  <p>{f.a}</p>
                </div>
              </div>
            );
          })
        )}

        {/* Other topics (reference: list + Browse other topics button) */}
        <section className="help__other" aria-label="Other topics">
          <h2 className="help__grouptitle">Other topics</h2>
          {OTHER_TOPICS.map((t) => (
            <button
              key={t.label}
              className="help__othertopic"
              onClick={() => showToast(`Opening ${t.label}…`, 'info')}
            >
              <Icon name={t.icon} size={17} />
              <span>{t.label}</span>
              <Icon name="chevron-right" size={15} />
            </button>
          ))}
          <button
            className="help__browse"
            onClick={() => setChatSheet(true)}
          >
            Browse other topics
          </button>
        </section>

        {/* Quick support actions */}
        <div className="help__quick">
          <button className="help__quick-btn" onClick={() => setChatSheet(true)}>
            <Icon name="help" size={20} />
            <span>Chat with us</span>
          </button>
          <a className="help__quick-btn" href={`tel:${BRAND_COPY.supportPhone.replace(/\s/g, '')}`}>
            <Icon name="phone" size={20} />
            <span>Call support</span>
          </a>
          <a className="help__quick-btn" href={`mailto:${BRAND_COPY.supportEmail}`}>
            <Icon name="mail" size={20} />
            <span>Email us</span>
          </a>
        </div>
      </div>

      {/* Simulated chat sheet */}
      {chatSheet && (
        <div className="helpchat" role="dialog" aria-label="Support chat">
          <div className="helpchat__head">
            <button onClick={() => setChatSheet(false)} aria-label="Close chat">
              <Icon name="chevron-left" size={20} />
            </button>
            <div>
              <strong>{BRAND.APP_NAME} Support</strong>
              <small>Simulated assistant · replies instantly</small>
            </div>
          </div>
          <div className="helpchat__log">
            {chatLog.map((m, i) => (
              <div key={i} className={`helpchat__msg helpchat__msg--${m.from}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="helpchat__input">
            <input
              placeholder="Type a message…"
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && chatMsg.trim()) {
                  const q = chatMsg.trim();
                  setChatLog((l) => [...l, { from: 'me', text: q }]);
                  setChatMsg('');
                  setTimeout(() => {
                    setChatLog((l) => [
                      ...l,
                      {
                        from: 'bot',
                        text: 'Thanks! This prototype support bot has logged your question. Check the FAQ above or email us anytime.',
                      },
                    ]);
                  }, 700);
                }
              }}
            />
            <button
              onClick={() => {
                if (!chatMsg.trim()) return;
                setChatLog((l) => [...l, { from: 'me', text: chatMsg.trim() }]);
                setChatMsg('');
                showToast('Message sent', 'success');
              }}
              aria-label="Send"
            >
              <Icon name="arrow-right" size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- helpers ---------------------------------- */

function formatTripDate(b: Booking): string {
  const d = fromISODate(b.travelDate);
  return `${String(d.getDate()).padStart(2, '0')} ${d.toLocaleString('en', { month: 'short' })} ${d.getFullYear()}, ${timeTo12h(b.departTime)}`;
}
