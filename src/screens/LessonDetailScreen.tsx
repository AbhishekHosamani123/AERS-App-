import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '../components/icons/Icon';
import { sound } from '../utils/sound';
import { MODULE_1_LESSONS, type LessonData } from '../data/module1Lessons';
import { MODULE_2_LESSONS } from '../data/module2Lessons';

const ALL_LESSONS: Record<number, LessonData> = {
  ...MODULE_1_LESSONS,
  ...MODULE_2_LESSONS,
};
import { CustomVideoPlayer } from '../components/video/CustomVideoPlayer';
import './LessonDetailScreen.css';

export type LessonStage =
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

export interface UploadedFileInfo {
  name: string;
  size: string;
  type: string;
}

const JOURNEY_STORAGE_KEY = 'aers_journey_progress_v4';

export function LessonDetailScreen({ levelId: propLevelId }: { levelId?: number }) {
  const navigate = useNavigate();
  const params = useParams<{ levelId?: string }>();

  // Determine active level (1 to 8)
  const levelId = useMemo(() => {
    if (propLevelId) return propLevelId;
    if (params.levelId) {
      const parsed = parseInt(params.levelId.replace(/\D/g, ''), 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 8) return parsed;
    }
    return 1;
  }, [propLevelId, params.levelId]);

  const lesson: LessonData = ALL_LESSONS[levelId] || ALL_LESSONS[1];
  const storageKey = `aers_lesson_${levelId}_state_v2`;

  // Saved state loader
  const savedState = useMemo(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  }, [storageKey]);

  // Stage & step progress
  const [currentStage, setCurrentStage] = useState<LessonStage>(() => savedState?.currentStage || 'overview');
  const [completedSteps, setCompletedSteps] = useState<number[]>(() => savedState?.completedSteps || []);

  // Language toggles
  const [language, setLanguage] = useState<'en' | 'kn'>('en');

  // Video playback
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>(() => savedState?.selectedAnswers || {});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(() => savedState?.quizSubmitted || false);
  const [quizScore, setQuizScore] = useState<number>(() => savedState?.quizScore || 0);

  // -------------------------------------------------------------
  // WORKSHEET STATES (Specific to Lessons 1, 2, 3, and 4)
  // -------------------------------------------------------------

  // Lesson 1: Self-Awareness Prompts
  const [l1Answers, setL1Answers] = useState<Record<number, string>>(() => {
    return (
      savedState?.l1Answers || {
        1: 'Resilient, Curious, Analytical. Because I focus on evidence and like understanding root causes.',
        2: 'Building full-stack projects, solving coding bugs, coordinating student group activities.',
        3: 'Public extempore speaking without prior preparation; sometimes overthinking edge cases.',
        4: 'In our 6th-sem database project, I resolved a deadlock issue which cut response time by 40%.',
        5: 'When our lab equipment failed right before submission, I created an alternate software simulator.',
        6: 'Peers consistently appreciate my patience in explaining complicated concepts clearly.',
        7: '“You are very thorough with details, but should speak up faster in large team meetings.”',
        8: 'I will improve structured verbal communication to deliver concise 60-second status updates.',
        9: 'Practice 3 mock elevator pitches with my project partner and record self-evaluations.',
        10: 'Software quality engineering and data analytics. I want to build verified proof of competency.',
      }
    );
  });

  // Lesson 2: Strength-to-Career Map
  const [l2Strengths, setL2Strengths] = useState(() => {
    return (
      savedState?.l2Strengths || [
        {
          strength: 'Systematic Problem Solving',
          experience: 'College Technical Symposium Registration Portal',
          myAction: 'Identified database concurrency lock and optimized connection pool.',
          result: 'Zero portal crashes across 1,200 participant registrations.',
        },
        {
          strength: 'Structured Communication',
          experience: 'Academic Capstone Seminar Presentation',
          myAction: 'Prepared architecture diagrams and answered faculty panel questions.',
          result: 'Ranked top 5% in department evaluation.',
        },
        {
          strength: 'Teamwork & Coordination',
          experience: 'Inter-College Hackathon 2025',
          myAction: 'Divided backend/frontend duties and managed Git pull request merges.',
          result: 'Completed functional MVP within 24 hours.',
        },
      ]
    );
  });

  const [l2SelectedSkills, setL2SelectedSkills] = useState<string[]>(() => {
    return savedState?.l2SelectedSkills || ['Planning', 'Problem-solving', 'Communication', 'Technical ability'];
  });

  const [l2ActivitiesRating, setL2ActivitiesRating] = useState<Record<string, number>>(() => {
    return (
      savedState?.l2ActivitiesRating || {
        'Analysing Information': 5,
        'Technical Problem Solving': 5,
        'Organising Tasks': 4,
        'Communicating Ideas': 4,
        'Helping Customers/Users': 3,
        'Independent Work': 4,
      }
    );
  });

  const [l2Directions, setL2Directions] = useState(() => {
    return (
      savedState?.l2Directions || {
        dir1: 'Software Quality Assurance / Testing Associate',
        why1: 'Strong alignment with analytical thinking, debugging discipline, and structured reporting.',
        investigate1: 'Automated testing frameworks (Selenium/Playwright) and API testing tools (Postman).',
        dir2: 'Cloud Support / Technical Operations Specialist',
        why2: 'Matches diagnostic troubleshooting strength and interest in production uptime.',
        investigate2: 'Linux shell scripting and basic AWS cloud practitioner concepts.',
        nextAction: 'Interview two alumni working as QA engineers and document 5 daily tools they use.',
        targetDate: 'Within 7 Days',
      }
    );
  });

  // Lesson 3: Career Role Exploration Canvas
  const [l3Roles, setL3Roles] = useState(() => {
    return (
      savedState?.l3Roles || {
        role1Title: 'Software QA / Test Engineer',
        role1Field: 'Information Technology / Software Engineering',
        role1Purpose: 'Ensure software systems function reliably and meet user requirements before production release.',
        role1Resp: '1. Design test cases from product specs\n2. Execute manual & automated tests\n3. Log detailed defect reports in Jira\n4. Verify bug fixes with developers\n5. Conduct regression testing cycles',
        role1Skills: 'Manual testing fundamentals, SQL, Jira, basic test automation (Python/Java), API testing.',
        role1Sources: 'Naukri job descriptions (Infosys, TCS), LinkedIn post by Senior QA Lead.',
        role1Evidence: 'Academic project test cases, bug tracking spreadsheet with 15 documented issues.',
        role1Gaps: 'Hands-on automated testing framework experience, CI/CD pipeline integration.',

        role2Title: 'Business Systems / Data Analyst',
        role2Field: 'Business Technology & Analytics',
        role2Purpose: 'Bridge business requirements with engineering teams through data insights and specifications.',
        role2Resp: '1. Gather functional requirements\n2. Build SQL analytical queries\n3. Create dashboard visualisations in PowerBI\n4. Document user stories\n5. Support user acceptance testing',
        role2Skills: 'Advanced Excel, SQL, Tableau/PowerBI, requirement documentation, stakeholder communication.',
        role2Sources: 'Accenture career portal, Glassdoor role review, college alumni webinar.',
        role2Evidence: 'Excel statistical dashboard project, course database design assignment.',
        role2Gaps: 'Production-level PowerBI dashboard portfolio, enterprise requirement gathering experience.',

        priorityRole: 'Software QA / Test Engineer',
        whyPriority: 'Higher immediate overlap with my technical debugging projects and faster entry pathway from BCA.',
        altRole: 'Business Systems / Data Analyst',
        whyAlt: 'Keeps analytical data pathway open as a strong alternative for enterprise roles.',
        sevenDayAction: 'Complete a structured test plan for an open-source web application and log in GitHub.',
      }
    );
  });

  // Lesson 4: Career Action Plan
  const [l4Plan, setL4Plan] = useState(() => {
    return (
      savedState?.l4Plan || {
        priorityRole: 'Software QA / Test Engineer',
        altRole: 'Business Systems Analyst',
        goalStatement:
          'Within 6 months, I will become fully placement-ready for entry-level Software Quality Engineer roles by completing 2 web application testing suites and obtaining verified AERS rubric certification.',
        priorityGaps: '1. Automated testing script execution\n2. API testing with Postman\n3. Structured mock interview evidence',
        action7d: 'Draft manual test scenarios for 5 core user flows of a sample e-commerce application.',
        action30d: 'Learn API testing with Postman and automate 10 test collection endpoints.',
        action3m: 'Build a comprehensive GitHub testing portfolio containing manual test matrices and automated scripts.',
        action6m: 'Complete 4 mock technical interviews and apply to 15 targeted campus recruitment drives.',
        barrier: 'Time crunch during upcoming semester university examinations.',
        fallback: 'Shift to bite-sized 30-minute daily practice sessions using curated mobile flashcards and review notes.',
        reviewSchedule: 'Monthly on the 1st and 15th with college placement mentor.',
        commitmentSigned: true,
      }
    );
  });

  // Lesson 5: Resume Evidence Inventory (Module 2, Lesson 1)
  const [l5Inventory, setL5Inventory] = useState(() => {
    return (
      savedState?.l5Inventory || {
        priorityRole: 'Junior Web Developer / QA Associate',
        altRole: 'Technical Support Specialist',
        fullName: 'Alex Morgan',
        email: 'alex.morgan.campus@gmail.com',
        phone: '+91 98765 43210',
        location: 'Bengaluru, Karnataka',
        portfolioUrl: 'https://github.com/alexmorgan-dev',
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Dayananda Sagar College, Bengaluru',
        gradYear: '2026',
        cgpa: '8.4 / 10 (Verified)',
        project1Title: 'Campus Recruitment Portal Prototype',
        project1Role: 'Frontend Developer & Tester',
        project1Tools: 'React, TypeScript, CSS Grid, Vite',
        project1Actions: 'Designed responsive student registration forms, validated data inputs, and eliminated broken layouts.',
        project1Output: 'Deployed live prototype on Vercel handling 120 mock student registrations.',
        project2Title: 'Inventory Stock Tracker for Local Retail',
        project2Role: 'Full Stack Contributor',
        project2Tools: 'Python, SQLite, Flask',
        project2Actions: 'Built automated low-stock alert script and structured relational product catalog.',
        project2Output: 'Cut manual inventory reconciliation time by 45%.',
        techSkills: 'React, JavaScript (ES6+), HTML5/CSS3, Python basics, SQL, Git/GitHub',
        toolSkills: 'VS Code, Postman, Microsoft Excel, Canva, Figma (Viewer)',
        employabilitySkills: 'Structured Communication (Seminar presentation), Analytical Debugging (Deadlock fix)',
        practicalExp: 'Family retail store operations support (weekend inventory reconciliation and customer bill processing)',
        truthCheck1: true,
        truthCheck2: true,
        truthCheck3: true,
      }
    );
  });

  // Lesson 6: Statement Bank & Professional Summary Builder (Module 2, Lesson 2)
  const [l6Statements, setL6Statements] = useState(() => {
    return (
      savedState?.l6Statements || {
        summaryDraft1: 'Final-year BCA student with hands-on project experience in React and JavaScript. Developed teamwork and debugging skills through campus tech portal builds; seeking entry-level Web Developer opportunity.',
        summaryDraft2: 'Detail-oriented computer applications undergraduate with proven coursework in database systems and frontend engineering. Coordinated 4-member hackathon team; targeting software engineering internship.',
        summaryDraft3: 'Aspiring Software QA / Frontend Engineer skilled in HTML, CSS, React, and Python. Completed 2 verified academic applications with zero production defects; eager to contribute to product reliability.',
        selectedSummary: 1,
        projStatement1: 'Engineered responsive React web portal for campus symposium, streamlining attendee registrations across 1,200 participants with zero server downtime.',
        projStatement2: 'Developed Python SQLite inventory reconciliation script, reducing weekly manual stock logging time by 45% for retail business.',
        expStatement1: 'Coordinated volunteer registration desk for 2-day technical fest, managing attendance tracking and issue resolution for 450+ delegates.',
        skillStatement1: 'Utilised Postman and Git to test 15 REST endpoints and resolve 8 concurrency bugs during 6th-semester capstone testing cycles.',
        verbAuditPassed: true,
        metricsVerified: true,
      }
    );
  });

  // Lesson 7: Skills, Projects and Experience Draft 1 (Module 2, Lesson 3)
  const [l7Draft, setL7Draft] = useState(() => {
    return (
      savedState?.l7Draft || {
        techSkills: ['JavaScript (ES6+)', 'React 19', 'HTML5 & CSS3', 'Python Basics', 'SQL / SQLite'],
        digitalTools: ['Git & GitHub', 'VS Code', 'Microsoft Excel (Data Sorting & Charts)', 'Postman'],
        employabilitySkills: ['Cross-functional Collaboration', 'Analytical Problem Solving', 'Technical Documentation'],
        languages: ['English (Professional Working)', 'Kannada (Native/Fluent)', 'Hindi (Conversational)'],
        proj1Heading: 'Campus Recruitment & Assessment Web Portal | React, TypeScript, Vite',
        proj1Bullets: [
          'Designed modular responsive UI components in React, achieving sub-second page loads across mobile viewports.',
          'Implemented client-side input validation and error states, preventing submission failures across 1,200 test cases.',
          'Collaborated with 3 peers via Git feature branches and resolved 6 pull request merge conflicts on schedule.'
        ],
        proj2Heading: 'Retail Inventory Stock Management System | Python, Flask, SQLite',
        proj2Bullets: [
          'Engineered relational database schema tracking 250+ SKU inventory counts with automated stock threshold alerts.',
          'Generated monthly sales analysis spreadsheets saving 10 hours of manual bookkeeping each month.'
        ],
        expHeading: 'Practical Experience — Family Retail Enterprise Operations | Bengaluru, India (2024–Present)',
        expBullets: [
          'Managed point-of-sale terminal transactions and maintained daily ledger balancing with 100% accuracy.',
          'Assisted store owner with vendor order coordination and stock replenishment scheduling.'
        ],
        layoutStyle: 'Single-Column ATS Standard (Verdana / Inter, 10-11pt, 0.75-inch margins)',
      }
    );
  });

  // Lesson 8: Tailoring, Reviewing and Verifying My Résumé (Module 2, Lesson 4)
  const [l8Tailor, setL8Tailor] = useState(() => {
    return (
      savedState?.l8Tailor || {
        targetJobTitle: 'Associate Software Engineer / Frontend Developer',
        targetCompany: 'TCS / Infosys Campus Recruitment',
        jobReq1: 'Solid proficiency in JavaScript, HTML5, CSS3, and modern web frameworks (React preferred)',
        jobReq1Evidence: 'Built 2 production-grade React web apps (Campus Portal & Inventory Tracker) hosted on GitHub.',
        jobReq1Placement: 'Top Skills section + Project 1 primary bullets.',
        jobReq2: 'Strong debugging abilities, unit testing awareness, and collaboration in Git version control',
        jobReq2Evidence: 'Documented 15 manual test suites and handled 20+ Git PR merges in academic capstone project.',
        jobReq2Placement: 'Project 1 bullet 3 + Tools section (Git, GitHub, Postman).',
        jobReq3: 'Clear verbal and written communication with ability to explain technical decisions',
        jobReq3Evidence: 'Delivered 6th-sem capstone seminar presentation evaluated in top 5% of department.',
        jobReq3Placement: 'Professional Summary + Academic Achievements section.',
        tailoredSummary: 'Final-year BCA student with verified competency in React, TypeScript, and responsive web development. Co-developed campus portal handling 1,200 student records with zero downtime; eager to contribute technical discipline and clean code as an Associate Software Engineer.',
        auditChecklist: {
          zeroTypos: true,
          verifiedDates: true,
          activeLinks: true,
          noSensitiveData: true,
          singleColumnAts: true,
          noSkillBars: true,
          actionVerbsUsed: true,
          metricsExplainable: true,
          reverseChronology: true,
          interviewDefensible: true,
        },
        auditApproved: true,
      }
    );
  });

  // Evidence submission state
  const [uploadedFile, setUploadedFile] = useState<UploadedFileInfo | null>(() => savedState?.uploadedFile || null);
  const [confirmCertified, setConfirmCertified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      const payload = {
        currentStage,
        completedSteps,
        selectedAnswers,
        quizSubmitted,
        quizScore,
        l1Answers,
        l2Strengths,
        l2SelectedSkills,
        l2ActivitiesRating,
        l2Directions,
        l3Roles,
        l4Plan,
        l5Inventory,
        l6Statements,
        l7Draft,
        l8Tailor,
        uploadedFile,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {}
  }, [
    storageKey,
    currentStage,
    completedSteps,
    selectedAnswers,
    quizSubmitted,
    quizScore,
    l1Answers,
    l2Strengths,
    l2SelectedSkills,
    l2ActivitiesRating,
    l2Directions,
    l3Roles,
    l4Plan,
    l5Inventory,
    l6Statements,
    l7Draft,
    l8Tailor,
    uploadedFile,
  ]);

  const hasLiveVideo = levelId === 1;
  const videoSrc = hasLiveVideo
    ? language === 'kn'
      ? '/videos/Module1/Lesson1/Kannada.mp4'
      : '/videos/Module1/Lesson1/English.mp4'
    : undefined;

  // Video playback simulation for lessons without native video
  useEffect(() => {
    if (hasLiveVideo) return;
    let timer: ReturnType<typeof setInterval>;
    if (isPlayingVideo && videoProgress < 100) {
      timer = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 96) {
            setIsPlayingVideo(false);
            return 100;
          }
          return prev + 4;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [hasLiveVideo, isPlayingVideo, videoProgress]);

  // Step complete helper
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
      name: `Learner_Level${levelId}_${lesson.primaryEvidence.replace(/\s+/g, '_')}.pdf`,
      size: '1.6 MB',
      type: 'PDF Document',
    });
    sound.playTap();
  };

  const handleSubmitEvidence = () => {
    if (!uploadedFile) {
      sound.playLocked();
      alert('Please upload or select an evidence snapshot document first.');
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

  const handleApproveLevel = () => {
    sound.playGrandFanfare();
    markStepDone(1);
    markStepDone(2);
    markStepDone(3);
    markStepDone(4);
    markStepDone(5);
    markStepDone(6);
    setCurrentStage('eval_approved');

    // Update global journey progress
    try {
      const raw = localStorage.getItem(JOURNEY_STORAGE_KEY);
      let currentProgress: {
        completedLevels: number[];
        levelStars: Record<number, number>;
        currentLevel: number;
        passportUnlocked: boolean;
        soundEnabled: boolean;
        learnerName: string;
      } = {
        completedLevels: [1],
        levelStars: { 1: 3 },
        currentLevel: 2,
        passportUnlocked: false,
        soundEnabled: true,
        learnerName: 'Alex Morgan',
      };
      if (raw) currentProgress = { ...currentProgress, ...JSON.parse(raw) };
      currentProgress.completedLevels = Array.from(new Set([...currentProgress.completedLevels, levelId]));
      currentProgress.levelStars[levelId] = 3;
      currentProgress.currentLevel = Math.max(currentProgress.currentLevel, Math.min(24, levelId + 1));
      localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(currentProgress));
    } catch {}
  };

  const handleContinueNextLevel = () => {
    sound.playTap();
    if (levelId < 8) {
      navigate(`/journey/level/${levelId + 1}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/journey');
    }
  };

  // ---------------- RENDER STAGES ----------------

  // 1. OVERVIEW
  const renderOverview = () => {
    const stepsData = [
      { id: 1, stage: 'objectives' as LessonStage, type: 'OBJECTIVES', duration: '2 MIN', title: 'Learning Objectives', desc: 'Pedagogical outcomes, framework & completion rules' },
      { id: 2, stage: 'notes' as LessonStage, type: 'READING', duration: '5 MIN', title: 'Read Lesson Notes', desc: 'Bilingual conceptual guide (English & Kannada)' },
      { id: 3, stage: 'video' as LessonStage, type: 'VIDEO', duration: '7 MIN', title: 'Watch Concept Video', desc: 'Bilingual script, key takeaways & simulation' },
      { id: 4, stage: 'quiz' as LessonStage, type: 'CHECKPOINT', duration: '5 QS', title: 'Knowledge Check Quiz', desc: 'Scenario questions with 60% pass threshold' },
      { id: 5, stage: 'activity' as LessonStage, type: 'WORKSHEET', duration: 'INTERACTIVE', title: lesson.primaryEvidence, desc: 'Complete verified digital reflection worksheet' },
      { id: 6, stage: 'submission' as LessonStage, type: 'EVIDENCE', duration: 'UPLOAD', title: 'Submit Evidence', desc: 'Upload verified document for human rubric assessment' },
    ];

    const progressPct = Math.round((completedSteps.length / 6) * 100);

    return (
      <div className="lvl1-stage-view lvl1-overview-view">
        <section className="lvl1-hero-milestone" aria-label="Level Overview">
          <div className="lvl1-hero-milestone__pill-row">
            <span className="lvl1-badge-kicker">LEVEL {lesson.numberStr} OF 24 · MODULE 01</span>
            <span className="lvl1-xp-badge">⚡ +{lesson.xpReward} XP</span>
          </div>

          <h1 className="lvl1-hero-milestone__title">{lesson.title}</h1>
          <p className="lvl1-hero-milestone__desc">{lesson.tagline}</p>

          <div className="lvl1-progress-bar-card">
            <div className="lvl1-progress-bar-head">
              <span className="lvl1-progress-label">Level Completion</span>
              <span className="lvl1-progress-val">{progressPct}%</span>
            </div>
            <div className="lvl1-progress-track">
              <div className="lvl1-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="lvl1-progress-stats">
              <span>{completedSteps.length} of 6 milestones done</span>
              <span>{lesson.durationMin} mins total</span>
            </div>
          </div>

          <button className="lvl1-primary-btn lvl1-resume-btn" onClick={handleStartOrResume}>
            <span style={{ fontSize: 15, marginRight: 4 }}>▶</span>
            {completedSteps.length === 0
              ? `Start Level ${lesson.numberStr} Now`
              : completedSteps.length === 6
              ? 'View Review Status'
              : `Resume Step ${nextAvailableStep}: ${stepsData[nextAvailableStep - 1]?.title}`}
          </button>
        </section>

        {/* Step List */}
        <section className="lvl1-step-list-section" aria-label="Milestone Steps">
          <h2 className="lvl1-section-heading">Guided Learning Path</h2>
          <div className="lvl1-step-cards-stack">
            {stepsData.map((s) => {
              const isDone = completedSteps.includes(s.id);
              const isCurrent = currentStepNum === s.id;
              return (
                <div
                  key={s.id}
                  className={`lvl1-step-card ${isDone ? 'is-done' : ''} ${isCurrent ? 'is-current' : ''}`}
                  onClick={() => {
                    sound.playTap();
                    setCurrentStage(s.stage);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="lvl1-step-card__num-col">
                    <span className="lvl1-step-badge">{isDone ? '✓' : `0${s.id}`}</span>
                  </div>
                  <div className="lvl1-step-card__content">
                    <div className="lvl1-step-card__meta">
                      <span className="lvl1-step-type">{s.type}</span>
                      <span className="lvl1-step-dot">·</span>
                      <span className="lvl1-step-time">{s.duration}</span>
                    </div>
                    <strong className="lvl1-step-title">{s.title}</strong>
                    <p className="lvl1-step-desc">{s.desc}</p>
                  </div>
                  <div className="lvl1-step-card__status">
                    {isDone ? (
                      <span className="lvl1-status-pill lvl1-status-pill--done">Done</span>
                    ) : (
                      <span className="lvl1-status-pill lvl1-status-pill--pending">Open</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  };

  // 2. OBJECTIVES
  const renderObjectives = () => {
    return (
      <div className="lvl1-stage-view lvl1-objectives-view">
        <div className="lvl1-view-header">
          <span className="lvl1-badge-kicker">STEP 01 OF 06 · SPECIFICATION</span>
          <h2 className="lvl1-view-title">{lesson.title} Objectives</h2>
          <p className="lvl1-view-subtitle">{lesson.subtitle}</p>
        </div>

        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="lightning" size={18} /> Lesson Purpose
          </h3>
          <p className="lvl1-card-body">{lesson.specification.purpose}</p>
        </div>

        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="star" size={18} /> Learning Outcomes
          </h3>
          <ul className="lvl1-bullet-list">
            {lesson.specification.outcomes.map((o, idx) => (
              <li key={idx}>
                <strong>✓ {o}</strong>
              </li>
            ))}
          </ul>
        </div>

        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="route" size={18} /> Core Framework
          </h3>
          <div className="lvl1-formula-box">
            <code>{lesson.framework}</code>
          </div>
        </div>

        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="info" size={18} /> Locked Completion Rules
          </h3>
          <ul className="lvl1-rules-list">
            <li><strong>Video:</strong> {lesson.specification.lockedRules.video}</li>
            <li><strong>Notes:</strong> {lesson.specification.lockedRules.note}</li>
            <li><strong>Quiz:</strong> {lesson.specification.lockedRules.quiz}</li>
            <li><strong>Worksheet:</strong> {lesson.specification.lockedRules.worksheet}</li>
            <li><strong>Human Review:</strong> {lesson.specification.lockedRules.humanReview}</li>
            <li><strong>Progression:</strong> {lesson.specification.lockedRules.closure}</li>
          </ul>
        </div>

        <div className="lvl1-bottom-bar">
          <button
            className="lvl1-primary-btn"
            onClick={() => {
              sound.playTap();
              markStepDone(1);
              setCurrentStage('notes');
            }}
          >
            Mark Complete & Read Notes ➔
          </button>
        </div>
      </div>
    );
  };

  // 3. NOTES (Bilingual)
  const renderNotes = () => {
    const isEn = language === 'en';
    const sections = isEn ? lesson.notes.sectionsEn : lesson.notes.sectionsKn;

    return (
      <div className="lvl1-stage-view lvl1-notes-view">
        <div className="lvl1-view-header">
          <div className="lvl1-bilingual-switcher-row">
            <span className="lvl1-badge-kicker">STEP 02 OF 06 · STUDY NOTE</span>
            <div className="lvl1-lang-pills">
              <button
                className={`lvl1-lang-pill ${language === 'en' ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setLanguage('en');
                }}
              >
                English
              </button>
              <button
                className={`lvl1-lang-pill ${language === 'kn' ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setLanguage('kn');
                }}
              >
                ಕನ್ನಡ (Kannada)
              </button>
            </div>
          </div>
          <h2 className="lvl1-view-title">{isEn ? lesson.notes.titleEn : lesson.notes.titleKn}</h2>
        </div>

        <div className="lvl1-card-box lvl1-intro-box">
          <p className="lvl1-card-body">{isEn ? lesson.notes.introEn : lesson.notes.introKn}</p>
        </div>

        <div className="lvl1-formula-banner">
          <span className="lvl1-formula-label">{isEn ? 'Core Framework' : 'ಸಂಪರ್ಕ ಚೌಕಟ್ಟು'}</span>
          <span className="lvl1-formula-text">{isEn ? lesson.notes.formulaEn : lesson.notes.formulaKn}</span>
        </div>

        {sections.map((sec, idx) => (
          <div key={idx} className="lvl1-card-box">
            <h3 className="lvl1-card-subtitle">{sec.heading}</h3>
            <p className="lvl1-card-body">{sec.body}</p>
            {sec.bulletList && (
              <ul className="lvl1-bullet-list">
                {sec.bulletList.map((b, bIdx) => (
                  <li key={bIdx}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="lvl1-quote-box">
          <span className="lvl1-quote-icon">“</span>
          <p className="lvl1-quote-body">{isEn ? lesson.notes.goldenQuoteEn : lesson.notes.goldenQuoteKn}</p>
        </div>

        <div className="lvl1-bottom-bar">
          <button
            className="lvl1-primary-btn"
            onClick={() => {
              sound.playTap();
              markStepDone(2);
              setCurrentStage('video');
            }}
          >
            Mark Read & Watch Video ➔
          </button>
        </div>
      </div>
    );
  };

  // 4. VIDEO (Bilingual Script & Player Simulation)
  const renderVideo = () => {
    const isEn = language === 'en';
    const takeaways = isEn ? lesson.video.keyTakeawaysEn : lesson.video.keyTakeawaysKn;

    return (
      <div className="lvl1-stage-view lvl1-video-view">
        <div className="lvl1-view-header">
          <div className="lvl1-bilingual-switcher-row">
            <span className="lvl1-badge-kicker">STEP 03 OF 06 · MASTERCLASS VIDEO</span>
            <div className="lvl1-lang-pills">
              <button
                className={`lvl1-lang-pill ${language === 'en' ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setLanguage('en');
                }}
              >
                English
              </button>
              <button
                className={`lvl1-lang-pill ${language === 'kn' ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setLanguage('kn');
                }}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
          <h2 className="lvl1-view-title">{lesson.title} Masterclass</h2>
          <p className="lvl1-view-subtitle">
            Duration: {hasLiveVideo ? (language === 'en' ? '3:53 · Masterclass + AERS Outro' : '6:48 · ಮಾಸ್ಟರ್‌ಕ್ಲಾಸ್ + AERS ಔಟ್ರೋ') : lesson.video.targetDuration} · {hasLiveVideo ? (isEn ? 'Watermark-Free HD' : 'ವಾಟರ್‌ಮಾರ್ಕ್-ಮುಕ್ತ ಎಚ್‌ಡಿ') : 'Bilingual Captions'}
          </p>
        </div>

        {/* Video Player Card */}
        <div className="lvl1-video-player-card">
          {hasLiveVideo && videoSrc ? (
            <CustomVideoPlayer
              key={videoSrc}
              src={videoSrc}
              title={lesson.title}
              language={language}
              onLanguageChange={setLanguage}
              expectedDuration={language === 'en' ? 233 : 408}
              initialProgress={videoProgress}
              onProgressUpdate={(pct) => {
                setVideoProgress(pct);
                if (pct >= 90) {
                  markStepDone(3);
                }
              }}
              onEnded={() => {
                setVideoProgress(100);
                markStepDone(3);
              }}
              onRequirementMet={() => {
                markStepDone(3);
              }}
            />
          ) : (
            <div className="lvl1-video-screen">
              <div className="lvl1-video-center-controls">
                <button
                  className="lvl1-video-play-btn"
                  onClick={() => {
                    sound.playTap();
                    setIsPlayingVideo((prev) => !prev);
                  }}
                  aria-label={isPlayingVideo ? 'Pause video' : 'Play video'}
                >
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{isPlayingVideo ? '⏸' : '▶'}</span>
                </button>
              </div>
              <div className="lvl1-video-subtitles-bar">
                <span>{isPlayingVideo ? `[${language.toUpperCase()}] ` + (isEn ? lesson.notes.goldenQuoteEn : lesson.notes.goldenQuoteKn) : 'Press play to begin video masterclass'}</span>
              </div>
            </div>
          )}
          <div className="lvl1-video-progress-bar">
            <div className="lvl1-video-progress-fill" style={{ width: `${videoProgress}%` }} />
          </div>
          <div className="lvl1-video-meta-bar">
            <span>Progress: {videoProgress}% {hasLiveVideo ? `(${language === 'en' ? 'English · 3:53' : 'ಕನ್ನಡ · 6:48'})` : ''}</span>
            <span>{videoProgress >= 90 ? '✓ Watch requirement fulfilled' : 'Must reach at least 90%'}</span>
          </div>
        </div>

        {/* Script Chapters */}
        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="info" size={18} /> Official Video Transcript & Script
          </h3>
          <div className="lvl1-script-sections-stack">
            {lesson.video.sections.map((sec) => (
              <div key={sec.step} className="lvl1-script-item">
                <div className="lvl1-script-item-head">
                  <strong className="lvl1-script-item-title">{isEn ? sec.titleEn : sec.titleKn}</strong>
                  <span className="lvl1-script-item-time">{sec.duration}</span>
                </div>
                <p className="lvl1-script-item-body">{isEn ? sec.scriptEn : sec.scriptKn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="star" size={18} /> Key Takeaways
          </h3>
          <ul className="lvl1-bullet-list">
            {takeaways.map((t, idx) => (
              <li key={idx}>{t}</li>
            ))}
          </ul>
        </div>

        <div className="lvl1-bottom-bar">
          <button
            className="lvl1-primary-btn"
            onClick={() => {
              sound.playTap();
              markStepDone(3);
              setCurrentStage('quiz');
            }}
          >
            Mark Watched & Take Quiz ➔
          </button>
        </div>
      </div>
    );
  };

  // 5. QUIZ (Bilingual Scenario Checkpoint)
  const renderQuiz = () => {
    // Pick first 5 questions for consistency
    const questions = lesson.quiz.questions.slice(0, 5);
    const q = questions[currentQuizIndex];
    const isEn = language === 'en';

    const handleAnswerSelect = (optionIdx: number) => {
      if (quizSubmitted) return;
      sound.playTap();
      setSelectedAnswers((prev) => ({ ...prev, [currentQuizIndex]: optionIdx }));
    };

    const handleQuizSubmit = () => {
      let correct = 0;
      questions.forEach((item, idx) => {
        if (selectedAnswers[idx] === item.correctIndex) correct++;
      });
      const scorePct = Math.round((correct / questions.length) * 100);
      setQuizScore(scorePct);
      setQuizSubmitted(true);
      if (scorePct >= 60) {
        sound.playLevelSuccess();
        markStepDone(4);
      } else {
        sound.playLocked();
      }
    };

    const handleRetakeQuiz = () => {
      sound.playTap();
      setSelectedAnswers({});
      setQuizSubmitted(false);
      setCurrentQuizIndex(0);
    };

    return (
      <div className="lvl1-stage-view lvl1-quiz-view">
        <div className="lvl1-view-header">
          <div className="lvl1-bilingual-switcher-row">
            <span className="lvl1-badge-kicker">STEP 04 OF 06 · KNOWLEDGE CHECKPOINT</span>
            <div className="lvl1-lang-pills">
              <button
                className={`lvl1-lang-pill ${language === 'en' ? 'is-active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                English
              </button>
              <button
                className={`lvl1-lang-pill ${language === 'kn' ? 'is-active' : ''}`}
                onClick={() => setLanguage('kn')}
              >
                ಕನ್ನಡ
              </button>
            </div>
          </div>
          <h2 className="lvl1-view-title">{lesson.title} Quiz</h2>
          <p className="lvl1-view-subtitle">5 Questions · Pass Mark: 60% · No negative marking</p>
        </div>

        {/* Progress Dots */}
        <div className="lvl1-quiz-pagination-dots">
          {questions.map((_, idx) => (
            <button
              key={idx}
              className={`lvl1-quiz-dot-btn ${currentQuizIndex === idx ? 'is-active' : ''} ${
                selectedAnswers[idx] !== undefined ? 'is-answered' : ''
              }`}
              onClick={() => {
                sound.playTap();
                setCurrentQuizIndex(idx);
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        {q && (
          <div className="lvl1-card-box lvl1-question-card">
            <span className="lvl1-question-num-tag">
              Question {currentQuizIndex + 1} of {questions.length}
            </span>
            <h3 className="lvl1-question-text">{isEn ? q.questionEn : q.questionKn}</h3>

            <div className="lvl1-options-stack">
              {(isEn ? q.optionsEn : q.optionsKn).map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuizIndex] === optIdx;
                const isCorrect = q.correctIndex === optIdx;
                let optionClass = 'lvl1-option-btn';
                if (isSelected) optionClass += ' is-selected';
                if (quizSubmitted) {
                  if (isCorrect) optionClass += ' is-correct';
                  else if (isSelected && !isCorrect) optionClass += ' is-wrong';
                }

                return (
                  <button
                    key={optIdx}
                    className={optionClass}
                    onClick={() => handleAnswerSelect(optIdx)}
                    disabled={quizSubmitted}
                  >
                    <span className="lvl1-option-letter">{String.fromCharCode(65 + optIdx)}</span>
                    <span className="lvl1-option-label">{opt}</span>
                    {quizSubmitted && isCorrect && <span className="lvl1-option-icon">✓</span>}
                    {quizSubmitted && isSelected && !isCorrect && <span className="lvl1-option-icon">✕</span>}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="lvl1-explanation-card">
                <strong>Explanation:</strong>
                <p>{isEn ? q.explanationEn : q.explanationKn}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation & Submit Bar */}
        <div className="lvl1-quiz-nav-row">
          <button
            className="lvl1-outline-btn"
            disabled={currentQuizIndex === 0}
            onClick={() => setCurrentQuizIndex((prev) => Math.max(0, prev - 1))}
          >
            ← Previous
          </button>

          {currentQuizIndex < questions.length - 1 ? (
            <button
              className="lvl1-primary-btn"
              onClick={() => setCurrentQuizIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              Next Question →
            </button>
          ) : !quizSubmitted ? (
            <button
              className="lvl1-primary-btn"
              disabled={Object.keys(selectedAnswers).length < questions.length}
              onClick={handleQuizSubmit}
            >
              Submit Quiz Checkpoint
            </button>
          ) : null}
        </div>

        {/* Quiz Result Banner */}
        {quizSubmitted && (
          <div className={`lvl1-card-box lvl1-quiz-result-card ${quizScore >= 60 ? 'is-pass' : 'is-fail'}`}>
            <h3>{quizScore >= 60 ? '🎉 Quiz Passed!' : '⚠️ Pass Threshold Not Reached'}</h3>
            <p>
              Your Score: <strong>{quizScore}%</strong> (Requirement: 60%)
            </p>
            {quizScore >= 60 ? (
              <button
                className="lvl1-primary-btn"
                onClick={() => {
                  sound.playTap();
                  setCurrentStage('activity');
                }}
              >
                Proceed to Worksheet Activity ➔
              </button>
            ) : (
              <button className="lvl1-outline-btn" onClick={handleRetakeQuiz}>
                Retake Quiz Checkpoint
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  // 6. ACTIVITY (Tailored to each lesson)
  const renderActivity = () => {
    return (
      <div className="lvl1-stage-view lvl1-activity-view">
        <div className="lvl1-view-header">
          <div className="lvl1-bilingual-switcher-row">
            <span className="lvl1-badge-kicker">STEP 05 OF 06 · LEARNER WORKSHEET</span>
            <div className="lvl1-lang-pills">
              <button className={`lvl1-lang-pill ${language === 'en' ? 'is-active' : ''}`} onClick={() => setLanguage('en')}>
                English
              </button>
              <button className={`lvl1-lang-pill ${language === 'kn' ? 'is-active' : ''}`} onClick={() => setLanguage('kn')}>
                ಕನ್ನಡ
              </button>
            </div>
          </div>
          <h2 className="lvl1-view-title">{lesson.primaryEvidence}</h2>
          <p className="lvl1-view-subtitle">Complete your verified reflections. Drafts are automatically saved.</p>
        </div>

        {/* Worksheet Status & Autosave Toolbar */}
        <div className="lvl1-worksheet-toolbar">
          <div className="lvl1-worksheet-autosave-badge">
            <span>✓</span> Auto-saved locally
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
            Module {levelId <= 4 ? '1 (Career Clarity)' : '2 (Résumé Readiness)'} Competency Artifact
          </span>
        </div>

        {/* LESSON 1 WORKSHEET */}
        {levelId === 1 && (
          <div className="lvl1-worksheet-fields-stack">
            {[
              { id: 1, promptEn: '1. Describe yourself in three words. Why did you choose each word?', promptKn: 'ನಿಮ್ಮನ್ನು ಮೂರು ಪದಗಳಲ್ಲಿ ವಿವರಿಸಿ. ಪ್ರತಿಯೊಂದು ಪದವನ್ನು ಏಕೆ ಆಯ್ಕೆ ಮಾಡಿದ್ದೀರಿ?' },
              { id: 2, promptEn: '2. List three activities you enjoy and explain why.', promptKn: 'ನೀವು ಇಷ್ಟಪಡುವ ಮೂರು ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಕಾರಣವನ್ನು ಬರೆಯಿರಿ.' },
              { id: 3, promptEn: '3. List three activities you find difficult and explain why.', promptKn: 'ನಿಮಗೆ ಕಷ್ಟವಾಗುವ ಮೂರು ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಕಾರಣವನ್ನು ಬರೆಯಿರಿ.' },
              { id: 4, promptEn: '4. Describe one achievement: situation, action, result and learning.', promptKn: 'ಒಂದು ಸಾಧನೆಯನ್ನು ಸಂದರ್ಭ, ಕ್ರಮ, ಫಲಿತಾಂಶ ಮತ್ತು ಕಲಿಕೆಯೊಂದಿಗೆ ವಿವರಿಸಿ.' },
              { id: 5, promptEn: '5. Describe one challenge you handled and what it taught you.', promptKn: 'ನೀವು ಎದುರಿಸಿದ ಒಂದು ಸವಾಲು ಮತ್ತು ಅದರಿಂದ ಕಲಿತದ್ದನ್ನು ವಿವರಿಸಿ.' },
              { id: 6, promptEn: '6. What do other people appreciate about you? Give one example.', promptKn: 'ಇತರರು ನಿಮ್ಮಲ್ಲಿ ಏನು ಮೆಚ್ಚುತ್ತಾರೆ? ಒಂದು ಉದಾಹರಣೆ ನೀಡಿ.' },
              { id: 7, promptEn: '7. What feedback do you receive repeatedly?', promptKn: 'ನಿಮಗೆ ಮರುಮರು ಯಾವ ಪ್ರತಿಕ್ರಿಯೆ ಬರುತ್ತದೆ?' },
              { id: 8, promptEn: '8. Which one skill or behaviour will you improve, and why is it important for your career?', promptKn: 'ನೀವು ಯಾವ ಒಂದು ಕೌಶಲ್ಯ ಅಥವಾ ವರ್ತನೆಯನ್ನು ಸುಧಾರಿಸುತ್ತೀರಿ? ಅದು ವೃತ್ತಿಗೆ ಏಕೆ ಮುಖ್ಯ?' },
              { id: 9, promptEn: '9. What one action will you complete this week?', promptKn: 'ಈ ವಾರ ನೀವು ಪೂರ್ಣಗೊಳಿಸುವ ಒಂದು ಕ್ರಮ ಯಾವುದು?' },
              { id: 10, promptEn: '10. What work interests you, and what do you want to discover through AERS?', promptKn: 'ಯಾವ ರೀತಿಯ ಕೆಲಸ ನಿಮಗೆ ಆಸಕ್ತಿ? AERS ಮೂಲಕ ಏನು ಕಂಡುಹಿಡಿಯಲು ಬಯಸುತ್ತೀರಿ?' },
            ].map((item) => (
              <div key={item.id} className="lvl1-card-box">
                <label className="lvl1-field-label">{language === 'en' ? item.promptEn : item.promptKn}</label>
                <textarea
                  className="lvl1-textarea"
                  rows={3}
                  value={l1Answers[item.id] || ''}
                  onChange={(e) => setL1Answers({ ...l1Answers, [item.id]: e.target.value })}
                  placeholder="Enter your honest reflection with concrete examples..."
                />
              </div>
            ))}
          </div>
        )}

        {/* LESSON 2 WORKSHEET */}
        {levelId === 2 && (
          <div className="lvl1-worksheet-fields-stack">
            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">A. Evidence-Backed Strengths</h3>
              <p className="lvl1-card-body">Record 3 strengths supported by real situations, actions, and results:</p>
              {l2Strengths.map((item: any, idx: number) => (
                <div key={idx} className="canvas-role-card">
                  <span className="canvas-role-badge">Strength #{idx + 1}</span>
                  <input
                    type="text"
                    className="lvl1-input"
                    style={{ marginTop: '8px', marginBottom: '6px' }}
                    value={item.strength}
                    onChange={(e) => {
                      const copy = [...l2Strengths];
                      copy[idx].strength = e.target.value;
                      setL2Strengths(copy);
                    }}
                    placeholder="Strength Name"
                  />
                  <input
                    type="text"
                    className="lvl1-input"
                    style={{ marginBottom: '6px' }}
                    value={item.experience}
                    onChange={(e) => {
                      const copy = [...l2Strengths];
                      copy[idx].experience = e.target.value;
                      setL2Strengths(copy);
                    }}
                    placeholder="Real Experience / Context"
                  />
                  <input
                    type="text"
                    className="lvl1-input"
                    style={{ marginBottom: '6px' }}
                    value={item.myAction}
                    onChange={(e) => {
                      const copy = [...l2Strengths];
                      copy[idx].myAction = e.target.value;
                      setL2Strengths(copy);
                    }}
                    placeholder="My Action"
                  />
                  <input
                    type="text"
                    className="lvl1-input"
                    value={item.result}
                    onChange={(e) => {
                      const copy = [...l2Strengths];
                      copy[idx].result = e.target.value;
                      setL2Strengths(copy);
                    }}
                    placeholder="Measurable Result or Feedback"
                  />
                </div>
              ))}
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">B. Transferable Skills Selection</h3>
              <div className="skills-selector-grid">
                {[
                  'Communication',
                  'Teamwork',
                  'Leadership',
                  'Planning',
                  'Problem-solving',
                  'Analysis',
                  'Creativity',
                  'Time management',
                  'Customer service',
                  'Technical ability',
                  'Adaptability',
                ].map((sk) => {
                  const isSel = l2SelectedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      className={`skill-tag-btn ${isSel ? 'is-selected' : ''}`}
                      onClick={() => {
                        sound.playTap();
                        if (isSel) setL2SelectedSkills(l2SelectedSkills.filter((s) => s !== sk));
                        else setL2SelectedSkills([...l2SelectedSkills, sk]);
                      }}
                    >
                      {isSel ? '✓ ' : '+ '}
                      {sk}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">C. Preferred Work Activities (Rate 1–5)</h3>
              {Object.keys(l2ActivitiesRating).map((act) => (
                <div key={act} className="activity-rating-row">
                  <label>{act}</label>
                  <div className="activity-rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`activity-star-btn ${l2ActivitiesRating[act] >= star ? 'is-active' : ''}`}
                        onClick={() => {
                          sound.playTap();
                          setL2ActivitiesRating({ ...l2ActivitiesRating, [act]: star });
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">D. Shortlisted Career Directions</h3>
              <div className="canvas-role-card">
                <span className="canvas-role-badge">Direction 1</span>
                <input
                  type="text"
                  className="lvl1-input"
                  style={{ marginTop: '8px', marginBottom: '6px' }}
                  value={l2Directions.dir1}
                  onChange={(e) => setL2Directions({ ...l2Directions, dir1: e.target.value })}
                />
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  style={{ marginBottom: '6px' }}
                  value={l2Directions.why1}
                  onChange={(e) => setL2Directions({ ...l2Directions, why1: e.target.value })}
                  placeholder="Why may it suit you?"
                />
                <input
                  type="text"
                  className="lvl1-input"
                  value={l2Directions.investigate1}
                  onChange={(e) => setL2Directions({ ...l2Directions, investigate1: e.target.value })}
                  placeholder="What must you investigate?"
                />
              </div>

              <div className="canvas-role-card">
                <span className="canvas-role-badge canvas-role-badge--alt">Direction 2</span>
                <input
                  type="text"
                  className="lvl1-input"
                  style={{ marginTop: '8px', marginBottom: '6px' }}
                  value={l2Directions.dir2}
                  onChange={(e) => setL2Directions({ ...l2Directions, dir2: e.target.value })}
                />
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  style={{ marginBottom: '6px' }}
                  value={l2Directions.why2}
                  onChange={(e) => setL2Directions({ ...l2Directions, why2: e.target.value })}
                  placeholder="Why may it suit you?"
                />
                <input
                  type="text"
                  className="lvl1-input"
                  value={l2Directions.investigate2}
                  onChange={(e) => setL2Directions({ ...l2Directions, investigate2: e.target.value })}
                  placeholder="What must you investigate?"
                />
              </div>

              <div style={{ marginTop: '12px' }}>
                <label className="lvl1-field-label">Seven-Day Investigation Action</label>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l2Directions.nextAction}
                  onChange={(e) => setL2Directions({ ...l2Directions, nextAction: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* LESSON 3 WORKSHEET */}
        {levelId === 3 && (
          <div className="lvl1-worksheet-fields-stack">
            <div className="canvas-role-card">
              <span className="canvas-role-badge">Role 1 Exploration</span>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginTop: '8px', marginBottom: '6px' }}
                value={l3Roles.role1Title}
                onChange={(e) => setL3Roles({ ...l3Roles, role1Title: e.target.value })}
                placeholder="Role Title"
              />
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '6px' }}
                value={l3Roles.role1Field}
                onChange={(e) => setL3Roles({ ...l3Roles, role1Field: e.target.value })}
                placeholder="Career Field"
              />
              <textarea
                className="lvl1-textarea"
                rows={2}
                style={{ marginBottom: '6px' }}
                value={l3Roles.role1Purpose}
                onChange={(e) => setL3Roles({ ...l3Roles, role1Purpose: e.target.value })}
                placeholder="Why does this role exist?"
              />
              <textarea
                className="lvl1-textarea"
                rows={3}
                style={{ marginBottom: '6px' }}
                value={l3Roles.role1Resp}
                onChange={(e) => setL3Roles({ ...l3Roles, role1Resp: e.target.value })}
                placeholder="Five Important Responsibilities"
              />
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '6px' }}
                value={l3Roles.role1Skills}
                onChange={(e) => setL3Roles({ ...l3Roles, role1Skills: e.target.value })}
                placeholder="Required Skills (Technical, Employability, Tools)"
              />
              <input
                type="text"
                className="lvl1-input"
                value={l3Roles.role1Sources}
                onChange={(e) => setL3Roles({ ...l3Roles, role1Sources: e.target.value })}
                placeholder="Research Sources (Company JDs, Portals)"
              />
            </div>

            <div className="canvas-role-card">
              <span className="canvas-role-badge canvas-role-badge--alt">Role 2 Exploration</span>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginTop: '8px', marginBottom: '6px' }}
                value={l3Roles.role2Title}
                onChange={(e) => setL3Roles({ ...l3Roles, role2Title: e.target.value })}
                placeholder="Role Title"
              />
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '6px' }}
                value={l3Roles.role2Field}
                onChange={(e) => setL3Roles({ ...l3Roles, role2Field: e.target.value })}
                placeholder="Career Field"
              />
              <textarea
                className="lvl1-textarea"
                rows={2}
                style={{ marginBottom: '6px' }}
                value={l3Roles.role2Purpose}
                onChange={(e) => setL3Roles({ ...l3Roles, role2Purpose: e.target.value })}
                placeholder="Why does this role exist?"
              />
              <textarea
                className="lvl1-textarea"
                rows={3}
                style={{ marginBottom: '6px' }}
                value={l3Roles.role2Resp}
                onChange={(e) => setL3Roles({ ...l3Roles, role2Resp: e.target.value })}
                placeholder="Five Important Responsibilities"
              />
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '6px' }}
                value={l3Roles.role2Skills}
                onChange={(e) => setL3Roles({ ...l3Roles, role2Skills: e.target.value })}
                placeholder="Required Skills (Technical, Employability, Tools)"
              />
              <input
                type="text"
                className="lvl1-input"
                value={l3Roles.role2Sources}
                onChange={(e) => setL3Roles({ ...l3Roles, role2Sources: e.target.value })}
                placeholder="Research Sources"
              />
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">Role Comparison & Decision</h3>
              <table className="comparison-matrix-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>{l3Roles.role1Title || 'Role 1'}</th>
                    <th>{l3Roles.role2Title || 'Role 2'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Strengths Alignment</td>
                    <td>Strong (Debugging, Analysis)</td>
                    <td>Moderate (Data, SQL)</td>
                  </tr>
                  <tr>
                    <td>Daily Work Enjoyment</td>
                    <td>High (Problem diagnosis)</td>
                    <td>High (Dashboards)</td>
                  </tr>
                  <tr>
                    <td>Current Evidence</td>
                    <td>Test cases & bug reports</td>
                    <td>Database assignments</td>
                  </tr>
                  <tr>
                    <td>Entry Opportunities</td>
                    <td>Wide campus recruitment</td>
                    <td>Specialized analyst drives</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '14px' }}>
                <label className="lvl1-field-label">Priority Career Role</label>
                <input
                  type="text"
                  className="lvl1-input"
                  style={{ marginBottom: '6px' }}
                  value={l3Roles.priorityRole}
                  onChange={(e) => setL3Roles({ ...l3Roles, priorityRole: e.target.value })}
                />
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  style={{ marginBottom: '6px' }}
                  value={l3Roles.whyPriority}
                  onChange={(e) => setL3Roles({ ...l3Roles, whyPriority: e.target.value })}
                  placeholder="Why prioritized?"
                />
                <label className="lvl1-field-label">Seven-Day Investigation Action</label>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l3Roles.sevenDayAction}
                  onChange={(e) => setL3Roles({ ...l3Roles, sevenDayAction: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* LESSON 4 WORKSHEET */}
        {levelId === 4 && (
          <div className="lvl1-worksheet-fields-stack">
            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">A. Career Direction & SMART-E Goal</h3>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '8px' }}
                value={l4Plan.priorityRole}
                onChange={(e) => setL4Plan({ ...l4Plan, priorityRole: e.target.value })}
                placeholder="Priority Role"
              />
              <textarea
                className="lvl1-textarea"
                rows={3}
                value={l4Plan.goalStatement}
                onChange={(e) => setL4Plan({ ...l4Plan, goalStatement: e.target.value })}
                placeholder="6–12 Month SMART-E Goal Statement"
              />
              <div className="smarte-badge-row">
                <span className="smarte-badge">✓ Specific</span>
                <span className="smarte-badge">✓ Measurable</span>
                <span className="smarte-badge">✓ Achievable</span>
                <span className="smarte-badge">✓ Relevant</span>
                <span className="smarte-badge">✓ Time-bound</span>
                <span className="smarte-badge">✓ Evidence-based</span>
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">B. Four Progressive Planning Horizons</h3>

              <div className="horizon-card">
                <div className="horizon-card__header">
                  <strong>Horizon 1: Next 7 Days</strong>
                  <span className="horizon-pill">Immediate Start</span>
                </div>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l4Plan.action7d}
                  onChange={(e) => setL4Plan({ ...l4Plan, action7d: e.target.value })}
                  placeholder="Action & expected evidence"
                />
              </div>

              <div className="horizon-card horizon-card--30d">
                <div className="horizon-card__header">
                  <strong>Horizon 2: First 30 Days</strong>
                  <span className="horizon-pill">Foundation & Routine</span>
                </div>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l4Plan.action30d}
                  onChange={(e) => setL4Plan({ ...l4Plan, action30d: e.target.value })}
                  placeholder="Action & expected evidence"
                />
              </div>

              <div className="horizon-card horizon-card--3m">
                <div className="horizon-card__header">
                  <strong>Horizon 3: Within 3 Months</strong>
                  <span className="horizon-pill">Demonstrated Ability</span>
                </div>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l4Plan.action3m}
                  onChange={(e) => setL4Plan({ ...l4Plan, action3m: e.target.value })}
                  placeholder="Action & expected evidence"
                />
              </div>

              <div className="horizon-card horizon-card--6m">
                <div className="horizon-card__header">
                  <strong>Horizon 4: Within 6 Months</strong>
                  <span className="horizon-pill">Placement Readiness</span>
                </div>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l4Plan.action6m}
                  onChange={(e) => setL4Plan({ ...l4Plan, action6m: e.target.value })}
                  placeholder="Action & expected evidence"
                />
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">C. Barriers, Fallbacks & Monthly Review</h3>
              <label className="lvl1-field-label">Anticipated Barrier</label>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '8px' }}
                value={l4Plan.barrier}
                onChange={(e) => setL4Plan({ ...l4Plan, barrier: e.target.value })}
              />
              <label className="lvl1-field-label">Preventive / Fallback Action</label>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '8px' }}
                value={l4Plan.fallback}
                onChange={(e) => setL4Plan({ ...l4Plan, fallback: e.target.value })}
              />
              <label className="lvl1-field-label">Monthly Review Schedule</label>
              <input
                type="text"
                className="lvl1-input"
                value={l4Plan.reviewSchedule}
                onChange={(e) => setL4Plan({ ...l4Plan, reviewSchedule: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* LESSON 5 WORKSHEET: Resume Evidence Inventory */}
        {levelId === 5 && (
          <div className="lvl1-worksheet-fields-stack">
            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">A. Target Role & Professional Profile</h3>
              <p className="lvl1-card-body">Connect this evidence inventory with your shortlisted role from Module 1:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                <div>
                  <label className="lvl1-field-label">Priority Target Role</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.priorityRole}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, priorityRole: e.target.value })}
                    placeholder="e.g. Junior Web Developer"
                  />
                </div>
                <div>
                  <label className="lvl1-field-label">Alternative / Fallback Role</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.altRole}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, altRole: e.target.value })}
                    placeholder="e.g. Technical Support Associate"
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                <div>
                  <label className="lvl1-field-label">Professional Email</label>
                  <input
                    type="email"
                    className="lvl1-input"
                    value={l5Inventory.email}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="lvl1-field-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="lvl1-input"
                    value={l5Inventory.phone}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, phone: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <label className="lvl1-field-label">Portfolio / GitHub Profile Link</label>
                <input
                  type="url"
                  className="lvl1-input"
                  value={l5Inventory.portfolioUrl}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, portfolioUrl: e.target.value })}
                />
              </div>
              <p className="field-hint-tip">🔒 Privacy Rule: Sensitive data (Aadhaar, religion, caste, marital status) must be excluded.</p>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">B. Education & Academic Records</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginTop: '8px' }}>
                <div>
                  <label className="lvl1-field-label">Degree & Major</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.degree}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, degree: e.target.value })}
                  />
                </div>
                <div>
                  <label className="lvl1-field-label">Graduation Year</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.gradYear}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, gradYear: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginTop: '8px' }}>
                <div>
                  <label className="lvl1-field-label">Institution / College Name</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.institution}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, institution: e.target.value })}
                  />
                </div>
                <div>
                  <label className="lvl1-field-label">Verified CGPA / %</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.cgpa}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, cgpa: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">C. Core Project Evidence</h3>
              <p className="lvl1-card-body">Document two concrete projects using Purpose → Role → Action → Tools → Output:</p>
              
              <div className="canvas-role-card">
                <span className="canvas-role-badge">Project 01</span>
                <input
                  type="text"
                  className="lvl1-input"
                  style={{ marginTop: '8px', marginBottom: '6px' }}
                  value={l5Inventory.project1Title}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, project1Title: e.target.value })}
                  placeholder="Project Title"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.project1Role}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, project1Role: e.target.value })}
                    placeholder="My Role"
                  />
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.project1Tools}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, project1Tools: e.target.value })}
                    placeholder="Tools & Tech Stack"
                  />
                </div>
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  style={{ marginBottom: '6px' }}
                  value={l5Inventory.project1Actions}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, project1Actions: e.target.value })}
                  placeholder="Personal Actions & Implementation..."
                />
                <input
                  type="text"
                  className="lvl1-input"
                  value={l5Inventory.project1Output}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, project1Output: e.target.value })}
                  placeholder="Measurable Output & Verified Evidence link/report"
                />
              </div>

              <div className="canvas-role-card">
                <span className="canvas-role-badge canvas-role-badge--alt">Project 02</span>
                <input
                  type="text"
                  className="lvl1-input"
                  style={{ marginTop: '8px', marginBottom: '6px' }}
                  value={l5Inventory.project2Title}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, project2Title: e.target.value })}
                  placeholder="Project Title"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.project2Role}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, project2Role: e.target.value })}
                    placeholder="My Role"
                  />
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l5Inventory.project2Tools}
                    onChange={(e) => setL5Inventory({ ...l5Inventory, project2Tools: e.target.value })}
                    placeholder="Tools & Tech Stack"
                  />
                </div>
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  style={{ marginBottom: '6px' }}
                  value={l5Inventory.project2Actions}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, project2Actions: e.target.value })}
                  placeholder="Personal Actions & Implementation..."
                />
                <input
                  type="text"
                  className="lvl1-input"
                  value={l5Inventory.project2Output}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, project2Output: e.target.value })}
                  placeholder="Measurable Output & Verified Evidence link"
                />
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">D. Skills & Practical Experience</h3>
              <label className="lvl1-field-label">Technical Skills (Level E - Demonstrated with Evidence)</label>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '8px' }}
                value={l5Inventory.techSkills}
                onChange={(e) => setL5Inventory({ ...l5Inventory, techSkills: e.target.value })}
              />
              <label className="lvl1-field-label">Digital Tools & Software</label>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '8px' }}
                value={l5Inventory.toolSkills}
                onChange={(e) => setL5Inventory({ ...l5Inventory, toolSkills: e.target.value })}
              />
              <label className="lvl1-field-label">Practical Experience / Non-Traditional Work Exposure</label>
              <input
                type="text"
                className="lvl1-input"
                value={l5Inventory.practicalExp}
                onChange={(e) => setL5Inventory({ ...l5Inventory, practicalExp: e.target.value })}
                placeholder="College event coordination, volunteering, family business, or freelancing"
              />
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">E. 3-Check Truthfulness Declaration</h3>
              <p className="lvl1-card-body">Confirm that every recorded entry passes the AERS verification standard:</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', margin: '8px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={l5Inventory.truthCheck1}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, truthCheck1: e.target.checked })}
                />
                <span><strong>Check 1: Is it true?</strong> All qualifications, dates, and project descriptions are factually accurate.</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', margin: '8px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={l5Inventory.truthCheck2}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, truthCheck2: e.target.checked })}
                />
                <span><strong>Check 2: Can I explain it?</strong> I can walk an interviewer through my actions and decisions without notes.</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', margin: '8px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={l5Inventory.truthCheck3}
                  onChange={(e) => setL5Inventory({ ...l5Inventory, truthCheck3: e.target.checked })}
                />
                <span><strong>Check 3: Do I have evidence?</strong> I have certificates, repository links, or verified records for every claim.</span>
              </label>
            </div>
          </div>
        )}

        {/* LESSON 6 WORKSHEET: Statement Bank & Professional Summary */}
        {levelId === 6 && (
          <div className="lvl1-worksheet-fields-stack">
            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">A. Professional Summary Options</h3>
              <p className="lvl1-card-body">Draft 3 variations using Identity → Capability → Evidence → Target Role, then select your primary summary:</p>
              
              {[
                { id: 1, label: 'Draft 1: Technical Focus', value: l6Statements.summaryDraft1, key: 'summaryDraft1' as const },
                { id: 2, label: 'Draft 2: Teamwork & Problem Solving', value: l6Statements.summaryDraft2, key: 'summaryDraft2' as const },
                { id: 3, label: 'Draft 3: Quality & Reliability', value: l6Statements.summaryDraft3, key: 'summaryDraft3' as const },
              ].map((opt) => (
                <div key={opt.id} className="canvas-role-card" style={{ borderLeft: l6Statements.selectedSummary === opt.id ? '4px solid #0066f5' : '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="canvas-role-badge">{opt.label}</span>
                    <button
                      className={`lvl1-outline-btn ${l6Statements.selectedSummary === opt.id ? 'is-active' : ''}`}
                      style={{ padding: '2px 10px', fontSize: '11px', height: 'auto' }}
                      onClick={() => setL6Statements({ ...l6Statements, selectedSummary: opt.id })}
                    >
                      {l6Statements.selectedSummary === opt.id ? '✓ Selected Summary' : 'Select This Summary'}
                    </button>
                  </div>
                  <textarea
                    className="lvl1-textarea"
                    rows={3}
                    value={opt.value}
                    onChange={(e) => setL6Statements({ ...l6Statements, [opt.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">B. Achievement Statement Bank</h3>
              <p className="lvl1-card-body">Construct statements using Action Verb → Context/Task → Method/Skill → Result/Output:</p>
              
              <div style={{ marginBottom: '12px' }}>
                <label className="lvl1-field-label">Project Achievement Statement 1</label>
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  value={l6Statements.projStatement1}
                  onChange={(e) => setL6Statements({ ...l6Statements, projStatement1: e.target.value })}
                  placeholder="e.g. Engineered responsive React portal for symposium..."
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="lvl1-field-label">Project Achievement Statement 2</label>
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  value={l6Statements.projStatement2}
                  onChange={(e) => setL6Statements({ ...l6Statements, projStatement2: e.target.value })}
                  placeholder="e.g. Developed Python SQLite inventory reconciliation script..."
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label className="lvl1-field-label">Practical Experience / Event Statement</label>
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  value={l6Statements.expStatement1}
                  onChange={(e) => setL6Statements({ ...l6Statements, expStatement1: e.target.value })}
                  placeholder="e.g. Coordinated volunteer registration desk for 2-day technical fest..."
                />
              </div>

              <div>
                <label className="lvl1-field-label">Technical Tool & Testing Statement</label>
                <textarea
                  className="lvl1-textarea"
                  rows={2}
                  value={l6Statements.skillStatement1}
                  onChange={(e) => setL6Statements({ ...l6Statements, skillStatement1: e.target.value })}
                  placeholder="e.g. Utilised Postman and Git to test 15 REST endpoints..."
                />
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">C. Action Verbs & Cliche Filter</h3>
              <p className="lvl1-card-body">Audit checks confirming professional tone and metric integrity:</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', margin: '8px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={l6Statements.verbAuditPassed}
                  onChange={(e) => setL6Statements({ ...l6Statements, verbAuditPassed: e.target.checked })}
                />
                <span>Zero empty buzzwords: No unsupported phrases like 'hardworking', 'enthusiastic', or 'dynamic leader'.</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', margin: '8px 0', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={l6Statements.metricsVerified}
                  onChange={(e) => setL6Statements({ ...l6Statements, metricsVerified: e.target.checked })}
                />
                <span>Metric Integrity: All numbers (1,200 participants, 45% time savings, 15 endpoints) are factual and verifiable.</span>
              </label>
            </div>
          </div>
        )}

        {/* LESSON 7 WORKSHEET: Skills, Projects and Experience (Draft 1 Template) */}
        {levelId === 7 && (
          <div className="lvl1-worksheet-fields-stack">
            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">A. Semantic Skills Categorisation</h3>
              <p className="lvl1-card-body">Organise skills into standard employer categories without arbitrary percentage bars:</p>
              
              <div style={{ marginBottom: '8px' }}>
                <label className="lvl1-field-label">Technical Skills (Languages, Frameworks, Databases)</label>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l7Draft.techSkills.join(', ')}
                  onChange={(e) => setL7Draft({ ...l7Draft, techSkills: e.target.value.split(',').map((s) => s.trim()) })}
                />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label className="lvl1-field-label">Digital & Tool-Based Skills (IDEs, Version Control, Tools)</label>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l7Draft.digitalTools.join(', ')}
                  onChange={(e) => setL7Draft({ ...l7Draft, digitalTools: e.target.value.split(',').map((s) => s.trim()) })}
                />
              </div>
              <div style={{ marginBottom: '8px' }}>
                <label className="lvl1-field-label">Employability Skills (Demonstrated with Context)</label>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l7Draft.employabilitySkills.join(', ')}
                  onChange={(e) => setL7Draft({ ...l7Draft, employabilitySkills: e.target.value.split(',').map((s) => s.trim()) })}
                />
              </div>
              <div>
                <label className="lvl1-field-label">Language Proficiencies</label>
                <input
                  type="text"
                  className="lvl1-input"
                  value={l7Draft.languages.join(', ')}
                  onChange={(e) => setL7Draft({ ...l7Draft, languages: e.target.value.split(',').map((s) => s.trim()) })}
                />
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">B. Project Entries (Individual Contribution Proof)</h3>
              <div className="canvas-role-card">
                <span className="canvas-role-badge">Project 01 Entry</span>
                <input
                  type="text"
                  className="lvl1-input"
                  style={{ marginTop: '8px', marginBottom: '8px', fontWeight: 600 }}
                  value={l7Draft.proj1Heading}
                  onChange={(e) => setL7Draft({ ...l7Draft, proj1Heading: e.target.value })}
                />
                {l7Draft.proj1Bullets.map((bullet: string, bIdx: number) => (
                  <textarea
                    key={bIdx}
                    className="lvl1-textarea"
                    rows={2}
                    style={{ marginBottom: '6px' }}
                    value={bullet}
                    onChange={(e) => {
                      const copy = [...l7Draft.proj1Bullets];
                      copy[bIdx] = e.target.value;
                      setL7Draft({ ...l7Draft, proj1Bullets: copy });
                    }}
                  />
                ))}
              </div>

              <div className="canvas-role-card">
                <span className="canvas-role-badge canvas-role-badge--alt">Project 02 Entry</span>
                <input
                  type="text"
                  className="lvl1-input"
                  style={{ marginTop: '8px', marginBottom: '8px', fontWeight: 600 }}
                  value={l7Draft.proj2Heading}
                  onChange={(e) => setL7Draft({ ...l7Draft, proj2Heading: e.target.value })}
                />
                {l7Draft.proj2Bullets.map((bullet: string, bIdx: number) => (
                  <textarea
                    key={bIdx}
                    className="lvl1-textarea"
                    rows={2}
                    style={{ marginBottom: '6px' }}
                    value={bullet}
                    onChange={(e) => {
                      const copy = [...l7Draft.proj2Bullets];
                      copy[bIdx] = e.target.value;
                      setL7Draft({ ...l7Draft, proj2Bullets: copy });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">C. Practical Experience Entry</h3>
              <input
                type="text"
                className="lvl1-input"
                style={{ marginBottom: '8px', fontWeight: 600 }}
                value={l7Draft.expHeading}
                onChange={(e) => setL7Draft({ ...l7Draft, expHeading: e.target.value })}
              />
              {l7Draft.expBullets.map((b: string, idx: number) => (
                <textarea
                  key={idx}
                  className="lvl1-textarea"
                  rows={2}
                  style={{ marginBottom: '6px' }}
                  value={b}
                  onChange={(e) => {
                    const copy = [...l7Draft.expBullets];
                    copy[idx] = e.target.value;
                    setL7Draft({ ...l7Draft, expBullets: copy });
                  }}
                />
              ))}
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">D. ATS Visual Hierarchy Standard</h3>
              <p className="lvl1-card-body">Layout specifications: Single-column standard layout, reverse-chronological order, zero graphics/icons.</p>
              <input
                type="text"
                className="lvl1-input"
                disabled
                value={l7Draft.layoutStyle}
              />
            </div>
          </div>
        )}

        {/* LESSON 8 WORKSHEET: Tailoring, Reviewing and Verifying My Résumé */}
        {levelId === 8 && (
          <div className="lvl1-worksheet-fields-stack">
            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">A. Job Description Analysis & Evidence Mapping</h3>
              <p className="lvl1-card-body">Deconstruct target role requirements and align them with your verified proof:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px', marginBottom: '12px' }}>
                <div>
                  <label className="lvl1-field-label">Target Role Title</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l8Tailor.targetJobTitle}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, targetJobTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="lvl1-field-label">Target Hiring Organisation</label>
                  <input
                    type="text"
                    className="lvl1-input"
                    value={l8Tailor.targetCompany}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, targetCompany: e.target.value })}
                  />
                </div>
              </div>

              <table className="comparison-matrix-table">
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Employer Requirement</th>
                    <th style={{ width: '40%' }}>My Verified Evidence</th>
                    <th style={{ width: '25%' }}>Résumé Placement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="lvl1-input"
                        value={l8Tailor.jobReq1}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq1: e.target.value })}
                      />
                    </td>
                    <td>
                      <textarea
                        className="lvl1-textarea"
                        rows={2}
                        value={l8Tailor.jobReq1Evidence}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq1Evidence: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="lvl1-input"
                        value={l8Tailor.jobReq1Placement}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq1Placement: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="lvl1-input"
                        value={l8Tailor.jobReq2}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq2: e.target.value })}
                      />
                    </td>
                    <td>
                      <textarea
                        className="lvl1-textarea"
                        rows={2}
                        value={l8Tailor.jobReq2Evidence}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq2Evidence: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="lvl1-input"
                        value={l8Tailor.jobReq2Placement}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq2Placement: e.target.value })}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <input
                        type="text"
                        className="lvl1-input"
                        value={l8Tailor.jobReq3}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq3: e.target.value })}
                      />
                    </td>
                    <td>
                      <textarea
                        className="lvl1-textarea"
                        rows={2}
                        value={l8Tailor.jobReq3Evidence}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq3Evidence: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="lvl1-input"
                        value={l8Tailor.jobReq3Placement}
                        onChange={(e) => setL8Tailor({ ...l8Tailor, jobReq3Placement: e.target.value })}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">B. Tailored Professional Summary</h3>
              <p className="lvl1-card-body">Fine-tune your summary to emphasize requirements for this specific opening naturally:</p>
              <textarea
                className="lvl1-textarea"
                rows={3}
                value={l8Tailor.tailoredSummary}
                onChange={(e) => setL8Tailor({ ...l8Tailor, tailoredSummary: e.target.value })}
              />
            </div>

            <div className="lvl1-card-box">
              <h3 className="lvl1-card-subtitle">C. 10-Point Quality & Defensibility Audit</h3>
              <p className="lvl1-card-body">All 10 checks must pass before final approval and passport credentialing:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.zeroTypos}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, zeroTypos: e.target.checked } })}
                  />
                  <span>1. Zero spelling & grammar typos</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.verifiedDates}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, verifiedDates: e.target.checked } })}
                  />
                  <span>2. Verified academic dates & marks</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.activeLinks}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, activeLinks: e.target.checked } })}
                  />
                  <span>3. Active GitHub/portfolio links</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.noSensitiveData}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, noSensitiveData: e.target.checked } })}
                  />
                  <span>4. No Aadhaar/marital/caste data</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.singleColumnAts}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, singleColumnAts: e.target.checked } })}
                  />
                  <span>5. Clean single-column ATS layout</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.noSkillBars}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, noSkillBars: e.target.checked } })}
                  />
                  <span>6. No arbitrary skill bars or stars</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.actionVerbsUsed}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, actionVerbsUsed: e.target.checked } })}
                  />
                  <span>7. Strong past-tense action verbs</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.metricsExplainable}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, metricsExplainable: e.target.checked } })}
                  />
                  <span>8. All numbers & metrics justifiable</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.reverseChronology}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, reverseChronology: e.target.checked } })}
                  />
                  <span>9. Reverse-chronological sequence</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={l8Tailor.auditChecklist.interviewDefensible}
                    onChange={(e) => setL8Tailor({ ...l8Tailor, auditChecklist: { ...l8Tailor.auditChecklist, interviewDefensible: e.target.checked } })}
                  />
                  <span>10. 100% interview defensible</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="lvl1-bottom-bar">
          <button
            className="lvl1-primary-btn"
            onClick={() => {
              sound.playTap();
              markStepDone(5);
              setCurrentStage('submission');
            }}
          >
            Review & Prepare Evidence Document ➔
          </button>
        </div>
      </div>
    );
  };

  // 7. SUBMISSION (Step 6)
  const renderSubmission = () => {
    return (
      <div className="lvl1-stage-view lvl1-submission-view">
        <div className="lvl1-view-header">
          <span className="lvl1-badge-kicker">STEP 06 OF 06 · EVIDENCE SUBMISSION</span>
          <h2 className="lvl1-view-title">Submit {lesson.primaryEvidence}</h2>
          <p className="lvl1-view-subtitle">Upload your verified reflection document for human evaluation.</p>
        </div>

        {/* Document Status Card */}
        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="ticket" size={18} /> Worksheet Document Status
          </h3>
          {uploadedFile ? (
            <div className="lvl1-uploaded-file-banner">
              <div className="lvl1-file-icon-box">
                <Icon name="ticket" size={24} />
              </div>
              <div className="lvl1-file-info-col">
                <strong className="lvl1-file-name">{uploadedFile.name}</strong>
                <span className="lvl1-file-meta">{uploadedFile.size} · {uploadedFile.type} · Ready for evaluation</span>
              </div>
              <button
                className="lvl1-file-remove-btn"
                onClick={() => setUploadedFile(null)}
                aria-label="Remove document"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="lvl1-upload-empty-box">
              <p>No document attached yet. You can auto-generate from your worksheet or attach an external PDF/Image.</p>
              <div className="lvl1-upload-actions-row">
                <button className="lvl1-outline-btn" onClick={handleUploadSamplePDF}>
                  <Icon name="ticket" size={16} /> Auto-Generate from Worksheet
                </button>
                <label className="lvl1-primary-btn lvl1-file-picker-label">
                  <span style={{ marginRight: 6 }}>↑</span> Browse PDF/Image
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Human Review Rubric Preview */}
        <div className="lvl1-card-box">
          <h3 className="lvl1-card-subtitle">
            <Icon name="star" size={18} /> Evaluation Rubric Preview (Score: 10 pts · Pass: 6/10)
          </h3>
          <ul className="lvl1-bullet-list">
            {lesson.rubric.criteria.map((c, idx) => (
              <li key={idx}>
                <strong>{c.name}:</strong> {c.score2}
              </li>
            ))}
          </ul>
        </div>

        {/* Declaration */}
        <div className="lvl1-card-box">
          <label className="lvl1-checkbox-label">
            <input
              type="checkbox"
              checked={confirmCertified}
              onChange={(e) => setConfirmCertified(e.target.checked)}
            />
            <span>
              <strong>Declaration / ಘೋಷಣೆ:</strong> These answers and evidence reflect my genuine experiences. I understand AERS evaluates submissions with human verification before progression.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="lvl1-bottom-bar">
          <button
            className="lvl1-primary-btn lvl1-submit-btn"
            disabled={!uploadedFile || !confirmCertified || isSubmitting}
            onClick={handleSubmitEvidence}
          >
            {isSubmitting ? 'Submitting to Evaluation Queue...' : `Submit Level ${lesson.numberStr} for Review ➔`}
          </button>
        </div>
      </div>
    );
  };

  // 8. EVAL PENDING (Under Review)
  const renderEvalPending = () => {
    return (
      <div className="lvl1-stage-view lvl1-status-view">
        <div className="lvl1-status-banner-card is-pending">
          <div className="lvl1-status-badge-icon">⏳</div>
          <h2 className="lvl1-status-title">Evidence Under Review</h2>
          <span className="lvl1-status-pill lvl1-status-pill--pending">Status: Under Review</span>
          <p className="lvl1-status-desc">
            Your {lesson.primaryEvidence} has been received and queued for evaluation by an authorized AERS reviewer.
          </p>
          <div className="lvl1-receipt-box">
            <div>Submission ID: AERS-M{levelId <= 4 ? 1 : 2}-L0{levelId}-78421</div>
            <div>Reviewed Threshold: Rubric Score ≥ 6/10 required</div>
            <div>Estimated Review Window: 24–48 Hours</div>
          </div>
        </div>

        {/* Reviewer Simulation Toolbar (For Demo & Verification) */}
        <div className="lvl1-card-box lvl1-demo-eval-box">
          <h3 className="lvl1-card-subtitle">Facilitator Verification Panel</h3>
          <p className="lvl1-card-body">
            Simulate human reviewer action to test the complete progression workflow:
          </p>
          <div className="lvl1-eval-actions-row">
            <button className="lvl1-primary-btn" onClick={handleApproveLevel}>
              ✓ Approve Submission (Score: 8/10)
            </button>
            <button
              className="lvl1-outline-btn"
              onClick={() => {
                sound.playLocked();
                setCurrentStage('eval_revision');
              }}
            >
              Request Revision
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 9. EVAL REVISION
  const renderEvalRevision = () => {
    return (
      <div className="lvl1-stage-view lvl1-status-view">
        <div className="lvl1-status-banner-card is-revision">
          <div className="lvl1-status-badge-icon">✍️</div>
          <h2 className="lvl1-status-title">Revision Required</h2>
          <span className="lvl1-status-pill lvl1-status-pill--revision">Score: 5/10</span>
          <div className="lvl1-feedback-quote">
            <p>
              “Your submission shows good reflection. However, please add more specific measurable outcomes in your actions and clarify your 7-day investigation timeline.”
            </p>
          </div>
          <button
            className="lvl1-primary-btn"
            onClick={() => {
              sound.playTap();
              setCurrentStage('activity');
            }}
          >
            Open Worksheet to Revise & Resubmit ➔
          </button>
        </div>
      </div>
    );
  };

  // 10. EVAL APPROVED
  const renderEvalApproved = () => {
    return (
      <div className="lvl1-stage-view lvl1-status-view">
        <div className="lvl1-status-banner-card is-approved">
          <div className="lvl1-status-badge-icon">🎖️</div>
          <h2 className="lvl1-status-title">Level {lesson.numberStr} Verified & Approved!</h2>
          <span className="lvl1-status-pill lvl1-status-pill--approved">Rubric Score: 8/10 · APPROVED</span>
          <p className="lvl1-status-desc">
            Congratulations! Your {lesson.primaryEvidence} has been reviewed and approved by your AERS Facilitator.
          </p>

          <div className="lvl1-award-card">
            <div className="lvl1-award-star">★★★</div>
            <strong>+ {lesson.xpReward} XP Earned</strong>
            <span>Module 0{levelId <= 4 ? 1 : 2} Competency Verified</span>
          </div>

          <button className="lvl1-primary-btn lvl1-continue-btn" onClick={handleContinueNextLevel}>
            {levelId < 8 ? `Unlock & Continue to Level 0${levelId + 1} ➔` : 'Complete Module 02 & Return to Journey ➔'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="lvl1-screen-container">
      {/* Top Header */}
      <header className="lvl1-top-nav">
        <div className="lvl1-top-nav__main">
          <button
            className="lvl1-nav-back-btn"
            onClick={() => {
              sound.playTap();
              if (currentStage === 'overview') navigate('/journey');
              else setCurrentStage('overview');
            }}
            aria-label="Back"
          >
            ←
          </button>
          <div className="lvl1-nav-titles">
            <span className="lvl1-nav-kicker">
              LEVEL {lesson.numberStr} OF 24 · MODULE 0{levelId <= 4 ? 1 : 2}: {levelId <= 4 ? 'CAREER CLARITY' : 'RÉSUMÉ READINESS'}
            </span>
            <h1 className="lvl1-nav-title">{lesson.title}</h1>
          </div>
          <div className="lvl1-nav-actions">
            <span className="lang-badge-pill">{language.toUpperCase()}</span>
          </div>
        </div>

        {/* Module Switcher Pills (Module 1 vs Module 2) */}
        <div style={{ display: 'flex', gap: '8px', padding: '6px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <button
            className={`lvl1-outline-btn ${levelId <= 4 ? 'is-active' : ''}`}
            style={{ fontSize: '11px', padding: '4px 10px', height: 'auto', background: levelId <= 4 ? '#0066f5' : '#ffffff', color: levelId <= 4 ? '#ffffff' : '#475569', borderColor: levelId <= 4 ? '#0066f5' : '#cbd5e1' }}
            onClick={() => {
              sound.playTap();
              navigate('/journey/level/1');
            }}
          >
            Module 1: Career Clarity (L01–04)
          </button>
          <button
            className={`lvl1-outline-btn ${levelId >= 5 ? 'is-active' : ''}`}
            style={{ fontSize: '11px', padding: '4px 10px', height: 'auto', background: levelId >= 5 ? '#0066f5' : '#ffffff', color: levelId >= 5 ? '#ffffff' : '#475569', borderColor: levelId >= 5 ? '#0066f5' : '#cbd5e1' }}
            onClick={() => {
              sound.playTap();
              navigate('/journey/level/5');
            }}
          >
            Module 2: Résumé Readiness (L05–08)
          </button>
        </div>

        {/* Level Quick Switcher Strip */}
        <div className="lvl1-module-levels-strip" role="tablist" aria-label="Module Lessons">
          {(levelId <= 4
            ? [
                { id: 1, label: 'Discovering Myself' },
                { id: 2, label: 'Strengths-to-Career' },
                { id: 3, label: 'Role Exploration' },
                { id: 4, label: 'Career Action Plan' },
              ]
            : [
                { id: 5, label: 'Purpose of Résumé' },
                { id: 6, label: 'Writing Strong Content' },
                { id: 7, label: 'Skills & Projects' },
                { id: 8, label: 'Tailoring & Review' },
              ]
          ).map((item) => (
            <button
              key={item.id}
              className={`lvl1-level-tab-chip ${levelId === item.id ? 'is-active' : ''}`}
              onClick={() => {
                sound.playTap();
                navigate(`/journey/level/${item.id}`);
              }}
              role="tab"
              aria-selected={levelId === item.id}
            >
              <span className="lvl1-level-tab-num">L{item.id.toString().padStart(2, '0')}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* 6-Step Segmented Progress Bar */}
        <div className="lvl1-nav-segments" aria-label="Progress across 6 milestones">
          {[1, 2, 3, 4, 5, 6].map((step) => {
            const isDone = completedSteps.includes(step);
            const isCurrent = currentStepNum === step;
            return (
              <div
                key={step}
                className={`lvl1-nav-segment ${isDone ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''}`}
                title={`Step ${step}: ${isDone ? 'Done' : isCurrent ? 'Active' : 'Pending'}`}
              />
            );
          })}
        </div>

        {/* 6-Stage Horizontal Navigation Tabs */}
        <nav className="lvl1-stage-tabs-scroll" aria-label="Lesson Stages">
          {[
            { id: 'overview' as LessonStage, label: 'Overview', icon: '📋' },
            { id: 'objectives' as LessonStage, label: 'Objectives', icon: '🎯' },
            { id: 'notes' as LessonStage, label: 'Notes', icon: '📖' },
            { id: 'video' as LessonStage, label: 'Video', icon: '🎬' },
            { id: 'quiz' as LessonStage, label: 'Quiz', icon: '⚡' },
            { id: 'activity' as LessonStage, label: 'Worksheet', icon: '✍️' },
            { id: 'submission' as LessonStage, label: 'Evidence & Eval', icon: '📤' },
          ].map((tab) => {
            const isActive =
              currentStage === tab.id ||
              (tab.id === 'submission' &&
                ['eval_pending', 'eval_revision', 'eval_approved'].includes(currentStage));
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  if (isActive && el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }
                }}
                className={`lvl1-stage-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  sound.playTap();
                  setCurrentStage(tab.id);
                }}
              >
                <span className="lvl1-stage-tab-icon">{tab.icon}</span>
                <span className="lvl1-stage-tab-text">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="lvl1-main-scroll">
        {currentStage === 'overview' && renderOverview()}
        {currentStage === 'objectives' && renderObjectives()}
        {currentStage === 'notes' && renderNotes()}
        {currentStage === 'video' && renderVideo()}
        {currentStage === 'quiz' && renderQuiz()}
        {currentStage === 'activity' && renderActivity()}
        {currentStage === 'submission' && renderSubmission()}
        {currentStage === 'eval_pending' && renderEvalPending()}
        {currentStage === 'eval_revision' && renderEvalRevision()}
        {currentStage === 'eval_approved' && renderEvalApproved()}
      </main>
    </div>
  );
}
