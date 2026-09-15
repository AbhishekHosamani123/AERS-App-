/* ============================================================
   Search results — list of services with sort + filters,
   skeleton loading, empty and error states.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, AppBarAction } from '../components/ui/AppBar';
import { Button } from '../components/ui/Button';
import { Sheet } from '../components/ui/Sheet';
import { EmptyState, ErrorState, ListSkeleton } from '../components/ui/StateView';
import { Icon } from '../components/icons/Icon';
import { BusCard } from '../components/booking/BusCard';
import { getOperators, searchBuses } from '../services/api';
import { useSearchState } from '../state/searchStore';
import { startDraft } from '../state/draftStore';
import { cityById } from '../mock';
import type { BusFilters, BusService, DepartureSlot, Operator, SortKey } from '../types';
import { currency } from '../design/tokens';
import { formatDisplay } from '../utils/datetime';
import './SearchResultsScreen.css';

const EMPTY_FILTERS: BusFilters = {
  busTypes: [],
  amenities: [],
  departureSlots: [],
  arrivalSlots: [],
  operators: [],
  minRating: 0,
  onlyAvailable: false,
  singleSeats: false,
};

const SORT_LABELS: Record<SortKey, string> = {
  smart: 'Smart sort',
  price: 'Cheapest first',
  duration: 'Fastest first',
  departure: 'Earliest departure',
  rating: 'Top rated',
};

const BUS_TYPES = ['AC Sleeper', 'AC Seater', 'Non-AC Sleeper', 'Non-AC Seater', 'Volvo AC Multi-Axle'] as const;
const AMENITIES = ['wifi', 'charging', 'water', 'blanket', 'movie', 'lightning'] as const;
const SLOTS: { id: DepartureSlot; label: string; range: string }[] = [
  { id: 'early', label: 'Before 6 AM', range: '12am–6am' },
  { id: 'morning', label: '6 AM – 12 PM', range: '6am–12pm' },
  { id: 'afternoon', label: '12 PM – 5 PM', range: '12pm–5pm' },
  { id: 'evening', label: '5 PM – 9 PM', range: '5pm–9pm' },
  { id: 'night', label: 'After 9 PM', range: '9pm–12am' },
];

export function SearchResultsScreen() {
  const navigate = useNavigate();
  const search = useSearchState();

  const [services, setServices] = useState<BusService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortSheet, setSortSheet] = useState(false);
  const [filterSheet, setFilterSheet] = useState(false);
  const [sort, setSort] = useState<SortKey>('smart');
  const [filters, setFilters] = useState<BusFilters>(EMPTY_FILTERS);
  const [operators, setOperators] = useState<Operator[]>([]);

  const from = search.fromCityId ? cityById(search.fromCityId)?.name : '';
  const to = search.toCityId ? cityById(search.toCityId)?.name : '';

  const load = useCallback(async () => {
    if (!search.fromCityId || !search.toCityId) {
      navigate('/home', { replace: true });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await searchBuses({
        fromCityId: search.fromCityId,
        toCityId: search.toCityId,
        dateISO: search.dateISO,
        filters,
        sort,
      });
      setServices(res.services);
    } catch {
      setError('Could not load buses for this route.');
    } finally {
      setLoading(false);
    }
  }, [search.fromCityId, search.toCityId, search.dateISO, filters, sort, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    getOperators().then(setOperators);
  }, []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.busTypes.length) n++;
    if (filters.amenities.length) n++;
    if (filters.departureSlots.length) n++;
    if (filters.arrivalSlots.length) n++;
    if (filters.operators.length) n++;
    if (filters.minRating > 0) n++;
    if (filters.onlyAvailable) n++;
    if (filters.singleSeats) n++;
    return n;
  }, [filters]);

  function selectService(svc: BusService) {
    startDraft(svc, search.dateISO);
    navigate('/booking/seats');
  }

  const cheapest = useMemo(
    () => services.reduce((min, s) => Math.min(min, s.basePrice), Infinity),
    [services]
  );

  return (
    <div className="results">
      <AppBar
        tone="surface"
        onBack={() => navigate('/home')}
        title={
          <span className="results__title">
            {from} <Icon name="chevron-right" size={12} /> {to}
          </span>
        }
        subtitle={`${services.length} buses · ${formatDisplay(search.dateISO)}`}
        actions={
          <AppBarAction
            icon="calendar"
            label="Change date"
            onClick={() => navigate('/home')}
          />
        }
      />

      {/* Sort / filter bar */}
      <div className="results__bar">
        <button className={`results__bar-btn ${sort !== 'smart' ? 'is-active' : ''}`} onClick={() => setSortSheet(true)}>
          <Icon name="sort" size={15} />
          {SORT_LABELS[sort]}
          <Icon name="chevron-down" size={12} />
        </button>
        <button
          className={`results__bar-btn ${activeFilterCount ? 'is-active' : ''}`}
          onClick={() => setFilterSheet(true)}
        >
          <Icon name="filter" size={15} />
          Filters
          {activeFilterCount > 0 && <span className="results__bar-badge">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="results__scroll">
        {loading ? (
          <div className="results__list">
            <ListSkeleton rows={5} height={150} />
          </div>
        ) : error ? (
          <ErrorState title="Could not load results" subtitle={error} onAction={load} />
        ) : services.length === 0 ? (
          <EmptyState
            icon="bus"
            title="No buses match your filters"
            subtitle="Try removing some filters or changing the travel date."
            actionLabel="Clear all filters"
            onAction={() => setFilters(EMPTY_FILTERS)}
          />
        ) : (
          <>
            {Number.isFinite(cheapest) && (
              <p className="results__hint">
                <Icon name="lightning" size={13} /> Cheapest fare on this date: {currency.format(cheapest)}
              </p>
            )}
            <div className="results__list">
              {services.map((s) => (
                <BusCard key={s.id} service={s} onSelect={selectService} />
              ))}
            </div>
            <p className="results__end">End of results · fares update in real time</p>
          </>
        )}
      </div>

      {/* Sort sheet */}
      <Sheet open={sortSheet} onClose={() => setSortSheet(false)} title="Sort by">
        <div className="sortlist">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
            <button
              key={k}
              className={`sortlist__item ${sort === k ? 'is-active' : ''}`}
              onClick={() => {
                setSort(k);
                setSortSheet(false);
              }}
            >
              <span>{SORT_LABELS[k]}</span>
              {sort === k && <Icon name="check" size={17} />}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Filter sheet */}
      <Sheet
        open={filterSheet}
        onClose={() => setFilterSheet(false)}
        title="Filters"
        footer={
          <div className="filterfoot">
            <Button variant="text" onClick={() => setFilters(EMPTY_FILTERS)}>
              Clear all
            </Button>
            <Button
              onClick={() => {
                setFilterSheet(false);
              }}
            >
              Apply
            </Button>
          </div>
        }
      >
        <FilterBody filters={filters} setFilters={setFilters} operators={operators} />
      </Sheet>
    </div>
  );
}

