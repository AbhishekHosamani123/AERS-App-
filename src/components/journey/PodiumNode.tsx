import type { LevelData } from '../../data/journeyData';
import './PodiumNode.css';

interface PodiumNodeProps {
  level: LevelData;
  status: 'completed' | 'current' | 'unlocked' | 'locked';
  stars: number;
  onClick: () => void;
  isShaking?: boolean;
}

export function PodiumNode({ level, status, stars, onClick, isShaking }: PodiumNodeProps) {
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';
  const isMilestone = Boolean(level.isMilestone);

  return (
    <div
      id={`level-node-${level.id}`}
      className={`podium-node is-${status} ${isMilestone ? 'is-milestone' : ''} ${isShaking ? 'is-shaking' : ''}`}
      style={{ left: `${level.pxX}px`, top: `${level.pxY}px` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Level ${level.numberStr}: ${level.title} — ${isCompleted ? 'Completed' : isCurrent ? 'Current' : isLocked ? 'Locked' : 'Available'}`}
    >
      {/* Current — subtle "You are here" label */}
      {isCurrent && <span className="podium-node__pin">Current</span>}

      {/* Minimal circle node — no images, no 3D */}
      <div className="podium-node__circle" aria-hidden="true">
        <span className="podium-node__num">{level.numberStr}</span>
        {isCompleted && <span className="podium-node__check">✓</span>}
        {isLocked && <span className="podium-node__lock">🔒</span>}
        {isMilestone && !isCompleted && !isLocked && <span className="podium-node__crown">◆</span>}
      </div>

      {/* Title — single line, quiet */}
      <div className="podium-node__label">
        <span className="podium-node__dot" aria-hidden="true" />
        <span className="podium-node__title">{level.title}</span>
      </div>

      {/* Stars — muted, only when earned */}
      {stars > 0 && (
        <div className="podium-node__stars" aria-label={`${stars} of 3 stars`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={`podium-star ${i <= stars ? 'is-on' : ''}`} aria-hidden="true">
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
