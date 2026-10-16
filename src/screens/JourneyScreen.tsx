import { useEffect, useRef, useState, useMemo, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/brand/Logo';
import { AERS_LEVELS, AERS_MODULES, CANVAS_WIDTH, CANVAS_HEIGHT, type LevelData } from '../data/journeyData';
import { JourneyTrackSvg } from '../components/journey/JourneyTrackSvg';
import { PodiumNode } from '../components/journey/PodiumNode';
import { sound } from '../utils/sound';
import './JourneyScreen.css';

interface ProgressState {
  completedLevels: number[];
  levelStars: Record<number, number>;
  currentLevel: number;
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
    if (raw) return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STATE;
}
function saveProgress(s: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
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
  const [unlockToast, setUnlockToast] = useState<string | null>(null);
  const [shakeNodeId, setShakeNodeId] = useState<number | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveProgress(progress);
    sound.toggleSound(progress.soundEnabled);
  }, [progress]);

  const totalStars = useMemo(() => Object.values(progress.levelStars).reduce((a, s) => a + s, 0), [progress.levelStars]);
  const progressPercent = useMemo(() => {
    const totalPossible = AERS_LEVELS.length;
    const completedCount = progress.completedLevels.length;
    return Math.min(100, Math.round((completedCount / totalPossible) * 100));
  }, [progress.completedLevels]);

  const findScrollParent = (el: HTMLElement): HTMLElement | null => {
    let node: HTMLElement | null = el.parentElement;
    while (node) {
      const style = getComputedStyle(node);
      const isScrollable = /(auto|scroll)/.test(style.overflowY);
      if (isScrollable && node.scrollHeight > node.clientHeight + 1) return node;
      node = node.parentElement;
    }
    return null;
  };

  const scrollToLevel = (levelId: number, smooth = true) => {
    const nodeEl = document.getElementById(`level-node-${levelId}`);
    if (!nodeEl) return;
    const container = findScrollParent(nodeEl) ?? scrollRef.current;
    if (!container) return;
    const nodeTopInScroller = nodeEl.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    const targetScroll = Math.max(0, nodeTopInScroller - container.clientHeight / 2 + 20);
    container.scrollTo({ top: targetScroll, behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    const t1 = setTimeout(() => scrollToLevel(progress.currentLevel, false), 40);
    const t2 = setTimeout(() => scrollToLevel(progress.currentLevel, true), 220);
    const t3 = setTimeout(() => scrollToLevel(progress.currentLevel, true), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [progress.currentLevel]);

  const handleLevelClick = (level: LevelData) => {
    sound.playTap();
    if (level.id >= 1 && level.id <= 8) {
      navigate(`/journey/level/${level.id}`);
      return;
    }
    const isCompleted = progress.completedLevels.includes(level.id);
    const isCurrent = progress.currentLevel === level.id;
    const isLocked = !isCompleted && !isCurrent;
    if (isLocked) {
      sound.playLocked();
      const requiredLevel = Math.max(1, level.id - 1);
      setUnlockToast(`Locked — Complete Level ${requiredLevel.toString().padStart(2, '0')} to unlock`);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => setUnlockToast(null), 2400);
      setShakeNodeId(level.id);
      if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setShakeNodeId(null), 500);
      return;
    }
    setActiveLevel(level);
    setSelectedOption(null);
    setHasAnswered(false);
  };

  const handleOptionSelect = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    if (activeLevel) {
      if (idx === activeLevel.challenge.correctIndex) sound.playStar(3);
      else sound.playLocked();
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
      const nextStars = { ...prev.levelStars, [activeLevel.id]: Math.max(prev.levelStars[activeLevel.id] || 0, earnedStars) };
      const nextLevel = Math.min(AERS_LEVELS.length, Math.max(prev.currentLevel, activeLevel.id + 1));
      const passportUnlocked = nextCompleted.length >= AERS_LEVELS.length || activeLevel.id === AERS_LEVELS.length;
      return { ...prev, completedLevels: nextCompleted, levelStars: nextStars, currentLevel: nextLevel, passportUnlocked: passportUnlocked || prev.passportUnlocked };
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
    allIds.forEach((id) => (allStars[id] = 3));
    setProgress({ completedLevels: allIds, levelStars: allStars, currentLevel: AERS_LEVELS.length, passportUnlocked: true, soundEnabled: progress.soundEnabled, learnerName: progress.learnerName });
    setShowDevMenu(false);
    sound.playGrandFanfare();
  };
  const resetProgressDemo = () => {
    setProgress(DEFAULT_STATE);
    setShowDevMenu(false);
    sound.playTap();
  };
  const toggleSound = () => setProgress((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  const handleSharePassport = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="journey-page">
      {/* Sticky header — quiet, useful, not loud */}
      <header className="journey-hud" aria-label="Journey header">
        <div className="journey-hud__top">
          <button className="journey-hud__brand" onClick={() => navigate('/home')} aria-label="Go to Home">
            <Logo withWordmark size={22} />
            <span className="journey-hud__brand-sub">Journey</span>
          </button>

          <div className="journey-hud__actions">
            <span className="journey-hud__meta" aria-label={`Stars ${totalStars} of ${AERS_LEVELS.length * 3}`}>
              <span className="journey-hud__meta-num">{totalStars}</span>
              <span className="journey-hud__meta-sep">/</span>
              <span className="journey-hud__meta-total">{AERS_LEVELS.length * 3}</span>
              <span className="journey-hud__meta-label">stars</span>
            </span>

            <button className="journey-hud__pill journey-hud__pill--current" onClick={() => scrollToLevel(progress.currentLevel)} aria-label={`Jump to level ${progress.currentLevel}`}>
              Level {String(progress.currentLevel).padStart(2, '0')}
            </button>

            <button className={`journey-hud__icon ${progress.soundEnabled ? 'is-on' : ''}`} onClick={toggleSound} aria-label={progress.soundEnabled ? 'Mute' : 'Unmute'} aria-pressed={progress.soundEnabled} title={progress.soundEnabled ? 'Mute' : 'Sound on'}>
              <span aria-hidden="true">{progress.soundEnabled ? '◐' : '○'}</span>
            </button>

            <button className="journey-hud__icon" onClick={() => setShowDevMenu((v) => !v)} aria-label="Demo options" aria-expanded={showDevMenu}>
              <span aria-hidden="true">⋯</span>
            </button>
          </div>
        </div>

        <div className="journey-hud__progress" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Journey progress">
          <div className="journey-hud__progress-track">
            <div className="journey-hud__progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="journey-hud__progress-label">{progressPercent}%</span>
        </div>
      </header>

      {showDevMenu && (
        <div className="journey-dev-backdrop" onClick={() => setShowDevMenu(false)}>
          <div className="journey-dev-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Demo controls">
            <h3 className="journey-dev-title">Demo controls</h3>
            <p className="journey-dev-desc">Preview the full path or reset to the start.</p>
            <div className="journey-dev-actions">
              <button className="journey-btn journey-btn--primary" onClick={unlockAllDemo}>Unlock all 24 levels</button>
              <button className="journey-btn journey-btn--secondary" onClick={resetProgressDemo}>Reset to Level 01</button>
              <button className="journey-btn journey-btn--ghost" onClick={() => setShowDevMenu(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas — light, airy, no background image */}
      <div className="journey-scroll" ref={scrollRef}>
        <div className="journey-canvas" style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}>
          <JourneyTrackSvg />

          {/* Summit — single quiet card, no trophy theatre */}
          <button className="journey-summit" style={{ left: '215px', top: '120px' }} onClick={handlePassportClick} aria-label="Open Employability Passport">
            <span className="journey-summit__eyebrow">Final destination</span>
            <span className="journey-summit__title">Employability Passport</span>
            <span className="journey-summit__sub">You did it — a brighter future awaits.</span>
            <span className="journey-summit__cta">View credential →</span>
            {progress.passportUnlocked && <span className="journey-summit__badge">Unlocked</span>}
          </button>

          {/* Module labels — thin, quiet dividers */}
          {AERS_MODULES.map((m) => {
            const modLevels = AERS_LEVELS.filter((l) => l.moduleId === m.id);
            const completedCount = modLevels.filter((l) => progress.completedLevels.includes(l.id)).length;
            const done = completedCount === modLevels.length;
            return (
              <button
                key={m.id}
                className={`journey-module ${done ? 'is-done' : ''}`}
                style={{ left: '215px', top: `${m.pxY}px` }}
                onClick={() => setActiveSignInfo({ title: `Module ${m.id} — ${m.name}`, subtitle: m.range, text: `Focus: ${m.name}. Complete the 4 levels in ${m.range} to earn this module.\n\nMotto: “${m.motto}”.` })}
                aria-label={`Module ${m.id} ${m.name}`}
              >
                <span className="journey-module__left">
                  <span className="journey-module__kicker">Module {m.id} · {m.range}</span>
                  <span className="journey-module__name">{m.name}</span>
                  <span className="journey-module__motto">{m.motto}</span>
                </span>
                <span className="journey-module__right">{done ? 'Done' : `${completedCount}/4`}</span>
              </button>
            );
          })}

          {AERS_LEVELS.map((lvl) => {
            const isTesting = lvl.id >= 1 && lvl.id <= 4;
            const isCompleted = progress.completedLevels.includes(lvl.id);
            const isCurrent = progress.currentLevel === lvl.id;
            const status: 'completed' | 'current' | 'unlocked' | 'locked' = isCompleted ? 'completed' : isCurrent ? 'current' : isTesting ? 'unlocked' : 'locked';
            const stars = progress.levelStars[lvl.id] || (isCompleted ? 3 : isTesting ? 3 : 0);
            return <PodiumNode key={lvl.id} level={lvl} status={status} stars={stars} isShaking={shakeNodeId === lvl.id} onClick={() => handleLevelClick(lvl)} />;
          })}

          <button className="journey-start" style={{ left: '215px', top: '3830px' }} onClick={() => setShowStartModal(true)} aria-label="Start journey">
            <span className="journey-start__pill">Start journey</span>
            <span className="journey-start__hint">Begin at Level 01</span>
          </button>
        </div>
      </div>

      {/* Locked toast */}
      {unlockToast && (
        <div className="journey-toast" role="status" aria-live="polite">{unlockToast}</div>
      )}

      {/* Level challenge sheet */}
      {activeLevel && (
        <div className="journey-sheet-backdrop" onClick={() => setActiveLevel(null)}>
          <div className="journey-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={activeLevel.title}>
            <div className="journey-sheet__head">
              <div className="journey-sheet__kicker">Module {activeLevel.moduleId} · {activeLevel.moduleName}</div>
              <button className="journey-sheet__close" onClick={() => setActiveLevel(null)} aria-label="Close">×</button>
            </div>
            <div className="journey-sheet__title-row">
              <span className="journey-sheet__num">{activeLevel.numberStr}</span>
              <div>
                <h2 className="journey-sheet__title">{activeLevel.title}</h2>
                <p className="journey-sheet__sub">{activeLevel.subtitle}</p>
              </div>
            </div>
            <div className="journey-sheet__stars" aria-hidden="true">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`journey-sheet__star ${(progress.levelStars[activeLevel.id] || 0) >= s ? 'is-on' : ''}`}>★</span>
              ))}
            </div>

            <section className="journey-sheet__section">
              <h3 className="journey-sheet__h">Learning objective</h3>
              <p className="journey-sheet__p">{activeLevel.objective}</p>
            </section>

            <section className="journey-sheet__section">
              <h3 className="journey-sheet__h">Core competencies</h3>
              <div className="journey-sheet__chips">
                {activeLevel.skills.map((sk, i) => (
                  <span key={i} className="journey-sheet__chip">{sk}</span>
                ))}
              </div>
            </section>

            <section className="journey-sheet__challenge">
              <h3 className="journey-sheet__h">Challenge</h3>
              <p className="journey-sheet__scenario">{activeLevel.challenge.scenario}</p>
              <p className="journey-sheet__question">{activeLevel.challenge.question}</p>
              <div className="journey-sheet__options">
                {activeLevel.challenge.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === activeLevel.challenge.correctIndex;
                  let cls = 'journey-sheet__opt';
                  if (hasAnswered) {
                    if (isCorrect) cls += ' is-correct';
                    else if (isSelected && !isCorrect) cls += ' is-wrong';
                  } else if (isSelected) cls += ' is-selected';
                  return (
                    <button key={idx} className={cls} onClick={() => handleOptionSelect(idx)}>
                      <span className="journey-sheet__opt-bullet">{String.fromCharCode(65 + idx)}</span>
                      <span className="journey-sheet__opt-text">{opt}</span>
                      {hasAnswered && isCorrect && <span className="journey-sheet__opt-mark">✓</span>}
                      {hasAnswered && isSelected && !isCorrect && <span className="journey-sheet__opt-mark">✕</span>}
                    </button>
                  );
                })}
              </div>
              {hasAnswered && (
                <div className={`journey-sheet__explain ${selectedOption === activeLevel.challenge.correctIndex ? 'is-ok' : 'is-note'}`}>
                  <strong>{selectedOption === activeLevel.challenge.correctIndex ? 'Correct — 3 stars' : 'Note — 2 stars'}</strong>
                  <p>{activeLevel.challenge.explanation}</p>
                </div>
              )}
            </section>

            <div className="journey-sheet__foot">
              {activeLevel.id <= 8 && (
                <button
                  type="button"
                  className="journey-btn journey-btn--ghost"
                  onClick={() => {
                    setActiveLevel(null);
                    navigate(`/journey/level/${activeLevel.id}`);
                  }}
                >
                  Open full lesson
                </button>
              )}
              <button className="journey-btn journey-btn--primary" style={{ flex: 1 }} disabled={!hasAnswered} onClick={handleCompleteLevel}>
                {progress.completedLevels.includes(activeLevel.id) ? 'Update & continue →' : 'Complete & continue →'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPassport && (
        <div className="journey-sheet-backdrop" onClick={() => setShowPassport(false)}>
          <div className="journey-sheet journey-sheet--passport" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Employability Passport">
            <div className="journey-sheet__head journey-sheet__head--passport">
              <div>
                <div className="journey-sheet__kicker journey-sheet__kicker--light">Official credential</div>
                <h2 className="journey-sheet__title journey-sheet__title--light">Employability Passport</h2>
                <p className="journey-sheet__sub journey-sheet__sub--light">AERS Student Placement-Readiness Programme</p>
              </div>
              <button className="journey-sheet__close journey-sheet__close--light" onClick={() => setShowPassport(false)} aria-label="Close">×</button>
            </div>

            <div className="journey-passport__student">
              <span className="journey-passport__label">Awarded to</span>
              <span className="journey-passport__name">{progress.learnerName}</span>
              <span className="journey-passport__id">ID: AERS-2026-EP{String(totalStars * 137).padStart(4, '0')}</span>
            </div>

            <div className="journey-passport__grid">
              <div className="journey-passport__stat">
                <span className="journey-passport__stat-v">{progress.completedLevels.length}/{AERS_LEVELS.length}</span>
                <span className="journey-passport__stat-k">Levels</span>
              </div>
              <div className="journey-passport__stat">
                <span className="journey-passport__stat-v">{totalStars}/{AERS_LEVELS.length * 3}</span>
                <span className="journey-passport__stat-k">Stars</span>
              </div>
              <div className="journey-passport__stat">
                <span className="journey-passport__stat-v">100%</span>
                <span className="journey-passport__stat-k">Readiness</span>
              </div>
            </div>

            <h3 className="journey-sheet__h" style={{ marginTop: 14 }}>Verified competencies</h3>
            <div className="journey-passport__mods">
              {AERS_MODULES.map((mod) => (
                <div key={mod.id} className="journey-passport__mod">
                  <span>Module {mod.id} · {mod.name}</span>
                  <span className="journey-passport__mod-check">Verified</span>
                </div>
              ))}
            </div>

            <div className="journey-sheet__foot" style={{ marginTop: 12 }}>
              <button className="journey-btn journey-btn--primary" style={{ flex: 1 }} onClick={handleSharePassport}>
                {copiedLink ? 'Link copied' : 'Copy share link'}
              </button>
              <button className="journey-btn journey-btn--ghost" onClick={() => setShowPassport(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showStartModal && (
        <div className="journey-sheet-backdrop" onClick={() => setShowStartModal(false)}>
          <div className="journey-sheet journey-sheet--sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Start">
            <div className="journey-sheet__head">
              <div className="journey-sheet__kicker">AERS Placement Gateway</div>
              <button className="journey-sheet__close" onClick={() => setShowStartModal(false)} aria-label="Close">×</button>
            </div>
            <h2 className="journey-sheet__title">Start — your career journey</h2>
            <p className="journey-sheet__p" style={{ marginTop: 6 }}>
              Start at <strong>Level 01</strong> and work up to the <strong>Employability Passport</strong>. Each level has one clear challenge — complete it to move forward.
            </p>
            <ol className="journey-sheet__steps">
              <li>Tap Level 01 to begin.</li>
              <li>Answer the challenge to earn stars.</li>
              <li>Open the full lesson when you want more depth (Levels 01–08).</li>
            </ol>
            <div className="journey-sheet__foot">
              <button className="journey-btn journey-btn--primary" style={{ flex: 1 }} onClick={() => { setShowStartModal(false); navigate('/journey/level/1'); }}>
                Start Level 01 →
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSignInfo && (
        <div className="journey-sheet-backdrop" onClick={() => setActiveSignInfo(null)}>
          <div className="journey-sheet journey-sheet--sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={activeSignInfo.title}>
            <div className="journey-sheet__head">
              <div className="journey-sheet__kicker">{activeSignInfo.subtitle}</div>
              <button className="journey-sheet__close" onClick={() => setActiveSignInfo(null)} aria-label="Close">×</button>
            </div>
            <h2 className="journey-sheet__title">{activeSignInfo.title}</h2>
            <p className="journey-sheet__p" style={{ whiteSpace: 'pre-line', marginTop: 8 }}>{activeSignInfo.text}</p>
            <div className="journey-sheet__foot">
              <button className="journey-btn journey-btn--primary" style={{ flex: 1 }} onClick={() => setActiveSignInfo(null)}>Got it</button>
            </div>
          </div>
        </div>
      )}

      {confettiActive && (
        <div className="journey-confetti" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="journey-confetti__dot"
              style={{ '--x': `${8 + Math.random() * 84}%`, '--d': `${0.9 + Math.random() * 0.9}s`, '--delay': `${Math.random() * 0.25}s` } as CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}
