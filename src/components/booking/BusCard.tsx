/* ============================================================
   BusCard — search-result list card: operator, schedule,
   duration, price, amenities, seats left, CTA.
   ============================================================ */

import type { BusService } from '../../types';
import { currency } from '../../design/tokens';
import { durationText, timeTo12h } from '../../utils/datetime';
import { Icon } from '../icons/Icon';
import './BusCard.css';

export interface BusCardProps {
  service: BusService;
  onSelect: (service: BusService) => void;
}

const AMENITY_ICONS = {
  wifi: 'wifi',
  charging: 'charging',
  water: 'water',
  blanket: 'blanket',
  movie: 'movie',
  lightning: 'lightning',
} as const;

export function BusCard({ service, onSelect }: BusCardProps) {
  const amenityList = (Object.keys(AMENITY_ICONS) as (keyof typeof AMENITY_ICONS)[]).filter(
    (k) => service.amenities[k]
  );

  const seatsPct = Math.round((service.seatsAvailable / service.seatsTotal) * 100);
  const lowSeats = service.seatsAvailable <= 6;

  return (
    <article
      className={`buscard ${service.isPrime ? 'buscard--prime' : ''}`}
      onClick={() => onSelect(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(service)}
    >
      <div className="buscard__top">
        <div className="buscard__op">
          <h3 className="buscard__name">{service.operatorName}</h3>
          <span className="buscard__class">{service.busClass}</span>
        </div>
        {service.rating > 0 && (
          <div className="buscard__rating" title={`${service.ratingCount} ratings`}>
            <Icon name="star-filled" size={11} />
            {service.rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="buscard__schedule">
        <div className="buscard__time">
          <strong>{timeTo12h(service.departTime)}</strong>
          <span>{durationText(service.durationMinutes)}</span>
          <strong>{timeTo12h(service.arriveTime)}</strong>
        </div>
        <div className="buscard__price">{currency.format(service.basePrice)}</div>
      </div>

      <div className="buscard__meta">
        <div className="buscard__amenities" aria-label="Amenities">
          {amenityList.slice(0, 5).map((k) => (
            <span key={k} className="buscard__amenity" title={k}>
              <Icon name={AMENITY_ICONS[k]} size={15} />
            </span>
          ))}
          {service.liveTracking && (
            <span className="buscard__amenity buscard__amenity--live" title="Live tracking">
              <Icon name="pin" size={15} />
            </span>
          )}
        </div>
        <span className={`buscard__seats ${lowSeats ? 'buscard__seats--low' : ''}`}>
          {service.seatsAvailable} seats left
        </span>
      </div>

      {(service.isPrime || service.freeCancellation) && (
        <div className="buscard__tags">
          {service.isPrime && <span className="buscard__tag buscard__tag--prime">PRIME</span>}
          {service.freeCancellation && (
            <span className="buscard__tag buscard__tag--free">
              <Icon name="check" size={10} /> Free cancellation
            </span>
          )}
        </div>
      )}

      <div className="buscard__select">
        <span className="buscard__select-label">Select seats</span>
        <Icon name="chevron-right" size={16} />
      </div>

      {/* subtle progress of seat availability */}
      <div className="buscard__availability" aria-hidden="true">
        <span style={{ width: `${seatsPct}%` }} />
      </div>
    </article>
  );
}
