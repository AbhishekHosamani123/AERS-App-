import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AERS_LEVELS, AERS_MODULES } from '../../data/journeyData';
import './LearningPathCTA.css';

const STORAGE_KEY = 'aers_journey_progress_v4';

interface ProgressState {
  completedLevels: number[];
  levelStars: Record<number, number>;
  currentLevel: number;
  passportUnlocked: boolean;
  learnerName: string;
}

const DEFAULT_STATE: ProgressState = {
  completedLevels: [1],
  levelStars: { 1: 3 },
  currentLevel: 2,
  passportUnlocked: false,
  learnerName: 'Alex Morgan',
};

function getStoredProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {}
  return DEFAULT_STATE;
}

export function LearningPathCTA() {
  const navigate = useNavigate();
  const progress = useMemo(() => getStoredProgress(), []);

  // Find active level data
  const currentLevel = useMemo(() => {
    return AERS_LEVELS.find((l) => l.id === progress.currentLevel) || AERS_LEVELS[1] || AERS_LEVELS[0];
  }, [progress.currentLevel]);

  // Find active module data
  const currentModule = useMemo(() => {
    return AERS_MODULES.find((m) => m.id === currentLevel.moduleId) || AERS_MODULES[0];
  }, [currentLevel.moduleId]);

  // Calculate stats
  const totalStars = Object.values(progress.levelStars || {}).reduce((acc, s) => acc + s, 0) || 3;
  const completedCount = progress.completedLevels ? progress.completedLevels.length : 1;
  const progressPct = Math.round((completedCount / 20) * 100) || 5;

  function handleResume() {
    if (currentLevel.id === 1) {
      navigate('/journey/level-1');
    } else {
      navigate('/journey');
    }
  }

  return (
    <section className="learning-cta-card" aria-label="Current Learning Stage">
      {/* Decorative Compass Graphic Asset in Top-Right Corner */}
      <div className="learning-cta-card__compass-wrap" aria-hidden="true">
        <img
          src="/clock.png"
          alt=""
          className="learning-cta-card__compass-img"
        />
      </div>

      {/* Top Section with Status Badge & Module Title */}
      <div className="learning-cta-card__header-row">
        <div className="learning-cta-card__header-left">
          <div className="learning-cta-card__stage-pill">
            <span className="learning-cta-card__stage-dot" />
            <span>CURRENT LEARNING STAGE</span>
          </div>

          <div className="learning-cta-card__module-info">
            <span className="learning-cta-card__module-num">
              Module {currentModule.id.toString().padStart(2, '0')}
            </span>
            <h2 className="learning-cta-card__module-title">{currentModule.name}</h2>
          </div>
        </div>
      </div>

      {/* Level Section with Blue Badge and Details */}
      <div className="learning-cta-card__level-row">
        <div className="learning-cta-card__level-badge">
          <span className="learning-cta-card__level-num">{currentLevel.numberStr}</span>
          <span className="learning-cta-card__level-label">Level</span>
        </div>

        <div className="learning-cta-card__level-details">
          <div className="learning-cta-card__status-pill">
            <span className="learning-cta-card__status-dot" />
            <span>IN PROGRESS</span>
          </div>
          <h3 className="learning-cta-card__level-title">{currentLevel.title}</h3>
          <p className="learning-cta-card__level-desc">{currentLevel.objective}</p>
        </div>
      </div>

      {/* Skill Chips */}
      {currentLevel.skills && currentLevel.skills.length > 0 && (
        <div className="learning-cta-card__skills-wrap">
          {currentLevel.skills.map((skill, i) => (
            <span key={i} className="learning-cta-card__skill-chip">
              <span className="learning-cta-card__skill-check">✓</span>
              <span>{skill}</span>
            </span>
          ))}
        </div>
      )}

      {/* Overall Journey Progress */}
      <div className="learning-cta-card__progress-block">
        <div className="learning-cta-card__progress-meta">
          <span className="learning-cta-card__progress-title">Overall Progress</span>
          <span className="learning-cta-card__progress-stat">
            {progressPct}% ({completedCount}/20 Levels)
          </span>
        </div>
        <div className="learning-cta-card__progress-track">
          <div
            className="learning-cta-card__progress-fill"
            style={{ width: `${Math.max(progressPct, 5)}%` }}
          />
        </div>
      </div>

      {/* Stats Row (3 Columns: Stars, Streak, Goal) */}
      <div className="learning-cta-card__stats-row">
        <div className="learning-cta-card__stat-col">
          <span className="learning-cta-card__stat-icon">⭐</span>
          <div className="learning-cta-card__stat-text">
            <strong>{totalStars} / 60</strong>
            <small>Stars Earned</small>
          </div>
        </div>

        <div className="learning-cta-card__stat-divider" />

        <div className="learning-cta-card__stat-col">
          <span className="learning-cta-card__stat-icon">🔥</span>
          <div className="learning-cta-card__stat-text">
            <strong>7 Days</strong>
            <small>Learning Streak</small>
          </div>
        </div>

        <div className="learning-cta-card__stat-divider" />

        <div className="learning-cta-card__stat-col">
          <span className="learning-cta-card__stat-icon">🎓</span>
          <div className="learning-cta-card__stat-text">
            <strong>Passport</strong>
            <small>Final Goal</small>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        className="learning-cta-card__cta-btn"
        onClick={handleResume}
        aria-label={`Continue Level ${currentLevel.id}: ${currentLevel.title}`}
      >
        <span className="learning-cta-card__cta-text">Continue Level {currentLevel.id}</span>
        <span className="learning-cta-card__cta-arrow">→</span>
      </button>
    </section>
  );
}
