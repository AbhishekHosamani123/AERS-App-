import type { LevelData } from '../../data/journeyData';
import './PodiumNode.css';

interface PodiumNodeProps {
  level: LevelData;
  status: 'completed' | 'current' | 'locked';
  stars: number;
  onClick: () => void;
}

export function PodiumNode({ level, status, stars, onClick }: PodiumNodeProps) {
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';
  const isMilestone = Boolean(level.isMilestone);

  const getStatusIcon = () => {
    if (isCompleted) return '✓';
    if (isLocked) return '🔒';
    if (isMilestone) return '👑';
    return '⚡';
  };

  return (
    <div
      id={`level-node-${level.id}`}
      className={`podium-node is-${status} ${isMilestone ? 'is-milestone' : ''}`}
      style={{ left: `${level.pxX}px`, top: `${level.pxY}px` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Level ${level.numberStr}: ${level.title} - ${
        isCompleted ? 'Completed' : isCurrent ? 'Active Level' : 'Locked'
      }`}
    >
      {/* 3 Gold Stars Floating Above */}
      <div className="podium-node__stars" aria-hidden="true">
        {[1, 2, 3].map((sIndex) => {
          const hasStar = sIndex <= stars;
          return (
            <span
              key={sIndex}
              className={`podium-node__star ${hasStar ? 'is-earned' : 'is-empty'}`}
            >
              ★
            </span>
          );
        })}
      </div>

      {/* Animated "You Are Here" Player Pin for Current Active Level */}
      {isCurrent && (
        <div className="podium-node__player-pin">
          <div className="podium-player-badge">
            <span className="podium-player-pulse" />
            <span className="podium-player-icon">🚀</span>
          </div>
          <div className="podium-player-tag">YOU ARE HERE</div>
        </div>
      )}

      {/* 3D Floating Isometric Cylinder / Puck */}
      <div className="podium-cylinder-wrapper">
        {/* Floating Top Status Badge */}
        <div className="podium-icon-badge">
          <span className="podium-icon-glyph">{getStatusIcon()}</span>
        </div>

        {/* 3D Cylinder Disc */}
        <div className="podium-cylinder">
          {/* Top Face Ellipse */}
          <div className="podium-top-face">
            <div className="podium-top-highlight" />
          </div>

          {/* Front Face with Level Number */}
          <div className="podium-front-body">
            <span className="podium-number">{level.numberStr}</span>
          </div>
        </div>

        {/* Ground Diffuse Shadow */}
        <div className="podium-ground-shadow" />
      </div>

      {/* Simplified, High-Legibility Title Capsule Pill */}
      <div className="podium-title-capsule">
        {isCompleted && <span className="podium-status-dot is-check">✓</span>}
        {isCurrent && <span className="podium-status-dot is-pulse" />}
        {isLocked && <span className="podium-status-dot is-lock">🔒</span>}
        <span className="podium-title-text">{level.title}</span>
      </div>
    </div>
  );
}
