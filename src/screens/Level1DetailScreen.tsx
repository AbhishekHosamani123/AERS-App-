import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { sound } from '../utils/sound';
import { generateLessonNotesPdf } from '../utils/generateLessonNotesPdf';
import './Level1DetailScreen.css';

export type Level1Stage =
  | 'overview'
  | 'objectives'
  | 'notes'
  | 'video'
  | 'quiz'
  | 'activity'
  | 'activity_review'
  | 'submission'
  | 'eval_pending'
  | 'eval_revision'
  | 'eval_approved';

export interface StrengthItem {
  strength: string;
  experience: string;
  whatIDid: string;
  result: string;
}

export interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
}

const STORAGE_KEY = 'aers_level1_detail_state_v5';
const JOURNEY_STORAGE_KEY = 'aers_journey_progress_v5';

const SAMPLE_STRENGTHS: [StrengthItem, StrengthItem, StrengthItem] = [
  {
    strength: 'Analytical Problem Solving & Debugging',
    experience: 'Academic Capstone Project & Hackathon 2025',
    whatIDid: 'Identified asynchronous race condition causing latency in sensor telemetry module and restructured promise handlers.',
    result: 'Reduced data drop rate by 42% and received high commendation from the academic evaluation panel.',
  },
  {
    strength: 'Cross-Disciplinary Team Leadership',
    experience: 'Annual College Tech Fest Organizing Committee',
    whatIDid: 'Led a 6-member student squad to coordinate registration workflows and live lab sessions.',
    result: 'Managed 850+ participant check-ins smoothly with zero queue bottlenecks.',
  },
  {
    strength: 'Adaptive Self-Learning & Rapid Upskilling',
    experience: 'Self-directed full-stack web development transition',
    whatIDid: 'Built 3 functional prototypes in 4 weeks while maintaining 8.8 CGPA.',
    result: 'Published open-source demo repository and earned mentor peer-review certificate.',
  },
];

const INITIAL_STRENGTHS: [StrengthItem, StrengthItem, StrengthItem] = [
  { strength: '', experience: '', whatIDid: '', result: '' },
  { strength: '', experience: '', whatIDid: '', result: '' },
  { strength: '', experience: '', whatIDid: '', result: '' },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What fundamentally differentiates a genuine strength from a generic claim during an interview?',
    options: [
      'Repeating confident buzzwords multiple times with high vocal volume.',
      'Grounding the skill in concrete past experiences, specific actions taken, and verified outcomes.',
      'Listing 20 unverified programming languages on your profile.',
      'Assuming the recruiter will intuitively know by your college branch.',
    ],
    correctIndex: 1,
    correctExplanation: 'A genuine strength is supported by specific evidence, actions, and measurable outcomes.',
    incorrectExplanation: 'Buzzwords and unverified claims do not prove competence. Recruiters look for specific evidence, actions taken, and verifiable outcomes.',
  },
  {
    id: 2,
    question: 'When asked about a major blind spot or development area, what is the most constructive response?',
    options: [
      'Deny having any weaknesses to appear completely flawless and confident.',
      'State a clichéd fake weakness like "I work too hard and care too much".',
      'Acknowledge a genuine developmental area and demonstrate an active mitigation habit or practice.',
      'Blame past teammates or professors for your project deficiencies.',
    ],
    correctIndex: 2,
    correctExplanation: 'Demonstrating self-awareness and active mitigation shows maturity, growth mindset, and coachability.',
    incorrectExplanation: 'Recruiters value self-honesty and a growth mindset. Acknowledging a real growth area with concrete mitigation habits proves maturity.',
  },
  {
    id: 3,
    question: 'Why is the 7-Day Growth Commitment focused on ONE specific habit rather than multiple large goals?',
    options: [
      'Because one hyper-specific, measurable action creates verified momentum without cognitive overload.',
      'Because employers only evaluate your performance over a single week.',
      'Because students should avoid aiming for significant career milestones.',
      'Because broad, vague ambitions sound more impressive on a resume.',
    ],
    correctIndex: 0,
    correctExplanation: 'Deliberate, micro-actions executed consistently build authentic confidence and tangible proof.',
    incorrectExplanation: 'Overly broad goals lead to inaction. One specific, verifiable habit creates immediate traction and lasting competence.',
  },
];