/* ------------------------------ Filter body -------------------------------- */

function FilterBody({
  filters,
  setFilters,
  operators,
}: {
  filters: BusFilters;
  setFilters: React.Dispatch<React.SetStateAction<BusFilters>>;
  operators: Operator[];
}) {
  const toggle = <K extends 'busTypes' | 'amenities' | 'departureSlots' | 'arrivalSlots' | 'operators'>(
    key: K,
    value: BusFilters[K][number]
  ) => {
    setFilters((f) => {
      const arr = f[key] as typeof value[];
      const has = arr.includes(value);
      return { ...f, [key]: has ? arr.filter((v) => v !== value) : [...arr, value] } as BusFilters;
    });
  };

  return (
    <div className="filterbody">
      <FilterGroup title="Bus type">
        {BUS_TYPES.map((t) => (
          <CheckChip
            key={t}
            label={t}
            checked={filters.busTypes.includes(t)}
            onToggle={() => toggle('busTypes', t)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Amenities">
        {AMENITIES.map((a) => (
          <CheckChip
            key={a}
            label={a}
            checked={filters.amenities.includes(a)}
            onToggle={() => toggle('amenities', a)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Departure time">
        {SLOTS.map((s) => (
          <CheckChip
            key={s.id}
            label={`${s.label}`}
            checked={filters.departureSlots.includes(s.id)}
            onToggle={() => toggle('departureSlots', s.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Arrival time">
        {SLOTS.map((s) => (
          <CheckChip
            key={s.id}
            label={`${s.label}`}
            checked={filters.arrivalSlots.includes(s.id)}
            onToggle={() => toggle('arrivalSlots', s.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={`Operator rating ${filters.minRating ? `· ${filters.minRating}+` : ''}`}>
        {[3, 3.5, 4, 4.5].map((r) => (
          <button
            key={r}
            className={`starbtn ${filters.minRating === r ? 'is-active' : ''}`}
            onClick={() => setFilters((f) => ({ ...f, minRating: f.minRating === r ? 0 : r }))}
          >
            <Icon name="star-filled" size={13} /> {r} & above
          </button>
        ))}
      </FilterGroup>

      {operators.length > 0 && (
        <FilterGroup title="Operators">
          {operators.map((o) => (
            <CheckChip
              key={o.id}
              label={`${o.name} · ${o.rating.toFixed(1)}★`}
              checked={filters.operators.includes(o.id)}
              onToggle={() => toggle('operators', o.id)}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Preferences">
        <label className="switchrow">
          <span>Available buses only</span>
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(e) => setFilters((f) => ({ ...f, onlyAvailable: e.target.checked }))}
          />
        </label>
        <label className="switchrow">
          <span>Single seats available</span>
          <input
            type="checkbox"
            checked={filters.singleSeats}
            onChange={(e) => setFilters((f) => ({ ...f, singleSeats: e.target.checked }))}
          />
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="filtergroup">
      <h4>{title}</h4>
      <div className="filtergroup__chips">{children}</div>
    </section>
  );
}

function CheckChip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button className={`chip ${checked ? 'is-active' : ''}`} onClick={onToggle} aria-pressed={checked}>
      {checked && <Icon name="check" size={11} />}
      {label}
    </button>
  );
}
