/* ============================================================
   SeatMap — lower/upper deck seater & sleeper layouts with
   available / booked / ladies / selected states.
   ============================================================ */

import { useMemo, useState } from 'react';
import type { Seat } from '../../types';
import { currency } from '../../design/tokens';
import { Icon } from '../icons/Icon';
import './SeatMap.css';

export interface SeatMapProps {
  seats: Seat[];
  selectedIds: Set<string>;
  onToggle: (seat: Seat) => void;
  /** Male passengers cannot take ladies seats (reference behavior). */
  isFemalePassenger: boolean;
}

/** Group seats into a grid per deck. */
function deckGrid(seats: Seat[]): Seat[][] {
  const rows = new Map<number, Seat[]>();
  for (const s of seats) {
    if (!rows.has(s.row)) rows.set(s.row, []);
    rows.get(s.row)!.push(s);
  }
  return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, cols]) => cols.sort((a, b) => a.col - b.col));
}

export function SeatMap({ seats, selectedIds, onToggle, isFemalePassenger }: SeatMapProps) {
  const [deck, setDeck] = useState<'lower' | 'upper'>(() =>
    seats.some((s) => s.deck === 'upper') ? 'lower' : 'lower'
  );
  const hasUpper = useMemo(() => seats.some((s) => s.deck === 'upper'), [seats]);
  const isSleeper = seats[0]?.type === 'sleeper';

  const deckSeats = useMemo(() => deckGrid(seats.filter((s) => s.deck === deck)), [seats, deck]);

  return (
    <div className="seatmap">
      <div className="seatmap__legend">
        <span className="seatlegend"><span className="sw sw--avail" /> Available</span>
        <span className="seatlegend"><span className="sw sw--unavail" /> Booked</span>
        <span className="seatlegend"><span className="sw sw--ladies" /> Ladies</span>
        <span className="seatlegend"><span className="sw sw--selected" /> Selected</span>
      </div>

      {hasUpper && (
        <div className="seatmap__tabs" role="tablist">
          <button
            role="tab"
            aria-selected={deck === 'lower'}
            className={`seatmap__tab ${deck === 'lower' ? 'is-active' : ''}`}
            onClick={() => setDeck('lower')}
          >
            Lower deck
          </button>
          <button
            role="tab"
            aria-selected={deck === 'upper'}
            className={`seatmap__tab ${deck === 'upper' ? 'is-active' : ''}`}
            onClick={() => setDeck('upper')}
          >
            Upper deck
          </button>
        </div>
      )}

      <div className={`seatmap__layout seatmap__layout--${isSleeper ? 'sleeper' : 'seater'}`}>
        <div className="seatmap__driver" aria-hidden="true">
          <Icon name="user" size={18} />
          <span>Driver</span>
        </div>
        <div className="seatmap__grid">
          {deckSeats.map((row, ri) => (
            <div className="seatmap__row" key={ri}>
              {row.map((seat) => {
                const key = `${seat.deck}:${seat.id}`;
                const selected = selectedIds.has(key);
                const ladies = seat.status === 'ladies';
                const blocked = seat.status === 'unavailable' || (ladies && !isFemalePassenger);
                return (
                  <button
                    key={key}
                    className={[
                      'seat',
                      `seat--${seat.type}`,
                      ladies ? 'seat--ladies' : '',
                      seat.status === 'unavailable' ? 'seat--unavail' : '',
                      selected ? 'seat--selected' : '',
                      blocked && !selected ? 'seat--blocked' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => onToggle(seat)}
                    disabled={blocked}
                    title={`${seat.deck} deck · ${currency.format(seat.price)}${ladies ? ' · Ladies only' : ''}`}
                    aria-label={`Seat ${seat.id}, ${seat.deck} deck, ${currency.format(seat.price)}, ${
                      seat.status === 'unavailable' ? 'booked' : ladies ? 'ladies only' : 'available'
                    }`}
                  >
                    {isSleeper ? (
                      <span className="seat__berth">{seat.id.replace(/^\w-/, '')}</span>
                    ) : (
                      <span className="seat__no">{String(seat.row * 4 + seat.col + 1)}</span>
                    )}
                    {selected && <span className="seat__check"><Icon name="check" size={12} /></span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
