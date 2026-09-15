/* ============================================================
   Seat selection — seat map + boarding/dropping points +
   sticky fare bar. Step 1 of booking.
   ============================================================ */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../components/ui/AppBar';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { ScreenLoader } from '../components/ui/StateView';
import { EmptyState } from '../components/ui/StateView';
import { Icon } from '../components/icons/Icon';
import { SeatMap } from '../components/booking/SeatMap';
import { StepIndicator } from '../components/booking/StepIndicator';
import { getSeatMap } from '../services/api';
import { useDraft, setBoarding, setDropping, toggleSeat, resetDraft } from '../state/draftStore';
import { showToast } from '../state/toastStore';
import type { BoardingPoint, Seat } from '../types';
import { currency } from '../design/tokens';
import { formatFull, timeTo12h } from '../utils/datetime';
import './SeatSelectionScreen.css';

export function SeatSelectionScreen() {
  const navigate = useNavigate();
  const draft = useDraft();
  const [seats, setSeats] = useState<Seat[] | null>(null);
  const [bpSheet, setBpSheet] = useState(false);
  const [dpSheet, setDpSheet] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  /* Reset draft when entering without a bus (e.g. page refresh) */
  useEffect(() => {
    if (!draft.bus) {
      navigate('/home', { replace: true });
      return;
    }
    let alive = true;
    getSeatMap(draft.bus, draft.dateISO).then((s) => {
      if (alive) setSeats(s);
    });
    return () => {
      alive = false;
    };
  }, [draft.bus, draft.dateISO, navigate]);

  const selectedIds = useMemo(
    () => new Set(draft.seats.map((s) => `${s.deck}:${s.id}`)),
    [draft.seats]
  );

  const total = useMemo(() => draft.seats.reduce((t, s) => t + s.price, 0), [draft.seats]);

  if (!draft.bus) return null;

  const bus = draft.bus;

  function handleToggle(seat: Seat) {
    const isLadies = seat.status === 'ladies' && !isFemale;
    toggleSeat(seat, isLadies);
    if (isLadies) showToast('That seat is reserved for female passengers', 'error');
  }

  function proceed() {
    if (draft.seats.length === 0) {
      showToast('Select at least one seat', 'error');
      return;
    }
    if (!draft.boardingPoint || !draft.droppingPoint) {
      showToast('Choose boarding & dropping points', 'error');
      setBpSheet(true);
      return;
    }
    navigate('/booking/passengers');
  }

  return (
    <div className="seats">
      <AppBar
        tone="surface"
        onBack={() => {
          resetDraft();
          navigate('/search');
        }}
        title={bus.operatorName}
        subtitle={`${bus.busClass} · ${formatFull(draft.dateISO)}`}
      />

      <StepIndicator current={1} />

      <div className="seats__scroll">
        {seats === null ? (
          <ScreenLoader />
        ) : (
          <>
            {/* Trip summary strip */}
            <div className="seats__summary">
              <div>
                <strong>{timeTo12h(bus.departTime)}</strong>
                <span>{bus.fromCityId.toUpperCase()}</span>
              </div>
              <div className="seats__summary-mid">
                <span className="seats__duration">{bus.durationMinutes}m</span>
              </div>
              <div>
                <strong>{timeTo12h(bus.arriveTime)}</strong>
                <span>{bus.toCityId.toUpperCase()}</span>
              </div>
              <div className="seats__price">{currency.format(bus.basePrice)}</div>
            </div>

            {/* Boarding / dropping selection */}
            <div className="seats__points">
              <button className="seats__point" onClick={() => setBpSheet(true)}>
                <span className="seats__point-label">
                  <Icon name="pin" size={14} /> Boarding
                </span>
                <span className="seats__point-value">
                  {draft.boardingPoint
                    ? `${draft.boardingPoint.name} · ${draft.boardingPoint.time}`
                    : 'Select point'}
                </span>
                <Icon name="chevron-right" size={14} />
              </button>
              <button className="seats__point" onClick={() => setDpSheet(true)}>
                <span className="seats__point-label">
                  <Icon name="pin" size={14} /> Dropping
                </span>
                <span className="seats__point-value">
                  {draft.droppingPoint
                    ? `${draft.droppingPoint.name} · ${draft.droppingPoint.time}`
                    : 'Select point'}
                </span>
                <Icon name="chevron-right" size={14} />
              </button>
            </div>

            {/* Ladies-passenger toggle (drives seat policy) */}
            <label className="seats__female">
              <input
                type="checkbox"
                checked={isFemale}
                onChange={(e) => {
                  const next = e.target.checked;
                  if (!next && draft.seats.some((s) => s.status === 'ladies')) {
                    showToast('Deselect ladies seats first', 'error');
                    return;
                  }
                  setIsFemale(next);
                }}
              />
              <span>Booking for a female passenger? Unlock ladies-only seats</span>
            </label>

            <SeatMap seats={seats} selectedIds={selectedIds} onToggle={handleToggle} isFemalePassenger={isFemale} />

            {draft.seats.length > 0 && (
              <div className="seats__picked">
                <h4>Selected seats</h4>
                <div className="seats__picked-list">
                  {draft.seats.map((s) => (
                    <span key={`${s.deck}:${s.id}`} className="seats__picked-chip">
                      {s.deck} · {s.id} · {currency.format(s.price)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky fare bar */}
      <div className="seats__bar">
        <div className="seats__bar-total">
          {draft.seats.length > 0 ? (
            <>
              <span>{draft.seats.length} seat{draft.seats.length > 1 ? 's' : ''}</span>
              <strong>{currency.format(total)}</strong>
            </>
          ) : (
            <span className="seats__bar-hint">Pick your seats to continue</span>
          )}
        </div>
        <Button onClick={proceed} disabled={draft.seats.length === 0}>
          Continue
        </Button>
      </div>

      {/* Boarding points sheet */}
      <PointSheet
        open={bpSheet}
        onClose={() => setBpSheet(false)}
        title="Select boarding point"
        points={bus.boardingPoints}
        selectedId={draft.boardingPoint?.id}
        onSelect={(p) => {
          setBoarding(p);
          setBpSheet(false);
          if (!draft.droppingPoint) setDpSheet(true);
        }}
      />

      {/* Dropping points sheet */}
      <PointSheet
        open={dpSheet}
        onClose={() => setDpSheet(false)}
        title="Select dropping point"
        points={bus.droppingPoints}
        selectedId={draft.droppingPoint?.id}
        onSelect={(p) => {
          setDropping(p);
          setDpSheet(false);
        }}
      />
    </div>
  );
}

/* --------------------------- Boarding point sheet --------------------------- */

function PointSheet({
  open,
  onClose,
  title,
  points,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  points: BoardingPoint[];
  selectedId?: string;
  onSelect: (p: BoardingPoint) => void;
}) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      {points.length === 0 ? (
        <EmptyState compact icon="pin" title="No points listed" subtitle="Any point can be chosen at boarding." />
      ) : (
        <ul className="pointsheet">
          {points.map((p) => (
            <li key={p.id}>
              <button
                className={`pointsheet__item ${selectedId === p.id ? 'is-active' : ''}`}
                onClick={() => onSelect(p)}
              >
                <span className="pointsheet__time">{timeTo12h(p.time)}</span>
                <span className="pointsheet__info">
                  <strong>{p.name}</strong>
                  <small>
                    {p.address}
                    {p.landmark ? ` · ${p.landmark}` : ''}
                  </small>
                </span>
                {selectedId === p.id && <Icon name="check-circle" size={20} className="pointsheet__check" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Sheet>
  );
}
