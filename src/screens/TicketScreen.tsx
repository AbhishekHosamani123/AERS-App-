/* ============================================================
   Ticket — confirmation view with PNR, QR, boarding pass
   layout, cancel flow with refund estimate.
   ============================================================ */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppBar } from '../components/ui/AppBar';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { EmptyState, TicketSkeleton } from '../components/ui/StateView';
import { Icon } from '../components/icons/Icon';
import { cancelBooking, getBooking, refundEstimate } from '../services/api';
import { showToast } from '../state/toastStore';
import type { Booking } from '../types';
import { currency } from '../design/tokens';
import { formatFull, timeTo12h } from '../utils/datetime';
import './TicketScreen.css';

export function TicketScreen() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (bookingId) getBooking(bookingId).then(setBooking);
  }, [bookingId]);

  if (booking === undefined) {
    return (
      <div className="ticket">
        <AppBar tone="surface" title="Ticket" onBack={() => navigate(-1)} />
        <div style={{ padding: 'var(--sp-lg)' }}>
          <TicketSkeleton />
        </div>
      </div>
    );
  }

  if (booking === null) {
    return (
      <div className="ticket">
        <AppBar tone="surface" title="Ticket" onBack={() => navigate('/trips')} />
        <EmptyState
          icon="ticket"
          title="Ticket not found"
          subtitle="This booking may have been made in another session."
          actionLabel="Go to MyTrips"
          onAction={() => navigate('/trips')}
        />
      </div>
    );
  }

  const refund = refundEstimate(booking.travelDate, booking.departTime, booking.fare.total);
  const isCancelled = booking.status === 'cancelled';

  async function confirmCancel() {
    setCancelling(true);
    try {
      const updated = await cancelBooking(booking!.id, refund);
      setBooking(updated);
      setCancelOpen(false);
      showToast(`Ticket cancelled · refund of ${currency.format(updated.refundAmount ?? 0)} initiated`, 'success');
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="ticket">
      <AppBar
        tone="surface"
        title={isCancelled ? 'Cancelled ticket' : 'Your ticket'}
        onBack={() => navigate('/trips')}
        actions={
          <button
            className="ticket__share"
            onClick={() => showToast('Ticket shared (simulated)', 'success')}
            aria-label="Share ticket"
          >
            <Icon name="share" size={18} />
          </button>
        }
      />

      <div className="ticket__scroll">
        {/* Success header (fresh bookings) */}
        {booking.status === 'confirmed' && (
          <div className="ticket__success">
            <span className="ticket__check">
              <Icon name="check" size={26} />
            </span>
            <h2>Booking confirmed!</h2>
            <p>
              Sent to <strong>{booking.contact.email}</strong> and <strong>+91 {booking.contact.phone}</strong>
            </p>
          </div>
        )}

        {isCancelled && (
          <div className="ticket__cancelled">
            <Icon name="exclamation" size={16} />
            <div>
              <strong>Ticket cancelled</strong>
              <p>
                Refund of {currency.format(booking.refundAmount ?? 0)} initiated to your payment source (5–7 days).
              </p>
            </div>
          </div>
        )}

        {/* Boarding pass card */}
        <section className={`pass ${isCancelled ? 'pass--cancelled' : ''}`}>
          <div className="pass__head">
            <div>
              <span className="pass__pnr-label">PNR</span>
              <strong className="pass__pnr">{booking.pnr}</strong>
            </div>
            <span className="pass__badge">{isCancelled ? 'CANCELLED' : 'CONFIRMED'}</span>
          </div>

          <div className="pass__route">
            <div className="pass__point">
              <strong>{timeTo12h(booking.departTime)}</strong>
              <span>{booking.fromCity}</span>
              <small>{formatFull(booking.travelDate)}</small>
            </div>
            <div className="pass__mid">
              <span className="pass__line" />
              <Icon name="bus" size={18} />
              <span className="pass__line" />
            </div>
            <div className="pass__point pass__point--end">
              <strong>{timeTo12h(booking.arriveTime)}</strong>
              <span>{booking.toCity}</span>
              <small>{booking.busClass}</small>
            </div>
          </div>

          <div className="pass__notch pass__notch--l" />
          <div className="pass__notch pass__notch--r" />

          <dl className="pass__details">
            <div>
              <dt>Boarding point</dt>
              <dd>{booking.boardingPoint}</dd>
            </div>
            <div>
              <dt>Dropping point</dt>
              <dd>{booking.droppingPoint}</dd>
            </div>
            <div>
              <dt>Operator</dt>
              <dd>{booking.operatorName}</dd>
            </div>
            <div>
              <dt>Seats</dt>
              <dd>
                {booking.seats.map((s) => (
                  <span key={s.id} className="pass__seat">
                    {s.id}
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          {/* Stub: QR + amount */}
          <div className="pass__stub">
            <div className="pass__qr" aria-hidden="true">
              <QrPattern seed={booking.pnr} />
            </div>
            <div className="pass__payinfo">
              <span>Paid via {booking.paymentMethod}</span>
              <strong>{currency.format(booking.fare.total)}</strong>
              <small>{booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}</small>
            </div>
          </div>
        </section>

        {/* Passengers */}
        <section className="ticket__pax">
          <h3>Passengers</h3>
          {booking.passengers.map((p, i) => (
            <div key={p.seatId} className="ticket__pax-row">
              <span className="ticket__pax-no">{i + 1}</span>
              <div>
                <strong>{p.name}</strong>
                <small>
                  {p.age} yrs · {p.gender === 'male' ? 'M' : 'F'} · seat {p.seatId.split(':')[1]?.replace(/^\w-/, '')}
                </small>
              </div>
            </div>
          ))}
        </section>

        {/* Fare + actions */}
        <section className="ticket__fare">
          <h3>Fare details</h3>
          <div className="fare-row">
            <span>Base fare</span>
            <span>{currency.format(booking.fare.base)}</span>
          </div>
          {booking.fare.concession > 0 && (
            <div className="fare-row fare-row--save">
              <span>Discount</span>
              <span>−{currency.format(booking.fare.concession)}</span>
            </div>
          )}
          <div className="fare-row">
            <span>GST</span>
            <span>{currency.format(booking.fare.gst)}</span>
          </div>
          <div className="fare-row fare-row--total">
            <span>Total paid</span>
            <span>{currency.format(booking.fare.total)}</span>
          </div>
        </section>

        {booking.status === 'confirmed' && (
          <div className="ticket__actions">
            <Button variant="danger" block onClick={() => setCancelOpen(true)}>
              Cancel ticket
            </Button>
            <Button variant="ghost" block onClick={() => navigate('/home')}>
              Book another trip
            </Button>
          </div>
        )}
      </div>

      {/* Cancel dialog */}
      <Dialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel this ticket?"
        confirmLabel={`Cancel ticket`}
        confirmVariant="danger"
        busy={cancelling}
        onConfirm={confirmCancel}
      >
        <p>
          Estimated refund: <strong>{currency.format(refund)}</strong> of {currency.format(booking.fare.total)} paid
          (80% up to 24h before departure, 60% within 12–24h, 30% under 12h; ₹30 fee). Refunds arrive in 5–7 days.
        </p>
      </Dialog>
    </div>
  );
}

/** Decorative QR-like pattern generated deterministically from the PNR. */
function QrPattern({ seed }: { seed: string }) {
  const n = 7;
  const cells: boolean[] = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = 0; i < n * n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push((h >>> 16) % 2 === 0);
  }
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="qr" aria-hidden="true">
      {cells.map((on, i) =>
        on ? <rect key={i} x={i % n} y={Math.floor(i / n)} width={1} height={1} /> : null
      )}
      {/* corner markers */}
      <g>
        <rect x="0" y="0" width="2.4" height="2.4" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <rect x={n - 2.4} y="0" width="2.4" height="2.4" fill="none" stroke="currentColor" strokeWidth="0.7" />
        <rect x="0" y={n - 2.4} width="2.4" height="2.4" fill="none" stroke="currentColor" strokeWidth="0.7" />
      </g>
    </svg>
  );
}
