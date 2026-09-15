/** Booking flow step indicator — mirrors reference labels:
    "Select seats" → "Board/Drop point" → "Passenger Info". */

import './StepIndicator.css';

export interface StepIndicatorProps {
  current: 1 | 2 | 3;
}

const STEPS = ['Select seats', 'Board/Drop point', 'Passenger Info'];

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <ol className="steps" aria-label={`Step ${current} of 3`}>
      {STEPS.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3;
        const state = n < current ? 'done' : n === current ? 'current' : 'todo';
        return (
          <li key={label} className={`steps__item steps__item--${state}`} aria-current={n === current ? 'step' : undefined}>
            <span className="steps__dot">{n < current ? '✓' : n}</span>
            <span className="steps__label">{label}</span>
            {i < STEPS.length - 1 && <span className="steps__connector" />}
          </li>
        );
      })}
    </ol>
  );
}