export function Level1DetailScreen() {
  const navigate = useNavigate();

  // Load initial state
  const savedState = useMemo(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  }, []);

  const [currentStage, setCurrentStage] = useState<Level1Stage>(() => {
    return savedState?.currentStage || 'overview';
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    return savedState?.completedSteps || [];
  });

  // Notes state
  const [notesLanguage, setNotesLanguage] = useState<'en' | 'kn'>('en');

  // Video state
  const [videoLanguage, setVideoLanguage] = useState<'en' | 'kn'>('en');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => {
    return savedState?.selectedAnswers || {};
  });
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(() => {
    return savedState?.quizSubmitted || false;
  });
  const [quizScore, setQuizScore] = useState<number>(() => {
    return savedState?.quizScore || 0;
  });

  // Activity Sub-Stepper (0: Strength 1, 1: Strength 2, 2: Strength 3, 3: 7-Day Action)
  const [activitySubStep, setActivitySubStep] = useState<number>(0);
  const [strengths, setStrengths] = useState<[StrengthItem, StrengthItem, StrengthItem]>(() => {
    return savedState?.strengths || INITIAL_STRENGTHS;
  });
  const [improvementAction, setImprovementAction] = useState<string>(() => {
    return savedState?.improvementAction || '';
  });

  // Evidence Upload state
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(() => {
    return savedState?.uploadedFile || null;
  });
  const [confirmCertified, setConfirmCertified] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [fileValidationError, setFileValidationError] = useState<string | null>(null);
  const [showCompactPreview, setShowCompactPreview] = useState<boolean>(false);
  const [showEvalDocPreview, setShowEvalDocPreview] = useState<boolean>(false);

  // Evaluator feedback
  const evaluatorFeedback =
    'Good initial reflection! For Strength 3, please provide more concrete metrics or mentor feedback in the Result field. Also make your 7-day action more specific with peer practice dates.';

  // Dev state tester menu
  const [showDevBar, setShowDevBar] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      const payload = {
        currentStage,
        completedSteps,
        selectedAnswers,
        quizSubmitted,
        quizScore,
        strengths,
        improvementAction,
        uploadedFile,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [currentStage, completedSteps, selectedAnswers, quizSubmitted, quizScore, strengths, improvementAction, uploadedFile]);

  // Video playback simulation
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlayingVideo && videoProgress < 100) {
      timer = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 96) {
            setIsPlayingVideo(false);
            return 100;
          }
          return prev + 5;
        });
      }, 350);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo, videoProgress]);

  // Mark step complete helper
  const markStepDone = (stepNum: number) => {
    setCompletedSteps((prev) => Array.from(new Set([...prev, stepNum])));
  };

  const currentStepNum = useMemo(() => {
    switch (currentStage) {
      case 'objectives':
        return 1;
      case 'notes':
        return 2;
      case 'video':
        return 3;
      case 'quiz':
        return 4;
      case 'activity':
      case 'activity_review':
        return 5;
      case 'submission':
        return 6;
      default:
        return 0;
    }
  }, [currentStage]);

  const nextAvailableStep = useMemo(() => {
    for (let i = 1; i <= 6; i++) {
      if (!completedSteps.includes(i)) return i;
    }
    return 6;
  }, [completedSteps]);

  // ---------------- Handlers ----------------

  const handleStartOrResume = () => {
    sound.playTap();
    if (completedSteps.includes(6)) {
      setCurrentStage('eval_pending');
      return;
    }
    switch (nextAvailableStep) {
      case 1:
        setCurrentStage('objectives');
        break;
      case 2:
        setCurrentStage('notes');
        break;
      case 3:
        setCurrentStage('video');
        break;
      case 4:
        setCurrentStage('quiz');
        break;
      case 5:
        setCurrentStage('activity');
        break;
      case 6:
        setCurrentStage('submission');
        break;
      default:
        setCurrentStage('objectives');
    }
  };

  const handleCompleteObjectives = () => {
    sound.playStar(1);
    markStepDone(1);
    setCurrentStage('notes');
  };

  const handleCompleteNotes = () => {
    sound.playStar(1);
    markStepDone(2);
    setCurrentStage('video');
  };

  const handleCompleteVideo = () => {
    sound.playStar(2);
    setVideoProgress(100);
    setIsPlayingVideo(false);
    markStepDone(3);
    setCurrentStage('quiz');
  };

  const handleQuizAnswer = (qId: number, optIdx: number) => {
    sound.playTap();
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) score += 1;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 2) {
      sound.playStar(3);
    } else {
      sound.playLocked();
    }
  };

  const handleCompleteQuiz = () => {
    sound.playTap();
    markStepDone(4);
    setCurrentStage('activity');
    setActivitySubStep(0);
  };

  const handleStrengthChange = (
    index: 0 | 1 | 2,
    field: keyof StrengthItem,
    value: string
  ) => {
    const updated = [...strengths] as [StrengthItem, StrengthItem, StrengthItem];
    updated[index] = { ...updated[index], [field]: value };
    setStrengths(updated);
  };

  const handleAutofillActivity = () => {
    sound.playTap();
    setStrengths(SAMPLE_STRENGTHS);
    setImprovementAction(
      'In the next 7 days, I will schedule two 15-minute mock introduction sessions with my peer study group and record a video playback of my 60-second elevator pitch to refine body language.'
    );
  };

  const handleNextActivitySubStep = () => {
    sound.playTap();
    if (activitySubStep < 3) {
      setActivitySubStep((s) => s + 1);
    } else {
      if (!strengths[0].strength.trim() || !improvementAction.trim()) {
        sound.playLocked();
        alert('Please fill in Strength 1 and your 7-Day Improvement Action before reviewing.');
        return;
      }
      setCurrentStage('activity_review');
    }
  };

  const handleSaveActivityReview = () => {
    sound.playStar(2);
    markStepDone(5);
    setCurrentStage('submission');
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const f = files[0];
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      const sizeNum = f.size / (1024 * 1024);

      const validExtensions = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png'];
      const lowerName = f.name.toLowerCase();
      const isValidType = validExtensions.some((ext) => lowerName.endsWith(ext));

      if (!isValidType) {
        setFileValidationError('File type not supported. Accepted formats: PDF, DOCX, JPG, PNG.');
        sound.playLocked();
        return;
      }

      if (sizeNum > 10) {
        setFileValidationError(`File exceeds 10 MB limit (${sizeMB} MB). Please choose a smaller file.`);
        sound.playLocked();
        return;
      }

      setFileValidationError(null);
      setUploadedFile({
        name: f.name,
        size: `${sizeMB} MB`,
        type: lowerName.endsWith('.pdf')
          ? 'PDF Document'
          : lowerName.endsWith('.docx') || lowerName.endsWith('.doc')
          ? 'Word Document'
          : 'Image File',
      });
      setConfirmCertified(false);
      setSubmissionSuccess(false);
      sound.playTap();
    }
  };

  const handleUploadSamplePDF = () => {
    setFileValidationError(null);
    setUploadedFile({
      name: 'Abhishek_Level1_SelfAwareness.pdf',
      size: '1.4 MB',
      type: 'PDF Document',
    });
    setConfirmCertified(false);
    setSubmissionSuccess(false);
    sound.playTap();
  };

  const handleRemoveFile = () => {
    sound.playTap();
    setUploadedFile(null);
    setConfirmCertified(false);
    setFileValidationError(null);
    setShowCompactPreview(false);
    setSubmissionSuccess(false);
  };

  const handleSubmitEvidence = () => {
    if (!uploadedFile) {
      sound.playLocked();
      setFileValidationError('Please select or upload a snapshot document first.');
      return;
    }
    if (!confirmCertified) {
      sound.playLocked();
      return;
    }
    setIsSubmitting(true);
    sound.playTap();
    setTimeout(() => {
      setIsSubmitting(false);
      markStepDone(6);
      setSubmissionSuccess(true);
      sound.playLevelSuccess();
    }, 600);
  };

  const handleApproveLevel1 = () => {
    sound.playGrandFanfare();
    markStepDone(1);
    markStepDone(2);
    markStepDone(3);
    markStepDone(4);
    markStepDone(5);
    markStepDone(6);
    setCurrentStage('eval_approved');

    try {
      const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
      let currentProgress = {
        completedLevels: [] as number[],
        levelStars: {} as Record<number, number>,
        currentLevel: 1,
        passportUnlocked: false,
        soundEnabled: true,
        learnerName: 'Alex Morgan',
      };
      if (raw) currentProgress = { ...currentProgress, ...JSON.parse(raw) };
      currentProgress.completedLevels = Array.from(
        new Set([...currentProgress.completedLevels, 1])
      );
      currentProgress.levelStars[1] = 3;
      currentProgress.currentLevel = Math.max(currentProgress.currentLevel, 2);
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(currentProgress));
    } catch {}
  };

  const handleContinueToLevel2 = () => {
    sound.playTap();
    navigate('/journey');
  };

  // ---------------- SCREEN RENDERERS ----------------

  // 1. LEVEL OVERVIEW (The Launchpad)
  const renderOverview = () => {
    const stepsData = [
      {
        id: 1,
        stage: 'objectives' as Level1Stage,
        type: 'OBJECTIVES',
        metaIcon: 'clock',
        metaText: '2 MIN',
        title: 'Learning Objectives',
        desc: 'Core self-awareness competencies & outcomes.',
      },
      {
        id: 2,
        stage: 'notes' as Level1Stage,
        type: 'READING',
        metaIcon: 'clock',
        metaText: '5 MIN',
        title: 'Read Lesson Notes',
        desc: 'Evidence formula, blind spots & 7-day activity.',
      },
      {
        id: 3,
        stage: 'video' as Level1Stage,
        type: 'VIDEO',
        metaIcon: 'clock',
        metaText: '4.5 MIN',
        title: 'Watch Concept Video',
        desc: 'Masterclass on communicating your authentic self.',
      },
      {
        id: 4,
        stage: 'quiz' as Level1Stage,
        type: 'CHECKPOINT',
        metaIcon: 'clock',
        metaText: '3 QS',
        title: 'Quick Check Quiz',
        desc: 'Practical scenarios to test placement readiness.',
      },
      {
        id: 5,
        stage: 'activity' as Level1Stage,
        type: 'WORKSHEET',
        metaIcon: 'interactive',
        metaText: 'INTERACTIVE',
        title: 'Self-Awareness Snapshot',
        desc: '3 verified strengths & a 7-day growth plan.',
      },
      {
        id: 6,
        stage: 'submission' as Level1Stage,
        type: 'EVIDENCE',
        metaIcon: 'upload',
        metaText: 'UPLOAD',
        title: 'Submit Evidence',
        desc: 'Upload verified reflection document for review.',
      },
    ];

    const progressPct = Math.round((completedSteps.length / 6) * 100);

    return (
      <div className="lvl1-stage-view lvl1-overview-view">
        {/* ================= LEVEL HERO CARD ================= */}
        <section className="lvl1-hero-milestone" aria-label="Level Overview">
          {/* Top Edge Accent Stripe */}
          <div className="lvl1-hero-milestone__accent-bar" aria-hidden="true" />

          {/* Module Kicker & XP Pill */}
          <div className="lvl1-hero-milestone__pill-row">
            <span className="lvl1-badge-kicker">MODULE 01 · CAREER CLARITY</span>
            <span className="lvl1-xp-badge">
              <span className="lvl1-xp-bolt">⚡</span> +150 XP
            </span>
          </div>

          {/* Title & Description with Right Compass Graphic */}
          <div className="lvl1-hero-body-row">
            <div className="lvl1-hero-text-col">
              <h2 className="lvl1-hero-milestone__title">Discovering Myself</h2>
              <p className="lvl1-hero-milestone__desc">
                Build self-knowledge that recruiters trust. Learn to turn
                past academic and project experiences into verifiable
                proof.
              </p>
            </div>

            {/* Compass Graphic with Floating Ribbon Badge */}
            <div className="lvl1-hero-compass-wrap" aria-hidden="true">
              <div className="lvl1-compass-ribbon-tag">
                <span>Know Yourself</span>
                <span>Build Your Future</span>
              </div>
              <div className="lvl1-compass-sparkle-1">✨</div>
              <div className="lvl1-compass-sparkle-2">✦</div>
              <img
                src="/clock.png"
                alt=""
                className="lvl1-hero-compass-img"
              />
            </div>
          </div>

          {/* Placement Readiness Boost Card */}
          <div className="lvl1-readiness-boost-box" role="note" aria-label="Placement Readiness Boost">
            <div className="lvl1-readiness-boost-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21H21" stroke="#0066F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 15L11 10L15 14L20 8" stroke="#0066F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8H20V12" stroke="#0066F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="lvl1-readiness-boost-text">
              <strong className="lvl1-readiness-title">Placement Readiness Boost: +15%</strong>
              <span className="lvl1-readiness-sub">Unlocks Module 01 Verified Competencies</span>
            </div>
            <div className="lvl1-readiness-arrow" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 3.5L10.5 8L6 12.5" stroke="#0066F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Progress Section */}
          <div className="lvl1-hero-progress-block">
            <div className="lvl1-hero-progress-meta">
              <span className="lvl1-progress-lbl">Overall Stage Progress</span>
              <strong className="lvl1-progress-val">{completedSteps.length} of 6 Completed ({progressPct}%)</strong>
            </div>
            <div className="lvl1-hero-progress-track">
              <div
                className="lvl1-hero-progress-fill"
                style={{ width: `${Math.max(progressPct, 3.5)}%` }}
              />
            </div>
          </div>
        </section>

        {/* ================= LEARNING JOURNEY CURRICULUM ================= */}
        <section className="lvl1-steps-roadmap" aria-label="Curriculum Steps">
          <div className="lvl1-roadmap-header">
            <h3 className="lvl1-roadmap-title">Learning Journey Curriculum</h3>
            <span className="lvl1-roadmap-duration">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 4 }}>
                <circle cx="8" cy="8" r="6.5" stroke="#64748B" strokeWidth="1.6"/>
                <path d="M8 4.5V8.2L10.5 9.7" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              ~12 mins total
            </span>
          </div>

          <div className="lvl1-roadmap-list">
            {stepsData.map((step) => {
              const isDone = completedSteps.includes(step.id);
              const isUnlocked = step.id === 1 || completedSteps.includes(step.id - 1);
              const isCurrent = isUnlocked && !isDone;

              return (
                <div
                  key={step.id}
                  className={`lvl1-step-card-modern ${
                    isDone ? 'is-done' : isCurrent ? 'is-current' : 'is-locked'
                  }`}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playTap();
                      setCurrentStage(step.stage);
                    } else {
                      sound.playLocked();
                    }
                  }}
                  role="button"
                  tabIndex={isUnlocked ? 0 : -1}
                  aria-label={`Step ${step.id}: ${step.title} - ${isDone ? 'Completed' : isCurrent ? 'Active' : 'Locked'}`}
                >
                  {/* Left Number Box with Sub-label */}
                  <div className="lvl1-step-badge-col">
                    <div className="lvl1-step-badge-box">
                      <span className="lvl1-step-badge-num">
                        {isDone ? '✓' : `0${step.id}`}
                      </span>
                    </div>
                    <span className="lvl1-step-badge-type">{step.type}</span>
                  </div>

                  {/* Center Content */}
                  <div className="lvl1-step-info-col">
                    <div className="lvl1-step-meta-row">
                      {step.metaIcon === 'clock' && (
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.6"/>
                          <path d="M8 4.5V8.2L10.5 9.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                      )}
                      {step.metaIcon === 'interactive' && (
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.5 2.5H9.5L12.5 5.5V13.5H3.5V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                          <path d="M9.5 2.5V5.5H12.5" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M6 8.5H10M6 11H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      )}
                      {step.metaIcon === 'upload' && (
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 11.5C2.6 11.5 1.5 10.4 1.5 9C1.5 7.7 2.4 6.7 3.7 6.5C4.1 4.5 5.9 3 8 3C10.5 3 12.5 5 12.5 7.5C13.6 7.7 14.5 8.7 14.5 10C14.5 11.4 13.4 12.5 12 12.5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          <path d="M8 8V13M5.5 10.5L8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      <span className="lvl1-step-duration">{step.metaText}</span>
                    </div>
                    <h4 className="lvl1-step-title">{step.title}</h4>
                    <p className="lvl1-step-desc">{step.desc}</p>
                  </div>

                  {/* Right Action / Status Pill */}
                  <div className="lvl1-step-action-col">
                    {isDone ? (
                      <span className="lvl1-status-pill lvl1-status-pill--done">
                        Done ✓
                      </span>
                    ) : isCurrent ? (
                      <button
                        className="lvl1-status-pill lvl1-status-pill--start"
                        onClick={(e) => {
                          e.stopPropagation();
                          sound.playTap();
                          setCurrentStage(step.stage);
                        }}
                      >
                        Start →
                      </button>
                    ) : (
                      <span className="lvl1-status-pill lvl1-status-pill--locked">
                        <span className="lvl1-lock-icon">🔒</span> Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= PRIMARY CTA BUTTON ================= */}
        <div className="lvl1-cta-wrap">
          <button className="lvl1-btn-cta-hero" onClick={handleStartOrResume}>
            <span className="lvl1-btn-cta-hero__text">
              {completedSteps.length === 0
                ? 'Start Level 01 →'
                : completedSteps.length >= 6
                ? 'View Evaluation Status →'
                : `Resume Step 0${nextAvailableStep} →`}
            </span>
            <span className="lvl1-btn-cta-hero__circle" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 4.5L13 10L7.5 15.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>

        {/* ================= MOTIVATIONAL QUOTE ================= */}
        <footer className="lvl1-motivational-quote-wrap" aria-label="Motivational Quote">
          <span className="lvl1-quote-symbol lvl1-quote-symbol--left">“</span>
          <p className="lvl1-quote-text">“Small steps today, a brighter tomorrow.”</p>
          <span className="lvl1-quote-symbol lvl1-quote-symbol--right">”</span>
        </footer>
      </div>
    );
  };

  // 2. STEP 1: LEARNING OBJECTIVES
  const renderObjectives = () => {
    const objectives = [
      {
        id: 1,
        numStr: '01',
        title: 'Foundations of Self-Awareness',
        desc: 'Understand why self-knowledge is the #1 trait recruiters look for during behavioral rounds.',
      },
      {
        id: 2,
        numStr: '02',
        title: 'Evidence-Based Strengths',
        desc: 'Identify personal signature skills grounded in tangible project accomplishments.',
      },
      {
        id: 3,
        numStr: '03',
        title: 'Substantiating with Metrics',
        desc: 'Back up claims with verifiable numbers, peer feedback, and grade evaluations.',
      },
      {
        id: 4,
        numStr: '04',
        title: 'Addressing Blind Spots',
        desc: 'Acknowledge development areas openly and demonstrate rapid adaptability.',
      },
      {
        id: 5,
        numStr: '05',
        title: 'Synthesizing External Feedback',
        desc: 'Use peer and faculty critiques as objective diagnostic data.',
      },
      {
        id: 6,
        numStr: '06',
        title: 'The 7-Day Growth Commitment',
        desc: 'Commit to one realistic habit you can execute and verify within the next 7 days.',
      },
    ];

    return (
      <div className="lvl1-stage-view lvl1-objectives-view">
        <header className="lvl1-screen-header">
          <span className="lvl1-screen-kicker">STEP 01 OF 06 · OBJECTIVES</span>
          <h2 className="lvl1-screen-title">Learning Objectives</h2>
          <p className="lvl1-screen-desc">
            Master the core self-awareness competencies expected in modern corporate placement drives.
          </p>
        </header>

        {/* Clean, un-carded numbered curriculum list */}
        <div className="lvl1-objectives-clean-list">
          {objectives.map((obj) => (
            <div key={obj.id} className="lvl1-obj-list-item">
              <div className="lvl1-obj-list-badge">
                <span>{obj.numStr}</span>
              </div>
              <div className="lvl1-obj-list-body">
                <h3 className="lvl1-obj-list-title">{obj.title}</h3>
                <p className="lvl1-obj-list-desc">{obj.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => setCurrentStage('overview')}
          >
            ← Overview
          </button>
          <button
            className="lvl1-btn-cta lvl1-btn-cta--primary"
            onClick={handleCompleteObjectives}
          >
            Continue to Lesson Notes →
          </button>
        </footer>
      </div>
    );
  };

  // 3. STEP 2: READ LESSON NOTES (Clean Document Reader Experience)
  const renderNotes = () => {
    const isKn = notesLanguage === 'kn';

    return (
      <div className="lvl1-stage-view lvl1-notes-reader-view">
        {/* Reading Toolbar */}
        <div className="lvl1-reading-toolbar">
          <div className="lvl1-reading-toolbar__meta">
            <span className="lvl1-reading-step-kicker">STEP 02 OF 06 · 5 MIN READ</span>
          </div>

          <div className="lvl1-reading-toolbar__actions">
            <div className="lvl1-lang-pill-switch">
              <button
                className={`lvl1-lang-choice ${notesLanguage === 'en' ? 'is-active' : ''}`}
                onClick={() => setNotesLanguage('en')}
              >
                English
              </button>
              <button
                className={`lvl1-lang-choice ${notesLanguage === 'kn' ? 'is-active' : ''}`}
                onClick={() => setNotesLanguage('kn')}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <button
              className="lvl1-doc-download-btn"
              onClick={() => generateLessonNotesPdf({ language: notesLanguage })}
              title="Download official PDF version of lesson notes"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2.5V10.5M8 10.5L5 7.5M8 10.5L11 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 13.5H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Clean Document Reading Surface */}
        <article className="lvl1-document-surface">
          {/* Document Header */}
          <header className="lvl1-doc-header">
            <h2 className="lvl1-doc-main-title">Read Lesson Notes</h2>
            <p className="lvl1-doc-main-desc">
              {isKn
                ? 'ಪ್ರಾಮಾಣಿಕ ಸ್ವಯಂ-ಜ್ಞಾನ, ಪುರಾವೆಗಳ ಸೂತ್ರೀಕರಣ ಮತ್ತು ಉದ್ದೇಶಪೂರ್ವಕ ಅಭ್ಯಾಸದ ತತ್ವಗಳನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಿ.'
                : 'Master the principles of authentic self-knowledge, evidence formulation, and deliberate practice.'}
            </p>
          </header>

          {/* Section 1 */}
          <section className="lvl1-doc-section">
            <h3 className="lvl1-doc-section-heading">
              {isKn
                ? '1. ವೃತ್ತಿ ಸಿದ್ಧತೆಯಲ್ಲಿ ಸ್ವಯಂ-ಅರಿವು ಎಂದರೇನು?'
                : '1. What is Self-Awareness in Career Readiness?'}
            </h3>
            <p className="lvl1-doc-paragraph">
              {isKn
                ? 'ಸ್ವಯಂ-ಅರಿವು ಎಂಬುದು ನಿಮ್ಮ ಪ್ರೇರಣೆಗಳು, ಕೆಲಸದ ಅಭ್ಯಾಸಗಳು, ತಾಂತ್ರಿಕ ಸಾಮರ್ಥ್ಯಗಳು ಮತ್ತು ಬೆಳವಣಿಗೆಯ ಕ್ಷೇತ್ರಗಳ ಪ್ರಜ್ಞಾಪೂರ್ವಕ ಗುರುತಿಸುವಿಕೆಯಾಗಿದೆ. ಕ್ಯಾಂಪಸ್ ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಸಂದರ್ಶನಗಳಲ್ಲಿ, ನೇಮಕಾತಿದಾರರು ಸ್ವಯಂ-ಅರಿವು ಹೊಂದಿರುವ ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ಹೆಚ್ಚಿನ ಆದ್ಯತೆ ನೀಡುತ್ತಾರೆ ಏಕೆಂದರೆ ಅವರು ಎಲ್ಲಿ ತಕ್ಷಣ ಮೌಲ್ಯವನ್ನು ನೀಡಬಹುದು ಮತ್ತು ಎಲ್ಲಿ ಅವರಿಗೆ ಮಾರ್ಗದರ್ಶನ ಬೇಕಾಗುತ್ತದೆ ಎಂಬುದನ್ನು ನಿಖರವಾಗಿ ತಿಳಿಸುತ್ತಾರೆ.'
                : 'Self-awareness is the conscious recognition of your motivations, work habits, technical aptitudes, and areas for growth. In placement drives, recruiters prioritize self-aware candidates because they accurately articulate where they can immediately deliver value and where they require mentorship.'}
            </p>
          </section>

          {/* Section 2 */}
          <section className="lvl1-doc-section">
            <h3 className="lvl1-doc-section-heading">
              {isKn
                ? '2. ನೈಜ ಸಾಮರ್ಥ್ಯಗಳು vs ಸಾಮಾನ್ಯ ಹೇಳಿಕೆಗಳನ್ನು ಗುರುತಿಸುವುದು'
                : '2. Identifying True Strengths vs. Generic Claims'}
            </h3>
            <p className="lvl1-doc-paragraph">
              {isKn
                ? 'ನೈಜ ಸಾಮರ್ಥ್ಯ ಎಂಬುದು ಪರಿಶೀಲಿಸಬಹುದಾದ ಪುರಾವೆಗಳ ಮೂಲಕ ನೀವು ಸ್ಥಿರವಾಗಿ ಪ್ರದರ್ಶಿಸಬಹುದಾದ ಕೌಶಲ್ಯವಾಗಿದೆ. "ನಾನು ತ್ವರಿತವಾಗಿ ಕಲಿಯುವವನು ಮತ್ತು ಶ್ರಮಜೀವಿ" ಎಂದು ಹೇಳುವುದು ಕೇವಲ ಒಂದು ಪ್ರತಿಪಾದನೆ; ನಿರ್ದಿಷ್ಟ ಪ್ರಾಜೆಕ್ಟ್ ಕಥೆಯೊಂದಿಗೆ ಅದನ್ನು ಬೆಂಬಲಿಸುವುದು ನಿಜವಾದ ಪುರಾವೆ.'
                : 'A genuine strength is an ability that you can consistently demonstrate through verifiable evidence. Saying "I am a quick learner and hard worker" is a claim; backing it up with a specific project story is proof.'}
            </p>

            {/* Subtle highlighted document callout */}
            <div className="lvl1-doc-callout lvl1-doc-callout--formula">
              <div className="lvl1-doc-callout__label">THE STRENGTH FORMULA</div>
              <div className="lvl1-doc-callout__formula-text">
                <span className="lvl1-doc-formula-pill">Core Skill</span>
                <span className="lvl1-doc-math-op">+</span>
                <span className="lvl1-doc-formula-pill">Project Context</span>
                <span className="lvl1-doc-math-op">+</span>
                <span className="lvl1-doc-formula-pill">Concrete Action</span>
                <span className="lvl1-doc-math-op">+</span>
                <span className="lvl1-doc-formula-pill">Measurable Result</span>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="lvl1-doc-section">
            <h3 className="lvl1-doc-section-heading">
              {isKn ? '3. ಊಹೆ vs ಕಾಂಕ್ರೀಟ್ ಪುರಾವೆ' : '3. Assumption vs. Concrete Evidence'}
            </h3>

            <div className="lvl1-doc-examples-stack">
              <div className="lvl1-doc-callout lvl1-doc-callout--vague">
                <div className="lvl1-doc-callout__tag is-vague">
                  <span>✕ Vague Assumption</span>
                </div>
                <p className="lvl1-doc-callout__quote">
                  "I think I have great problem-solving skills because I enjoy coding."
                </p>
              </div>

              <div className="lvl1-doc-callout lvl1-doc-callout--verifiable">
                <div className="lvl1-doc-callout__tag is-verifiable">
                  <span>✓ Verifiable Evidence</span>
                </div>
                <p className="lvl1-doc-callout__quote">
                  "Resolved asynchronous API race conditions in my final-year IoT project, reducing sensor packet drop rate by 42%."
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="lvl1-doc-section">
            <h3 className="lvl1-doc-section-heading">
              {isKn
                ? '4. ಬೆಳವಣಿಗೆಯ ಮನಸ್ಥಿತಿ ಮತ್ತು ಅಂಧ ಬಿಂದುಗಳನ್ನು ಎದುರಿಸುವುದು'
                : '4. Growth Mindset & Addressing Blind Spots'}
            </h3>
            <p className="lvl1-doc-paragraph">
              {isKn
                ? 'ಪ್ರತಿಯೊಬ್ಬ ವೃತ್ತಿಪರನಿಗೂ ಸುಧಾರಣೆಯ ಅಗತ್ಯವಿರುವ ಕ್ಷೇತ್ರಗಳಿರುತ್ತವೆ. ನಿಜವಾದ ಆತ್ಮವಿಶ್ವಾಸ ಎಂದರೆ ಪರಿಪೂರ್ಣವಾಗಿರುವುದು ಎಂದಲ್ಲ; ಇದು ನಿಮ್ಮ ಬೆಳವಣಿಗೆಯ ಮಿತಿಗಳನ್ನು ಪೂರ್ವಭಾವಿಯಾಗಿ ಗುರುತಿಸುವುದು ಮತ್ತು ಸುಧಾರಿಸಲು ಉದ್ದೇಶಪೂರ್ವಕ ಅಭ್ಯಾಸವನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳುವುದು.'
                : 'Every professional has areas requiring refinement. True confidence does not mean being perfect; it means proactively acknowledging your growth edges and adopting deliberate practice to improve.'}
            </p>
          </section>

          {/* Section 5 */}
          <section className="lvl1-doc-section">
            <h3 className="lvl1-doc-section-heading">
              {isKn
                ? '5. 7-ದಿನಗಳ ಸುಧಾರಣಾ ಕ್ರಿಯಾ ಚೌಕಟ್ಟು'
                : '5. The 7-Day Improvement Action Framework'}
            </h3>
            <p className="lvl1-doc-paragraph">
              {isKn ? (
                <>
                  ವೃತ್ತಿಜೀವನದ ಪ್ರಗತಿಯು ಸಣ್ಣ, ಸ್ಥಿರವಾದ ಅಭ್ಯಾಸಗಳಿಂದ ಉಂಟಾಗುತ್ತದೆ. ಅಸ್ಪಷ್ಟ ದೀರ್ಘಾವಧಿಯ ಗುರಿಗಳನ್ನು ನಿಗದಿಪಡಿಸುವ ಬದಲು, ಮುಂದಿನ 7 ದಿನಗಳಲ್ಲಿ ನೀವು ಕಾರ್ಯಗತಗೊಳಿಸುವ <strong>ಒಂದು ನಿರ್ದಿಷ್ಟ ಕ್ರಿಯೆಗೆ</strong> ಬದ್ಧರಾಗಿರಿ.
                </>
              ) : (
                <>
                  Career breakthroughs stem from small, consistent habits. Rather than setting vague long-term goals, commit to <strong>one specific action</strong> you will execute within the next 7 days.
                </>
              )}
            </p>
          </section>
        </article>

        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => setCurrentStage('objectives')}
          >
            ← Previous
          </button>
          <button
            className="lvl1-btn-cta lvl1-btn-cta--primary"
            onClick={handleCompleteNotes}
          >
            Mark Notes as Read →
          </button>
        </footer>
      </div>
    );
  };

  // 4. STEP 3: WATCH VIDEO (Cinema Video Experience)
  const renderVideo = () => {
    const isKn = videoLanguage === 'kn';
    const totalSeconds = 270; // 4:30
    const currentSeconds = Math.round((videoProgress / 100) * totalSeconds);
    const curMin = Math.floor(currentSeconds / 60);
    const curSec = String(currentSeconds % 60).padStart(2, '0');
    const timeStr = `${curMin}:${curSec}`;

    const takeaways = isKn
      ? [
          {
            id: 1,
            num: '01',
            text: 'ಸ್ವಯಂ-ಅರಿವು ಅಹಂಕಾರವಿಲ್ಲದೆ ನೈಜ ಆತ್ಮವಿಶ್ವಾಸವನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ.',
          },
          {
            id: 2,
            num: '02',
            text: 'ಯಾವಾಗಲೂ ನಿಮ್ಮ ಪ್ರಮುಖ 3 ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಕಾಂಕ್ರೀಟ್ ಪ್ರಾಜೆಕ್ಟ್ ಕಥೆಗಳೊಂದಿಗೆ ಸಮರ್ಥಿಸಿಕೊಳ್ಳಿ.',
          },
          {
            id: 3,
            num: '03',
            text: 'ಅಂಧ ಬಿಂದುಗಳನ್ನು ಸಕ್ರಿಯ ತಗ್ಗಿಸುವಿಕೆ ಮತ್ತು ಸಾಪ್ತಾಹಿಕ ಅಭ್ಯಾಸಗಳೊಂದಿಗೆ ವಿವರಿಸಿ.',
          },
        ]
      : [
          {
            id: 1,
            num: '01',
            text: 'Self-awareness creates confidence without arrogance.',
          },
          {
            id: 2,
            num: '02',
            text: 'Always substantiate your top 3 strengths with concrete project stories.',
          },
          {
            id: 3,
            num: '03',
            text: 'Frame blind spots around active mitigation and weekly habits.',
          },
        ];

    const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(100, Math.round((clickX / rect.width) * 100)));
      setVideoProgress(pct);
    };

    return (
      <div className="lvl1-stage-view lvl1-video-stage-view">
        {/* Step Metadata & Language Row */}
        <div className="lvl1-reading-toolbar">
          <div className="lvl1-reading-toolbar__meta">
            <span className="lvl1-reading-step-kicker">STEP 03 OF 06 · 4:30 MINS</span>
          </div>
          <div className="lvl1-reading-toolbar__actions">
            <div className="lvl1-lang-pill-switch">
              <button
                className={`lvl1-lang-choice ${videoLanguage === 'en' ? 'is-active' : ''}`}
                onClick={() => setVideoLanguage('en')}
              >
                English
              </button>
              <button
                className={`lvl1-lang-choice ${videoLanguage === 'kn' ? 'is-active' : ''}`}
                onClick={() => setVideoLanguage('kn')}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <header className="lvl1-doc-header" style={{ marginBottom: 18, paddingBottom: 0, borderBottom: 'none' }}>
          <h2 className="lvl1-doc-main-title">Watch Concept Video</h2>
          <p className="lvl1-doc-main-desc">
            Visual walkthrough on how evaluators score self-awareness and how to articulate your strengths authentically.
          </p>
        </header>

        {/* Modern 16:9 Video Player */}
        <div className="lvl1-video-player-card">
          <div className="lvl1-video-player-inner">
            {/* Background Graphic & Poster */}
            <div className="lvl1-video-poster">
              <div className="lvl1-video-poster__grid" aria-hidden="true" />
              <div className="lvl1-video-poster__glow" aria-hidden="true" />
              <div className="lvl1-video-poster__content">
                <span className="lvl1-video-poster__badge">
                  CAREER CLARITY · {videoLanguage === 'en' ? 'ENGLISH HD' : 'ಕನ್ನಡ HD'}
                </span>
                <h3 className="lvl1-video-poster__title">Foundations of Self-Awareness</h3>
                <span className="lvl1-video-poster__meta">4 min 30 sec · Video Walkthrough</span>
              </div>
            </div>

            {/* Completion Success Overlay / Badge */}
            {videoProgress >= 100 && (
              <div className="lvl1-video-completed-banner">
                <span>✓ Video Completed (+30 XP)</span>
              </div>
            )}

            {/* Big Circular Center Play / Pause Button */}
            <button
              className={`lvl1-video-center-btn ${isPlayingVideo ? 'is-playing' : ''}`}
              onClick={() => {
                sound.playTap();
                if (videoProgress >= 100) {
                  setVideoProgress(0);
                  setIsPlayingVideo(true);
                } else {
                  setIsPlayingVideo(!isPlayingVideo);
                }
              }}
              aria-label={isPlayingVideo ? 'Pause Video' : 'Play Video'}
            >
              {isPlayingVideo ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 5H10V19H6V5ZM14 5H18V19H14V5Z"/>
                </svg>
              ) : videoProgress >= 100 ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                  <path d="M3 3v5h5"/>
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 3 }}>
                  <path d="M8 5V19L19 12L8 5Z"/>
                </svg>
              )}
            </button>

            {/* Bottom Controls Bar */}
            <div className="lvl1-video-controls-bar">
              {/* Timeline Track */}
              <div
                className="lvl1-video-timeline-wrap"
                onClick={handleScrubberClick}
                role="slider"
                aria-valuenow={videoProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                title="Click to seek video"
              >
                <div className="lvl1-video-timeline-track">
                  <div
                    className="lvl1-video-timeline-fill"
                    style={{ width: `${videoProgress}%` }}
                  />
                  <div
                    className="lvl1-video-timeline-thumb"
                    style={{ left: `${videoProgress}%` }}
                  />
                </div>
              </div>

              {/* Controls Action Row */}
              <div className="lvl1-video-controls-row">
                <div className="lvl1-video-controls-left">
                  <button
                    className="lvl1-video-ctrl-icon-btn"
                    onClick={() => {
                      sound.playTap();
                      if (videoProgress >= 100) {
                        setVideoProgress(0);
                        setIsPlayingVideo(true);
                      } else {
                        setIsPlayingVideo(!isPlayingVideo);
                      }
                    }}
                    title={isPlayingVideo ? 'Pause' : 'Play'}
                  >
                    {isPlayingVideo ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 5H10V19H6V5ZM14 5H18V19H14V5Z"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5V19L19 12L8 5Z"/>
                      </svg>
                    )}
                  </button>

                  <span className="lvl1-video-time-display">
                    {timeStr} <span className="lvl1-video-time-divider">/</span> 4:30
                  </span>
                </div>

                <div className="lvl1-video-controls-right">
                  <button
                    className="lvl1-video-ctrl-icon-btn"
                    onClick={() => sound.playTap()}
                    title="Volume"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    </svg>
                  </button>

                  <span className="lvl1-video-hd-badge">HD</span>

                  <button
                    className="lvl1-video-ctrl-icon-btn"
                    onClick={() => sound.playTap()}
                    title="Fullscreen"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Placement Takeaways (Clean Numbered List) */}
        <section className="lvl1-video-takeaways-section">
          <h3 className="lvl1-video-takeaways-title">Key Placement Takeaways</h3>
          <div className="lvl1-video-takeaways-list">
            {takeaways.map((item) => (
              <div key={item.id} className="lvl1-takeaway-item">
                <div className="lvl1-takeaway-badge">
                  <span>{item.num}</span>
                </div>
                <div className="lvl1-takeaway-text">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Actions */}
        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => setCurrentStage('notes')}
          >
            ← Previous
          </button>
          <button
            className="lvl1-btn-cta lvl1-btn-cta--primary"
            onClick={handleCompleteVideo}
          >
            Continue to Quick Quiz →
          </button>
        </footer>
      </div>
    );
  };

  // 5. STEP 4: QUICK CHECK QUIZ
  const renderQuiz = () => {
    // If quiz is completed and submitted, render the dedicated Result State
    if (quizSubmitted) {
      let score = 0;
      QUIZ_QUESTIONS.forEach((q) => {
        if (selectedAnswers[q.id] === q.correctIndex) score += 1;
      });

      return (
        <div className="lvl1-stage-view lvl1-quiz-result-view">
          {/* Header */}
          <div className="lvl1-reading-toolbar">
            <div className="lvl1-reading-toolbar__meta">
              <span className="lvl1-reading-step-kicker">STEP 04 OF 06 · ASSESSMENT COMPLETE</span>
            </div>
          </div>

          <div className="lvl1-quiz-result-card">
            <div className="lvl1-quiz-result-trophy">
              <div className="lvl1-quiz-result-trophy-icon">🏆</div>
            </div>

            <h2 className="lvl1-quiz-result-title">Quiz Complete</h2>

            <div className="lvl1-quiz-score-pill">
              <span className="lvl1-quiz-score-num">{score} / {QUIZ_QUESTIONS.length}</span>
              <span className="lvl1-quiz-score-label">Correct</span>
            </div>

            <p className="lvl1-quiz-result-desc">
              {score === 3
                ? 'Excellent understanding of the core self-awareness concepts.'
                : 'Good effort! You demonstrated key awareness of evidence-based principles.'}
            </p>

            <div className="lvl1-quiz-checklist">
              <div className="lvl1-quiz-check-item">
                <span className="lvl1-quiz-check-icon">✓</span>
                <span>Lesson concepts understood</span>
              </div>
              <div className="lvl1-quiz-check-item">
                <span className="lvl1-quiz-check-icon">✓</span>
                <span>Evidence-based thinking demonstrated</span>
              </div>
              <div className="lvl1-quiz-check-item">
                <span className="lvl1-quiz-check-icon">✓</span>
                <span>Ready for the Self-Awareness Snapshot</span>
              </div>
            </div>

            <div className="lvl1-quiz-result-actions">
              <button
                className="lvl1-btn-cta lvl1-btn-cta--primary"
                onClick={handleCompleteQuiz}
                style={{ width: '100%' }}
              >
                Continue to Self-Awareness Snapshot →
              </button>
              <button
                className="lvl1-quiz-retake-btn"
                onClick={() => {
                  sound.playTap();
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                  setCurrentQuizIndex(0);
                }}
              >
                ↻ Retake Quiz
              </button>
            </div>
          </div>
        </div>
      );
    }

    const q = QUIZ_QUESTIONS[currentQuizIndex];
    const isAnswered = selectedAnswers[q.id] !== undefined;
    const isLastQuestion = currentQuizIndex === QUIZ_QUESTIONS.length - 1;
    const selectedOpt = selectedAnswers[q.id];
    const isCorrect = isAnswered && selectedOpt === q.correctIndex;

    return (
      <div className="lvl1-stage-view lvl1-quiz-stage-view">
        {/* Step Kicker */}
        <div className="lvl1-reading-toolbar">
          <div className="lvl1-reading-toolbar__meta">
            <span className="lvl1-reading-step-kicker">STEP 04 OF 06 · QUICK CHECK</span>
          </div>
        </div>

        {/* Page Header */}
        <header className="lvl1-doc-header" style={{ marginBottom: 18, paddingBottom: 0, borderBottom: 'none' }}>
          <h2 className="lvl1-doc-main-title">Quick Quiz</h2>
          <p className="lvl1-doc-main-desc">
            Test your understanding of Lesson 1 concepts with 3 practical scenarios before starting your worksheet.
          </p>
        </header>

        {/* Question Navigation Tabs: Q1, Q2, Q3 */}
        <div className="lvl1-quiz-tabs-row" role="tablist">
          {QUIZ_QUESTIONS.map((item, idx) => {
            const answered = selectedAnswers[item.id] !== undefined;
            const active = idx === currentQuizIndex;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={active}
                className={`lvl1-quiz-tab ${active ? 'is-active' : answered ? 'is-answered' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setCurrentQuizIndex(idx);
                }}
              >
                <span>Q{idx + 1}</span>
                {answered && <span className="lvl1-quiz-tab-check">✓</span>}
              </button>
            );
          })}
        </div>

        {/* ONE Question Container */}
        <div className="lvl1-quiz-single-container">
          <div className="lvl1-quiz-container-header">
            <span className="lvl1-quiz-qnum-kicker">
              QUESTION {currentQuizIndex + 1} OF {QUIZ_QUESTIONS.length}
            </span>
          </div>

          <h3 className="lvl1-quiz-question-prompt">{q.question}</h3>

          {/* 4 Answer Options */}
          <div className="lvl1-quiz-options-stack">
            {q.options.map((opt, optIdx) => {
              const selected = selectedOpt === optIdx;
              const correct = optIdx === q.correctIndex;
              let optionClass = 'lvl1-quiz-option-btn';

              if (isAnswered) {
                if (correct) optionClass += ' is-correct-answer';
                else if (selected && !correct) optionClass += ' is-wrong-answer';
                else optionClass += ' is-locked-choice';
              } else if (selected) {
                optionClass += ' is-selected';
              }

              return (
                <button
                  key={optIdx}
                  className={optionClass}
                  disabled={isAnswered}
                  onClick={() => handleQuizAnswer(q.id, optIdx)}
                  aria-pressed={selected}
                >
                  <div className="lvl1-quiz-option-badge">
                    <span>{String.fromCharCode(65 + optIdx)}</span>
                  </div>
                  <span className="lvl1-quiz-option-text">{opt}</span>
                  {isAnswered && correct && (
                    <span className="lvl1-quiz-option-tick" aria-hidden="true">✓</span>
                  )}
                  {isAnswered && selected && !correct && (
                    <span className="lvl1-quiz-option-cross" aria-hidden="true">✕</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subtle Correct / Incorrect Feedback Callout */}
          {isAnswered && (
            <div className={`lvl1-quiz-feedback-box ${isCorrect ? 'is-correct' : 'is-incorrect'}`}>
              <div className="lvl1-quiz-feedback-header">
                {isCorrect ? (
                  <span className="lvl1-quiz-feedback-tag is-correct">✓ Correct</span>
                ) : (
                  <span className="lvl1-quiz-feedback-tag is-incorrect">✕ Not quite</span>
                )}
              </div>
              <p className="lvl1-quiz-feedback-body">
                {isCorrect ? q.correctExplanation : q.incorrectExplanation}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => {
              sound.playTap();
              if (currentQuizIndex > 0) {
                setCurrentQuizIndex(currentQuizIndex - 1);
              } else {
                setCurrentStage('video');
              }
            }}
          >
            ← Previous
          </button>

          {!isLastQuestion ? (
            <button
              className="lvl1-btn-cta lvl1-btn-cta--primary"
              disabled={!isAnswered}
              onClick={() => {
                sound.playTap();
                setCurrentQuizIndex(currentQuizIndex + 1);
              }}
            >
              Next Question →
            </button>
          ) : (
            <button
              className="lvl1-btn-cta lvl1-btn-cta--primary"
              disabled={!isAnswered}
              onClick={handleQuizSubmit}
            >
              Finish Quiz →
            </button>
          )}
        </footer>
      </div>
    );
  };

  // 6. STEP 5: SELF-AWARENESS SNAPSHOT (Sub-Stepper)
  const renderActivityStepper = () => {
    const subSteps = [
      { id: 0, label: 'Strength 1', subtitle: 'Primary Capability' },
      { id: 1, label: 'Strength 2', subtitle: 'Collaboration / Execution' },
      { id: 2, label: 'Strength 3', subtitle: 'Adaptability & Learning' },
      { id: 3, label: '7-Day Action', subtitle: 'Growth Commitment' },
    ];

    return (
      <div className="lvl1-stage-view">
        <header className="lvl1-screen-header">
          <div className="lvl1-screen-header__row">
            <span className="lvl1-screen-kicker">STEP 05 OF 06 · MAIN ACTIVITY</span>
            <button className="lvl1-autofill-btn" onClick={handleAutofillActivity}>
              ✨ Autofill Sample
            </button>
          </div>
          <h2 className="lvl1-screen-title">Self-Awareness Snapshot</h2>
          <p className="lvl1-screen-desc">
            Reflect on your strengths using real experiences and identify one concrete improvement action for the next 7 days.
          </p>
        </header>

        {/* Stepper Tabs */}
        <div className="lvl1-sub-stepper">
          {subSteps.map((s) => (
            <button
              key={s.id}
              className={`lvl1-stepper-tab ${activitySubStep === s.id ? 'is-active' : activitySubStep > s.id ? 'is-done' : ''}`}
              onClick={() => {
                sound.playTap();
                setActivitySubStep(s.id);
              }}
            >
              <span className="lvl1-stepper-tab__num">{s.id + 1}</span>
              <span className="lvl1-stepper-tab__label">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Form Fields for Strength 1 / 2 / 3 */}
        {activitySubStep >= 0 && activitySubStep <= 2 && (
          <div className="lvl1-worksheet-card">
            <div className="lvl1-worksheet-header">
              <span className="lvl1-worksheet-tag">STRENGTH {activitySubStep + 1} OF 3</span>
              <span className="lvl1-worksheet-subtitle">{subSteps[activitySubStep].subtitle}</span>
            </div>

            <div className="lvl1-form-item">
              <label className="lvl1-field-label">Strength Name</label>
              <input
                type="text"
                className="lvl1-field-input"
                placeholder="e.g., Analytical Problem Solving & Debugging"
                value={strengths[activitySubStep as 0 | 1 | 2].strength}
                onChange={(e) =>
                  handleStrengthChange(activitySubStep as 0 | 1 | 2, 'strength', e.target.value)
                }
              />
            </div>

            <div className="lvl1-form-item">
              <label className="lvl1-field-label">Experience that proves it</label>
              <input
                type="text"
                className="lvl1-field-input"
                placeholder="e.g., Final Year Capstone Project / IoT Lab Hackathon"
                value={strengths[activitySubStep as 0 | 1 | 2].experience}
                onChange={(e) =>
                  handleStrengthChange(activitySubStep as 0 | 1 | 2, 'experience', e.target.value)
                }
              />
            </div>

            <div className="lvl1-form-item">
              <label className="lvl1-field-label">What I did</label>
              <textarea
                className="lvl1-field-textarea"
                rows={3}
                placeholder="Describe your concrete action and the methodology you utilized..."
                value={strengths[activitySubStep as 0 | 1 | 2].whatIDid}
                onChange={(e) =>
                  handleStrengthChange(activitySubStep as 0 | 1 | 2, 'whatIDid', e.target.value)
                }
              />
            </div>

            <div className="lvl1-form-item">
              <label className="lvl1-field-label">Result / feedback received</label>
              <input
                type="text"
                className="lvl1-field-input"
                placeholder="e.g., Reduced latency by 42% and received high commendation"
                value={strengths[activitySubStep as 0 | 1 | 2].result}
                onChange={(e) =>
                  handleStrengthChange(activitySubStep as 0 | 1 | 2, 'result', e.target.value)
                }
              />
            </div>

            <div className="lvl1-protip-box">
              <span>💡 <strong>Pro Tip:</strong> Include numbers, team sizes, or grade impact in your Result field.</span>
            </div>
          </div>
        )}

        {/* Part 4: 7-Day Improvement Action */}
        {activitySubStep === 3 && (
          <div className="lvl1-worksheet-card">
            <div className="lvl1-worksheet-header">
              <span className="lvl1-worksheet-tag">IMPROVEMENT ACTION</span>
              <span className="lvl1-worksheet-subtitle">7-Day Growth Commitment</span>
            </div>

            <div className="lvl1-form-item">
              <label className="lvl1-field-label">
                What is one specific improvement action you will complete within the next 7 days?
              </label>
              <textarea
                className="lvl1-field-textarea lvl1-field-textarea--highlight"
                rows={4}
                placeholder="e.g., In the next 7 days, I will schedule two 15-minute mock introduction sessions with my peer study group and record a video playback of my 60-second elevator pitch to refine body language..."
                value={improvementAction}
                onChange={(e) => setImprovementAction(e.target.value)}
              />
            </div>

            <div className="lvl1-protip-box">
              <span>💡 <strong>Pro Tip:</strong> Focus on 1 concrete habit with a clear timeline rather than vague goals.</span>
            </div>
          </div>
        )}

        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => {
              sound.playTap();
              if (activitySubStep > 0) {
                setActivitySubStep((s) => s - 1);
              } else {
                setCurrentStage('quiz');
              }
            }}
          >
            ← Previous
          </button>

          <button
            className="lvl1-btn-cta lvl1-btn-cta--primary"
            onClick={handleNextActivitySubStep}
          >
            {activitySubStep < 3 ? `Next Part (${activitySubStep + 2}/4) ➔` : 'Review Snapshot ➔'}
          </button>
        </footer>
      </div>
    );
  };

  // 7. STEP 5 REVIEW: REVIEW YOUR SNAPSHOT DOSSIER
  const renderActivityReview = () => {
    const s1 = {
      title: strengths[0]?.strength || 'Analytical Problem Solving & Debugging',
      exp: strengths[0]?.experience || 'Academic Capstone Project & Hackathon 2025',
      what: strengths[0]?.whatIDid || 'Identified asynchronous race condition causing latency in sensor telemetry module and restructured promise handlers.',
      result: strengths[0]?.result || 'Reduced data drop rate by 42% and received high commendation from the academic evaluation panel.',
    };

    const s2 = {
      title: strengths[1]?.strength || 'Cross-Disciplinary Team Leadership',
      exp: strengths[1]?.experience || 'Annual College Tech Fest Organizing Committee',
      what: strengths[1]?.whatIDid || 'Led a 6-member student squad to coordinate registration workflows and live lab sessions.',
      result: strengths[1]?.result || 'Managed 850+ participant check-ins smoothly with zero queue bottlenecks.',
    };

    const s3 = {
      title: strengths[2]?.strength || 'Adaptive Self-Learning & Rapid Upskilling',
      exp: strengths[2]?.experience || 'Self-directed full-stack web development transition',
      what: strengths[2]?.whatIDid || 'Built 3 functional prototypes in 4 weeks while maintaining 8.8 CGPA.',
      result: strengths[2]?.result || 'Published open-source demo repository and earned mentor peer-review certificate.',
    };

    const actionText = improvementAction.trim() ||
      'In the next 7 days, I will schedule two 15-minute mock introduction sessions with my peer study group and record a video playback of my 60-second elevator pitch to refine body language.';

    const strengthsData = [
      { id: 1, subStep: 0, tag: 'STRENGTH 1', data: s1 },
      { id: 2, subStep: 1, tag: 'STRENGTH 2', data: s2 },
      { id: 3, subStep: 2, tag: 'STRENGTH 3', data: s3 },
    ];

    return (
      <div className="lvl1-stage-view lvl1-dossier-stage-view">
        {/* Step Kicker */}
        <div className="lvl1-reading-toolbar">
          <div className="lvl1-reading-toolbar__meta">
            <span className="lvl1-reading-step-kicker">STEP 05 · REVIEW DOSSIER</span>
          </div>
          <div className="lvl1-reading-toolbar__actions">
            <div className="lvl1-dossier-summary-pill">
              <span className="lvl1-dossier-summary-check">✓</span>
              <span>3 Strengths · 1 Action Plan</span>
            </div>
          </div>
        </div>

        {/* Page Header */}
        <header className="lvl1-doc-header" style={{ marginBottom: 16, paddingBottom: 0, borderBottom: 'none' }}>
          <h2 className="lvl1-doc-main-title">Review Your Snapshot</h2>
          <p className="lvl1-doc-main-desc">
            Review your reflections before saving and proceeding to the evidence upload step.
          </p>
        </header>

        {/* Unified Dossier Container */}
        <div className="lvl1-dossier-container">
          {/* Strengths 1, 2, 3 */}
          {strengthsData.map((item) => (
            <div key={item.id} className="lvl1-dossier-strength-block">
              <div className="lvl1-dossier-block-top">
                <span className="lvl1-dossier-tag">⚡ {item.tag}</span>
                <button
                  className="lvl1-dossier-edit-inline-btn"
                  onClick={() => {
                    sound.playTap();
                    setCurrentStage('activity');
                    setActivitySubStep(item.subStep);
                  }}
                  title={`Edit ${item.tag}`}
                >
                  Edit ✎
                </button>
              </div>

              <h3 className="lvl1-dossier-strength-title">{item.data.title}</h3>

              <div className="lvl1-dossier-fields-grid">
                <div className="lvl1-dossier-field">
                  <div className="lvl1-dossier-field-header">
                    <span className="lvl1-dossier-label">EXPERIENCE</span>
                    <span className="lvl1-dossier-quality-badge">✓ Specific experience</span>
                  </div>
                  <p className="lvl1-dossier-value">{item.data.exp}</p>
                </div>

                <div className="lvl1-dossier-field">
                  <div className="lvl1-dossier-field-header">
                    <span className="lvl1-dossier-label">WHAT I DID</span>
                    <span className="lvl1-dossier-quality-badge">✓ Action clearly defined</span>
                  </div>
                  <p className="lvl1-dossier-value">{item.data.what}</p>
                </div>

                <div className="lvl1-dossier-field">
                  <div className="lvl1-dossier-field-header">
                    <span className="lvl1-dossier-label">RESULT</span>
                    <span className="lvl1-dossier-quality-badge is-quantifiable">✓ Quantifiable result</span>
                  </div>
                  <p className="lvl1-dossier-value">{item.data.result}</p>
                </div>
              </div>
            </div>
          ))}

          {/* 7-Day Improvement Action Commitment */}
          <div className="lvl1-dossier-action-block">
            <div className="lvl1-dossier-block-top">
              <span className="lvl1-dossier-action-tag">🎯 7-DAY IMPROVEMENT ACTION</span>
              <button
                className="lvl1-dossier-edit-inline-btn"
                onClick={() => {
                  sound.playTap();
                  setCurrentStage('activity');
                  setActivitySubStep(3);
                }}
                title="Edit 7-Day Action"
              >
                Edit ✎
              </button>
            </div>

            <p className="lvl1-dossier-action-body">
              "{actionText}"
            </p>

            <div className="lvl1-dossier-action-footer">
              <span className="lvl1-dossier-quality-badge is-quantifiable">
                ✓ Measurable 7-day commitment
              </span>
            </div>
          </div>
        </div>

        {/* Confirmation Message */}
        <div className="lvl1-dossier-confirm-note">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div className="lvl1-dossier-confirm-text">
            <strong>Your snapshot includes 3 evidence-backed strengths and a measurable 7-day improvement action.</strong>
            <span>Review everything carefully before continuing to evidence submission.</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => {
              sound.playTap();
              setCurrentStage('activity');
              setActivitySubStep(0);
            }}
          >
            Edit Responses ✎
          </button>
          <button
            className="lvl1-btn-cta lvl1-btn-cta--primary"
            onClick={handleSaveActivityReview}
          >
            Save & Continue to Step 6 →
          </button>
        </footer>
      </div>
    );
  };

  // 8. STEP 6: EVIDENCE SUBMISSION
  const renderSubmission = () => {
    // If successfully submitted, show the Submission Confirmation view
    if (submissionSuccess) {
      return (
        <div className="lvl1-stage-view lvl1-submission-stage-view">
          <div className="lvl1-submission-success-card">
            <div className="lvl1-submission-success-icon-wrap">
              <span className="lvl1-submission-success-check">✓</span>
            </div>

            <div className="lvl1-submission-success-header">
              <h2 className="lvl1-submission-success-title">Evidence Submitted</h2>
              <p className="lvl1-submission-success-desc">
                Your Level 01 Self-Awareness Snapshot has been submitted for evaluator verification.
              </p>
            </div>

            <div className="lvl1-submission-status-pill">
              <span className="lvl1-submission-status-pulse" />
              <span>Status: Awaiting Evaluation</span>
            </div>

            {/* Compact Submission Summary */}
            <div className="lvl1-submission-summary-box">
              <div className="lvl1-submission-summary-row">
                <span className="lvl1-summary-label">Level</span>
                <span className="lvl1-summary-val font-bold">01 · Discovering Myself</span>
              </div>
              <div className="lvl1-submission-summary-row">
                <span className="lvl1-summary-label">Evidence</span>
                <span className="lvl1-summary-val truncate" title={uploadedFile?.name || 'Self-Awareness Snapshot'}>
                  📄 {uploadedFile?.name || 'Abhishek_Level1_SelfAwareness.pdf'}
                </span>
              </div>
              <div className="lvl1-submission-summary-row">
                <span className="lvl1-summary-label">Status</span>
                <span className="lvl1-summary-val lvl1-val-pending">Awaiting Evaluation (24–48h SLA)</span>
              </div>
              <div className="lvl1-submission-summary-row">
                <span className="lvl1-summary-label">Submitted</span>
                <span className="lvl1-summary-val text-muted">Just now</span>
              </div>
            </div>

            <p className="lvl1-submission-trust-note">
              🔒 Your document will be used only for evaluator review. You will receive an in-app notification once the review is completed.
            </p>

            <footer className="lvl1-submission-actions-row">
              <button
                type="button"
                className="lvl1-btn-cta lvl1-btn-cta--ghost"
                onClick={() => {
                  sound.playTap();
                  setSubmissionSuccess(false);
                }}
              >
                Re-upload / Edit
              </button>
              <button
                type="button"
                className="lvl1-btn-cta lvl1-btn-cta--primary lvl1-btn-submit-hero"
                onClick={() => {
                  sound.playTap();
                  setCurrentStage('eval_pending');
                }}
              >
                View Evaluation Status →
              </button>
            </footer>
          </div>
        </div>
      );
    }

    // Default Submission Flow (Initial Upload Area or Uploaded Preview State)
    return (
      <div className="lvl1-stage-view lvl1-submission-stage-view">
        <header className="lvl1-screen-header">
          <span className="lvl1-screen-kicker">STEP 06 OF 06 · SUBMIT EVIDENCE</span>
          <h2 className="lvl1-screen-title">Submit Your Evidence</h2>
          <p className="lvl1-screen-desc">
            Upload your completed Self-Awareness Snapshot or evidence document for evaluator verification.
          </p>
        </header>

        {/* INITIAL STATE: Upload Area */}
        {!uploadedFile ? (
          <div className="lvl1-submission-upload-wrapper">
            <div className="lvl1-dropzone-modern">
              <div className="lvl1-dropzone-icon-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <h3 className="lvl1-dropzone-title">Upload your evidence</h3>
              <p className="lvl1-dropzone-subtitle">PDF, DOCX or image · Max 10 MB</p>

              <div className="lvl1-dropzone-cta-wrap">
                <label className="lvl1-choose-file-btn">
                  <span>Choose File</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="lvl1-dropzone-or-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="lvl1-sample-upload-link"
                onClick={handleUploadSamplePDF}
              >
                ✨ Use Sample Snapshot PDF
              </button>

              <div className="lvl1-dropzone-specs">
                <span>Accepted: PDF, DOCX, JPG, PNG</span>
                <span>Maximum file size: 10 MB</span>
              </div>
            </div>

            {fileValidationError && (
              <div className="lvl1-upload-error-alert">
                <span className="lvl1-error-icon">✕</span>
                <span>{fileValidationError}</span>
              </div>
            )}

            <p className="lvl1-trust-muted-note">
              🔒 Your document will be used only for evaluator review.
            </p>
          </div>
        ) : (
          /* UPLOADED STATE */
          <div className="lvl1-uploaded-evidence-card">
            {/* File Info Row */}
            <div className="lvl1-file-preview-row">
              <div className="lvl1-file-badge-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span className="lvl1-file-ext-tag">PDF</span>
              </div>

              <div className="lvl1-file-info-details">
                <strong className="lvl1-file-name" title={uploadedFile.name}>{uploadedFile.name}</strong>
                <span className="lvl1-file-meta">{uploadedFile.type} · {uploadedFile.size}</span>
              </div>

              <button
                type="button"
                className="lvl1-file-remove-btn"
                onClick={handleRemoveFile}
                title="Remove and upload different file"
              >
                ✕ Remove
              </button>
            </div>

            {/* Compact PDF Preview Card */}
            <div className="lvl1-compact-pdf-preview">
              <div className="lvl1-pdf-sheet-mock">
                <div className="lvl1-pdf-sheet-topbar">
                  <div className="lvl1-pdf-sheet-logo">
                    <span className="lvl1-pdf-mini-dot" />
                    <span>CAREER CLARITY · EVIDENCE DOSSIER</span>
                  </div>
                  <span className="lvl1-pdf-sheet-code">AERS-L1-2025</span>
                </div>

                <div className="lvl1-pdf-sheet-content">
                  <div className="lvl1-pdf-sheet-heading">Level 01 · Self-Awareness Snapshot</div>
                  <div className="lvl1-pdf-sheet-sub">Evidence Artifact: {uploadedFile.name}</div>
                  
                  <div className="lvl1-pdf-sheet-grid">
                    <div className="lvl1-pdf-sheet-item">
                      <span className="lvl1-pdf-item-dot" />
                      <span>Strength 1: Analytical Problem Solving & Debugging</span>
                    </div>
                    <div className="lvl1-pdf-sheet-item">
                      <span className="lvl1-pdf-item-dot" />
                      <span>Strength 2: Cross-Disciplinary Team Leadership</span>
                    </div>
                    <div className="lvl1-pdf-sheet-item">
                      <span className="lvl1-pdf-item-dot" />
                      <span>Strength 3: Adaptive Self-Learning & Rapid Upskilling</span>
                    </div>
                    <div className="lvl1-pdf-sheet-item lvl1-pdf-sheet-item--highlight">
                      <span className="lvl1-pdf-item-dot is-green" />
                      <span>7-Day Growth Commitment: 2 Peer Mock Introductions</span>
                    </div>
                  </div>
                </div>

                <div className="lvl1-pdf-sheet-footer">
                  <span className="lvl1-pdf-watermark">✓ Ready for Evaluator Verification</span>
                  <span className="lvl1-pdf-seal">SEALED</span>
                </div>
              </div>

              <div className="lvl1-pdf-preview-toolbar">
                <button
                  type="button"
                  className="lvl1-pdf-preview-toggle-btn"
                  onClick={() => {
                    sound.playTap();
                    setShowCompactPreview(!showCompactPreview);
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{showCompactPreview ? 'Hide Quick Look' : 'Preview Document'}</span>
                </button>
              </div>

              {showCompactPreview && (
                <div className="lvl1-quicklook-drawer">
                  <div className="lvl1-quicklook-header">
                    <strong>Document Summary Quick Look</strong>
                    <span className="lvl1-quicklook-badge">3 Strengths + 1 Action</span>
                  </div>
                  <div className="lvl1-quicklook-body">
                    <p><strong>Primary Strengths:</strong> Analytical Debugging, Team Leadership, Fast Learning Transition.</p>
                    <p><strong>Action Commitment:</strong> Record 60-sec pitch and conduct 2 mock sessions within 7 days.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Document Validation Checklist */}
            <div className="lvl1-validation-checklist">
              <div className="lvl1-validation-item is-valid">
                <span className="lvl1-validation-icon">✓</span>
                <span>File type supported ({uploadedFile.type})</span>
              </div>
              <div className="lvl1-validation-item is-valid">
                <span className="lvl1-validation-icon">✓</span>
                <span>File size within limit ({uploadedFile.size})</span>
              </div>
              <div className="lvl1-validation-item is-valid">
                <span className="lvl1-validation-icon">✓</span>
                <span>Document ready for submission</span>
              </div>
            </div>

            {/* Authenticity Certification */}
            <label className={`lvl1-cert-checkbox-card ${confirmCertified ? 'is-certified' : ''}`}>
              <input
                type="checkbox"
                checked={confirmCertified}
                onChange={(e) => {
                  sound.playTap();
                  setConfirmCertified(e.target.checked);
                }}
                className="lvl1-custom-checkbox"
              />
              <div className="lvl1-cert-text-wrap">
                <strong className="lvl1-cert-title">Authenticity Certification</strong>
                <span className="lvl1-cert-desc">
                  I certify that this evidence reflects my authentic coursework and reflections.
                </span>
              </div>
            </label>

            <p className="lvl1-trust-muted-note">
              🔒 Your document will be used only for evaluator review.
            </p>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <footer className="lvl1-floating-cta-bar lvl1-submission-cta-bar">
          <button
            type="button"
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => {
              sound.playTap();
              setCurrentStage('activity_review');
            }}
          >
            ← Review
          </button>
          <button
            type="button"
            className={`lvl1-btn-cta lvl1-btn-cta--primary lvl1-btn-submit-hero ${
              !uploadedFile || !confirmCertified || isSubmitting ? 'is-disabled' : ''
            }`}
            disabled={!uploadedFile || !confirmCertified || isSubmitting}
            onClick={handleSubmitEvidence}
          >
            {isSubmitting ? 'Submitting for Evaluation...' : 'Submit for Evaluation →'}
          </button>
        </footer>
      </div>
    );
  };

  // 9. EVALUATION STATUS (Pending / Revision / Approved)
  const renderEvaluationStatus = () => {
    const isApproved = currentStage === 'eval_approved';
    const isRevision = currentStage === 'eval_revision';
    const isPending = currentStage === 'eval_pending';

    return (
      <div className="lvl1-stage-view lvl1-stage-view--eval">
        {/* STATE 1: EVALUATION PENDING */}
        {isPending && (
          <div className="lvl1-eval-status-box lvl1-eval-status-box--pending">
            {/* Status Pill Badge */}
            <div className="lvl1-eval-status-pill lvl1-eval-status-pill--pending">
              <span className="lvl1-status-pulse lvl1-status-pulse--pending" />
              <span>EVALUATION PENDING</span>
            </div>

            {/* Main Heading & Description */}
            <h2 className="lvl1-eval-main-heading">Your submission is being reviewed</h2>
            <p className="lvl1-eval-main-desc">
              Your Self-Awareness Snapshot has been submitted and is currently being evaluated by the academic placement board.
            </p>
            <p className="lvl1-eval-sla-note">
              Estimated review turnaround is 24–48 hours.
            </p>

            {/* Status Timeline */}
            <div className="lvl1-eval-timeline-section">
              <div className="lvl1-eval-timeline-track">
                {/* Step 1: Submitted (Green Complete) */}
                <div className="lvl1-timeline-node is-completed">
                  <div className="lvl1-node-marker">
                    <span>✓</span>
                  </div>
                  <div className="lvl1-node-info">
                    <strong className="lvl1-node-title">Submitted</strong>
                    <span className="lvl1-node-state">Completed</span>
                  </div>
                </div>

                <div className="lvl1-timeline-connector is-active" />

                {/* Step 2: Under Review (Orange Active) */}
                <div className="lvl1-timeline-node is-active">
                  <div className="lvl1-node-marker">
                    <span className="lvl1-node-pulse-dot" />
                  </div>
                  <div className="lvl1-node-info">
                    <strong className="lvl1-node-title">Under Review</strong>
                    <span className="lvl1-node-state">Current</span>
                  </div>
                </div>

                <div className="lvl1-timeline-connector is-upcoming" />

                {/* Step 3: Credential Ready (Gray Upcoming) */}
                <div className="lvl1-timeline-node is-upcoming">
                  <div className="lvl1-node-marker">
                    <span>○</span>
                  </div>
                  <div className="lvl1-node-info">
                    <strong className="lvl1-node-title">Credential Ready</strong>
                    <span className="lvl1-node-state">Upcoming</span>
                  </div>
                </div>
              </div>

              {/* Short explanation callout under Under Review */}
              <div className="lvl1-eval-timeline-callout">
                <p>An evaluator will review your evidence against the Level 01 assessment criteria.</p>
                <p>You'll see the result here once the review is complete.</p>
              </div>
            </div>

            {/* Submitted Document / Artifact */}
            <div className="lvl1-eval-artifact-card">
              <span className="lvl1-eval-section-kicker">SUBMITTED ARTIFACT</span>
              <div className="lvl1-eval-artifact-row">
                <div className="lvl1-file-badge-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span className="lvl1-file-ext-tag">PDF</span>
                </div>
                <div className="lvl1-file-info-details">
                  <strong className="lvl1-file-name" title={uploadedFile?.name || 'Alex_Morgan_Level1_SelfAwareness_Snapshot.pdf'}>
                    {uploadedFile?.name || 'Alex_Morgan_Level1_SelfAwareness_Snapshot.pdf'}
                  </strong>
                  <span className="lvl1-file-meta">{uploadedFile?.type || 'PDF Document'} · {uploadedFile?.size || '1.4 MB'}</span>
                </div>
                <button
                  type="button"
                  className="lvl1-eval-view-doc-btn"
                  onClick={() => {
                    sound.playTap();
                    setShowEvalDocPreview(!showEvalDocPreview);
                  }}
                >
                  {showEvalDocPreview ? 'Hide Document' : 'View Document'}
                </button>
              </div>

              {showEvalDocPreview && (
                <div className="lvl1-quicklook-drawer lvl1-eval-doc-drawer">
                  <div className="lvl1-quicklook-header">
                    <strong>Submitted Coursework Snapshot</strong>
                    <span className="lvl1-quicklook-badge">3 Strengths + 1 Action</span>
                  </div>
                  <div className="lvl1-quicklook-body">
                    <p><strong>Strength 1:</strong> Analytical Problem Solving & Debugging</p>
                    <p><strong>Strength 2:</strong> Cross-Disciplinary Team Leadership</p>
                    <p><strong>Strength 3:</strong> Adaptive Self-Learning & Rapid Upskilling</p>
                    <p><strong>7-Day Action:</strong> 2 Peer Mock Introductions & Elevator Pitch Video</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submission Details (Two-Column Metadata Box) */}
            <div className="lvl1-eval-metadata-box">
              <div className="lvl1-metadata-grid">
                <div className="lvl1-metadata-item">
                  <span className="lvl1-metadata-label">Submission</span>
                  <strong className="lvl1-metadata-value">Self-Awareness Snapshot</strong>
                </div>
                <div className="lvl1-metadata-item">
                  <span className="lvl1-metadata-label">Level</span>
                  <strong className="lvl1-metadata-value">Level 01 · Discovering Myself</strong>
                </div>
                <div className="lvl1-metadata-item">
                  <span className="lvl1-metadata-label">Status</span>
                  <strong className="lvl1-metadata-value lvl1-status-text--pending">Under Review</strong>
                </div>
                <div className="lvl1-metadata-item">
                  <span className="lvl1-metadata-label">Submitted</span>
                  <strong className="lvl1-metadata-value">Just now</strong>
                </div>
              </div>
            </div>

            {/* What Happens Next Section */}
            <div className="lvl1-eval-next-steps-box">
              <h3 className="lvl1-eval-next-steps-title">What happens next?</h3>
              <div className="lvl1-eval-steps-list">
                <div className="lvl1-eval-step-item">
                  <span className="lvl1-eval-step-num">1</span>
                  <span className="lvl1-eval-step-text">Your evidence is reviewed against placement criteria.</span>
                </div>
                <div className="lvl1-eval-step-item">
                  <span className="lvl1-eval-step-num">2</span>
                  <span className="lvl1-eval-step-text">The evaluator records the assessment result.</span>
                </div>
                <div className="lvl1-eval-step-item">
                  <span className="lvl1-eval-step-num">3</span>
                  <span className="lvl1-eval-step-text">Your Level 01 status is updated.</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <footer className="lvl1-floating-cta-bar lvl1-eval-cta-bar">
              <button
                type="button"
                className="lvl1-btn-cta lvl1-btn-cta--ghost"
                onClick={() => {
                  sound.playTap();
                  setCurrentStage('overview');
                }}
              >
                Level Overview
              </button>
              <button
                type="button"
                className="lvl1-btn-cta lvl1-btn-cta--primary"
                onClick={() => {
                  sound.playTap();
                  navigate('/journey');
                }}
              >
                Return to Journey Map →
              </button>
            </footer>

            {/* Muted Notification Leave Note */}
            <p className="lvl1-eval-leave-note">
              🔒 You can leave this page. Your evaluation status will be updated here when the review is complete.
            </p>
          </div>
        )}

        {/* STATE 3: REVISION REQUIRED */}
        {isRevision && (
          <div className="lvl1-eval-status-box lvl1-eval-status-box--revision">
            <div className="lvl1-eval-status-pill lvl1-eval-status-pill--revision">
              <span className="lvl1-status-pulse lvl1-status-pulse--revision" />
              <span>REVISION REQUIRED</span>
            </div>

            <h2 className="lvl1-eval-main-heading">Your evaluator has requested changes</h2>
            <p className="lvl1-eval-main-desc">
              Your submission has been reviewed. Please address the evaluator's specific feedback and update your evidence.
            </p>

            {/* Revision Timeline */}
            <div className="lvl1-eval-timeline-section">
              <div className="lvl1-eval-timeline-track">
                <div className="lvl1-timeline-node is-completed">
                  <div className="lvl1-node-marker">
                    <span>✓</span>
                  </div>
                  <div className="lvl1-node-info">
                    <strong className="lvl1-node-title">Submitted</strong>
                    <span className="lvl1-node-state">Completed</span>
                  </div>
                </div>

                <div className="lvl1-timeline-connector is-revision" />

                <div className="lvl1-timeline-node is-revision">
                  <div className="lvl1-node-marker">
                    <span>!</span>
                  </div>
                  <div className="lvl1-node-info">
                    <strong className="lvl1-node-title">Revision Needed</strong>
                    <span className="lvl1-node-state">Action Required</span>
                  </div>
                </div>

                <div className="lvl1-timeline-connector is-upcoming" />

                <div className="lvl1-timeline-node is-upcoming">
                  <div className="lvl1-node-marker">
                    <span>○</span>
                  </div>
                  <div className="lvl1-node-info">
                    <strong className="lvl1-node-title">Credential Ready</strong>
                    <span className="lvl1-node-state">Upcoming</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluator Feedback Card */}
            <div className="lvl1-eval-feedback-card">
              <div className="lvl1-feedback-header">
                <span className="lvl1-feedback-icon">💬</span>
                <strong>Evaluator Feedback & Action Items</strong>
              </div>
              <p className="lvl1-feedback-quote">“{evaluatorFeedback}”</p>
            </div>

            {/* Submitted Artifact Row */}
            <div className="lvl1-eval-artifact-card">
              <span className="lvl1-eval-section-kicker">PREVIOUS SUBMISSION</span>
              <div className="lvl1-eval-artifact-row">
                <div className="lvl1-file-badge-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span className="lvl1-file-ext-tag">PDF</span>
                </div>
                <div className="lvl1-file-info-details">
                  <strong className="lvl1-file-name">{uploadedFile?.name || 'Alex_Morgan_Level1_SelfAwareness_Snapshot.pdf'}</strong>
                  <span className="lvl1-file-meta">{uploadedFile?.type || 'PDF Document'} · {uploadedFile?.size || '1.4 MB'}</span>
                </div>
                <button
                  type="button"
                  className="lvl1-eval-view-doc-btn"
                  onClick={() => {
                    sound.playTap();
                    setShowEvalDocPreview(!showEvalDocPreview);
                  }}
                >
                  {showEvalDocPreview ? 'Hide Document' : 'View Document'}
                </button>
              </div>
            </div>

            <footer className="lvl1-floating-cta-bar lvl1-eval-cta-bar">
              <button
                type="button"
                className="lvl1-btn-cta lvl1-btn-cta--ghost"
                onClick={() => {
                  sound.playTap();
                  setCurrentStage('overview');
                }}
              >
                Level Overview
              </button>
              <button
                type="button"
                className="lvl1-btn-cta lvl1-btn-cta--primary"
                onClick={() => {
                  sound.playTap();
                  setCurrentStage('activity_review');
                }}
              >
                Review & Update Submission →
              </button>
            </footer>
          </div>
        )}

        {/* APPROVED STATE (EXACT MATCH TO REFERENCE DESIGN) */}
        {isApproved && (
          <div className="lvl1-eval-approved-view">
            {/* 1. Main Success Hero Card */}
            <div className="lvl1-eval-hero-card">
              {/* Badge: Level 1 Completed */}
              <div className="lvl1-eval-badge-done">
                <span className="lvl1-eval-check-circle">✓</span>
                <span>LEVEL 1 COMPLETED</span>
              </div>

              {/* Title & Stars + Floating 3D Medal */}
              <div className="lvl1-eval-hero-body">
                <div className="lvl1-eval-hero-left">
                  <div className="lvl1-eval-stars-row">
                    <span className="lvl1-gold-star">⭐</span>
                    <span className="lvl1-gold-star">⭐</span>
                    <span className="lvl1-gold-star">⭐</span>
                  </div>
                  <h2 className="lvl1-eval-congrats-title">
                    Congratulations!
                    <span className="lvl1-eval-level-verified">Level 01 Verified</span>
                  </h2>
                </div>

                <div className="lvl1-eval-hero-right">
                  <svg
                    width="116"
                    height="116"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="lvl1-medal-svg"
                  >
                    <defs>
                      <linearGradient id="medalGoldGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFF176" />
                        <stop offset="45%" stopColor="#FBC02D" />
                        <stop offset="100%" stopColor="#F57F17" />
                      </linearGradient>
                      <linearGradient id="medalInnerGold" x1="30" y1="30" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFEE58" />
                        <stop offset="60%" stopColor="#FDD835" />
                        <stop offset="100%" stopColor="#F9A825" />
                      </linearGradient>
                      <linearGradient id="medalStarGrad" x1="40" y1="40" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="40%" stopColor="#FFF59D" />
                        <stop offset="100%" stopColor="#FBC02D" />
                      </linearGradient>
                      <linearGradient id="ribbonLeftGrad" x1="40" y1="60" x2="20" y2="105" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#00E676" />
                        <stop offset="50%" stopColor="#00C853" />
                        <stop offset="100%" stopColor="#00897B" />
                      </linearGradient>
                      <linearGradient id="ribbonRightGrad" x1="60" y1="60" x2="80" y2="105" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#69F0AE" />
                        <stop offset="50%" stopColor="#00E676" />
                        <stop offset="100%" stopColor="#00B0FF" />
                      </linearGradient>
                      <filter id="medalGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#F57F17" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    {/* Radiant Confetti Particles */}
                    <rect x="18" y="24" width="5.5" height="13" rx="2.75" transform="rotate(-40 18 24)" fill="#FF9800" />
                    <rect x="42" y="10" width="5" height="11" rx="2.5" transform="rotate(10 42 10)" fill="#00E5FF" />
                    <rect x="74" y="12" width="5" height="12" rx="2.5" transform="rotate(35 74 12)" fill="#1DE9B6" />
                    <circle cx="94" cy="30" r="3" fill="#FFD600" />
                    <rect x="92" y="48" width="5" height="12" rx="2.5" transform="rotate(85 92 48)" fill="#00B0FF" />
                    <rect x="11" y="44" width="5" height="11" rx="2.5" transform="rotate(-65 11 44)" fill="#00E5FF" />
                    <circle cx="92" cy="74" r="2.8" fill="#FFCA28" />

                    {/* Ribbons */}
                    <path d="M42 62 L26 98 L36 93 L46 99 L50 64 Z" fill="url(#ribbonLeftGrad)" />
                    <path d="M58 64 L74 99 L64 93 L54 98 L50 62 Z" fill="url(#ribbonRightGrad)" />

                    {/* Medal Disc */}
                    <g filter="url(#medalGlow)">
                      <circle cx="50" cy="50" r="32" fill="#F57F17" />
                      <circle cx="50" cy="50" r="30" fill="url(#medalGoldGrad)" />
                      <circle cx="50" cy="50" r="26" fill="#FBC02D" stroke="#FFF59D" strokeWidth="1.5" />
                      <circle cx="50" cy="50" r="22" fill="url(#medalInnerGold)" />
                      
                      {/* Center 3D Star */}
                      <polygon 
                        points="50,35 53.5,44.5 64,44.5 55.5,51 59,60.5 50,55 41,60.5 44.5,51 36,44.5 46.5,44.5" 
                        fill="url(#medalStarGrad)" 
                        stroke="#F57F17" 
                        strokeWidth="0.8"
                      />
                      <path d="M37 38 Q50 31 63 38 Q50 34 37 38 Z" fill="#FFFFFF" opacity="0.65" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Verified Subtitle */}
              <p className="lvl1-eval-summary-desc">
                Your Self-Awareness Snapshot has been reviewed and verified by the placement board with <strong>3 Gold Stars</strong>.
              </p>

              {/* Evaluator Rubric Note Box */}
              <div className="lvl1-eval-rubric-card">
                <div className="lvl1-eval-rubric-icon">
                  <span>🎓</span>
                </div>
                <div className="lvl1-eval-rubric-content">
                  <h4 className="lvl1-eval-rubric-title">Evaluator Rubric Note</h4>
                  <p className="lvl1-eval-rubric-quote">
                    “Excellent articulation of technical problem solving and leadership with quantifiable project outcomes. Level 02 is now unlocked on your Journey map.”
                  </p>
                </div>
              </div>

              {/* Continue to Level 2 CTA Button */}
              <button
                className="lvl1-eval-continue-btn"
                onClick={handleContinueToLevel2}
              >
                <span className="lvl1-eval-btn-arrow-circle">➔</span>
                <span className="lvl1-eval-btn-text">Continue to Level 2</span>
                <span className="lvl1-eval-btn-burst">✨</span>
              </button>
            </div>

            {/* 2. Next Step Card */}
            <div
              className="lvl1-eval-next-step-card"
              onClick={handleContinueToLevel2}
              role="button"
              tabIndex={0}
            >
              <div className="lvl1-next-step-icon">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="lvl1-map-svg"
                >
                  <defs>
                    <linearGradient id="mapCardGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#E8FDF5" />
                      <stop offset="100%" stopColor="#D1FAE5" />
                    </linearGradient>
                    <linearGradient id="mapPathGrad" x1="8" y1="40" x2="40" y2="10" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#6EE7B7" />
                      <stop offset="100%" stopColor="#A7F3D0" />
                    </linearGradient>
                    <linearGradient id="pinGrad" x1="24" y1="8" x2="36" y2="28" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#00E676" />
                      <stop offset="50%" stopColor="#00C853" />
                      <stop offset="100%" stopColor="#00897B" />
                    </linearGradient>
                    <filter id="pinShadow" x="14" y="8" width="24" height="28" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00897B" floodOpacity="0.25" />
                    </filter>
                  </defs>

                  <rect width="48" height="48" rx="14" fill="url(#mapCardGrad)" />

                  <path
                    d="M 6 38 C 14 34, 16 26, 24 26 C 32 26, 34 14, 42 12"
                    stroke="url(#mapPathGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 6 38 C 14 34, 16 26, 24 26 C 32 26, 34 14, 42 12"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    strokeLinecap="round"
                    fill="none"
                  />

                  <g filter="url(#pinShadow)">
                    <path
                      d="M26 9 C22.13 9 19 12.13 19 16 C19 21.25 26 28 26 28 C26 28 33 21.25 33 16 C33 12.13 29.87 9 26 9 Z"
                      fill="url(#pinGrad)"
                    />
                    <circle cx="26" cy="15.5" r="3" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>
              <div className="lvl1-next-step-info">
                <span className="lvl1-next-step-kicker">Next Step</span>
                <h4 className="lvl1-next-step-title">Level 2: Career Exploration</h4>
                <p className="lvl1-next-step-desc">
                  Discover career paths, job roles and skills that match your interests.
                </p>
              </div>
              <div className="lvl1-next-step-chevron">
                <Icon name="chevron-right" size={20} strokeWidth={2.4} />
              </div>
            </div>

            {/* 3. Inspirational Quote Carousel */}
            <div className="lvl1-eval-quote-carousel">
              <div className="lvl1-eval-quote-row">
                <span className="lvl1-quote-mark">“</span>
                <p className="lvl1-quote-text">You're one step closer to your dreams!</p>
                <span className="lvl1-quote-mark">”</span>
              </div>
              <div className="lvl1-carousel-dots">
                <span className="lvl1-carousel-dot is-active" />
                <span className="lvl1-carousel-dot" />
                <span className="lvl1-carousel-dot" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const isEvalStage =
    currentStage === 'eval_pending' ||
    currentStage === 'eval_revision' ||
    currentStage === 'eval_approved';

  return (
    <div className="lvl1-screen-container">
      {/* ================= STICKY TOP APP HEADER ================= */}
      <header className="lvl1-top-nav">
        <div className="lvl1-top-nav__main">
          <button
            className="lvl1-nav-back-btn"
            onClick={() => {
              sound.playTap();
              if (currentStage === 'overview' || isEvalStage) {
                navigate('/journey');
              } else {
                setCurrentStage('overview');
              }
            }}
            aria-label="Back"
          >
            <Icon name="chevron-left" size={20} strokeWidth={2.4} />
          </button>

          <div className="lvl1-nav-titles">
            <span className="lvl1-nav-kicker">
              {isEvalStage ? 'CAREER CLARITY' : currentStepNum > 0 ? `LEVEL 01 · STEP ${currentStepNum} OF 6` : 'CAREER CLARITY'}
            </span>
            <h1 className="lvl1-nav-title">
              {isEvalStage
                ? 'Evaluation Status'
                : currentStage === 'overview'
                ? 'Level 01 · Discovering Myself'
                : currentStage === 'objectives'
                ? 'Learning Objectives'
                : currentStage === 'notes'
                ? 'Read Lesson Notes'
                : currentStage === 'video'
                ? 'Watch Concept Video'
                : currentStage === 'quiz'
                ? 'Quick Check Quiz'
                : currentStage === 'activity'
                ? 'Self-Awareness Snapshot'
                : currentStage === 'activity_review'
                ? 'Review Your Snapshot'
                : currentStage === 'submission'
                ? 'Submit Evidence'
                : 'Evaluation Status'}
            </h1>
          </div>

          <button
            className="lvl1-tester-btn"
            onClick={() => setShowDevBar(!showDevBar)}
            title="Switch Screen / State Tester"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 4 }}>
              <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M5 5.5H11M5 8H11M5 10.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            State
          </button>
        </div>

        {/* Segmented Step Indicator - Only show during learning steps 1..6 */}
        {currentStepNum > 0 && !isEvalStage && (
          <div className="lvl1-nav-segments">
            {[1, 2, 3, 4, 5, 6].map((st) => (
              <div
                key={st}
                className={`lvl1-nav-segment ${
                  completedSteps.includes(st)
                    ? 'is-completed'
                    : currentStepNum === st
                    ? 'is-current'
                    : ''
                }`}
              />
            ))}
          </div>
        )}
      </header>

      {/* ================= TESTER POPUP TOOLBAR ================= */}
      {showDevBar && (
        <div className="lvl1-tester-bar">
          <div className="lvl1-tester-bar__head">
            <span>🧪 Jump to Screen State:</span>
            <button onClick={() => setShowDevBar(false)}>✕</button>
          </div>
          <div className="lvl1-tester-bar__pills">
            <button
              className={currentStage === 'overview' ? 'is-active' : ''}
              onClick={() => {
                setCurrentStage('overview');
                setShowDevBar(false);
              }}
            >
              Overview
            </button>
            <button
              className={currentStage === 'objectives' ? 'is-active' : ''}
              onClick={() => {
                setCurrentStage('objectives');
                setShowDevBar(false);
              }}
            >
              1. Objectives
            </button>
            <button
              className={currentStage === 'notes' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                setCurrentStage('notes');
                setShowDevBar(false);
              }}
            >
              2. Notes
            </button>
            <button
              className={currentStage === 'video' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                setCurrentStage('video');
                setShowDevBar(false);
              }}
            >
              3. Video
            </button>
            <button
              className={currentStage === 'quiz' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                setCurrentStage('quiz');
                setShowDevBar(false);
              }}
            >
              4. Quiz
            </button>
            <button
              className={currentStage === 'activity' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                setCurrentStage('activity');
                setShowDevBar(false);
              }}
            >
              5. Activity
            </button>
            <button
              className={currentStage === 'activity_review' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                handleAutofillActivity();
                setCurrentStage('activity_review');
                setShowDevBar(false);
              }}
            >
              5. Review
            </button>
            <button
              className={currentStage === 'submission' && !uploadedFile && !submissionSuccess ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                markStepDone(5);
                setUploadedFile(null);
                setConfirmCertified(false);
                setSubmissionSuccess(false);
                setCurrentStage('submission');
                setShowDevBar(false);
              }}
            >
              6. Upload (Empty)
            </button>
            <button
              className={currentStage === 'submission' && uploadedFile && !submissionSuccess ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                markStepDone(5);
                handleUploadSamplePDF();
                setSubmissionSuccess(false);
                setCurrentStage('submission');
                setShowDevBar(false);
              }}
            >
              6. Uploaded (Ready)
            </button>
            <button
              className={currentStage === 'submission' && submissionSuccess ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                markStepDone(5);
                markStepDone(6);
                if (!uploadedFile) handleUploadSamplePDF();
                setSubmissionSuccess(true);
                setCurrentStage('submission');
                setShowDevBar(false);
              }}
            >
              6. Submitted (Confirm)
            </button>
            <button
              className={currentStage === 'eval_pending' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                markStepDone(5);
                markStepDone(6);
                if (!uploadedFile) handleUploadSamplePDF();
                setCurrentStage('eval_pending');
                setShowDevBar(false);
              }}
            >
              Pending Review
            </button>
            <button
              className={currentStage === 'eval_revision' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                markStepDone(5);
                markStepDone(6);
                setCurrentStage('eval_revision');
                setShowDevBar(false);
              }}
            >
              Revision Req.
            </button>
            <button
              className={currentStage === 'eval_approved' ? 'is-active' : ''}
              onClick={() => {
                handleApproveLevel1();
                setShowDevBar(false);
              }}
            >
              Approved ✓
            </button>
          </div>
        </div>
      )}

      {/* ================= SCREEN VIEW BODY ================= */}
      <main className="lvl1-main-scroll">
        {currentStage === 'overview' && renderOverview()}
        {currentStage === 'objectives' && renderObjectives()}
        {currentStage === 'notes' && renderNotes()}
        {currentStage === 'video' && renderVideo()}
        {currentStage === 'quiz' && renderQuiz()}
        {currentStage === 'activity' && renderActivityStepper()}
        {currentStage === 'activity_review' && renderActivityReview()}
        {currentStage === 'submission' && renderSubmission()}
        {(currentStage === 'eval_pending' ||
          currentStage === 'eval_revision' ||
          currentStage === 'eval_approved') &&
          renderEvaluationStatus()}
      </main>
    </div>
  );
}
