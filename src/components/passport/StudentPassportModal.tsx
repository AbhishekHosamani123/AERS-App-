/**
 * StudentPassportModal.tsx
 * ============================================================================
 * Official AERS Student Employability Passport
 * Designed to senior executive UI/UX design standards:
 * - Luxury Navy & 24k Gold Foil Biometric Credential Booklet aesthetic
 * - Dynamic 78% Overall Readiness Gauge
 * - 6 Core Placement Pillars:
 *   1. Career Clarity and Self Discovery (88%)
 *   2. Resume Readiness (82%)
 *   3. Communication (76%)
 *   4. Aptitude Readiness (72%)
 *   5. Workplace Readiness (86%)
 *   6. Interview Readiness (70%)
 * - Interactive Deep-Dive accordions with verified deliverables & faculty notes
 * - Official Machine Readable Zone (MRZ), Security Seals & Verification Actions
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { Icon, type IconName } from '../icons/Icon';
import { sound } from '../../utils/sound';
import { showToast } from '../../state/toastStore';
import './StudentPassportModal.css';

export interface ReadinessPillar {
  id: string;
  name: string;
  percentage: number;
  benchmark: number; // Tier-1 cutoff target (usually 70%)
  status: 'Exemplary' | 'Advanced' | 'Proficient' | 'Benchmark Cleared' | 'In Progress';
  color: string;
  icon: IconName;
  deliverables: string[];
  facultyReviewer: string;
  facultyQuote: string;
  improvementTip: string;
}

const READINESS_PILLARS: ReadinessPillar[] = [
  {
    id: 'career-clarity',
    name: 'Career Clarity and Self Discovery',
    percentage: 88,
    benchmark: 70,
    status: 'Exemplary',
    color: '#2563eb', // Royal Blue
    icon: 'shield',
    deliverables: [
      'Level 1: Initial Self-Awareness Profile verified (3 Mirrors Check)',
      'Level 2: Strength-to-Career Map completed (Ikigai & Skill Matrix)',
      'Level 3: Two-Role Exploration Canvas approved (Role A vs Role B)',
      'Level 4: SMART-E 4-Horizon Action Plan v2.0 locked',
    ],
    facultyReviewer: 'Prof. K. Venkatesh · Head of Career Mentorship',
    facultyQuote:
      'Krishna demonstrates exceptional self-awareness and realistic alignment between his engineering skills and target product engineering trajectories.',
    improvementTip:
      'Review Month 6 milestones quarterly with your assigned industry alumni mentor.',
  },
  {
    id: 'resume-readiness',
    name: 'Resume Readiness',
    percentage: 82,
    benchmark: 70,
    status: 'Advanced',
    color: '#4f46e5', // Indigo
    icon: 'ticket',
    deliverables: [
      'ATS Compatibility Score: 87/100 (Passes Taleo & Workday parsers)',
      'Action-verb formula (X-Y-Z approach) applied across all 3 projects',
      'Zero grammatical or typographical discrepancies (Grammarly certified)',
      'Live GitHub & portfolio repository links active and verified',
    ],
    facultyReviewer: 'Ms. Ananya Sharma · Lead Talent Strategist',
    facultyQuote:
      'High-impact resume with quantified results. Project bullet points clearly articulate technical leadership and architectural choices.',
    improvementTip:
      'Incorporate your upcoming cloud infrastructure certification badge into the header.',
  },
  {
    id: 'communication',
    name: 'Communication',
    percentage: 76,
    benchmark: 70,
    status: 'Proficient',
    color: '#0284c7', // Sky Blue
    icon: 'user',
    deliverables: [
      'Business Communication & Email Etiquette module cleared (92%)',
      'Impromptu 90-second Self-Pitch: 4.2 / 5.0 score',
      'Group Discussion round: Effective moderator & constructive speaker',
      'Cross-cultural workplace communication assessment passed',
    ],
    facultyReviewer: 'Dr. Ronald Evans · Corporate Communication Chair',
    facultyQuote:
      'Clear, concise verbal communication with professional poise. Effectively structures complex ideas into conversational answers.',
    improvementTip:
      'Practice 2 additional recorded mock presentations using structured 3-second pauses.',
  },
  {
    id: 'aptitude-readiness',
    name: 'Aptitude Readiness',
    percentage: 72,
    benchmark: 70,
    status: 'Benchmark Cleared',
    color: '#7c3aed', // Purple
    icon: 'lightning',
    deliverables: [
      'Quantitative Aptitude: 74% (Speed math, algebra & probability)',
      'Logical Reasoning: 80% (Pattern recognition, syllogisms & seating)',
      'Data Interpretation: 68% (Tables, graphs & trend analysis)',
      'Timed National Mock Test: Cleared 70-percentile Tier-1 cutoff',
    ],
    facultyReviewer: 'Prof. R. M. Sundaram · Director of Quantitative Analytics',
    facultyQuote:
      'Solid analytical deduction and strong pattern recognition in logical reasoning. Cleared institutional benchmark cleanly.',
    improvementTip:
      'Solve 15 advanced time-and-work and probability questions weekly to boost speed.',
  },
  {
    id: 'workplace-readiness',
    name: 'Workplace Readiness',
    percentage: 86,
    benchmark: 70,
    status: 'Exemplary',
    color: '#059669', // Emerald
    icon: 'check-circle',
    deliverables: [
      'Corporate Culture & Workplace Ethics certification completed',
      'Agile / Scrum sprint simulation: 100% attendance & story delivery',
      'Conflict resolution & feedback reception scenario rated Excellent',
      'Information security & confidentiality NDA guidelines signed',
    ],
    facultyReviewer: 'Dr. S. Nair · Head of Corporate Relations',
    facultyQuote:
      'Exhibits outstanding emotional intelligence (EQ) and reliable team ownership. Ready for fast-paced corporate engineering culture.',
    improvementTip:
      'Maintain continuous peer-feedback rhythm during your final-year team capstone.',
  },
  {
    id: 'interview-readiness',
    name: 'Interview Readiness',
    percentage: 70,
    benchmark: 70,
    status: 'In Progress',
    color: '#d97706', // Amber
    icon: 'star-filled',
    deliverables: [
      'STAR Story Bank: 5 structured behavioral stories documented',
      'Data Structures & Algorithms scenario mock: Solved medium problem',
      'Body language, eye contact & virtual interview setup certified',
      'Questions-for-the-interviewer strategy prepared',
    ],
    facultyReviewer: 'Mr. Rajesh Pillai · Senior Staff Tech Lead (Industry Panel)',
    facultyQuote:
      'Strong behavioral grounding and genuine enthusiasm. Needs 1 more technical mock round focusing on edge-case scenario handling.',
    improvementTip:
      'Schedule a peer technical mock interview before the campus recruitment drive.',
  },
];

interface StudentPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  studentPhone?: string;
  studentEmail?: string;
}

export function StudentPassportModal({
  isOpen,
  onClose,
  studentName = 'Krishna R.',
  studentPhone = '+91 98765 43210',
  studentEmail = 'krishna@aers.in',
}: StudentPassportModalProps) {
  const [activeTab, setActiveTab] = useState<'book' | 'pillars' | 'verify'>('book');
  const [expandedPillarId, setExpandedPillarId] = useState<string | null>('career-clarity');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Play celebratory audio cue upon opening
  useEffect(() => {
    if (isOpen) {
      sound.playGrandFanfare();
      // Lock background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate composite readiness score
  const totalScore = Math.round(
    READINESS_PILLARS.reduce((acc, p) => acc + p.percentage, 0) / READINESS_PILLARS.length
  );

  const passportNumber = 'P-IND-2026-AERS8492';
  const usnNumber = '1MS22CS045';
  const issueDate = '15 SEP 2026';
  const expiryDate = '15 SEP 2031';

  function handleCopyLink() {
    sound.playTap();
    const link = `${window.location.origin}/account/passport?id=${passportNumber}`;
    navigator.clipboard?.writeText?.(link);
    setIsCopied(true);
    showToast('Official Passport verification link copied to clipboard!', 'success');
    setTimeout(() => setIsCopied(false), 3000);
  }

  function handleDownloadPDF() {
    sound.playTap();
    setIsDownloading(true);
    showToast('Generating official AERS Digital Credential PDF...', 'info');
    setTimeout(() => {
      setIsDownloading(false);
      showToast('Official Employability Passport downloaded successfully!', 'success');
    }, 1800);
  }

  return (
    <div className="passport-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="passport-modal-window"
        onClick={(e) => e.stopPropagation()}
        aria-label="Official AERS Student Employability Passport"
      >
        {/* TOP BAR / CONTROLS */}
        <div className="passport-topbar">
          <div className="passport-topbar__badge">
            <span className="passport-topbar__dot" />
            <span>OFFICIAL BIOMETRIC CREDENTIAL</span>
          </div>

          <div className="passport-topbar__tabs">
            <button
              type="button"
              className={`passport-topbar__tab ${activeTab === 'book' ? 'passport-topbar__tab--active' : ''}`}
              onClick={() => {
                sound.playTap();
                setActiveTab('book');
              }}
            >
              <Icon name="shield" size={14} />
              <span>Passport Book</span>
            </button>
            <button
              type="button"
              className={`passport-topbar__tab ${activeTab === 'pillars' ? 'passport-topbar__tab--active' : ''}`}
              onClick={() => {
                sound.playTap();
                setActiveTab('pillars');
              }}
            >
              <Icon name="star-filled" size={14} />
              <span>6 Readiness Fields</span>
            </button>
            <button
              type="button"
              className={`passport-topbar__tab ${activeTab === 'verify' ? 'passport-topbar__tab--active' : ''}`}
              onClick={() => {
                sound.playTap();
                setActiveTab('verify');
              }}
            >
              <Icon name="check-circle" size={14} />
              <span>Verify & Share</span>
            </button>
          </div>

          <button
            type="button"
            className="passport-topbar__close"
            onClick={onClose}
            aria-label="Close passport"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="passport-modal-scroll">
          {/* ================= TAB 1: PASSPORT BOOK COVER & BIOMETRIC PAGE ================= */}
          {activeTab === 'book' && (
            <div className="passport-book">
              {/* Luxury Gold Border Container */}
              <div className="passport-frame">
                {/* Header Band */}
                <div className="passport-header">
                  <div className="passport-emblem">
                    <img
                      src="/AERS_Officel_Logo.png"
                      alt="AERS Emblem"
                      className="passport-emblem__img"
                      onError={(e) => {
                        // Fallback to Golden Book if logo path needs adjustment
                        e.currentTarget.src = '/Golden_close_book.png';
                      }}
                    />
                    <div className="passport-emblem__chip">
                      <span className="passport-chip-icon" title="Biometric Smart Credential">⚲</span>
                    </div>
                  </div>

                  <div className="passport-header__meta">
                    <div className="passport-header__country">REPUBLIC OF INDIA · AERS ACADEMIC BOARD</div>
                    <h1 className="passport-header__title">EMPLOYABILITY PASSPORT</h1>
                    <p className="passport-header__subtitle">
                      ACADEMIC &amp; EMPLOYABILITY READINESS SYSTEM
                    </p>
                    <div className="passport-header__serial">
                      <span>PASSPORT NO:</span>
                      <strong>{passportNumber}</strong>
                    </div>
                  </div>
                </div>

                {/* Biometric Identity Grid */}
                <div className="passport-biometric-grid">
                  {/* Photo & Holographic Security Stamp */}
                  <div className="passport-photo-card">
                    <div className="passport-photo-wrap">
                      <img
                        src="/students/student1.jpg"
                        alt={studentName}
                        className="passport-photo-img"
                      />
                      {/* Holographic Watermark Badge */}
                      <div className="passport-hologram">
                        <Icon name="shield" size={14} />
                        <span>AERS VERIFIED</span>
                      </div>
                    </div>
                    <div className="passport-tier-badge">
                      <Icon name="check-circle" size={13} />
                      <span>TIER-1 PLACEMENT ELIGIBLE</span>
                    </div>
                  </div>

                  {/* Primary Student Credential Fields */}
                  <div className="passport-fields">
                    <div className="passport-field-row">
                      <div className="passport-field">
                        <span className="passport-field__label">Full Legal Name</span>
                        <strong className="passport-field__value passport-field__value--lg">
                          {studentName}
                        </strong>
                      </div>
                      <div className="passport-field">
                        <span className="passport-field__label">USN / Student ID</span>
                        <strong className="passport-field__value passport-field__value--mono">
                          {usnNumber}
                        </strong>
                      </div>
                    </div>

                    <div className="passport-field-row">
                      <div className="passport-field">
                        <span className="passport-field__label">Degree &amp; Discipline</span>
                        <strong className="passport-field__value">
                          B.E. Computer Science &amp; Engineering
                        </strong>
                      </div>
                      <div className="passport-field">
                        <span className="passport-field__label">Cohort / Batch</span>
                        <strong className="passport-field__value">Class of 2026 (Final Year)</strong>
                      </div>
                    </div>

                    <div className="passport-field-row">
                      <div className="passport-field">
                        <span className="passport-field__label">Issuing Authority</span>
                        <strong className="passport-field__value">
                          AERS National Assessment Directorate
                        </strong>
                      </div>
                      <div className="passport-field">
                        <span className="passport-field__label">Issue Date · Valid Until</span>
                        <strong className="passport-field__value">
                          {issueDate} · {expiryDate}
                        </strong>
                      </div>
                    </div>

                    {/* Quick Contact Line */}
                    <div className="passport-contact-row">
                      <span>Email: {studentEmail}</span>
                      <span>·</span>
                      <span>Phone: {studentPhone}</span>
                    </div>
                  </div>
                </div>

                {/* OVERALL READINESS SCORE GAUGE BANNER */}
                <div className="passport-gauge-card">
                  <div className="passport-gauge-visual">
                    <svg viewBox="0 0 100 100" className="passport-gauge-svg">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="passport-gauge-track"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="passport-gauge-fill"
                        style={{
                          strokeDashoffset: 264 - (264 * totalScore) / 100,
                        }}
                      />
                    </svg>
                    <div className="passport-gauge-number">
                      <strong>{totalScore}%</strong>
                      <small>Readiness</small>
                    </div>
                  </div>

                  <div className="passport-gauge-info">
                    <div className="passport-gauge-kicker">COMPOSITE EMPLOYABILITY INDEX</div>
                    <h3 className="passport-gauge-title">Verified Placement-Ready Candidate</h3>
                    <p className="passport-gauge-desc">
                      Student has completed core curriculum milestones, submitted evidence across all
                      competency domains, and surpassed the national institutional Tier-1 hiring
                      benchmark (70%).
                    </p>
                    <div className="passport-gauge-badges">
                      <span className="passport-tag passport-tag--green">✓ 6 of 6 Pillars Assessed</span>
                      <span className="passport-tag passport-tag--blue">✓ Faculty Board Certified</span>
                      <span className="passport-tag passport-tag--gold">★ Top 15th Percentile</span>
                    </div>
                  </div>
                </div>

                {/* 6 FIELDS MINI PREVIEW STRIP */}
                <div className="passport-mini-pillars">
                  <div className="passport-mini-pillars__head">
                    <h4>The 6 Readiness Pillars Summary</h4>
                    <button
                      type="button"
                      className="passport-mini-pillars__btn"
                      onClick={() => {
                        sound.playTap();
                        setActiveTab('pillars');
                      }}
                    >
                      <span>Explore Detailed Analysis</span>
                      <Icon name="arrow-right" size={14} />
                    </button>
                  </div>

                  <div className="passport-mini-grid">
                    {READINESS_PILLARS.map((pillar) => (
                      <div
                        key={pillar.id}
                        className="passport-mini-card"
                        onClick={() => {
                          sound.playTap();
                          setExpandedPillarId(pillar.id);
                          setActiveTab('pillars');
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="passport-mini-card__top">
                          <div
                            className="passport-mini-card__icon"
                            style={{ backgroundColor: `${pillar.color}18`, color: pillar.color }}
                          >
                            <Icon name={pillar.icon} size={15} />
                          </div>
                          <span
                            className="passport-mini-card__pct"
                            style={{ color: pillar.color }}
                          >
                            {pillar.percentage}%
                          </span>
                        </div>
                        <div className="passport-mini-card__name">{pillar.name}</div>
                        <div className="passport-mini-card__bar-bg">
                          <div
                            className="passport-mini-card__bar-fill"
                            style={{
                              width: `${pillar.percentage}%`,
                              backgroundColor: pillar.color,
                            }}
                          />
                        </div>
                        <div className="passport-mini-card__status">{pillar.status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OFFICIAL SIGNATURES & HOLOGRAPHIC STAMP */}
                <div className="passport-endorsement-row">
                  <div className="passport-signatory">
                    <div className="passport-signatory__line">
                      <span className="passport-signatory__font">S. Nair</span>
                    </div>
                    <strong>Dr. S. Nair</strong>
                    <span>Head of Corporate Relations &amp; Placements</span>
                  </div>

                  {/* Official Circular AERS Red/Gold Stamp */}
                  <div className="passport-official-stamp">
                    <div className="passport-stamp-circle">
                      <span className="passport-stamp-text-top">AERS ACADEMIC COUNCIL</span>
                      <span className="passport-stamp-center">VERIFIED<br />2026</span>
                      <span className="passport-stamp-text-bot">DIRECTORATE OF PLACEMENTS</span>
                    </div>
                  </div>

                  <div className="passport-signatory">
                    <div className="passport-signatory__line">
                      <span className="passport-signatory__font">K. Venkatesh</span>
                    </div>
                    <strong>Prof. K. Venkatesh</strong>
                    <span>Director of Academic Evaluation</span>
                  </div>
                </div>

                {/* AUTHENTIC MACHINE READABLE ZONE (MRZ) */}
                <div className="passport-mrz-zone" title="Biometric Machine Readable Credential Zone">
                  <div className="passport-mrz-line">
                    P&lt;INDKRISHNA&lt;&lt;AERS&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  </div>
                  <div className="passport-mrz-line">
                    2026AERS84927IND0408221M3009176&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;08
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: DETAILED 6 READINESS FIELDS ================= */}
          {activeTab === 'pillars' && (
            <div className="passport-pillars-view">
              <div className="passport-pillars-banner">
                <div className="passport-pillars-banner__info">
                  <h2>Employability Readiness Matrix</h2>
                  <p>
                    Comprehensive competency evaluation across all 6 core employability domains.
                    Each score is benchmarked against Tier-1 campus placement requirements.
                  </p>
                </div>
                <div className="passport-pillars-banner__stats">
                  <div className="passport-stat-box">
                    <strong>{totalScore}%</strong>
                    <span>Overall Average</span>
                  </div>
                  <div className="passport-stat-box">
                    <strong>70%</strong>
                    <span>Tier-1 Cutoff</span>
                  </div>
                  <div className="passport-stat-box">
                    <strong>6 / 6</strong>
                    <span>Qualified</span>
                  </div>
                </div>
              </div>

              {/* ACCORDION OF ALL 6 PILLARS */}
              <div className="passport-pillars-list">
                {READINESS_PILLARS.map((pillar, index) => {
                  const isExpanded = expandedPillarId === pillar.id;
                  return (
                    <div
                      key={pillar.id}
                      className={`pillar-card ${isExpanded ? 'pillar-card--expanded' : ''}`}
                    >
                      {/* Accordion Header */}
                      <div
                        className="pillar-card__header"
                        onClick={() => {
                          sound.playTap();
                          setExpandedPillarId(isExpanded ? null : pillar.id);
                        }}
                      >
                        <div className="pillar-card__left">
                          <div
                            className="pillar-card__index-badge"
                            style={{
                              backgroundColor: `${pillar.color}15`,
                              color: pillar.color,
                              borderColor: `${pillar.color}40`,
                            }}
                          >
                            <Icon name={pillar.icon} size={18} />
                          </div>
                          <div>
                            <div className="pillar-card__field-num">PILLAR 0{index + 1}</div>
                            <h3 className="pillar-card__name">{pillar.name}</h3>
                          </div>
                        </div>

                        <div className="pillar-card__right">
                          <div className="pillar-card__score-block">
                            <span className="pillar-card__pct" style={{ color: pillar.color }}>
                              {pillar.percentage}%
                            </span>
                            <span
                              className="pillar-card__status-pill"
                              style={{
                                backgroundColor: `${pillar.color}18`,
                                color: pillar.color,
                              }}
                            >
                              {pillar.status}
                            </span>
                          </div>

                          <div className="pillar-card__chevron">
                            <Icon
                              name={isExpanded ? 'chevron-up' : 'chevron-down'}
                              size={18}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="pillar-card__bar-wrap">
                        <div className="pillar-card__bar-track">
                          <div
                            className="pillar-card__bar-fill"
                            style={{
                              width: `${pillar.percentage}%`,
                              backgroundColor: pillar.color,
                            }}
                          />
                          {/* 70% Cutoff Line Marker */}
                          <div
                            className="pillar-card__benchmark-marker"
                            style={{ left: `${pillar.benchmark}%` }}
                            title={`Target Benchmark: ${pillar.benchmark}%`}
                          >
                            <span className="pillar-card__marker-tag">70% Cutoff</span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content Details */}
                      {isExpanded && (
                        <div className="pillar-card__body">
                          <p className="pillar-card__desc">
                            Evaluated based on student submissions, verified worksheets, proctored
                            quizzes, and faculty mentor feedback.
                          </p>

                          {/* Verified Deliverables */}
                          <div className="pillar-card__section">
                            <h4 className="pillar-card__section-title">
                              <Icon name="check-circle" size={15} />
                              <span>Verified Deliverables &amp; Milestones</span>
                            </h4>
                            <ul className="pillar-card__evidence-list">
                              {pillar.deliverables.map((item, i) => (
                                <li key={i} className="pillar-card__evidence-item">
                                  <span className="pillar-card__check-icon">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Faculty Endorsement Box */}
                          <div className="pillar-card__quote-box">
                            <div className="pillar-card__quote-header">
                              <span className="pillar-card__quote-by">{pillar.facultyReviewer}</span>
                              <span className="pillar-card__quote-tag">OFFICIAL EVALUATOR</span>
                            </div>
                            <blockquote className="pillar-card__quote-text">
                              “{pillar.facultyQuote}”
                            </blockquote>
                          </div>

                          {/* Action to Improve to 100% */}
                          <div className="pillar-card__action-tip">
                            <div className="pillar-card__tip-icon">
                              <Icon name="lightning" size={16} />
                            </div>
                            <div className="pillar-card__tip-content">
                              <strong>Action To Reach 100% Mastery:</strong>
                              <p>{pillar.improvementTip}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 3: VERIFY & SHARE CREDENTIAL ================= */}
          {activeTab === 'verify' && (
            <div className="passport-verify-view">
              <div className="passport-verify-card">
                <div className="passport-verify-badge">CRYPTOGRAPHICALLY VERIFIABLE CREDENTIAL</div>
                <h2>AERS Placement Integrity Network</h2>
                <p>
                  This Employability Passport is cryptographically linked to candidate{' '}
                  <strong>{studentName}</strong> (USN: {usnNumber}). Corporate hiring teams,
                  interviewers, and placement officers can instantly verify all 6 readiness scores.
                </p>

                {/* QR Code Simulation Block */}
                <div className="passport-qr-block">
                  <div className="passport-qr-code">
                    <svg viewBox="0 0 120 120" className="passport-qr-svg">
                      <rect width="120" height="120" fill="#ffffff" rx="10" />
                      {/* Corner Target 1 */}
                      <rect x="12" y="12" width="30" height="30" fill="#0f172a" rx="4" />
                      <rect x="18" y="18" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="23" y="23" width="8" height="8" fill="#0f172a" rx="1" />
                      {/* Corner Target 2 */}
                      <rect x="78" y="12" width="30" height="30" fill="#0f172a" rx="4" />
                      <rect x="84" y="18" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="89" y="23" width="8" height="8" fill="#0f172a" rx="1" />
                      {/* Corner Target 3 */}
                      <rect x="12" y="78" width="30" height="30" fill="#0f172a" rx="4" />
                      <rect x="18" y="84" width="18" height="18" fill="#ffffff" rx="2" />
                      <rect x="23" y="89" width="8" height="8" fill="#0f172a" rx="1" />
                      {/* Pattern Matrix */}
                      <rect x="48" y="16" width="6" height="6" fill="#0052ff" />
                      <rect x="58" y="16" width="6" height="6" fill="#0f172a" />
                      <rect x="48" y="26" width="6" height="6" fill="#0f172a" />
                      <rect x="66" y="26" width="6" height="6" fill="#0052ff" />
                      <rect x="16" y="48" width="6" height="6" fill="#0f172a" />
                      <rect x="26" y="58" width="6" height="6" fill="#0052ff" />
                      <rect x="48" y="48" width="24" height="24" fill="#0052ff" rx="4" />
                      <text x="60" y="64" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">AERS</text>
                      <rect x="78" y="48" width="6" height="6" fill="#0f172a" />
                      <rect x="88" y="58" width="6" height="6" fill="#0052ff" />
                      <rect x="48" y="78" width="6" height="6" fill="#0f172a" />
                      <rect x="66" y="88" width="6" height="6" fill="#0052ff" />
                      <rect x="78" y="78" width="6" height="6" fill="#0f172a" />
                      <rect x="88" y="88" width="6" height="6" fill="#0052ff" />
                      <rect x="98" y="78" width="6" height="6" fill="#0f172a" />
                    </svg>
                  </div>
                  <div className="passport-qr-meta">
                    <strong>Scan to Verify On-Chain</strong>
                    <span>Ledger ID: AERS-HASH-9842-2026</span>
                    <span className="passport-qr-status">● Live Blockchain Validated</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="passport-actions-grid">
                  <button
                    type="button"
                    className="passport-act-btn passport-act-btn--primary"
                    onClick={handleCopyLink}
                  >
                    <Icon name="share" size={16} />
                    <span>{isCopied ? '✓ Link Copied!' : 'Copy Verification URL'}</span>
                  </button>

                  <button
                    type="button"
                    className="passport-act-btn passport-act-btn--secondary"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                  >
                    <Icon name="download" size={16} />
                    <span>{isDownloading ? 'Generating PDF...' : 'Download Official PDF'}</span>
                  </button>

                  <button
                    type="button"
                    className="passport-act-btn passport-act-btn--outline"
                    onClick={() => {
                      sound.playTap();
                      showToast('Credential ready to attach to LinkedIn Profile!', 'success');
                    }}
                  >
                    <Icon name="shield" size={16} />
                    <span>Add to LinkedIn Profile</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="passport-bottom-bar">
          <div className="passport-bottom-summary">
            <span className="passport-bottom-status-dot" />
            <span>
              <strong>{studentName}</strong> · Overall Readiness:{' '}
              <strong style={{ color: '#0052ff' }}>{totalScore}%</strong>
            </span>
          </div>

          <div className="passport-bottom-actions">
            <button
              type="button"
              className="passport-foot-btn passport-foot-btn--ghost"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="passport-foot-btn passport-foot-btn--gold"
              onClick={handleDownloadPDF}
            >
              <Icon name="download" size={15} />
              <span>Download Digital Passport</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
