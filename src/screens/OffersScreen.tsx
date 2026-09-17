/* ============================================================
   AERS Assessment Submissions & Review Center (Offers Screen)
   3 Dynamic Tabs: Submitted · Pending · Got Review
   Blue-Themed Perforated Ticket Card Design
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { AppHeader } from '../components/ui/AppHeader';
import { showToast } from '../state/toastStore';
import './OffersScreen.css';

export type AssessmentTab = 'submitted' | 'pending' | 'got_review';

export interface AssessmentItem {
  id: string;
  levelId: number;
  levelStr: string;
  levelTitle: string;
  studentName: string;
  studentRoll: string;
  artifactName: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  summary: string;
  tags: string[];
  status: 'submitted' | 'pending' | 'got_review';
  assignedReviewer?: string;
  expectedTurnaround?: string;
  reviewedAt?: string;
  reviewerName?: string;
  reviewerRole?: string;
  score?: string;
  stars?: number;
  teacherFeedback?: string;
  endorsement?: string;
}

const SERVICE_TABS: { id: AssessmentTab; label: string; icon: 'check-circle' | 'clock' | 'star-filled'; count: number }[] = [
  { id: 'submitted', label: 'Submitted', icon: 'check-circle', count: 4 },
  { id: 'pending', label: 'Pending', icon: 'clock', count: 2 },
  { id: 'got_review', label: 'Got Review', icon: 'star-filled', count: 2 },
];

const INITIAL_ASSESSMENTS: AssessmentItem[] = [
  // 1. Submitted assessments
  {
    id: 'sub-1',
    levelId: 1,
    levelStr: 'Level 01',
    levelTitle: 'Discovering Myself',
    studentName: 'Alex Morgan',
    studentRoll: 'AERS-2025-084',
    artifactName: 'Initial Self-Awareness Profile',
    fileName: 'AlexMorgan_L01_SelfAwareness_Snapshot.pdf',
    fileSize: '1.4 MB',
    submittedAt: '16 Sep 2026, 11:30 AM',
    summary: '10 structured reflections completed. 3-Mirror assessment verified with STAR-format database deadlock resolution case study.',
    tags: ['Self-Awareness', '3 Mirrors', 'STAR Evidence', '7-Day Action'],
    status: 'got_review',
    reviewedAt: '16 Sep 2026, 04:30 PM',
    reviewerName: 'Prof. Meera Kulkarni',
    reviewerRole: 'Lead Career Mentor & Faculty Chair',
    score: '8/10 · APPROVED',
    stars: 3,
    teacherFeedback: '“Alex demonstrated exceptional clarity in the 3-mirror self-awareness check. The STAR breakdown of resolving database deadlocks in the symposium project provided concrete, undeniable proof of analytical problem-solving. Strong start!”',
    endorsement: 'Verified Placement Competency · Module 1 Endorsement',
  },
  {
    id: 'sub-2',
    levelId: 2,
    levelStr: 'Level 02',
    levelTitle: 'Connecting Strengths to Career Direction',
    studentName: 'Alex Morgan',
    studentRoll: 'AERS-2025-084',
    artifactName: 'My Strength-to-Career Map',
    fileName: 'AlexMorgan_L02_Strength_Career_Map.pdf',
    fileSize: '1.8 MB',
    submittedAt: '17 Sep 2026, 09:15 AM',
    summary: '3 evidence-backed strengths connected with 4 transferable skills (Planning, Problem-solving, Analysis) and shortlisted for QA / DevOps pathways.',
    tags: ['Transferable Skills', 'Energy Ratings', 'Noise Filter', 'Career Match'],
    status: 'pending',
    assignedReviewer: 'Prof. Meera Kulkarni',
    expectedTurnaround: 'Within 12 Hours',
  },
  {
    id: 'sub-3',
    levelId: 3,
    levelStr: 'Level 03',
    levelTitle: 'Exploring Career Roles and Opportunities',
    studentName: 'Priya Sharma',
    studentRoll: 'AERS-2025-092',
    artifactName: 'Career Role Exploration Canvas',
    fileName: 'PriyaSharma_L03_Role_Canvas_DualRole.pdf',
    fileSize: '2.1 MB',
    submittedAt: '17 Sep 2026, 01:45 PM',
    summary: 'Side-by-side comparative matrix of Software QA Engineer vs Business Systems Analyst with realistic compensation and 3-pillar prep plan.',
    tags: ['Dual-Role Canvas', 'Comparison Matrix', 'Gap Analysis', 'Alumni Inquiry'],
    status: 'pending',
    assignedReviewer: 'Dr. Anand Rao',
    expectedTurnaround: 'Within 24 Hours',
  },
  {
    id: 'sub-4',
    levelId: 4,
    levelStr: 'Level 04',
    levelTitle: 'Building My Career Action Plan',
    studentName: 'Rahul Nair',
    studentRoll: 'AERS-2025-047',
    artifactName: 'My Career Action Plan (SMART-E)',
    fileName: 'RahulNair_L04_SMARTE_Action_Plan.pdf',
    fileSize: '1.9 MB',
    submittedAt: '17 Sep 2026, 02:10 PM',
    summary: '4-Horizon milestone roadmap (7 days, 30 days, 3 months, 6 months) for Junior QA Automation Engineer with weekly 10h commitment.',
    tags: ['SMART-E Plan', '4 Horizons', 'Accountability Partner', 'Time Budget'],
    status: 'got_review',
    reviewedAt: '17 Sep 2026, 02:45 PM',
    reviewerName: 'Dr. Anand Rao',
    reviewerRole: 'Industry Placement Advisor',
    score: '9/10 · OUTSTANDING',
    stars: 3,
    teacherFeedback: '“Very well constructed 4-horizon SMART-E plan. The immediate 7-day action of completing manual test scenarios with documented bug reports sets an actionable pace. Strong accountability partner mechanism.”',
    endorsement: 'Placement Ready · Verified Career Roadmap',
  },
];

const LEVEL_FILTERS = ['All Levels', 'Level 01', 'Level 02', 'Level 03', 'Level 04'] as const;

export function OffersScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AssessmentTab>('submitted');
  const [levelFilter, setLevelFilter] = useState<(typeof LEVEL_FILTERS)[number]>('All Levels');
  const [assessments, setAssessments] = useState<AssessmentItem[]>(INITIAL_ASSESSMENTS);
  const [selectedItem, setSelectedItem] = useState<AssessmentItem | null>(null);

  // Filter items according to active service tab & level filter
  const filteredItems = assessments.filter((item) => {
    // Tab filter
    if (activeTab === 'submitted') {
      // In submitted, display all submissions by students
    } else if (activeTab === 'pending') {
      if (item.status !== 'pending') return false;
    } else if (activeTab === 'got_review') {
      if (item.status !== 'got_review') return false;
    }

    // Level filter
    if (levelFilter !== 'All Levels') {
      if (item.levelStr !== levelFilter) return false;
    }

    return true;
  });

  // Dynamic status strips under tabs
  const getSubStrips = () => {
    switch (activeTab) {
      case 'submitted':
        return ['4 Submissions Recorded', 'Verified PDF Snapshots', 'Honor Code Declared'];
      case 'pending':
        return ['2 In Review Queue', 'Faculty Turnaround < 24h', 'Rubric Evaluation'];
      case 'got_review':
        return ['2 Faculty Evaluations', '100% Pass Rate (8+/10)', '6 Gold Stars Earned'];
    }
  };

  // Simulate Teacher Review / Approval
  const handleSimulateApprove = (item: AssessmentItem) => {
    const updated = assessments.map((a) => {
      if (a.id === item.id) {
        return {
          ...a,
          status: 'got_review' as const,
          reviewedAt: 'Just Now',
          reviewerName: 'Prof. Meera Kulkarni',
          reviewerRole: 'Lead Career Mentor',
          score: '8.5/10 · APPROVED',
          stars: 3,
          teacherFeedback: '“Verified and approved! Excellent demonstration of evidence-backed competency with concrete measurable outcomes.”',
          endorsement: 'Verified Placement Competency',
        };
      }
      return a;
    });
    setAssessments(updated);
    showToast(`Reviewed & Approved ${item.levelStr} (${item.studentName}) with 8.5/10!`, 'success');
  };

  return (
    <div className="offers">
      {/* White Header: wordmark + wallet pill + notifications */}
      <AppHeader />

      {/* 3 Main Service Tabs: Submitted · Pending · Got Review */}
      <div className="offers__svctabs" role="tablist" aria-label="Assessment Status Tabs">
        {SERVICE_TABS.map((t) => {
          const isActive = activeTab === t.id;
          const count = assessments.filter((a) => {
            if (t.id === 'submitted') return true;
            return a.status === t.id;
          }).length;

          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              className={`offers__svctab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <Icon name={t.icon} size={18} />
              <span>{t.label}</span>
              <span className={`offers__tab-count ${isActive ? 'is-active' : ''}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Filter / Metric Strip under service tabs */}
      <div className="offers__coupons" role="list" aria-label="Assessment Highlights">
        {getSubStrips().map((strip, idx) => (
          <span key={idx} className="offers__coupon" role="listitem">
            {strip}
          </span>
        ))}
      </div>

      <div className="offers__scroll">
        {/* Section Heading with Dynamic Title */}
        <div className="offers__head">
          <div>
            <h1 className="offers__title">
              {activeTab === 'submitted' && 'Student Submissions'}
              {activeTab === 'pending' && 'Pending Mentor Reviews'}
              {activeTab === 'got_review' && 'Teacher Reviews & Evaluations'}
            </h1>
            <p className="offers__sub">
              {activeTab === 'submitted' && 'All completed assessments & verified evidence uploaded by students'}
              {activeTab === 'pending' && 'Submissions awaiting faculty rubric scoring and evaluation'}
              {activeTab === 'got_review' && 'Evaluations, rubric feedback, and competency endorsements from mentors'}
            </p>
          </div>
          <button className="offers__viewall" onClick={() => navigate('/journey')}>
            Journey Map ➔
          </button>
        </div>

        {/* Level Filter Chips */}
        <div className="offers__chips" role="tablist" aria-label="Level Filter">
          {LEVEL_FILTERS.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={levelFilter === f}
              className={`offers__chip ${levelFilter === f ? 'is-active' : ''}`}
              onClick={() => setLevelFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Blue-Themed Coupon Ticket Cards */}
        {filteredItems.length === 0 ? (
          <div className="offers__empty-card">
            <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>📁</span>
            <strong>No assessments found</strong>
            <p>There are no items matching the selected level filter in this tab.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <article key={item.id} className="coupon coupon--blue">
              {/* Left and right circular ticket notches */}
              <div className="coupon__notch coupon__notch--l" />
              <div className="coupon__notch coupon__notch--r" />

              <div className="coupon__text">
                {/* Header Tag Pill */}
                <div className="coupon__tag-row">
                  <span className="coupon__tag">
                    {item.levelStr} · {item.artifactName}
                  </span>
                  {item.status === 'got_review' ? (
                    <span className="coupon__score-tag">
                      ✓ {item.score}
                    </span>
                  ) : item.status === 'pending' ? (
                    <span className="coupon__status-tag is-pending">
                      ⏳ Pending Review
                    </span>
                  ) : (
                    <span className="coupon__status-tag is-submitted">
                      📄 Submitted
                    </span>
                  )}
                </div>

                {/* Level Title & Student Name */}
                <h3>
                  {item.levelTitle}
                  <small>
                    Student: {item.studentName} ({item.studentRoll})
                  </small>
                </h3>

                {/* Summary / Submission Description */}
                <p>{item.summary}</p>

                {/* Teacher Review Box (displayed prominently when in got_review or item is reviewed) */}
                {item.status === 'got_review' && item.teacherFeedback && (
                  <div className="coupon__review-box">
                    <div className="coupon__review-head">
                      <span>
                        💬 Review by {item.reviewerName} ({item.reviewerRole})
                      </span>
                      <span className="coupon__stars-row">
                        {'★'.repeat(item.stars || 3)}
                      </span>
                    </div>
                    <p className="coupon__review-quote">{item.teacherFeedback}</p>
                    {item.endorsement && (
                      <div className="coupon__endorsement-badge">
                        <span>🎖️</span> {item.endorsement}
                      </div>
                    )}
                  </div>
                )}

                {/* Pending Status Callout */}
                {item.status === 'pending' && (
                  <div className="coupon__pending-callout">
                    <span>
                      Assigned Mentor: <strong>{item.assignedReviewer}</strong>
                    </span>
                    <span>Turnaround: <strong>{item.expectedTurnaround}</strong></span>
                  </div>
                )}

                {/* Metadata Fine Print */}
                <div className="coupon__fine">
                  <span>📅 Submitted: {item.submittedAt}</span>
                  <span>📎 File: {item.fileName} ({item.fileSize})</span>
                  {item.reviewedAt && <span>✅ Evaluated: {item.reviewedAt}</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="coupon__actions">
                <button
                  className="coupon__copy"
                  onClick={() => setSelectedItem(item)}
                  title="View complete submission and evaluation details"
                >
                  <Icon name="eye" size={14} />
                  <span>View Details</span>
                </button>

                {item.status === 'pending' ? (
                  <button
                    className="coupon__go coupon__go--approve"
                    onClick={() => handleSimulateApprove(item)}
                    title="Simulate Faculty Evaluation & Scoring"
                  >
                    <Icon name="check" size={14} />
                    <span>Evaluate & Score</span>
                  </button>
                ) : (
                  <button
                    className="coupon__go"
                    onClick={() => navigate(`/journey/level/${item.levelId}`)}
                    title="Open lesson and review criteria"
                  >
                    <span>Open Lesson</span>
                    <Icon name="arrow-right" size={13} />
                  </button>
                )}
              </div>
            </article>
          ))
        )}

        {/* Portfolio Readiness Card (Blue Theme) */}
        <section className="offers__wallet offers__wallet--blue" aria-label="Placement Competency">
          <div className="offers__wallet-body">
            <h2 className="offers__wallet-title">
              <Icon name="shield" size={16} /> Placement Competency Tracker
            </h2>
            <strong className="offers__wallet-amt">2 of 4 Verified Artifacts</strong>
            <p className="offers__wallet-expiry">AERS Academic Board Verification in progress</p>
            <p className="offers__wallet-note">
              Complete all 4 Module 1 milestones to receive your certified Career Clarity credential for campus placements.
            </p>
          </div>
          <div className="offers__getaway">
            <p className="offers__getaway-head">
              Quick Jump to Lessons
              <span>Module 1 Career Clarity</span>
            </p>
            <div className="offers__getaway-chips">
              {[1, 2, 3, 4].map((id) => (
                <button
                  key={id}
                  className="offers__getaway-chip"
                  onClick={() => navigate(`/journey/level/${id}`)}
                >
                  <Icon name="ticket" size={13} />
                  Level 0{id}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Faculty Mentorship Card (Blue Theme) */}
        <section className="offers__rate offers__rate--blue" aria-label="Faculty Support">
          <h2 className="offers__rate-title">Faculty Office Hours & Mentorship</h2>
          <div className="offers__rate-body">
            <div>
              <strong>Need 1-on-1 Feedback on Your Action Plan?</strong>
              <p>Book a 15-minute review session with your assigned AERS Placement Mentor.</p>
            </div>
            <Icon name="star-filled" size={32} className="offers__rate-star" />
          </div>
          <button
            className="offers__rate-btn offers__rate-btn--blue"
            onClick={() => showToast('Mentorship session request logged! Mentor will reach out via email.', 'success')}
          >
            Request Mentor Review Session ➔
          </button>
        </section>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="offers-modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="offers-modal" onClick={(e) => e.stopPropagation()}>
            <header className="offers-modal__head">
              <div>
                <span className="offers-modal__kicker">{selectedItem.levelStr} · {selectedItem.artifactName}</span>
                <h2 className="offers-modal__title">{selectedItem.levelTitle}</h2>
              </div>
              <button className="offers-modal__close" onClick={() => setSelectedItem(null)}>✕</button>
            </header>

            <div className="offers-modal__body">
              <div className="offers-modal__meta-grid">
                <div>
                  <span className="offers-modal__lbl">Learner</span>
                  <strong>{selectedItem.studentName} ({selectedItem.studentRoll})</strong>
                </div>
                <div>
                  <span className="offers-modal__lbl">Status</span>
                  <strong>{selectedItem.status.toUpperCase()}</strong>
                </div>
                <div>
                  <span className="offers-modal__lbl">Submission Time</span>
                  <span>{selectedItem.submittedAt}</span>
                </div>
                <div>
                  <span className="offers-modal__lbl">Evidence Document</span>
                  <span>{selectedItem.fileName} ({selectedItem.fileSize})</span>
                </div>
              </div>

              <div className="offers-modal__section">
                <h4 className="offers-modal__sec-title">Submission Summary</h4>
                <p>{selectedItem.summary}</p>
                <div className="offers-modal__tags">
                  {selectedItem.tags.map((t, idx) => (
                    <span key={idx} className="offers-modal__tag">#{t}</span>
                  ))}
                </div>
              </div>

              {selectedItem.status === 'got_review' && (
                <div className="offers-modal__section offers-modal__review-sec">
                  <h4 className="offers-modal__sec-title">Teacher Evaluation & Rubric Score</h4>
                  <div className="offers-modal__score-card">
                    <span className="offers-modal__score-val">{selectedItem.score}</span>
                    <span>Reviewed by {selectedItem.reviewerName}</span>
                  </div>
                  <blockquote className="offers-modal__quote">
                    {selectedItem.teacherFeedback}
                  </blockquote>
                  {selectedItem.endorsement && (
                    <div className="coupon__endorsement-badge" style={{ marginTop: 8 }}>
                      <span>🎖️</span> {selectedItem.endorsement}
                    </div>
                  )}
                </div>
              )}
            </div>

            <footer className="offers-modal__foot">
              <button
                className="coupon__go"
                onClick={() => {
                  setSelectedItem(null);
                  navigate(`/journey/level/${selectedItem.levelId}`);
                }}
              >
                Open Lesson {selectedItem.levelStr} ➔
              </button>
              <button className="coupon__copy" onClick={() => setSelectedItem(null)}>
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
