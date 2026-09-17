import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { sound } from '../utils/sound';
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

const STORAGE_KEY = 'aers_level1_detail_state_v4';
const JOURNEY_STORAGE_KEY = 'aers_journey_progress_v4';

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
    explanation: 'Concrete evidence (Context + Action + Measurable Result) creates authentic credibility and enables interviewers to trust your real capabilities.',
  },
  {
    id: 2,
    question: 'When identifying personal growth areas or blind spots, what is the most constructive response?',
    options: [
      'Rejecting feedback that points out areas for improvement.',
      'Relying solely on existing strengths while ignoring feedback.',
      'Synthesizing constructive feedback and committing to 1 actionable improvement step within 7 days.',
      'Switching career pathways every time you face a skill hurdle.',
    ],
    correctIndex: 2,
    explanation: 'Self-awareness is active. Framing blind spots as targetable 7-day habits builds rapid career adaptability and shows maturity.',
  },
  {
    id: 3,
    question: 'Why is evidence-based reflection essential before drafting your resume or meeting evaluators?',
    options: [
      'It ensures every bullet point is backed by truthful, verifiable impact rather than wishful assumptions.',
      'It allows you to memorize interview answers word-for-word.',
      'It is only useful for theoretical exam evaluations.',
      'It guarantees you will never be asked technical follow-ups.',
    ],
    correctIndex: 0,
    explanation: 'Replacing assumptions with verified evidence turns generic statements into compelling, interview-ready stories.',
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
  const [confirmCertified, setConfirmCertified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setUploadedFile({
        name: f.name,
        size: `${sizeMB} MB`,
        type: f.type.includes('pdf') ? 'PDF Document' : 'Image File',
      });
      sound.playTap();
    }
  };

  const handleUploadSamplePDF = () => {
    setUploadedFile({
      name: 'Alex_Morgan_Level1_SelfAwareness_Snapshot.pdf',
      size: '1.4 MB',
      type: 'PDF Document',
    });
    sound.playTap();
  };

  const handleSubmitEvidence = () => {
    if (!uploadedFile) {
      sound.playLocked();
      alert('Please select or upload a snapshot document first.');
      return;
    }
    setIsSubmitting(true);
    sound.playTap();
    setTimeout(() => {
      setIsSubmitting(false);
      markStepDone(6);
      setCurrentStage('eval_pending');
      sound.playLevelSuccess();
    }, 700);
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
        completedLevels: [1],
        levelStars: { 1: 3 },
        currentLevel: 2,
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
      { id: 1, stage: 'objectives' as Level1Stage, type: 'OBJECTIVES', duration: '2 MIN', title: 'Learning Objectives', desc: 'Core self-awareness competencies & interview targets' },
      { id: 2, stage: 'notes' as Level1Stage, type: 'READING', duration: '5 MIN', title: 'Read Lesson Notes', desc: 'Evidence formula, blind spots & 7-day action habits' },
      { id: 3, stage: 'video' as Level1Stage, type: 'VIDEO', duration: '4.5 MIN', title: 'Watch Concept Video', desc: 'Masterclass on communicating your authentic value' },
      { id: 4, stage: 'quiz' as Level1Stage, type: 'CHECKPOINT', duration: '3 QS', title: 'Quick Check Quiz', desc: 'Practical scenarios to test placement readiness' },
      { id: 5, stage: 'activity' as Level1Stage, type: 'WORKSHEET', duration: 'INTERACTIVE', title: 'Self-Awareness Snapshot', desc: '3 verified strengths & a 7-day growth commitment' },
      { id: 6, stage: 'submission' as Level1Stage, type: 'EVIDENCE', duration: 'UPLOAD', title: 'Submit Evidence', desc: 'Upload verified reflection document for evaluator rubric' },
    ];

    const progressPct = Math.round((completedSteps.length / 6) * 100);

    return (
      <div className="lvl1-stage-view lvl1-overview-view">
        {/* Hero Milestone Card */}
        <section className="lvl1-hero-milestone" aria-label="Level Overview">
          <div className="lvl1-hero-milestone__pill-row">
            {/* UX: shows learner position in the overall journey (nav bar already shows module) */}
            <span className="lvl1-badge-kicker">LEVEL 01 OF 24 · MODULE 01</span>
            <span className="lvl1-xp-badge">⚡ +150 XP</span>
          </div>

          <h1 className="lvl1-hero-milestone__title">Discovering Myself</h1>
          <p className="lvl1-hero-milestone__desc">
            Build self-knowledge that recruiters trust. Learn to turn past academic and project experiences into verifiable proof.
          </p>

          <div className="lvl1-readiness-boost-box">
            <div className="lvl1-readiness-boost-icon">📈</div>
            <div className="lvl1-readiness-boost-text">
              <strong>Placement Readiness Boost: +15%</strong>
              <span>Unlocks Module 01 Verified Competencies</span>
            </div>
          </div>

          {/* Progress Bar — UX: no fake dot at 0%, min-width only once progress exists */}
          <div className="lvl1-hero-progress-block">
            <div className="lvl1-hero-progress-meta">
              <span>Overall Stage Progress</span>
              <strong>{completedSteps.length} of 6 Completed ({progressPct}%)</strong>
            </div>
            <div className="lvl1-hero-progress-track">
              <div
                className="lvl1-hero-progress-fill"
                style={{ width: completedSteps.length > 0 ? `${progressPct}%` : '0%' }}
              />
            </div>
          </div>
        </section>

        {/* Guided Steps Roadmap */}
        <section className="lvl1-steps-roadmap" aria-label="Learning Steps">
          <div className="lvl1-roadmap-header">
            <h2 className="lvl1-roadmap-title">Learning Journey Curriculum</h2>
            <span className="lvl1-roadmap-duration">⏱ ~12 mins total</span>
          </div>

          <div className="lvl1-roadmap-list">
            {stepsData.map((step, idx) => {
              const isDone = completedSteps.includes(step.id);
              const isUnlocked = step.id === 1 || completedSteps.includes(step.id - 1);
              const isCurrent = isUnlocked && !isDone;
              const isLast = idx === stepsData.length - 1;

              return (
                <div key={step.id} className={`lvl1-roadmap-item ${isLast ? 'is-last' : ''}`}>
                  {/* Connector spine linking steps into one continuous path */}
                  {!isLast && (
                    <div
                      className={`lvl1-roadmap-connector ${isDone ? 'is-done' : ''}`}
                      aria-hidden="true"
                    />
                  )}
                    <div
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
                    aria-disabled={!isUnlocked}
                  >
                  <div className="lvl1-step-badge-col">
                    <span className="lvl1-step-badge-num">
                      {isDone ? '✓' : `0${step.id}`}
                    </span>
                    <span className="lvl1-step-badge-type">{step.type}</span>
                  </div>

                  <div className="lvl1-step-info-col">
                    <div className="lvl1-step-meta-row">
                      <span className="lvl1-step-duration">{step.duration}</span>
                      {isCurrent && <span className="lvl1-pulse-dot" />}
                    </div>
                    <h3 className="lvl1-step-title">{step.title}</h3>
                    <p className="lvl1-step-desc">{step.desc}</p>
                  </div>

                  <div className="lvl1-step-action-col">
                    {isDone ? (
                      <span className="lvl1-status-pill lvl1-status-pill--done">Done ✓</span>
                    ) : isCurrent ? (
                      <span className="lvl1-status-pill lvl1-status-pill--active">Start ➔</span>
                    ) : (
                      <span className="lvl1-status-pill lvl1-status-pill--locked">🔒 Locked</span>
                    )}
                  </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA Bar — UX: context line tells the learner exactly what's next */}
        <footer className="lvl1-floating-cta-bar lvl1-cta-stack">
          <div className="lvl1-cta-hint" role="note">
            <span className="lvl1-cta-hint__label">
              {completedSteps.length === 0 ? 'Up next' : completedSteps.length >= 6 ? 'All steps done' : 'Resume'}
            </span>
            <span className="lvl1-cta-hint__value">
              {completedSteps.length >= 6
                ? 'Evaluation in review'
                : `Step 0${nextAvailableStep} · ${stepsData[nextAvailableStep - 1].title} · ${stepsData[nextAvailableStep - 1].duration}`}
            </span>
          </div>
          <button className="lvl1-btn-cta lvl1-btn-cta--primary" onClick={handleStartOrResume}>
            <span>
              {completedSteps.length === 0
                ? 'Start Level 1 ➔'
                : completedSteps.length >= 6
                ? 'View Evaluation Status ➔'
                : `Resume Step 0${nextAvailableStep} ➔`}
            </span>
          </button>
        </footer>
      </div>
    );
  };

  // 2. STEP 1: LEARNING OBJECTIVES
  const renderObjectives = () => {
    const objectives = [
      {
        id: 1,
        title: 'Foundations of Self-Awareness',
        desc: 'Understand why self-knowledge is the #1 trait recruiters look for during behavioral rounds.',
      },
      {
        id: 2,
        title: 'Evidence-Based Strengths',
        desc: 'Identify personal signature skills grounded in tangible project accomplishments.',
      },
      {
        id: 3,
        title: 'Substantiating with Metrics',
        desc: 'Back up claims with verifiable numbers, peer feedback, and grade evaluations.',
      },
      {
        id: 4,
        title: 'Addressing Blind Spots',
        desc: 'Acknowledge development areas openly and demonstrate rapid adaptability.',
      },
      {
        id: 5,
        title: 'Synthesizing External Feedback',
        desc: 'Use peer and faculty critiques as objective diagnostic data.',
      },
      {
        id: 6,
        title: 'The 7-Day Growth Commitment',
        desc: 'Commit to one realistic habit you can execute and verify within the next 7 days.',
      },
    ];

    return (
      <div className="lvl1-stage-view">
        <header className="lvl1-screen-header">
          <span className="lvl1-screen-kicker">STEP 01 OF 06 · OBJECTIVES</span>
          <h2 className="lvl1-screen-title">Learning Objectives</h2>
          <p className="lvl1-screen-desc">
            Master the core self-awareness competencies expected in modern corporate placement drives.
          </p>
        </header>

        <div className="lvl1-objectives-grid">
          {objectives.map((obj) => (
            <div key={obj.id} className="lvl1-objective-card-modern">
              <div className="lvl1-obj-badge">{obj.id}</div>
              <div className="lvl1-obj-content">
                <h3 className="lvl1-obj-title">{obj.title}</h3>
                <p className="lvl1-obj-desc">{obj.desc}</p>
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
            Continue to Lesson Notes ➔
          </button>
        </footer>
      </div>
    );
  };

  // 3. STEP 2: READ LESSON NOTES (Masterclass Editorial)
  const renderNotes = () => {
    return (
      <div className="lvl1-stage-view">
        <header className="lvl1-screen-header">
          <div className="lvl1-screen-header__row">
            <span className="lvl1-screen-kicker">STEP 02 OF 06 · 5 MIN READ</span>
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
          </div>
          <h2 className="lvl1-screen-title">Read Lesson Notes</h2>
          <p className="lvl1-screen-desc">
            Master the principles of authentic self-knowledge, evidence formulation, and deliberate practice.
          </p>
        </header>

        <article className="lvl1-editorial-container">
          <section className="lvl1-editorial-section">
            <h3 className="lvl1-editorial-heading">1. What is Self-Awareness in Career Readiness?</h3>
            <p className="lvl1-editorial-text">
              Self-awareness is the conscious recognition of your motivations, work habits, technical aptitudes, and areas for growth. In placement drives, recruiters prioritize self-aware candidates because they accurately articulate where they can immediately deliver value and where they require mentorship.
            </p>
          </section>

          <section className="lvl1-editorial-section">
            <h3 className="lvl1-editorial-heading">2. Identifying True Strengths vs. Generic Claims</h3>
            <p className="lvl1-editorial-text">
              A genuine strength is an ability that you can consistently demonstrate through verifiable evidence. Saying <em>"I am a quick learner and hard worker"</em> is a claim; backing it up with a specific project story is proof.
            </p>

            <div className="lvl1-formula-card">
              <div className="lvl1-formula-tag">✨ THE STRENGTH FORMULA</div>
              <div className="lvl1-formula-equation">
                <span className="lvl1-formula-part">Core Skill</span>
                <span className="lvl1-formula-plus">+</span>
                <span className="lvl1-formula-part">Project Context</span>
                <span className="lvl1-formula-plus">+</span>
                <span className="lvl1-formula-part">Concrete Action</span>
                <span className="lvl1-formula-plus">+</span>
                <span className="lvl1-formula-part">Measurable Result</span>
              </div>
            </div>
          </section>

          <section className="lvl1-editorial-section">
            <h3 className="lvl1-editorial-heading">3. Assumption vs. Concrete Evidence</h3>
            <div className="lvl1-compare-cards">
              <div className="lvl1-compare-item is-negative">
                <div className="lvl1-compare-header">
                  <span>❌ Vague Assumption</span>
                </div>
                <p>"I think I have great problem-solving skills because I enjoy coding."</p>
              </div>
              <div className="lvl1-compare-item is-positive">
                <div className="lvl1-compare-header">
                  <span>✓ Verifiable Evidence</span>
                </div>
                <p>"Resolved asynchronous API race conditions in my final-year IoT project, reducing sensor packet drop rate by 42%."</p>
              </div>
            </div>
          </section>

          <section className="lvl1-editorial-section">
            <h3 className="lvl1-editorial-heading">4. Growth Mindset & Addressing Blind Spots</h3>
            <p className="lvl1-editorial-text">
              Every professional has areas requiring refinement. True confidence does not mean being perfect; it means proactively acknowledging your growth edges and adopting deliberate practice to improve.
            </p>
          </section>

          <section className="lvl1-editorial-section">
            <h3 className="lvl1-editorial-heading">5. The 7-Day Improvement Action Framework</h3>
            <p className="lvl1-editorial-text">
              Career breakthroughs stem from small, consistent habits. Rather than setting vague long-term goals, commit to <strong>one specific action</strong> you will execute within the next 7 days.
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
            Mark Notes as Read ➔
          </button>
        </footer>
      </div>
    );
  };

  // 4. STEP 3: WATCH VIDEO (Cinema Player)
  const renderVideo = () => {
    return (
      <div className="lvl1-stage-view">
        <header className="lvl1-screen-header">
          <div className="lvl1-screen-header__row">
            <span className="lvl1-screen-kicker">STEP 03 OF 06 · 4:30 MINS</span>
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
          <h2 className="lvl1-screen-title">Watch Concept Video</h2>
          <p className="lvl1-screen-desc">
            Visual walkthrough on how evaluators score self-awareness and how to articulate your strengths authentically.
          </p>
        </header>

        {/* Cinema Video Frame */}
        <div className="lvl1-cinema-player">
          <div className="lvl1-cinema-player__inner">
            <button
              className={`lvl1-cinema-play-btn ${isPlayingVideo ? 'is-playing' : ''}`}
              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
              aria-label={isPlayingVideo ? 'Pause Video' : 'Play Video'}
            >
              {isPlayingVideo ? '⏸' : '▶'}
            </button>

            <div className="lvl1-cinema-controls">
              <div className="lvl1-cinema-meta">
                <span className="lvl1-cinema-title">Foundations of Self-Awareness</span>
                <span className="lvl1-cinema-quality">
                  {videoLanguage === 'en' ? 'English HD' : 'ಕನ್ನಡ HD'}
                </span>
              </div>

              <div className="lvl1-cinema-scrubber">
                <div
                  className="lvl1-cinema-scrubber-fill"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <div className="lvl1-cinema-time">
                <span>
                  {videoProgress >= 100
                    ? '4:30'
                    : `${Math.floor((videoProgress * 2.7) / 60)}:${String(
                        Math.floor((videoProgress * 2.7) % 60)
                      ).padStart(2, '0')}`}{' '}
                  / 4:30
                </span>
                <span>{videoProgress >= 100 ? 'Completed ✓' : isPlayingVideo ? 'Playing' : 'Paused'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="lvl1-takeaways-card">
          <h3 className="lvl1-takeaways-title">Key Placement Takeaways</h3>
          <ul className="lvl1-takeaways-list">
            <li>Self-awareness creates confidence without arrogance.</li>
            <li>Always substantiate your top 3 strengths with concrete project stories.</li>
            <li>Frame blind spots around active mitigation and weekly habits.</li>
          </ul>
        </div>

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
            Continue to Quick Quiz ➔
          </button>
        </footer>
      </div>
    );
  };

  // 5. STEP 4: QUICK CHECK QUIZ
  const renderQuiz = () => {
    const q = QUIZ_QUESTIONS[currentQuizIndex];
    const isAnswered = selectedAnswers[q.id] !== undefined;
    const isLastQuestion = currentQuizIndex === QUIZ_QUESTIONS.length - 1;
    const isCorrect = isAnswered && selectedAnswers[q.id] === q.correctIndex;

    return (
      <div className="lvl1-stage-view">
        <header className="lvl1-screen-header">
          <span className="lvl1-screen-kicker">STEP 04 OF 06 · QUICK CHECK</span>
          <h2 className="lvl1-screen-title">Quick Quiz</h2>
          <p className="lvl1-screen-desc">
            Test your understanding of Lesson 1 concepts with 3 practical scenarios before starting your worksheet.
          </p>
        </header>

        {/* Question Stepper Tabs */}
        <div className="lvl1-quiz-stepper">
          {QUIZ_QUESTIONS.map((item, idx) => {
            const answered = selectedAnswers[item.id] !== undefined;
            const active = idx === currentQuizIndex;
            return (
              <button
                key={item.id}
                className={`lvl1-quiz-step-tab ${active ? 'is-active' : answered ? 'is-answered' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setCurrentQuizIndex(idx);
                }}
              >
                Q{idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="lvl1-quiz-question-card">
          <span className="lvl1-quiz-counter">
            Question {currentQuizIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <h3 className="lvl1-quiz-prompt">{q.question}</h3>

          <div className="lvl1-quiz-choices">
            {q.options.map((opt, optIdx) => {
              const selected = selectedAnswers[q.id] === optIdx;
              const correct = optIdx === q.correctIndex;
              let choiceClass = 'lvl1-choice-card';

              if (quizSubmitted || isAnswered) {
                if (correct) choiceClass += ' is-correct';
                else if (selected && !correct) choiceClass += ' is-wrong';
              } else if (selected) {
                choiceClass += ' is-selected';
              }

              return (
                <button
                  key={optIdx}
                  className={choiceClass}
                  onClick={() => handleQuizAnswer(q.id, optIdx)}
                >
                  <span className="lvl1-choice-letter">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="lvl1-choice-text">{opt}</span>
                  {(quizSubmitted || isAnswered) && correct && <span className="lvl1-choice-tick">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isAnswered && (
            <div className={`lvl1-explanation-callout ${isCorrect ? 'is-correct' : 'is-review'}`}>
              <strong>{isCorrect ? '🎉 Spot On!' : '💡 Key Concept:'}</strong>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>

        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            disabled={currentQuizIndex === 0}
            onClick={() => {
              sound.playTap();
              setCurrentQuizIndex((i) => Math.max(0, i - 1));
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
                setCurrentQuizIndex((i) => i + 1);
              }}
            >
              Next Question ➔
            </button>
          ) : !quizSubmitted ? (
            <button
              className="lvl1-btn-cta lvl1-btn-cta--primary"
              disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
              onClick={handleQuizSubmit}
            >
              Submit Quiz ➔
            </button>
          ) : (
            <button
              className="lvl1-btn-cta lvl1-btn-cta--primary"
              onClick={handleCompleteQuiz}
            >
              Continue to Activity ➔
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
    return (
      <div className="lvl1-stage-view">
        <header className="lvl1-screen-header">
          <span className="lvl1-screen-kicker">STEP 05 · REVIEW DOSSIER</span>
          <h2 className="lvl1-screen-title">Review Your Snapshot</h2>
          <p className="lvl1-screen-desc">
            Review your reflections before saving and proceeding to the evidence upload step.
          </p>
        </header>

        {/* Strength 1 */}
        <div className="lvl1-dossier-card">
          <div className="lvl1-dossier-header">
            <span className="lvl1-dossier-tag">⚡ STRENGTH 1</span>
            <strong>{strengths[0].strength || 'Analytical Problem Solving'}</strong>
          </div>
          <div className="lvl1-dossier-row">
            <span>Experience:</span>
            <p>{strengths[0].experience || 'Capstone IoT Lab Project'}</p>
          </div>
          <div className="lvl1-dossier-row">
            <span>What I Did:</span>
            <p>{strengths[0].whatIDid || 'Diagnosed sensor packet latency and refactored promise queues.'}</p>
          </div>
          <div className="lvl1-dossier-row">
            <span>Result:</span>
            <p>{strengths[0].result || 'Reduced drop rate by 42% and earned top grade.'}</p>
          </div>
        </div>

        {/* Strength 2 */}
        <div className="lvl1-dossier-card">
          <div className="lvl1-dossier-header">
            <span className="lvl1-dossier-tag">⚡ STRENGTH 2</span>
            <strong>{strengths[1].strength || 'Cross-Disciplinary Team Leadership'}</strong>
          </div>
          <div className="lvl1-dossier-row">
            <span>Experience:</span>
            <p>{strengths[1].experience || 'College Tech Fest Organizing Committee'}</p>
          </div>
          <div className="lvl1-dossier-row">
            <span>What I Did:</span>
            <p>{strengths[1].whatIDid || 'Led registration team and coordinated logistics.'}</p>
          </div>
          <div className="lvl1-dossier-row">
            <span>Result:</span>
            <p>{strengths[1].result || 'Checked in 850+ attendees seamlessly.'}</p>
          </div>
        </div>

        {/* Strength 3 */}
        <div className="lvl1-dossier-card">
          <div className="lvl1-dossier-header">
            <span className="lvl1-dossier-tag">⚡ STRENGTH 3</span>
            <strong>{strengths[2].strength || 'Adaptive Self-Learning'}</strong>
          </div>
          <div className="lvl1-dossier-row">
            <span>Experience:</span>
            <p>{strengths[2].experience || 'Full-Stack Web Transition'}</p>
          </div>
          <div className="lvl1-dossier-row">
            <span>What I Did:</span>
            <p>{strengths[2].whatIDid || 'Developed and published 3 production-grade open-source prototypes.'}</p>
          </div>
          <div className="lvl1-dossier-row">
            <span>Result:</span>
            <p>{strengths[2].result || 'Earned peer mentor certificate and maintained 8.8 CGPA.'}</p>
          </div>
        </div>

        {/* Improvement Action */}
        <div className="lvl1-dossier-card is-highlight">
          <div className="lvl1-dossier-header">
            <span className="lvl1-dossier-tag">🎯 7-DAY IMPROVEMENT ACTION</span>
          </div>
          <p className="lvl1-dossier-action-text">
            {improvementAction ||
              'In the next 7 days, I will schedule two 15-minute mock introduction sessions with my peer study group and record a video playback of my 60-second elevator pitch to refine body language.'}
          </p>
        </div>

        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--secondary"
            onClick={() => {
              sound.playTap();
              setCurrentStage('activity');
              setActivitySubStep(0);
            }}
          >
            Edit Responses ✏️
          </button>
          <button
            className="lvl1-btn-cta lvl1-btn-cta--primary"
            onClick={handleSaveActivityReview}
          >
            Save & Continue to Step 6 ➔
          </button>
        </footer>
      </div>
    );
  };

  // 8. STEP 6: EVIDENCE SUBMISSION
  const renderSubmission = () => {
    return (
      <div className="lvl1-stage-view">
        <header className="lvl1-screen-header">
          <span className="lvl1-screen-kicker">STEP 06 OF 06 · SUBMIT EVIDENCE</span>
          <h2 className="lvl1-screen-title">Submit Your Evidence</h2>
          <p className="lvl1-screen-desc">
            Upload your completed Self-Awareness Snapshot or evidence document for evaluator verification.
          </p>
        </header>

        <div className="lvl1-upload-card">
          {!uploadedFile ? (
            <div className="lvl1-dropzone-modern">
              <div className="lvl1-dropzone-icon">📄</div>
              <h3 className="lvl1-dropzone-title">Upload Snapshot Document</h3>
              <p className="lvl1-dropzone-subtitle">Supports PDF, JPG or PNG up to 10 MB</p>

              <div className="lvl1-dropzone-actions">
                <label className="lvl1-btn-cta lvl1-btn-cta--secondary lvl1-btn-cta--sm">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                <button
                  className="lvl1-btn-cta lvl1-btn-cta--ghost lvl1-btn-cta--sm"
                  onClick={handleUploadSamplePDF}
                >
                  Use Sample PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="lvl1-file-dossier">
              <div className="lvl1-file-dossier-icon">📑</div>
              <div className="lvl1-file-dossier-info">
                <strong className="lvl1-file-dossier-name">{uploadedFile.name}</strong>
                <span className="lvl1-file-dossier-meta">{uploadedFile.type} · {uploadedFile.size}</span>
              </div>
              <button
                className="lvl1-file-dossier-remove"
                onClick={() => {
                  sound.playTap();
                  setUploadedFile(null);
                }}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          )}

          {uploadedFile && (
            <label className="lvl1-cert-checkbox">
              <input
                type="checkbox"
                checked={confirmCertified}
                onChange={(e) => setConfirmCertified(e.target.checked)}
              />
              <span>I certify that this evidence reflects my authentic coursework and reflections.</span>
            </label>
          )}
        </div>

        <footer className="lvl1-floating-cta-bar">
          <button
            className="lvl1-btn-cta lvl1-btn-cta--ghost"
            onClick={() => setCurrentStage('activity_review')}
          >
            ← Review
          </button>
          <button
            className="lvl1-btn-cta lvl1-btn-cta--primary"
            disabled={!uploadedFile || !confirmCertified || isSubmitting}
            onClick={handleSubmitEvidence}
          >
            {isSubmitting ? 'Submitting Evidence...' : 'Submit for Evaluation ➔'}
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
        {/* PENDING STATE */}
        {isPending && (
          <div className="lvl1-eval-status-box lvl1-eval-status-box--pending">
            <div className="lvl1-status-indicator lvl1-status-indicator--pending">
              <span className="lvl1-status-pulse lvl1-status-pulse--pending" />
              <span>EVALUATION PENDING</span>
            </div>

            <h2 className="lvl1-eval-status-title">Your submission is being reviewed</h2>
            <p className="lvl1-eval-status-desc">
              Your Self-Awareness Snapshot has been submitted and is currently being evaluated by the academic placement board. Estimated review turnaround is 24–48 hours.
            </p>

            <div className="lvl1-eval-timeline-card">
              <div className="lvl1-timeline-row">
                <span className="lvl1-timeline-step is-complete">✓ Submitted</span>
                <span className="lvl1-timeline-arrow">➔</span>
                <span className="lvl1-timeline-step is-active">● Under Review</span>
                <span className="lvl1-timeline-arrow">➔</span>
                <span className="lvl1-timeline-step">○ Credential Ready</span>
              </div>
              <div className="lvl1-timeline-file">
                <span>Attached Artifact:</span>
                <strong>{uploadedFile?.name || 'Alex_Morgan_Level1_SelfAwareness_Snapshot.pdf'}</strong>
              </div>
            </div>

            <footer className="lvl1-floating-cta-bar">
              <button
                className="lvl1-btn-cta lvl1-btn-cta--secondary"
                onClick={() => setCurrentStage('overview')}
              >
                Level Overview
              </button>
              <button
                className="lvl1-btn-cta lvl1-btn-cta--primary"
                onClick={() => navigate('/journey')}
              >
                Return to Journey Map ➔
              </button>
            </footer>
          </div>
        )}

        {/* REVISION REQUIRED STATE */}
        {isRevision && (
          <div className="lvl1-eval-status-box lvl1-eval-status-box--revision">
            <div className="lvl1-status-indicator lvl1-status-indicator--revision">
              <span className="lvl1-status-pulse lvl1-status-pulse--revision" />
              <span>REVISION REQUIRED</span>
            </div>

            <h2 className="lvl1-eval-status-title">Your evaluator has requested a revision</h2>
            <p className="lvl1-eval-status-desc">
              Please review the evaluator notes below and refine your worksheet accordingly:
            </p>

            <div className="lvl1-eval-feedback-note">
              <span className="lvl1-eval-feedback-icon">💬</span>
              <p>{evaluatorFeedback}</p>
            </div>

            <footer className="lvl1-floating-cta-bar">
              <button
                className="lvl1-btn-cta lvl1-btn-cta--secondary"
                onClick={() => {
                  sound.playTap();
                  setCurrentStage('activity');
                  setActivitySubStep(0);
                }}
              >
                Edit Submission ✏️
              </button>
              <button
                className="lvl1-btn-cta lvl1-btn-cta--primary"
                onClick={() => {
                  sound.playLevelSuccess();
                  setCurrentStage('eval_pending');
                }}
              >
                Resubmit for Evaluation ➔
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

          {/* UX: dev/state tester is a tool, not a primary action — de-emphasized icon button */}
          <button
            className="lvl1-tester-btn lvl1-tester-btn--icon"
            onClick={() => setShowDevBar(!showDevBar)}
            title="Switch Screen / State Tester (dev tool)"
            aria-label="Open state tester (dev tool)"
            aria-expanded={showDevBar}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
              <path d="M1 14h6M9 8h6M17 16h6" />
            </svg>
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
              className={currentStage === 'submission' ? 'is-active' : ''}
              onClick={() => {
                markStepDone(1);
                markStepDone(2);
                markStepDone(3);
                markStepDone(4);
                markStepDone(5);
                if (!uploadedFile) handleUploadSamplePDF();
                setCurrentStage('submission');
                setShowDevBar(false);
              }}
            >
              6. Submission
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
