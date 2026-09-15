/** Date/time helpers used across screens. */

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDisplay(iso: string): string {
  const d = fromISODate(iso);
  const today = new Date();
  const tmr = new Date();
  tmr.setDate(today.getDate() + 1);
  if (toISODate(today) === iso) return 'Today';
  if (toISODate(tmr) === iso) return 'Tomorrow';
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatShort(iso: string): string {
  const d = fromISODate(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatFull(iso: string): string {
  const d = fromISODate(iso);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function isWeekend(iso: string): boolean {
  const d = fromISODate(iso).getDay();
  return d === 5 || d === 6 || d === 0; // Fri, Sat, Sun
}

export function durationText(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function timeTo12h(hhmm: string): string {
  const [h, m] = hhmm.replace(' (+1d)', '').split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Days from today: 0 = today. */
export function daysFromToday(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISODate(d);
}
