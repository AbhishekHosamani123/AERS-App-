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
  const isMilestone = level.isMilestone;

  const renderIcon = () => {
    if (isLocked) return '🔒';
    if (isCompleted) return '✓';
    switch (level.iconName) {
      case 'search':
        return '🔍';
      case 'book':
        return '📖';
      case 'compass':
        return '🧭';
      case 'trend':
        return '📈';
      case 'users':
        return '👥';
      case 'chart':
        return '📊';
      case 'document':
        return '📄';
      case 'shield':
        return '🛡️';
      case 'chat':
        return '💬';
      case 'target':
        return '🎯';
      default:
        return '⭐';
    }
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
        isCompleted ? 'Completed' : isCurrent ? 'Current Active' : 'Locked'
      }`}
    >
      {/* 3 Gold Stars Floating Above */}
      <div className="podium-node__stars">
        {[1, 2, 3].map((sIndex) => {
          const hasStar = sIndex <= stars;
          return (
            <span
              key={sIndex}
              className={`podium-node__star ${hasStar ? 'is-earned' : 'is-empty'}`}
            >
              ⭐
            </span>
          );
        })}
      </div>

      {/* Animated "You Are Here" Player Pin */}
      {isCurrent && (
        <div className="podium-node__player-pin">
          <div className="podium-player-avatar">
            <span className="podium-player-icon">🚀</span>
          </div>
          <div className="podium-player-tag">YOU ARE HERE</div>
        </div>
      )}

      {/* 3D Floating Isometric Cylinder Puck */}
      <div className="podium-cylinder-wrapper">
        {/* Floating Top Icon Badge */}
        <div className="podium-icon-badge">
          <span className="podium-icon-glyph">{renderIcon()}</span>
        </div>

        {/* 3D Cylinder */}
        <div className="podium-cylinder">
          {/* Top Ellipse Face */}
          <div className="podium-top-face">
            <div className="podium-top-highlight" />
          </div>

          {/* Front Body with Number */}
          <div className="podium-front-body">
            <span className="podium-number">{level.numberStr}</span>
          </div>
        </div>

        {/* Diffuse Ground Shadow */}
        <div className="podium-ground-shadow" />
      </div>

      {/* Title Capsule (Pill) */}
      <div className="podium-title-capsule">
        <span className="podium-title-text">{level.title}</span>
      </div>

      {/* Subtitle Description */}
      <p className="podium-subtitle-text">{level.subtitle}</p>
    </div>
  );
}
