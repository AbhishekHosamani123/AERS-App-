import { useEffect, useRef, useState, useMemo, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/brand/Logo';
import {
  AERS_LEVELS,
  AERS_MODULES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  type LevelData,
} from '../data/journeyData';
import { JourneyTrackSvg } from '../components/journey/JourneyTrackSvg';
import { PodiumNode } from '../components/journey/PodiumNode';
import { sound } from '../utils/sound';
import journeyBgImg from '../assets/new_journey_baground.png';
import lastBookImg from '../assets/last_book.png';
import './JourneyScreen.css';

interface ProgressState {
  completedLevels: number[];
  levelStars: Record<number, number>; // levelId -> stars (1-3)
  currentLevel: number; // 1..20
  passportUnlocked: boolean;
  soundEnabled: boolean;
  learnerName: string;
}

const STORAGE_KEY = 'aers_journey_progress_v4';

const DEFAULT_STATE: ProgressState = {
  completedLevels: [1],
  levelStars: { 1: 3 },
  currentLevel: 2,
  passportUnlocked: false,
  soundEnabled: true,
  learnerName: 'Alex Morgan',
};

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_STATE, ...parsed };
    }
  } catch {}
  return DEFAULT_STATE;
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function JourneyScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [activeLevel, setActiveLevel] = useState<LevelData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [activeSignInfo, setActiveSignInfo] = useState<{ title: string; subtitle: string; text: string } | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [showDevMenu, setShowDevMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync state to storage
  useEffect(() => {
    saveProgress(progress);
    sound.toggleSound(progress.soundEnabled);
  }, [progress]);

  // Total stars calculation
  const totalStars = useMemo(() => {
    return Object.values(progress.levelStars).reduce((acc, s) => acc + s, 0);
  }, [progress.levelStars]);

  const progressPercent = useMemo(() => {
    const totalPossible = 20;
    const completedCount = progress.completedLevels.length;
    return Math.min(100, Math.round((completedCount / totalPossible) * 100));
  }, [progress.completedLevels]);

  const scrollToLevel = (levelId: number, smooth = true) => {
    const nodeEl = document.getElementById(`level-node-${levelId}`);
    if (nodeEl && scrollRef.current) {
      const container = scrollRef.current;
      const containerHeight = container.clientHeight;
      const nodeTop = nodeEl.offsetTop;
      const targetScroll = Math.max(0, nodeTop - containerHeight / 2 + 20);
      container.scrollTo({
        top: targetScroll,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  // Initial scroll: Automatically center on the learner's CURRENT learning stage on switch
  useEffect(() => {
    const t1 = setTimeout(() => {
      scrollToLevel(progress.currentLevel, false);
    }, 40);
    const t2 = setTimeout(() => {
      scrollToLevel(progress.currentLevel, true);
    }, 220);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [progress.currentLevel]);

  const handleLevelClick = (level: LevelData) => {
    const isCompleted = progress.completedLevels.includes(level.id);
    const isCurrent = progress.currentLevel === level.id;
    const isLocked = !isCompleted && !isCurrent;

    if (isLocked) {
      sound.playLocked();
      return;
    }

    sound.playTap();
    setActiveLevel(level);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (activeLevel) {
      if (idx === activeLevel.challenge.correctIndex) {
        sound.playStar(3);
      } else {
        sound.playLocked();
      }
    }
  };

  const handleCompleteLevel = () => {
    if (!activeLevel) return;

    const isCorrect = selectedOption === activeLevel.challenge.correctIndex;
    const earnedStars = isCorrect ? 3 : 2;

    sound.playLevelSuccess();
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);

    setProgress((prev) => {
      const nextCompleted = Array.from(new Set([...prev.completedLevels, activeLevel.id]));
      const nextStars = {
        ...prev.levelStars,
        [activeLevel.id]: Math.max(prev.levelStars[activeLevel.id] || 0, earnedStars),
      };
      const nextLevel = Math.min(20, Math.max(prev.currentLevel, activeLevel.id + 1));
      const passportUnlocked = nextCompleted.length >= 20 || activeLevel.id === 20;

      return {
        ...prev,
        completedLevels: nextCompleted,
        levelStars: nextStars,
        currentLevel: nextLevel,
        passportUnlocked: passportUnlocked || prev.passportUnlocked,
      };
    });

    setActiveLevel(null);
  };

  const handlePassportClick = () => {
    sound.playGrandFanfare();
    setShowPassport(true);
  };

  const unlockAllDemo = () => {
    const allIds = AERS_LEVELS.map((l) => l.id);
    const allStars: Record<number, number> = {};
    allIds.forEach((id) => {
      allStars[id] = 3;
    });
    setProgress({
      completedLevels: allIds,
      levelStars: allStars,
      currentLevel: 20,
      passportUnlocked: true,
      soundEnabled: progress.soundEnabled,
      learnerName: progress.learnerName,
    });
    setShowDevMenu(false);
    sound.playGrandFanfare();
  };

  const resetProgressDemo = () => {
    setProgress(DEFAULT_STATE);
    setShowDevMenu(false);
    sound.playTap();
  };

  const toggleSound = () => {
    setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleSharePassport = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="journey-page">
      {/* ================= STICKY HUD HEADER (Clean Theme) ================= */}
      <header className="journey-hud" aria-label="Journey Progress Header">
        <div className="journey-hud__top-row">
          <div
            className="journey-hud__brand"
            onClick={() => navigate('/home')}
            role="button"
            tabIndex={0}
            title="AERS Home"
          >
            <Logo withWordmark size={26} />
            <span className="app-header__subtitle">Journey</span>
          </div>

          <div className="journey-hud__stats">
            {/* Stars Pill */}
            <div className="journey-hud__pill journey-hud__pill--stars" title="Total Stars Earned">
              <span className="journey-hud__star-icon">⭐</span>
              <span className="journey-hud__pill-val">{totalStars}</span>
              <span className="journey-hud__pill-max">/60</span>
            </div>

            {/* Level Pill */}
            <button
              className="journey-hud__pill journey-hud__pill--lvl"
              onClick={() => scrollToLevel(progress.currentLevel)}
              title="Jump to current active level"
            >
              <span className="journey-hud__lvl-icon">🎯</span>
              <span className="journey-hud__pill-val">Lvl {progress.currentLevel}</span>
            </button>

            {/* Sound Toggle */}
            <button
              className={`journey-hud__icon-btn ${progress.soundEnabled ? 'is-active' : ''}`}
              onClick={toggleSound}
              aria-label="Toggle game sounds"
              title={progress.soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            >
              {progress.soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Dev Controls */}
            <button
              className="journey-hud__icon-btn"
              onClick={() => setShowDevMenu(!showDevMenu)}
              title="Demo Actions"
              aria-label="Demo options"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Multi-color Gradient Progress Bar */}
        <div className="journey-hud__progress-track" title={`${progressPercent}% Journey Completed`}>
          <div className="journey-hud__progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </header>

      {/* ================= DEV / DEMO MENU MODAL ================= */}
      {showDevMenu && (
        <div className="journey-devmodal-backdrop" onClick={() => setShowDevMenu(false)}>
          <div className="journey-devmodal" onClick={(e) => e.stopPropagation()}>
            <h3 className="journey-devmodal__title">Demo / Progression Controls</h3>
            <p className="journey-devmodal__desc">
              Quickly test unlocking all 20 levels or reset progression to Level 1.
            </p>
            <div className="journey-devmodal__actions">
              <button className="journey-btn journey-btn--primary" onClick={unlockAllDemo}>
                ⚡ Unlock All 20 Levels & Passport
              </button>
              <button className="journey-btn journey-btn--secondary" onClick={resetProgressDemo}>
                🔄 Reset to Level 1
              </button>
              <button className="journey-btn journey-btn--ghost" onClick={() => setShowDevMenu(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN SCROLLABLE MAP CONTAINER ================= */}
      <div className="journey-scroll" ref={scrollRef}>
        <div
          className="journey-canvas"
          style={{
            width: `${CANVAS_WIDTH}px`,
            height: `${CANVAS_HEIGHT}px`,
            backgroundImage: `url(${journeyBgImg})`,
          }}
        >
          {/* Background Illustration Layer */}
          <img
            src={journeyBgImg}
            alt="Journey Background"
            className="journey-canvas-bg"
            aria-hidden="true"
          />

          {/* 1. Vector Map Clean Track & Minimalist Elements */}
          <JourneyTrackSvg />

          {/* ================= 2. SUMMIT DESTINATION (EMPLOYABILITY PASSPORT) ================= */}
          <div
            className="journey-clean-summit"
            style={{ left: '215px', top: '120px' }}
            onClick={handlePassportClick}
            role="button"
            tabIndex={0}
            title="Click to view Employability Passport"
          >
            <div className="journey-clean-summit__trophy">
              <span className="journey-clean-summit__sparkle">✨</span>
              <img
                src={lastBookImg}
                alt="Golden Sacred Passport Book"
                className="journey-summit-book-icon"
                draggable={false}
              />
              <span className="journey-clean-summit__sparkle">✨</span>
            </div>

            {/* Grand Golden 3D Podium */}
            <div className="journey-summit-podium">
              <div className="journey-summit-top-face">
                <span className="journey-summit-crown">👑</span>
              </div>
              <div className="journey-summit-body">
                <span className="journey-summit-title">PASSPORT</span>
              </div>
            </div>

            <div className="journey-summit-card">
              <div className="journey-summit-card__badge-row">
                <span className="journey-summit-card__badge">🌟 FINAL DESTINATION</span>
                {progress.passportUnlocked && (
                  <span className="journey-summit-card__unlocked-tag">UNLOCKED</span>
                )}
              </div>
              <h3 className="journey-summit-card__title">EMPLOYABILITY PASSPORT</h3>
              <p className="journey-summit-card__quote">“You Did It! A Brighter Future Awaits”</p>
              <span className="journey-summit-card__cta">View Credential ➔</span>
            </div>
          </div>

          {/* ================= 3. MODULE SECTION BANNERS ================= */}
          {AERS_MODULES.map((m) => {
            const modLevels = AERS_LEVELS.filter((l) => l.moduleId === m.id);
            const completedCount = modLevels.filter((l) =>
              progress.completedLevels.includes(l.id)
            ).length;
            const isModuleFinished = completedCount === modLevels.length;

            return (
              <div
                key={m.id}
                className={`journey-module-pill-banner ${
                  isModuleFinished ? 'is-module-done' : ''
                }`}
                style={{ left: '215px', top: `${m.pxY}px` }}
                onClick={() =>
                  setActiveSignInfo({
                    title: `Module ${m.id} — ${m.name}`,
                    subtitle: m.range,
                    text: `Focus Area: ${m.name}.\nMaster core concepts, complete interactive scenario challenges, and collect all stars across ${m.range}.\n\nMotto: "${m.motto}".`,
                  })
                }
              >
                <div className="journey-mod-banner__icon-wrap">
                  <span className="journey-mod-banner__icon">
                    {m.icon === 'compass' && '🧭'}
                    {m.icon === 'document' && '📄'}
                    {m.icon === 'chat' && '💬'}
                    {m.icon === 'target' && '🎯'}
                    {m.icon === 'briefcase' && '💼'}
                  </span>
                </div>
                <div className="journey-mod-banner__content">
                  <div className="journey-mod-banner__head">
                    <span className="journey-mod-banner__tag">MODULE {m.id}</span>
                    <span className="journey-mod-banner__range">{m.range}</span>
                  </div>
                  <div className="journey-mod-banner__name">{m.name}</div>
                  <div className="journey-mod-banner__motto">{m.motto}</div>
                </div>
                <div className="journey-mod-banner__progress-pill">
                  {isModuleFinished ? '✓ Done' : `${completedCount}/4`}
                </div>
              </div>
            );
          })}

          {/* ================= 4. TWENTY 3D ISOMETRIC CYLINDER PODIUM NODES ================= */}
          {AERS_LEVELS.map((lvl) => {
            const isCompleted = progress.completedLevels.includes(lvl.id);
            const isCurrent = progress.currentLevel === lvl.id;
            const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked';
            const stars = progress.levelStars[lvl.id] || (isCompleted ? 3 : 0);

            return (
              <PodiumNode
                key={lvl.id}
                level={lvl}
                status={status}
                stars={stars}
                onClick={() => handleLevelClick(lvl)}
              />
            );
          })}

          {/* ================= 5. START GATE (BOTTOM) ================= */}
          <div
            className="journey-clean-start"
            style={{ left: '215px', top: '3240px' }}
            onClick={() => setShowStartModal(true)}
            role="button"
            tabIndex={0}
            title="START — Let's Begin!"
          >
            <div className="journey-start-pill">
              <span className="journey-start-pill__arrow">🚀</span>
              <div className="journey-start-pill__text">
                <span className="journey-start-pill__main">START JOURNEY</span>
                <span className="journey-start-pill__sub">Begin at Level 01</span>
              </div>
            </div>
            <p className="journey-start-motto">AERS Skills Today • A Brighter Tomorrow</p>
          </div>
        </div>
      </div>

      {/* ================= LEVEL CHALLENGE MODAL ================= */}
      {activeLevel && (
        <div className="journey-modal-backdrop" onClick={() => setActiveLevel(null)}>
          <div className="journey-modal" onClick={(e) => e.stopPropagation()}>
            <header className="journey-modal__head">
              <div className="journey-modal__meta">
                <span className="journey-modal__mod-tag">
                  Module {activeLevel.moduleId}: {activeLevel.moduleName}
                </span>
                <button
                  className="journey-modal__close"
                  onClick={() => setActiveLevel(null)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="journey-modal__title-row">
                <div className="journey-modal__badge">{activeLevel.numberStr}</div>
                <div>
                  <h2 className="journey-modal__title">{activeLevel.title}</h2>
                  <p className="journey-modal__subtitle">{activeLevel.moduleRange}</p>
                </div>
              </div>

              {/* Stars display */}
              <div className="journey-modal__stars">
                {[1, 2, 3].map((s) => (
                  <span
                    key={s}
                    className={`journey-modal__star ${
                      (progress.levelStars[activeLevel.id] || 0) >= s ? 'is-filled' : ''
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </header>

            <div className="journey-modal__body">
              {/* Objective */}
              <div className="journey-section">
                <h4 className="journey-section__title">🎯 Learning Objective</h4>
                <p className="journey-section__text">{activeLevel.objective}</p>
              </div>

              {/* Competencies */}
              <div className="journey-section">
                <h4 className="journey-section__title">💡 Core Competencies</h4>
                <div className="journey-chips">
                  {activeLevel.skills.map((sk, i) => (
                    <span key={i} className="journey-chip">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Scenario Challenge */}
              <div className="journey-challenge">
                <div className="journey-challenge__head">
                  <span className="journey-challenge__icon">⚡</span>
                  <h4 className="journey-challenge__title">Interactive Level Challenge</h4>
                </div>
                <p className="journey-challenge__scenario">{activeLevel.challenge.scenario}</p>
                <p className="journey-challenge__question">{activeLevel.challenge.question}</p>

                <div className="journey-options">
                  {activeLevel.challenge.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === activeLevel.challenge.correctIndex;
                    let optClass = 'journey-option';

                    if (hasAnswered) {
                      if (isCorrect) optClass += ' is-correct';
                      else if (isSelected && !isCorrect) optClass += ' is-incorrect';
                    } else if (isSelected) {
                      optClass += ' is-selected';
                    }

                    return (
                      <button
                        key={idx}
                        className={optClass}
                        onClick={() => handleOptionSelect(idx)}
                      >
                        <span className="journey-option__bullet">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="journey-option__text">{opt}</span>
                        {hasAnswered && isCorrect && <span className="journey-option__icon">✓</span>}
                        {hasAnswered && isSelected && !isCorrect && (
                          <span className="journey-option__icon">✕</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {hasAnswered && (
                  <div
                    className={`journey-explanation ${
                      selectedOption === activeLevel.challenge.correctIndex
                        ? 'is-success'
                        : 'is-review'
                    }`}
                  >
                    <strong>
                      {selectedOption === activeLevel.challenge.correctIndex
                        ? '🎉 Spot On! 3 Stars Earned!'
                        : '💡 Key Takeaway (2 Stars Earned):'}
                    </strong>
                    <p>{activeLevel.challenge.explanation}</p>
                  </div>
                )}
              </div>
            </div>

            <footer className="journey-modal__foot">
              <button
                className="journey-btn journey-btn--primary"
                disabled={!hasAnswered}
                onClick={handleCompleteLevel}
              >
                {progress.completedLevels.includes(activeLevel.id)
                  ? 'Update Milestone & Continue ➔'
                  : 'Complete Level & Advance ➔'}
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ================= EMPLOYABILITY PASSPORT MODAL ================= */}
      {showPassport && (
        <div className="journey-modal-backdrop" onClick={() => setShowPassport(false)}>
          <div className="journey-passport-modal" onClick={(e) => e.stopPropagation()}>
            <div className="journey-passport-gold-border">
              <header className="journey-passport__head">
                <img
                  src={lastBookImg}
                  alt="Employability Passport Book"
                  className="journey-passport__book-crest"
                  draggable={false}
                />
                <div className="journey-passport__seal-tag">OFFICIAL CREDENTIAL</div>
                <h2 className="journey-passport__title">EMPLOYABILITY PASSPORT</h2>
                <p className="journey-passport__quote">“You Did It! A Brighter Future Awaits”</p>
                <p className="journey-passport__sub">AERS Student Placement-Readiness Programme</p>
              </header>

              <div className="journey-passport__body">
                <div className="journey-passport__student">
                  <span className="journey-passport__student-label">Awarded To</span>
                  <h3 className="journey-passport__student-name">{progress.learnerName}</h3>
                  <span className="journey-passport__id">
                    Passport ID: AERS-2026-EP{String(totalStars * 137).padStart(4, '0')}
                  </span>
                </div>

                <div className="journey-passport__stats-grid">
                  <div className="journey-passport__stat-card">
                    <span className="journey-passport__stat-val">{progress.completedLevels.length}/20</span>
                    <span className="journey-passport__stat-lbl">Levels Completed</span>
                  </div>
                  <div className="journey-passport__stat-card">
                    <span className="journey-passport__stat-val">{totalStars}/60</span>
                    <span className="journey-passport__stat-lbl">Stars Earned</span>
                  </div>
                  <div className="journey-passport__stat-card">
                    <span className="journey-passport__stat-val">100%</span>
                    <span className="journey-passport__stat-lbl">Readiness Score</span>
                  </div>
                </div>

                <h4 className="journey-passport__competencies-title">
                  Verified Placement Competencies
                </h4>
                <div className="journey-passport__skills-list">
                  {AERS_MODULES.map((mod) => (
                    <div key={mod.id} className="journey-passport__skill-row">
                      <div className="journey-passport__skill-info">
                        <span className="journey-passport__skill-mod">Module {mod.id}</span>
                        <span className="journey-passport__skill-name">{mod.name}</span>
                      </div>
                      <div className="journey-passport__skill-stars">⭐⭐⭐ VERIFIED</div>
                    </div>
                  ))}
                </div>

                <div className="journey-passport__signature-row">
                  <div className="journey-passport__sig">
                    <div className="journey-passport__sig-line">AERS Academic Board</div>
                    <span className="journey-passport__sig-sub">Director of Placements</span>
                  </div>
                  <div className="journey-passport__stamp">
                    <span>AERS</span>
                    <span>VERIFIED</span>
                  </div>
                </div>
              </div>

              <footer className="journey-passport__foot">
                <button className="journey-btn journey-btn--gold" onClick={handleSharePassport}>
                  {copiedLink ? '✓ Link Copied to Clipboard!' : '🔗 Share Achievement Link'}
                </button>
                <button
                  className="journey-btn journey-btn--ghost"
                  onClick={() => setShowPassport(false)}
                >
                  Close Passport
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}

      {/* ================= START ARCH MODAL ================= */}
      {showStartModal && (
        <div className="journey-modal-backdrop" onClick={() => setShowStartModal(false)}>
          <div className="journey-modal journey-modal--sm" onClick={(e) => e.stopPropagation()}>
            <header className="journey-modal__head" style={{ background: '#0066F5' }}>
              <div className="journey-modal__meta">
                <span>AERS Placement Gateway</span>
                <button className="journey-modal__close" onClick={() => setShowStartModal(false)}>
                  ✕
                </button>
              </div>
              <h2 className="journey-modal__title">START — Let’s Begin!</h2>
              <p className="journey-modal__subtitle">Welcome to your Career Journey</p>
            </header>
            <div className="journey-modal__body">
              <p>
                Your journey starts here at <strong>Level 01 (Know Yourself)</strong> and climbs up 20
                milestones to the summit <strong>EMPLOYABILITY PASSPORT</strong>.
              </p>
              <div className="journey-start-steps">
                <div className="journey-start-step">
                  <span className="journey-start-step__icon">1️⃣</span>
                  <span>Tap <strong>Level 01</strong> right above this start gate to begin.</span>
                </div>
                <div className="journey-start-step">
                  <span className="journey-start-step__icon">2️⃣</span>
                  <span>Solve scenario challenges to earn up to 3 gold stars per level.</span>
                </div>
                <div className="journey-start-step">
                  <span className="journey-start-step__icon">3️⃣</span>
                  <span>Climb through all 5 modules and claim your verified Passport at the top!</span>
                </div>
              </div>
            </div>
            <footer className="journey-modal__foot">
              <button
                className="journey-btn journey-btn--primary"
                onClick={() => {
                  setShowStartModal(false);
                  handleLevelClick(AERS_LEVELS[0]);
                }}
              >
                Start Level 01 Now ➔
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ================= SIGNBOARD INFO MODAL ================= */}
      {activeSignInfo && (
        <div className="journey-modal-backdrop" onClick={() => setActiveSignInfo(null)}>
          <div className="journey-modal journey-modal--sm" onClick={(e) => e.stopPropagation()}>
            <header className="journey-modal__head" style={{ background: '#0066F5' }}>
              <div className="journey-modal__meta">
                <span>Module Information</span>
                <button className="journey-modal__close" onClick={() => setActiveSignInfo(null)}>
                  ✕
                </button>
              </div>
              <h2 className="journey-modal__title">{activeSignInfo.title}</h2>
              <p className="journey-modal__subtitle">{activeSignInfo.subtitle}</p>
            </header>
            <div className="journey-modal__body">
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{activeSignInfo.text}</p>
            </div>
            <footer className="journey-modal__foot">
              <button
                className="journey-btn journey-btn--primary"
                onClick={() => setActiveSignInfo(null)}
              >
                Got It!
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ================= CONFETTI CELEBRATION ================= */}
      {confettiActive && (
        <div className="journey-confetti" aria-hidden="true">
          {Array.from({ length: 45 }).map((_, i) => (
            <div
              key={i}
              className="journey-confetti__piece"
              style={
                {
                  '--x': `${Math.random() * 100}%`,
                  '--y': `${Math.random() * -20}%`,
                  '--rot': `${Math.random() * 360}deg`,
                  '--color': ['#FFD700', '#FF4757', '#2ED573', '#0066F5', '#FD79A8', '#FFA502'][
                    i % 6
                  ],
                  '--delay': `${Math.random() * 0.4}s`,
                  '--dur': `${1.5 + Math.random() * 1.5}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
