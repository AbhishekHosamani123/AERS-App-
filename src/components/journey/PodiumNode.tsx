import type { LevelData } from '../../data/journeyData';
import greenBookImg from '../../assets/Green_closed_book.png';
import openBookImg from '../../assets/Open_Book.png';
import blueBookImg from '../../assets/Blue_closed_book.png';
import goldenBookImg from '../../assets/Golden_close_book.png';
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

  const getBookImage = () => {
    if (isMilestone) return goldenBookImg;
    if (isCompleted) return greenBookImg;
    if (isCurrent) return openBookImg;
    return blueBookImg; // locked
  };

  const getBookAltText = () => {
    if (isMilestone) return `Milestone Level ${level.numberStr} (Golden Book)`;
    if (isCompleted) return `Completed Level ${level.numberStr} (Green Book)`;
    if (isCurrent) return `Current Active Level ${level.numberStr} (Open Book)`;
    return `Locked Level ${level.numberStr} (Blue Book)`;
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

      {/* 3D Book Visual Container */}
      <div className="podium-book-wrapper">
        {/* Floating Level Number Pill Badge */}
        <div className="podium-book-badge">
          <span className="podium-book-num">{level.numberStr}</span>
          {isCompleted && <span className="podium-book-badge-icon">✓</span>}
          {isLocked && <span className="podium-book-badge-icon">🔒</span>}
          {isMilestone && <span className="podium-book-badge-icon">👑</span>}
        </div>

        {/* 3D Book Graphic */}
        <img
          src={getBookImage()}
          alt={getBookAltText()}
          className={`podium-book-img ${isCurrent ? 'is-current-book' : ''}`}
          draggable={false}
        />

        {/* Diffuse Ground Shadow */}
        <div className="podium-ground-shadow" />
      </div>

      {/* High-Legibility Title Capsule Pill */}
      <div className="podium-title-capsule">
        {isCompleted && <span className="podium-status-dot is-check">✓</span>}
        {isCurrent && <span className="podium-status-dot is-pulse" />}
        {isLocked && <span className="podium-status-dot is-lock">🔒</span>}
        <span className="podium-title-text">{level.title}</span>
      </div>
    </div>
  );
}
