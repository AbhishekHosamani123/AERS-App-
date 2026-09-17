/**
 * AERS TRANSFORM — MODULE 1: CAREER CLARITY AND SELF DISCOVERY
 * Official Bilingual Content Master v2.0
 * Extracted directly from AERS_Transform_Module_1_Career_Clarity_Content_Master_v2.0.pdf
 */

export interface QuizQuestionItem {
  id: number;
  questionEn: string;
  questionKn: string;
  optionsEn: string[];
  optionsKn: string[];
  correctIndex: number;
  explanationEn: string;
  explanationKn: string;
}

export interface VideoScriptSection {
  step: number;
  titleEn: string;
  titleKn: string;
  duration: string;
  scriptEn: string;
  scriptKn: string;
}

export interface RubricCriterion {
  name: string;
  score0: string;
  score1: string;
  score2: string;
}

export interface LessonData {
  id: number;
  numberStr: string;
  title: string;
  subtitle: string;
  primaryEvidence: string;
  tagline: string;
  xpReward: number;
  durationMin: number;
  framework: string;

  specification: {
    purpose: string;
    outcomes: string[];
    primaryOutput: string;
    deliveryMix: string;
    estimatedTime: string;
    eriContribution: string;
    lockedRules: {
      video: string;
      note: string;
      quiz: string;
      worksheet: string;
      humanReview: string;
      closure: string;
    };
  };

  notes: {
    titleEn: string;
    titleKn: string;
    introEn: string;
    introKn: string;
    sectionsEn: { heading: string; body: string; bulletList?: string[] }[];
    sectionsKn: { heading: string; body: string; bulletList?: string[] }[];
    goldenQuoteEn: string;
    goldenQuoteKn: string;
    formulaEn: string;
    formulaKn: string;
  };

  video: {
    targetDuration: string;
    sections: VideoScriptSection[];
    keyTakeawaysEn: string[];
    keyTakeawaysKn: string[];
  };

  quiz: {
    config: {
      totalBank: number;
      drawCount: number;
      passPercent: number;
      maxAttempts: number;
    };
    questions: QuizQuestionItem[];
  };

  rubric: {
    maxScore: number;
    threshold: number;
    criteria: RubricCriterion[];
    feedbackSentenceFrame: string;
  };

  guidedSession: {
    duration: string;
    agenda: { time: string; facilitatorAction: string; learnerOutput: string }[];
    guardrails: string[];
    closingCommitmentTemplate: string;
  };
}

export const MODULE_1_LESSONS: Record<number, LessonData> = {
  // =========================================================================
  // LESSON 1: Discovering Myself
  // =========================================================================
  1: {
    id: 1,
    numberStr: '01',
    title: 'Discovering Myself',
    subtitle: 'Confidence Begins with Self-Awareness',
    primaryEvidence: 'Initial Self-Awareness Profile',
    tagline: 'Understand your true strengths and blind spots using verifiable proof.',
    xpReward: 150,
    durationMin: 60,
    framework: 'Situation → Action → Result → Learning',

    specification: {
      purpose: 'Help learners identify qualities, abilities, interests, behaviour patterns and improvement areas using evidence.',
      outcomes: [
        'Explain self-awareness clearly without generic cliches',
        'Identify evidence-backed strengths and honest improvement areas',
        'Cite specific proof from projects, academics, sports or life experiences',
        'Seek constructive feedback from teachers, mentors or peers',
        'Commit to one specific, measurable action habit within 7 days',
      ],
      primaryOutput: 'Initial Self-Awareness Profile — completed bilingual worksheet.',
      deliveryMix: 'Platform self-learning (45–60 mins) + 30-minute guided review session.',
      estimatedTime: '45–60 minutes platform work; 30-minute guided review session.',
      eriContribution: 'Career clarity, self-awareness, communication confidence and improvement ownership.',
      lockedRules: {
        video: 'At least 90% watched.',
        note: 'Opened and read by learner.',
        quiz: '5 random questions; 60% pass mark; maximum 2 attempts; no negative marking.',
        worksheet: 'Submitted as digital form, PDF or clear image upload.',
        humanReview: 'Rubric score at least 6/10 by authorized AERS reviewer.',
        closure: 'Learner acknowledges reviewer feedback and confirms commitment.',
      },
    },

    notes: {
      titleEn: 'Discovering Myself — Confidence Begins with Self-Awareness',
      titleKn: 'ನನ್ನನ್ನು ನಾನು ಅರಿತುಕೊಳ್ಳುವುದು — ಆತ್ಮವಿಶ್ವಾಸ ಸ್ವ-ಅರಿವಿನಿಂದ ಆರಂಭ',
      introEn:
        'Self-awareness is the ability to understand your qualities, abilities, interests, behaviour and areas for improvement. It is the starting point of career readiness because good choices require an honest understanding of yourself.',
      introKn:
        'ಸ್ವ-ಅರಿವು ಎಂದರೆ ನಮ್ಮ ಗುಣಗಳು, ಸಾಮರ್ಥ್ಯಗಳು, ಆಸಕ್ತಿಗಳು, ವರ್ತನೆ ಮತ್ತು ಸುಧಾರಿಸಬೇಕಾದ ಕ್ಷೇತ್ರಗಳನ್ನು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ಸಾಮರ್ಥ್ಯ. ಉತ್ತಮ ವೃತ್ತಿ ಆಯ್ಕೆಗಳು ನಮ್ಮ ಬಗ್ಗೆ ನಮಗೆ ಇರುವ ಸ್ಪಷ್ಟತೆಯಿಂದ ಆರಂಭವಾಗುತ್ತವೆ.',
      sectionsEn: [
        {
          heading: 'Assumption is not evidence',
          body: 'Statements such as “I am confident” or “I am hardworking” become meaningful only when you can describe the situation, your action, the result and the feedback received.',
        },
        {
          heading: 'Five core reflection prompts',
          body: 'When reflecting on your profile, always answer these five essential questions with proof:',
          bulletList: [
            'Strength: What do I do well? When have I demonstrated it?',
            'Interest: Which activities hold my attention, curiosity and energy?',
            'Challenge: What repeatedly feels difficult or frustrating, and why?',
            'Feedback: What do teachers, mentors, friends or family consistently notice?',
            'Improvement: Which one skill or behaviour will I actively work on now?',
          ],
        },
        {
          heading: 'Use experiences as proof',
          body: 'Evidence does not require formal employment. It can come from academic projects, presentations, internships, volunteering, sports, part-time work, family responsibilities or a difficult challenge you handled.',
        },
        {
          heading: 'Your first weekly commitment',
          body: 'Choose one improvement area, explain why it matters for your career and name one small action you will complete this week. Real confidence grows from self-knowledge, evidence and repeated improvement.',
        },
      ],
      sectionsKn: [
        {
          heading: 'ಊಹೆ ಸಾಕಾಗುವುದಿಲ್ಲ — ಸಾಕ್ಷ್ಯ ಬೇಕು',
          body: '“ನಾನು ಆತ್ಮವಿಶ್ವಾಸಿ” ಅಥವಾ “ನಾನು ಪರಿಶ್ರಮಿ” ಎನ್ನುವುದು ಆರಂಭ ಮಾತ್ರ. ಅದು ಯಾವ ಸಂದರ್ಭದಲ್ಲಿತ್ತು, ನೀವು ಏನು ಮಾಡಿದ್ದೀರಿ, ಫಲಿತಾಂಶ ಏನು ಮತ್ತು ಇತರರು ಏನು ಪ್ರತಿಕ್ರಿಯೆ ನೀಡಿದರು ಎಂಬುದನ್ನು ವಿವರಿಸಿದಾಗ ಅದು ಸಾಕ್ಷ್ಯವಾಗುತ್ತದೆ.',
        },
        {
          heading: 'ಐದು ಚಿಂತನೆ ಮತ್ತು ಸಾಕ್ಷ್ಯದ ಪ್ರಶ್ನೆಗಳು',
          body: 'ನಿಮ್ಮ ವಿವರಣೆ ಸಿದ್ಧಪಡಿಸುವಾಗ ಈ ಐದು ಪ್ರಮುಖ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ:',
          bulletList: [
            'ಸಾಮರ್ಥ್ಯ: ನಾನು ಯಾವ ಕೆಲಸವನ್ನು ಚೆನ್ನಾಗಿ ಮಾಡುತ್ತೇನೆ? ಅದನ್ನು ಯಾವಾಗ ತೋರಿಸಿದ್ದೇನೆ?',
            'ಆಸಕ್ತಿ: ಯಾವ ಚಟುವಟಿಕೆಗಳು ನನಗೆ ಉತ್ಸಾಹ ನೀಡುತ್ತವೆ?',
            'ಸವಾಲು: ಯಾವ ಕೆಲಸಗಳು ಮರುಮರು ಕಷ್ಟವಾಗುತ್ತವೆ?',
            'ಪ್ರತಿಕ್ರಿಯೆ: ಶಿಕ್ಷಕರು, ಸ್ನೇಹಿತರು ಅಥವಾ ಕುಟುಂಬದವರು ನನ್ನ ಬಗ್ಗೆ ಏನು ಹೇಳುತ್ತಾರೆ?',
            'ಸುಧಾರಣೆ: ಈಗ ನಾನು ಯಾವ ಒಂದು ಕೌಶಲ್ಯ ಅಥವಾ ವರ್ತನೆಯನ್ನು ಸುಧಾರಿಸುತ್ತೇನೆ?',
          ],
        },
        {
          heading: 'ಅನುಭವವೇ ಸಾಕ್ಷ್ಯ',
          body: 'ಪ್ರಾಜೆಕ್ಟ್, ಪ್ರಸ್ತುತಿ, ಇಂಟರ್ನ್‌ಶಿಪ್, ಸ್ವಯಂಸೇವೆ, ಕ್ರೀಡೆ, ಅರೆಕಾಲಿಕ ಕೆಲಸ, ಕುಟುಂಬದ ಹೊಣೆಗಾರಿಕೆ ಅಥವಾ ನೀವು ಎದುರಿಸಿದ ಸವಾಲಿನಿಂದ ಸಾಕ್ಷ್ಯ ಪಡೆಯಬಹುದು.',
        },
        {
          heading: 'ನಿಮ್ಮ ಮೊದಲ ಬದ್ಧತೆ',
          body: 'ಒಂದು ಸುಧಾರಣಾ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. ಅದು ನಿಮ್ಮ ವೃತ್ತಿಗೆ ಏಕೆ ಮುಖ್ಯ ಮತ್ತು ಈ ವಾರ ನೀವು ತೆಗೆದುಕೊಳ್ಳುವ ಒಂದು ಸಣ್ಣ ಕ್ರಮ ಯಾವುದು ಎಂದು ಬರೆಯಿರಿ. ನಿಜವಾದ ಆತ್ಮವಿಶ್ವಾಸ ಸ್ವ-ಅರಿವು, ಸಾಕ್ಷ್ಯ ಮತ್ತು ನಿರಂತರ ಸುಧಾರಣೆಯಿಂದ ಬೆಳೆಯುತ್ತದೆ.',
        },
      ],
      goldenQuoteEn: 'Real confidence grows from self-knowledge, evidence and repeated improvement.',
      goldenQuoteKn: 'ನಿಜವಾದ ಆತ್ಮವಿಶ್ವಾಸ ಸ್ವ-ಅರಿವು, ಸಾಕ್ಷ್ಯ ಮತ್ತು ನಿರಂತರ ಸುಧಾರಣೆಯಿಂದ ಬೆಳೆಯುತ್ತದೆ.',
      formulaEn: 'Situation → Action → Result → Learning',
      formulaKn: 'ಸಂದರ್ಭ → ಕ್ರಮ → ಫಲಿತಾಂಶ → ಕಲಿಕೆ',
    },

    video: {
      targetDuration: '6–7 minutes',
      sections: [
        {
          step: 1,
          titleEn: '1 · Opening',
          titleKn: '1 · ಆರಂಭ',
          duration: '0:45',
          scriptEn:
            'Welcome to AERS Transform. Before preparing a résumé, attending an interview or choosing a career direction, you must first understand yourself. Without self-awareness, students often copy someone else’s goal or describe themselves using words they cannot prove.',
          scriptKn:
            'AERS Transform ಗೆ ಸ್ವಾಗತ. ರೆಸ್ಯೂಮ್ ಸಿದ್ಧಪಡಿಸುವ ಮೊದಲು, ಸಂದರ್ಶನಕ್ಕೆ ಹೋಗುವ ಮೊದಲು ಅಥವಾ ವೃತ್ತಿ ದಿಕ್ಕನ್ನು ಆಯ್ಕೆ ಮಾಡುವ ಮೊದಲು, ನಮ್ಮನ್ನು ನಾವು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಬೇಕು. ಸ್ವ-ಅರಿವು ಇಲ್ಲದಿದ್ದರೆ ನಾವು ಇತರರ ಗುರಿಯನ್ನು ನಕಲಿಸಬಹುದು ಅಥವಾ ಸಾಕ್ಷ್ಯವಿಲ್ಲದ ಪದಗಳಿಂದ ನಮ್ಮನ್ನು ವಿವರಿಸಬಹುದು.',
        },
        {
          step: 2,
          titleEn: '2 · What self-awareness means',
          titleKn: '2 · ಸ್ವ-ಅರಿವು ಎಂದರೇನು?',
          duration: '0:50',
          scriptEn:
            'Self-awareness means understanding your qualities, abilities, interests, behaviour and improvement areas. Ask: What do I enjoy? What do I do well? What do I avoid? What feedback do I receive repeatedly? What would I like to improve?',
          scriptKn:
            'ಸ್ವ-ಅರಿವು ಎಂದರೆ ನಮ್ಮ ಗುಣಗಳು, ಸಾಮರ್ಥ್ಯಗಳು, ಆಸಕ್ತಿಗಳು, ವರ್ತನೆ ಮತ್ತು ಸುಧಾರಣಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು. ನನಗೆ ಏನು ಇಷ್ಟ? ನಾನು ಯಾವ ಕೆಲಸ ಚೆನ್ನಾಗಿ ಮಾಡುತ್ತೇನೆ? ಯಾವ ಕೆಲಸ ತಪ್ಪಿಸುತ್ತೇನೆ? ನನಗೆ ಮರುಮರು ಯಾವ ಪ್ರತಿಕ್ರಿಯೆ ಬರುತ್ತದೆ? ಎಂದು ಕೇಳಿಕೊಳ್ಳಿ.',
        },
        {
          step: 3,
          titleEn: '3 · Assumption versus evidence',
          titleKn: '3 · ಊಹೆ ಮತ್ತು ಸಾಕ್ಷ್ಯ',
          duration: '1:00',
          scriptEn:
            '“I am confident,” “I am hardworking,” and “I am a good communicator” are assumptions until they are supported. Ask when you demonstrated the quality, what the situation was, what you did, what result followed and what feedback you received.',
          scriptKn:
            '“ನಾನು ಆತ್ಮವಿಶ್ವಾಸಿ”, “ನಾನು ಪರಿಶ್ರಮಿ”, “ನಾನು ಉತ್ತಮ ಸಂವಹನಕಾರ” ಎನ್ನುವುದು ಸಾಕ್ಷ್ಯವಿಲ್ಲದೆ ಊಹೆ ಮಾತ್ರ. ಯಾವ ಸಂದರ್ಭ, ನೀವು ಮಾಡಿದ ಕ್ರಮ, ಫಲಿತಾಂಶ ಮತ್ತು ಪಡೆದ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ವಿವರಿಸಿ.',
        },
        {
          step: 4,
          titleEn: '4 · Strengths and improvement areas',
          titleKn: '4 · ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಸುಧಾರಣಾ ಕ್ಷೇತ್ರ',
          duration: '0:55',
          scriptEn:
            'A strength is a useful pattern you can demonstrate consistently. An improvement area is not a weakness to hide; it is a skill or behaviour you can develop. Honest language creates a practical starting point.',
          scriptKn:
            'ಸಾಮರ್ಥ್ಯ ಎಂದರೆ ನೀವು ನಿರಂತರವಾಗಿ ತೋರಿಸಬಹುದಾದ ಉಪಯುಕ್ತ ಗುಣ ಅಥವಾ ಕೌಶಲ್ಯ. ಸುಧಾರಣಾ ಕ್ಷೇತ್ರವು ಮರೆಮಾಡಬೇಕಾದ ದುರ್ಬಲತೆ ಅಲ್ಲ; ಬೆಳೆಸಬಹುದಾದ ಕೌಶಲ್ಯ ಅಥವಾ ವರ್ತನೆ.',
        },
        {
          step: 5,
          titleEn: '5 · Learn from experience',
          titleKn: '5 · ಅನುಭವದಿಂದ ಕಲಿಯಿರಿ',
          duration: '0:50',
          scriptEn:
            'Look at projects, presentations, internships, volunteering, sports, part-time work, family responsibilities and challenges. Use the sequence Situation, Action, Result and Learning to turn experience into evidence.',
          scriptKn:
            'ಪ್ರಾಜೆಕ್ಟ್, ಪ್ರಸ್ತುತಿ, ಇಂಟರ್ನ್‌ಶಿಪ್, ಸ್ವಯಂಸೇವೆ, ಕ್ರೀಡೆ, ಅರೆಕಾಲಿಕ ಕೆಲಸ, ಕುಟುಂಬದ ಹೊಣೆಗಾರಿಕೆ ಮತ್ತು ಸವಾಲುಗಳನ್ನು ನೆನಪಿಸಿಕೊಳ್ಳಿ. ಸಂದರ್ಭ, ಕ್ರಮ, ಫಲಿತಾಂಶ ಮತ್ತು ಕಲಿಕೆ ಕ್ರಮವನ್ನು ಬಳಸಿ.',
        },
        {
          step: 6,
          titleEn: '6 · Use feedback wisely',
          titleKn: '6 · ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಬಳಸಿ',
          duration: '0:45',
          scriptEn:
            'Ask a trusted teacher, friend, mentor or family member what they appreciate in you and what would help you improve. Look for repeated patterns, not one isolated opinion.',
          scriptKn:
            'ನಂಬಿಗಸ್ಥ ಶಿಕ್ಷಕ, ಸ್ನೇಹಿತ, ಮಾರ್ಗದರ್ಶಕ ಅಥವಾ ಕುಟುಂಬದವರನ್ನು ಕೇಳಿ: ನನ್ನಲ್ಲಿ ನೀವು ಮೆಚ್ಚುವುದೇನು? ನಾನು ಏನು ಸುಧಾರಿಸಬೇಕು? ಒಂದೇ ಅಭಿಪ್ರಾಯಕ್ಕಿಂತ ಮರುಮರು ಕಾಣುವ ಮಾದರಿಯನ್ನು ಗಮನಿಸಿ.',
        },
        {
          step: 7,
          titleEn: '7 · Complete the activity',
          titleKn: '7 · ಚಟುವಟಿಕೆ',
          duration: '0:55',
          scriptEn:
            'Open the My Self-Awareness Snapshot. Answer all ten prompts briefly and honestly. Add examples wherever requested. Choose one improvement priority and one action you can complete this week.',
          scriptKn:
            '“My Self-Awareness Snapshot” ತೆರೆಯಿರಿ. ಹತ್ತು ಪ್ರಶ್ನೆಗಳಿಗೆ ಚಿಕ್ಕದಾಗಿ ಮತ್ತು ಪ್ರಾಮಾಣಿಕವಾಗಿ ಉತ್ತರಿಸಿ. ಕೇಳಿದಲ್ಲಿ ಉದಾಹರಣೆ ನೀಡಿ. ಒಂದು ಸುಧಾರಣಾ ಆದ್ಯತೆ ಮತ್ತು ಈ ವಾರದ ಒಂದು ಕ್ರಮ ಆಯ್ಕೆ ಮಾಡಿ.',
        },
        {
          step: 8,
          titleEn: '8 · Closing',
          titleKn: '8 · ಸಮಾಪ್ತಿ',
          duration: '0:40',
          scriptEn:
            'Real confidence is not pretending to know everything. It is knowing yourself, showing evidence and being willing to improve. Submit your snapshot for review. In the next lesson, you will connect this self-awareness to career direction.',
          scriptKn:
            'ನಿಜವಾದ ಆತ್ಮವಿಶ್ವಾಸ ಎಂದರೆ ಎಲ್ಲವೂ ಗೊತ್ತಿರುವಂತೆ ನಟಿಸುವುದಲ್ಲ. ನಮ್ಮನ್ನು ನಾವು ಅರಿತುಕೊಳ್ಳುವುದು, ಸಾಕ್ಷ್ಯ ತೋರಿಸುವುದು ಮತ್ತು ಸುಧಾರಿಸಲು ಸಿದ್ಧರಾಗಿರುವುದು. ನಿಮ್ಮ ಉತ್ತರಗಳನ್ನು ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ.',
        },
      ],
      keyTakeawaysEn: [
        'Replace abstract adjectives with concrete situations, actions, and results.',
        'An improvement area is an opportunity for targeted growth, not a personal flaw.',
        'Feedback patterns from multiple people reveal true blind spots.',
        'A single 7-day action builds more credibility than 10 wishful intentions.',
      ],
      keyTakeawaysKn: [
        'ಅಸ್ಪಷ್ಟ ವಿಶೇಷಣಗಳ ಬದಲಿಗೆ ಸ್ಪಷ್ಟ ಸಂದರ್ಭ, ಕ್ರಮ ಮತ್ತು ಫಲಿತಾಂಶ ನೀಡಿ.',
        'ಸುಧಾರಣಾ ಕ್ಷೇತ್ರವು ಬೆಳೆಸಬಹುದಾದ ಅವಕಾಶವೇ ಹೊರತು ದೌರ್ಬಲ್ಯವಲ್ಲ.',
        'ಹಲವರ ಪ್ರತಿಕ್ರಿಯೆಯಲ್ಲಿ ಪುನರಾವರ್ತನೆಯಾಗುವ ಮಾದರಿಯೇ ನೈಜ ಅರಿವು.',
        'ಹತ್ತು ಆಸೆಗಳಿಗಿಂತ ಏಳು ದಿನಗಳ ಒಂದು ಸಣ್ಣ ಕ್ರಮವೇ ಹೆಚ್ಚಿನ ವಿಶ್ವಾಸ ನೀಡುತ್ತದೆ.',
      ],
    },

    quiz: {
      config: {
        totalBank: 10,
        drawCount: 5,
        passPercent: 60,
        maxAttempts: 2,
      },
      questions: [
        {
          id: 1,
          questionEn: 'What is self-awareness?',
          questionKn: 'ಸ್ವ-ಅರಿವು ಎಂದರೇನು?',
          optionsEn: [
            'Believing you have no weaknesses',
            'Copying your classmate’s career goals',
            'Understanding your qualities, abilities, interests, behaviour and improvement areas',
            'Memorising popular interview answers',
          ],
          optionsKn: [
            'ನನಗೆ ಯಾವುದೇ ದೌರ್ಬಲ್ಯವಿಲ್ಲ ಎಂದು ನಂಬುವುದು',
            'ಸಹಪಾಠಿಯ ವೃತ್ತಿ ಗುರಿಯನ್ನು ನಕಲಿಸುವುದು',
            'ಗುಣ, ಸಾಮರ್ಥ್ಯ, ಆಸಕ್ತಿ, ವರ್ತನೆ ಮತ್ತು ಸುಧಾರಣಾ ಕ್ಷೇತ್ರಗಳ ಅರಿವು',
            'ಸಂದರ್ಶನದ ಉತ್ತರಗಳನ್ನು ಬಾಯಿಪಾಠ ಮಾಡುವುದು',
          ],
          correctIndex: 2,
          explanationEn: 'Self-awareness is the honest, evidence-based understanding of your strengths, interests, habits and areas needing development.',
          explanationKn: 'ಸ್ವ-ಅರಿವು ಎಂದರೆ ನಿಮ್ಮ ಸಾಮರ್ಥ್ಯ, ಆಸಕ್ತಿ, ವರ್ತನೆ ಮತ್ತು ಸುಧಾರಿಸಬೇಕಾದ ಕ್ಷೇತ್ರಗಳನ್ನು ಸಾಕ್ಷ್ಯದೊಂದಿಗೆ ಪ್ರಾಮಾಣಿಕವಾಗಿ ಅರಿತುಕೊಳ್ಳುವುದು.',
        },
        {
          id: 2,
          questionEn: 'Which statement provides credible evidence?',
          questionKn: 'ಯಾವುದು ನೈಜ ಸಾಕ್ಷ್ಯವಾಗಿದೆ?',
          optionsEn: [
            '“I am very hardworking and sincere.”',
            '“I coordinated a project team and submitted on time.”',
            '“Everyone knows I am a great speaker.”',
            '“I want to be an exceptional software engineer.”',
          ],
          optionsKn: [
            '“ನಾನು ತುಂಬಾ ಪರಿಶ್ರಮಿ ಮತ್ತು ಪ್ರಾಮಾಣಿಕ.”',
            '“ನಾನು ಪ್ರಾಜೆಕ್ಟ್ ತಂಡವನ್ನು ಸಂಯೋಜಿಸಿ ಸಮಯಕ್ಕೆ ಸಲ್ಲಿಸಿದೆ.”',
            '“ನಾನು ಉತ್ತಮ ಭಾಷಣಕಾರ ಎಂದು ಎಲ್ಲರಿಗೂ ಗೊತ್ತು.”',
            '“ನಾನು ಶ್ರೇಷ್ಠ ಸಾಫ್ಟ್‌ವೇರ್ ಇಂಜಿನಿಯರ್ ಆಗಲು ಬಯಸುತ್ತೇನೆ.”',
          ],
          correctIndex: 1,
          explanationEn: 'Evidence requires a specific action and outcome rather than an unsupported personal adjective.',
          explanationKn: 'ಸಾಕ್ಷ್ಯಕ್ಕೆ ಕೇವಲ ಹೇಳಿಕೆ ಸಾಲದು; ನಿರ್ದಿಷ್ಟ ಕ್ರಮ ಮತ್ತು ಫಲಿತಾಂಶದ ವಿವರಣೆ ಅಗತ್ಯ.',
        },
        {
          id: 3,
          questionEn: 'Which sequence turns personal experience into evidence?',
          questionKn: 'ಅನುಭವವನ್ನು ಸಾಕ್ಷ್ಯವಾಗಿಸುವ ಸರಿಯಾದ ಕ್ರಮ ಯಾವುದು?',
          optionsEn: [
            'Situation → Action → Result → Learning',
            'Assumption → Claim → Opinion → Goal',
            'Degree → Interview → Salary → Promotion',
            'Listening → Speaking → Arguing → Concluding',
          ],
          optionsKn: [
            'ಸಂದರ್ಭ → ಕ್ರಮ → ಫಲಿತಾಂಶ → ಕಲಿಕೆ',
            'ಊಹೆ → ಪ್ರತಿಪಾದನೆ → ಅಭಿಪ್ರಾಯ → ಗುರಿ',
            'ಪದವಿ → ಸಂದರ್ಶನ → ಸಂಬಳ → ಬಡ್ತಿ',
            'ಕೇಳುವುದು → ಮಾತನಾಡುವುದು → ವಾದಿಸುವುದು → ಮುಕ್ತಾಯ',
          ],
          correctIndex: 0,
          explanationEn: 'The STAR/SARL framework (Situation, Action, Result, Learning) grounds your experiences in verifiable proof.',
          explanationKn: 'ಸಂದರ್ಭ, ಕ್ರಮ, ಫಲಿತಾಂಶ ಮತ್ತು ಕಲಿಕೆ ಚೌಕಟ್ಟು ನಿಮ್ಮ ಅನುಭವವನ್ನು ಸಾಕ್ಷ್ಯವಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.',
        },
        {
          id: 4,
          questionEn: 'An improvement area is best understood as…',
          questionKn: 'ಸುಧಾರಣಾ ಕ್ಷೇತ್ರ ಎಂದರೆ…',
          optionsEn: [
            'A permanent personal flaw you must hide',
            'An excuse to avoid technical subjects',
            'Proof that you cannot succeed in corporate roles',
            'A skill or behaviour that can be developed through focused action',
          ],
          optionsKn: [
            'ಮರೆಮಾಡಬೇಕಾದ ಶಾಶ್ವತ ದೌರ್ಬಲ್ಯ',
            'ತಾಂತ್ರಿಕ ವಿಷಯಗಳನ್ನು ತಪ್ಪಿಸಲು ಸಬೂಬು',
            'ನೀವು ಯಶಸ್ವಿಯಾಗಲು ಸಾಧ್ಯವಿಲ್ಲ ಎಂಬುದಕ್ಕೆ ಪುರಾವೆ',
            'ಕೇಂದ್ರೀಕೃತ ಕ್ರಮದ ಮೂಲಕ ಬೆಳೆಸಬಹುದಾದ ಕೌಶಲ್ಯ ಅಥವಾ ವರ್ತನೆ',
          ],
          correctIndex: 3,
          explanationEn: 'Improvement areas are actionable growth targets, not permanent handicaps.',
          explanationKn: 'ಸುಧಾರಣಾ ಕ್ಷೇತ್ರವು ಕಲಿಕೆ ಮತ್ತು ಅಭ್ಯಾಸದ ಮೂಲಕ ಬೆಳೆಸಬಹುದಾದ ಅವಕಾಶವಾಗಿದೆ.',
        },
        {
          id: 5,
          questionEn: 'Useful feedback is best identified by…',
          questionKn: 'ಉಪಯುಕ್ತ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಹೇಗೆ ಗುರುತಿಸಬೇಕು?',
          optionsEn: [
            'Listening only to praise and compliments',
            'Looking for repeated patterns across multiple credible people',
            'Changing your personality after a single negative remark',
            'Ignoring anyone who has not worked in your target company',
          ],
          optionsKn: [
            'ಕೇವಲ ಪ್ರಶಂಸೆಗಳನ್ನು ಮಾತ್ರ ಆಲಿಸುವುದು',
            'ವಿವಿಧ ವ್ಯಕ್ತಿಗಳಿಂದ ಮರುಮರು ಕಾಣುವ ಮಾದರಿಯನ್ನು ಗಮನಿಸುವುದು',
            'ಒಬ್ಬರ ನಕಾರಾತ್ಮಕ ಮಾತಿಗೆ ವ್ಯಕ್ತಿತ್ವವನ್ನೇ ಬದಲಾಯಿಸುವುದು',
            'ನಿಮ್ಮ ಸಂಸ್ಥೆಯಲ್ಲಿ ಕೆಲಸ ಮಾಡದವರನ್ನು ಕಡೆಗಣಿಸುವುದು',
          ],
          correctIndex: 1,
          explanationEn: 'Consistent observations across teachers, peers and mentors pinpoint authentic strengths and blind spots.',
          explanationKn: 'ಹಲವು ಮಾರ್ಗದರ್ಶಕರು ಮತ್ತು ಸಹಪಾಠಿಗಳು ನಿರಂತರವಾಗಿ ಗಮನಿಸುವ ಅಂಶಗಳೇ ನೈಜ ಪ್ರತಿಕ್ರಿಯೆ.',
        },
        {
          id: 6,
          questionEn: 'Which of the following can provide evidence of a strength?',
          questionKn: 'ಸಾಮರ್ಥ್ಯಕ್ಕೆ ಸಾಕ್ಷ್ಯ ಯಾವುದು ನೀಡಬಲ್ಲದು?',
          optionsEn: [
            'A high salary expectation',
            'A company logo saved on your phone',
            'A project, responsibility or difficult challenge handled',
            'A broad wish to lead others',
          ],
          optionsKn: [
            'ಹೆಚ್ಚಿನ ಸಂಬಳದ ನಿರೀಕ್ಷೆ',
            'ಫೋನಿನಲ್ಲಿ ಉಳಿಸಿದ ಕಂಪನಿ ಲೋಗೋ',
            'ನಿರ್ವಹಿಸಿದ ಪ್ರಾಜೆಕ್ಟ್, ಹೊಣೆಗಾರಿಕೆ ಅಥವಾ ಸವಾಲು',
            'ಇತರರನ್ನು ಮುನ್ನಡೆಸಬೇಕೆಂಬ ಕೇವಲ ಆಸೆ',
          ],
          correctIndex: 2,
          explanationEn: 'Handling real tasks, academic responsibilities or organizing events provides verifiable proof of ability.',
          explanationKn: 'ನೈಜ ಪ್ರಾಜೆಕ್ಟ್, ಜವಾಬ್ದಾರಿ ಅಥವಾ ಸವಾಲು ನಿಭಾಯಿಸಿದ ಅನುಭವವೇ ಸಾಮರ್ಥ್ಯಕ್ಕೆ ಸಾಕ್ಷಿ.',
        },
        {
          id: 7,
          questionEn: 'Real career confidence grows from…',
          questionKn: 'ನಿಜವಾದ ಆತ್ಮವಿಶ್ವಾಸ ಬೆಳೆಯುವುದು…',
          optionsEn: [
            'Self-knowledge, evidence and repeated improvement',
            'Pretending to know every topic in an interview',
            'Avoiding any feedback that feels critical',
            'Memorizing company brochures before tests',
          ],
          optionsKn: [
            'ಸ್ವ-ಅರಿವು, ಸಾಕ್ಷ್ಯ ಮತ್ತು ನಿರಂತರ ಸುಧಾರಣೆ',
            'ಸಂದರ್ಶನದಲ್ಲಿ ಎಲ್ಲವೂ ಗೊತ್ತು ಎಂದು ನಟಿಸುವುದು',
            'ಟೀಕೆ ಎನಿಸುವ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ತಪ್ಪಿಸುವುದು',
            'ಪರೀಕ್ಷೆಗೆ ಮುನ್ನ ಕಂಪನಿ ಬ್ರೋಷರ್ ಬಾಯಿಪಾಠ ಮಾಡುವುದು',
          ],
          correctIndex: 0,
          explanationEn: 'Authentic confidence comes from knowing your facts, demonstrating proof, and maintaining a growth mindset.',
          explanationKn: 'ಸ್ವಯಂ ತಿಳುವಳಿಕೆ, ನೈಜ ಸಾಕ್ಷ್ಯ ಮತ್ತು ಸತತ ಸುಧಾರಣೆಗಳಿಂದಲೇ ನಿಜವಾದ ಆತ್ಮವಿಶ್ವಾಸ ಮೂಡುತ್ತದೆ.',
        },
        {
          id: 8,
          questionEn: 'What should a weekly improvement action be?',
          questionKn: 'ವಾರದ ಸುಧಾರಣಾ ಕ್ರಮ ಹೇಗಿರಬೇಕು?',
          optionsEn: [
            'Vague and open-ended without a deadline',
            'Extremely ambitious like learning 5 languages in 7 days',
            'Something you assign to another classmate',
            'Specific, achievable and measurable within seven days',
          ],
          optionsKn: [
            'ಗಡುವಿಲ್ಲದ ಅಸ್ಪಷ್ಟ ಗುರಿ',
            'ಏಳು ದಿನಗಳಲ್ಲಿ ಐದು ಭಾಷೆ ಕಲಿಯುವಂತಹ ಅಸಾಧ್ಯ ಗುರಿ',
            'ಇನ್ನೊಬ್ಬ ಸಹಪಾಠಿಗೆ ವಹಿಸುವ ಕೆಲಸ',
            'ಸ್ಪಷ್ಟ, ನಿರ್ದಿಷ್ಟ ಮತ್ತು ಏಳು ದಿನಗಳಲ್ಲಿ ಸಾಧಿಸಬಹುದಾದದ್ದು',
          ],
          correctIndex: 3,
          explanationEn: 'Weekly actions must be bite-sized, practical, and produce a verifiable outcome within 7 days.',
          explanationKn: 'ವಾರದ ಕ್ರಮವು ಸ್ಪಷ್ಟವಾಗಿದ್ದು, ಏಳು ದಿನಗಳೊಳಗೆ ಪೂರ್ಣಗೊಳಿಸಬಹುದಾದಂತಿರಬೇಕು.',
        },
        {
          id: 9,
          questionEn: 'Why should learners ask others for feedback?',
          questionKn: 'ಇತರರ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಏಕೆ ಕೇಳಬೇಕು?',
          optionsEn: [
            'To feel bad about oneself',
            'To discover behavioural patterns and blind spots we may not notice',
            'To let others make career choices on our behalf',
            'Because recruiters require letters from friends',
          ],
          optionsKn: [
            'ನಮ್ಮ ಬಗ್ಗೆ ಕೀಳರಿಮೆ ಬೆಳೆಸಿಕೊಳ್ಳಲು',
            'ನಮಗೆ ಕಾಣದ ವರ್ತನೆ ಮತ್ತು ಅಂಧಕ್ಷೇತ್ರಗಳನ್ನು ತಿಳಿಯಲು',
            'ಇತರರೇ ನಮ್ಮ ವೃತ್ತಿ ನಿರ್ಧರಿಸಲು ಬಿಡಲು',
            'ಸಂದರ್ಶಕರು ಸ್ನೇಹಿತರ ಪತ್ರ ಕೇಳುವುದರಿಂದ',
          ],
          correctIndex: 1,
          explanationEn: 'Outside perspectives help identify strengths we take for granted and blind spots we overlook.',
          explanationKn: 'ಇತರರ ದೃಷ್ಟಿಕೋನವು ನಮ್ಮ ಕಣ್ಣಿಗೆ ಕಾಣದ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಸುಧಾರಣಾ ಅಂಶಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.',
        },
        {
          id: 10,
          questionEn: 'What is the primary evidence output for Lesson 1?',
          questionKn: 'ಪಾಠ 1ರ ಪ್ರಮುಖ ಸಾಕ್ಷ್ಯ ಫಲಿತಾಂಶ ಯಾವುದು?',
          optionsEn: [
            'Final Placement Offer Letter',
            'Completed Initial Self-Awareness Profile',
            'A 10-page research thesis',
            'A recorded mock HR interview video',
          ],
          optionsKn: [
            'ಅಂತಿಮ ನೇಮಕಾತಿ ಪತ್ರ',
            'ಪೂರ್ಣಗೊಂಡ ಪ್ರಾರಂಭಿಕ ಸ್ವ-ಅರಿವು ಪ್ರೊಫೈಲ್',
            'ಹತ್ತು ಪುಟಗಳ ಸಂಶೋಧನಾ ಪ್ರಬಂಧ',
            'ರೆಕಾರ್ಡ್ ಮಾಡಿದ ಮಾಕ್ ಇಂಟರ್ವ್ಯೂ ವಿಡಿಯೋ',
          ],
          correctIndex: 1,
          explanationEn: 'Lesson 1 culminates in the verified bilingual Initial Self-Awareness Profile worksheet.',
          explanationKn: 'ಪಾಠ 1 ರ ಮುಖ್ಯ ಔಟ್‌ಪುಟ್ ಪ್ರಾರಂಭಿಕ ಸ್ವ-ಅರಿವು ಪ್ರೊಫೈಲ್ ವರ್ಕ್‌ಶೀಟ್ ಆಗಿದೆ.',
        },
      ],
    },

    rubric: {
      maxScore: 10,
      threshold: 6,
      criteria: [
        {
          name: 'Honest self-description',
          score0: 'Generic, cliché or missing.',
          score1: 'Some relevant detail provided, but lacks depth.',
          score2: 'Clear, specific, honest and highly credible self-reflection.',
        },
        {
          name: 'Use of evidence',
          score0: 'No real examples cited; purely assumptions.',
          score1: 'Example cited but lacks specific action, result or learning.',
          score2: 'Situation, action, measurable result and learning are concrete.',
        },
        {
          name: 'Recognition of patterns',
          score0: 'No pattern identified across experiences.',
          score1: 'One partly supported pattern described.',
          score2: 'Strength, challenge and feedback patterns clearly supported.',
        },
        {
          name: 'Improvement ownership',
          score0: 'No priority or action identified.',
          score1: 'Priority or weekly action is vague without deadline.',
          score2: 'Relevant growth priority with specific, achievable 7-day action.',
        },
        {
          name: 'Career connection',
          score0: 'No connection to career readiness.',
          score1: 'General connection with minimal specificity.',
          score2: 'Clear link established between self-awareness and career readiness.',
        },
      ],
      feedbackSentenceFrame:
        '“Your evidence is strongest when you [Observation]. To improve this profile, clarify [Growth Point]. Your next action is [7-Day Step].”',
    },

    guidedSession: {
      duration: '30 minutes',
      agenda: [
        { time: '0–3 min', facilitatorAction: 'Welcome, psychological safety and lesson purpose.', learnerOutput: 'Ready to participate.' },
        { time: '3–7 min', facilitatorAction: 'Ask: “What did you notice about yourself?” Invite two responses.', learnerOutput: 'One insight stated.' },
        { time: '7–13 min', facilitatorAction: 'Model assumption versus evidence using one sample statement.', learnerOutput: 'Understands evidence formula.' },
        { time: '13–20 min', facilitatorAction: 'Pair reflection: strength + supporting example; improvement + weekly action.', learnerOutput: 'Spoken evidence and action.' },
        { time: '20–25 min', facilitatorAction: 'Invite volunteers; give precise, respectful feedback.', learnerOutput: 'Improved wording.' },
        { time: '25–28 min', facilitatorAction: 'Explain rubric, submission and revision process.', learnerOutput: 'Knows completion rules.' },
        { time: '28–30 min', facilitatorAction: 'Close with commitment: “This week I will…”', learnerOutput: 'One named action.' },
      ],
      guardrails: [
        'Do not label learners or compare them publicly.',
        'Ask for evidence with curiosity: “Can you share one example?”',
        'Accept English, Kannada or a comfortable mix during reflection.',
        'Keep personal disclosures voluntary; redirect sensitive issues.',
        'Record only learning-relevant evidence and feedback.',
      ],
      closingCommitmentTemplate: '“This week I will complete [Specific Action] to improve [Target Skill].”',
    },
  },

  // =========================================================================
  // LESSON 2: Connecting My Strengths to Career Direction
  // =========================================================================
  2: {
    id: 2,
    numberStr: '02',
    title: 'Connecting My Strengths to Career Direction',
    subtitle: 'My Strengths Become Valuable When I Understand Where and How to Use Them',
    primaryEvidence: 'My Strength-to-Career Map',
    tagline: 'Translate real abilities into transferable skills and shortlist 2–3 suitable career pathways.',
    xpReward: 200,
    durationMin: 60,
    framework: 'Experience → Strength → Transferable Skill → Work Activity → Career Direction',

    specification: {
      purpose: 'Connect evidence-backed strengths with transferable skills, preferred work activities and realistic career directions.',
      outcomes: [
        'Identify three supported strengths using verified past actions',
        'Distinguish clearly between interest, strength, qualification and career role',
        'Map daily work activities to transferable competencies',
        'Shortlist 2–3 realistic career directions for deeper investigation',
        'Define key investigation questions and a 7-day inquiry action',
      ],
      primaryOutput: 'Completed bilingual My Strength-to-Career Map.',
      deliveryMix: 'Platform self-learning (45–60 mins) + 30-minute guided review session.',
      estimatedTime: '45–60 minutes platform work + 30-minute guided review.',
      eriContribution: 'Career clarity, self-awareness, decision-making, communication confidence and improvement ownership.',
      lockedRules: {
        video: 'At least 90% watched.',
        note: 'Opened and read by learner.',
        quiz: '5 random questions; 60% pass; maximum 2 attempts; no negative marking.',
        worksheet: 'Completed Strength-to-Career Map submitted with 2–3 directions.',
        humanReview: 'Rubric score at least 6/10.',
        closure: 'Required revisions completed and reviewer feedback acknowledged.',
      },
    },

    notes: {
      titleEn: 'Connecting My Strengths to Career Direction',
      titleKn: 'ನನ್ನ ಸಾಮರ್ಥ್ಯಗಳನ್ನು ವೃತ್ತಿ ದಿಕ್ಕಿಗೆ ಸಂಪರ್ಕಿಸುವುದು',
      introEn:
        'A strength becomes valuable when you understand where and how to deploy it. Moving from self-awareness to career direction requires connecting real experiences to transferable skills, preferred work activities, and verified market roles.',
      introKn:
        'ನಮ್ಮ ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಎಲ್ಲಿ ಮತ್ತು ಹೇಗೆ ಬಳಸಬೇಕೆಂದು ಅರ್ಥಮಾಡಿಕೊಂಡಾಗ ಅವು ಮೌಲ್ಯಯುತವಾಗುತ್ತವೆ. ಕೇವಲ ಪದವಿಗಿಂತ ನೈಜ ಅನುಭವ, ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯ ಮತ್ತು ಕೆಲಸದ ಚಟುವಟಿಕೆಗಳು ವೃತ್ತಿ ದಿಕ್ಕನ್ನು ನಿರ್ಧರಿಸುತ್ತವೆ.',
      sectionsEn: [
        {
          heading: 'What is a genuine strength?',
          body: 'A strength is a quality or ability demonstrated through real action. “I am a leader” is only a statement. “I coordinated four students, divided responsibilities and helped the team submit on time” provides evidence of coordination and leadership.',
        },
        {
          heading: 'Transferable skills across industries',
          body: 'Skills like communication, teamwork, leadership, planning, problem-solving, analytical thinking, creativity, time management and adaptability can be applied across numerous roles regardless of your college branch.',
          bulletList: [
            'Event coordination shows planning, logistics, teamwork and crisis handling.',
            'Seminar presentations demonstrate clear technical communication and presence.',
            'Debugging a code error shows analytical deduction and persistent problem-solving.',
            'Managing family expenses shows budgeting, responsibility and quantitative reasoning.',
          ],
        },
        {
          heading: 'Understand the four distinct terms',
          body: 'Never confuse these four critical career elements:',
          bulletList: [
            'Interest: What you enjoy and what sparks your curiosity.',
            'Strength: What you can consistently demonstrate with verified proof.',
            'Qualification: Your formal academic degree (e.g. BCA, B.Com, B.Sc, B.E.).',
            'Career Role: The specific daily work and business responsibilities performed in a job.',
          ],
        },
        {
          heading: 'Shortlist before deciding',
          body: 'Do not lock yourself prematurely into one narrow option. Select 2–3 possible directions for investigation. Study the daily tasks, required toolkits, entry pathways, and identify evidence you still need to build.',
        },
      ],
      sectionsKn: [
        {
          heading: 'ಸಾಮರ್ಥ್ಯ ಎಂದರೇನು?',
          body: 'ಸಾಮರ್ಥ್ಯ ಎಂದರೆ ನೈಜ ಕ್ರಮ ಅಥವಾ ಅನುಭವದ ಮೂಲಕ ತೋರಿಸಲಾದ ಗುಣ ಅಥವಾ ಕೌಶಲ್ಯ. ನೀವು ಏನು ಮಾಡಿದ್ದೀರಿ ಮತ್ತು ಫಲಿತಾಂಶ ಏನು ಎಂದು ವಿವರಿಸಿದಾಗ ಹೇಳಿಕೆ ನಂಬಲರ್ಹವಾಗುತ್ತದೆ.',
        },
        {
          heading: 'ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯಗಳು',
          body: 'ಸಂವಹನ, ತಂಡಕಾರ್ಯ, ನಾಯಕತ್ವ, ಯೋಜನೆ, ಸಮಸ್ಯೆ ಪರಿಹಾರ, ವಿಶ್ಲೇಷಣೆ, ಸೃಜನಶೀಲತೆ, ಸಮಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಜವಾಬ್ದಾರಿಯನ್ನು ವಿವಿಧ ಉದ್ಯೋಗಗಳಲ್ಲಿ ಬಳಸಬಹುದು.',
        },
        {
          heading: 'ನಾಲ್ಕು ಪದಗಳ ವ್ಯತ್ಯಾಸ ತಿಳಿಯಿರಿ',
          body: 'ಈ ನಾಲ್ಕು ಅಂಶಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಪ್ರತ್ಯೇಕಿಸಿ:',
          bulletList: [
            'ಆಸಕ್ತಿ: ನಿಮಗೆ ಇಷ್ಟವಾದುದು.',
            'ಸಾಮರ್ಥ್ಯ: ನೀವು ತೋರಿಸಬಲ್ಲದ್ದು.',
            'ಅರ್ಹತೆ: ನಿಮ್ಮ ಅಧಿಕೃತ ಶಿಕ್ಷಣ/ಪದವಿ.',
            'ವೃತ್ತಿಪಾತ್ರ: ಉದ್ಯೋಗದಲ್ಲಿ ಮಾಡುವ ದೈನಂದಿನ ಕೆಲಸ ಮತ್ತು ಜವಾಬ್ದಾರಿ.',
          ],
        },
        {
          heading: 'ಅಂತಿಮ ನಿರ್ಧಾರಕ್ಕೂ ಮುನ್ನ ಆಯ್ಕೆ ಮಾಡಿ',
          body: '2–3 ಸಾಧ್ಯ ದಿಕ್ಕುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ದೈನಂದಿನ ಕೆಲಸ, ಅಗತ್ಯ ಕೌಶಲ್ಯ ಮತ್ತು ಪ್ರವೇಶ ಅವಕಾಶಗಳನ್ನು ಪರಿಶೀಲಿಸಿ. ಇವು ಸಾಧ್ಯತೆಗಳು ಮಾತ್ರ; ಅಂತಿಮ ನಿರ್ಧಾರಗಳಲ್ಲ.',
        },
      ],
      goldenQuoteEn: 'Your qualification shows what you studied. Your evidence shows what you can contribute.',
      goldenQuoteKn: 'ನಿಮ್ಮ ಅರ್ಹತೆ ನೀವು ಏನು ಓದಿದ್ದೀರಿ ಎಂಬುದನ್ನು ತಿಳಿಸುತ್ತದೆ. ನಿಮ್ಮ ಸಾಕ್ಷ್ಯ ನೀವು ಏನು ಕೊಡುಗೆ ನೀಡಬಲ್ಲಿರಿ ಎಂಬುದನ್ನು ತೋರಿಸುತ್ತದೆ.',
      formulaEn: 'Experience → Strength → Transferable Skill → Work Activity → Career Direction',
      formulaKn: 'ಅನುಭವ → ಸಾಮರ್ಥ್ಯ → ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯ → ಕೆಲಸದ ಚಟುವಟಿಕೆ → ವೃತ್ತಿ ದಿಕ್ಕು',
    },

    video: {
      targetDuration: '7–8 minutes',
      sections: [
        {
          step: 1,
          titleEn: '1 · Opening',
          titleKn: '1 · ಆರಂಭ',
          duration: '0:50',
          scriptEn:
            'Welcome to Lesson 2 of AERS Transform. In Lesson 1, you began understanding your qualities, interests, experiences and improvement areas. Now ask: Where can my strengths be useful? Career direction needs evidence—not only peer choices, attractive job titles or salary assumptions.',
          scriptKn:
            'AERS Transform ಪಾಠ 2ಕ್ಕೆ ಸ್ವಾಗತ. ಪಾಠ 1ರಲ್ಲಿ ನಿಮ್ಮ ಗುಣ, ಆಸಕ್ತಿ, ಅನುಭವ ಮತ್ತು ಸುಧಾರಣಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಅರಿತುಕೊಂಡಿದ್ದೀರಿ. ಈಗ ಕೇಳಿ: ನನ್ನ ಸಾಮರ್ಥ್ಯಗಳು ಎಲ್ಲಿ ಉಪಯುಕ್ತ? ಸ್ನೇಹಿತರ ಆಯ್ಕೆ, ಆಕರ್ಷಕ ಉದ್ಯೋಗದ ಹೆಸರು ಅಥವಾ ಸಂಬಳದ ಊಹೆಗಿಂತ ಸಾಕ್ಷ್ಯ ಮುಖ್ಯ.',
        },
        {
          step: 2,
          titleEn: '2 · What is a strength?',
          titleKn: '2 · ಸಾಮರ್ಥ್ಯ ಎಂದರೇನು?',
          duration: '0:50',
          scriptEn:
            'A strength is a quality or ability demonstrated through action. “I am a leader” is only a statement. “I coordinated four students, divided responsibilities and helped the team submit on time” provides evidence of coordination, responsibility and leadership.',
          scriptKn:
            'ಸಾಮರ್ಥ್ಯ ಎಂದರೆ ಕಾರ್ಯದ ಮೂಲಕ ತೋರಿಸಿದ ಗುಣ ಅಥವಾ ಕೌಶಲ್ಯ. “ನಾನು ನಾಯಕ” ಎನ್ನುವುದು ಹೇಳಿಕೆ ಮಾತ್ರ. ತಂಡವನ್ನು ಸಂಯೋಜಿಸಿ, ಜವಾಬ್ದಾರಿ ಹಂಚಿ, ಸಮಯಕ್ಕೆ ಕೆಲಸ ಮುಗಿಸಿದ ಅನುಭವವು ನಾಯಕತ್ವ ಮತ್ತು ಜವಾಬ್ದಾರಿಯ ಸಾಕ್ಷ್ಯ.',
        },
        {
          step: 3,
          titleEn: '3 · Discover transferable skills',
          titleKn: '3 · ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯ',
          duration: '0:55',
          scriptEn:
            'Transferable skills are useful across subjects, industries and roles. Events may show planning and teamwork; presentations show communication; technical problems show analysis; family business may show customer service; sports may show discipline. Formal employment is not the only source of evidence.',
          scriptKn:
            'ಈ ಕೌಶಲ್ಯಗಳನ್ನು ವಿವಿಧ ವಿಷಯ, ಉದ್ಯಮ ಮತ್ತು ಉದ್ಯೋಗಗಳಲ್ಲಿ ಬಳಸಬಹುದು. ಕಾರ್ಯಕ್ರಮವು ಯೋಜನೆ ಮತ್ತು ತಂಡಕಾರ್ಯ; ಪ್ರಸ್ತುತಿ ಸಂವಹನ; ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆ ವಿಶ್ಲೇಷಣೆ; ಕುಟುಂಬದ ವ್ಯವಹಾರ ಗ್ರಾಹಕ ಸೇವೆ; ಕ್ರೀಡೆ ಶಿಸ್ತು ತೋರಿಸಬಹುದು. ಅಧಿಕೃತ ಉದ್ಯೋಗ ಮಾತ್ರ ಸಾಕ್ಷ್ಯದ ಮೂಲವಲ್ಲ.',
        },
        {
          step: 4,
          titleEn: '4 · Use the framework',
          titleKn: '4 · ಸಂಪರ್ಕ ಚೌಕಟ್ಟು',
          duration: '1:00',
          scriptEn:
            'Experience → Strength → Transferable Skill → Work Activity → Career Direction. Event coordination may reveal organising strength, planning and communication, enjoyment of deadlines and people, and possible directions such as operations, project coordination, events or HR. The framework identifies possibilities for investigation.',
          scriptKn:
            'ಅನುಭವ → ಸಾಮರ್ಥ್ಯ → ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯ → ಕೆಲಸದ ಚಟುವಟಿಕೆ → ವೃತ್ತಿ ದಿಕ್ಕು. ಕಾರ್ಯಕ್ರಮ ಸಂಯೋಜನೆಯಿಂದ ಸಂಘಟನೆ, ಯೋಜನೆ, ಸಂವಹನ ಮತ್ತು ಜನರೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವ ಆಸಕ್ತಿ ಗೋಚರಿಸಿ, ಕಾರ್ಯಾಚರಣೆ, ಪ್ರಾಜೆಕ್ಟ್ ಸಂಯೋಜನೆ, ಕಾರ್ಯಕ್ರಮ ನಿರ್ವಹಣೆ ಅಥವಾ HR ದಿಕ್ಕುಗಳು ಕಾಣಬಹುದು.',
        },
        {
          step: 5,
          titleEn: '5 · Understand four terms',
          titleKn: '5 · ನಾಲ್ಕು ಪದಗಳ ವ್ಯತ್ಯಾಸ',
          duration: '0:55',
          scriptEn:
            'Interest is what you enjoy. Strength is what you can demonstrate. Qualification is your formal education. Career role is the work performed. A BCA student with technology interest and communication strength could explore development, testing, support, business analysis, customer success or project coordination.',
          scriptKn:
            'ಆಸಕ್ತಿ ಎಂದರೆ ನಿಮಗೆ ಇಷ್ಟವಾದುದು. ಸಾಮರ್ಥ್ಯ ಎಂದರೆ ನೀವು ತೋರಿಸಬಲ್ಲಿರಿ. ಅರ್ಹತೆ ಎಂದರೆ ಅಧಿಕೃತ ಶಿಕ್ಷಣ. ವೃತ್ತಿಪಾತ್ರ ಎಂದರೆ ಉದ್ಯೋಗದಲ್ಲಿ ಮಾಡುವ ಕೆಲಸ. BCA ವಿದ್ಯಾರ್ಥಿ ಅಭಿವೃದ್ಧಿ, ಟೆಸ್ಟಿಂಗ್, ತಾಂತ್ರಿಕ ಸಹಾಯ, ಬಿಸಿನೆಸ್ ಅನಾಲಿಸಿಸ್, ಕಸ್ಟಮರ್ ಸಕ್ಸಸ್ ಅಥವಾ ಪ್ರಾಜೆಕ್ಟ್ ಸಂಯೋಜನೆ ಪರಿಶೀಲಿಸಬಹುದು.',
        },
        {
          step: 6,
          titleEn: '6 · Focus on work activities',
          titleKn: '6 · ಕೆಲಸದ ಚಟುವಟಿಕೆ',
          duration: '0:50',
          scriptEn:
            'Ask whether you enjoy analysing information, explaining ideas, creating, organising, solving technical problems, helping customers, working independently or collaborating. Career clarity improves when strengths and preferred activities support each other.',
          scriptKn:
            'ಮಾಹಿತಿ ವಿಶ್ಲೇಷಣೆ, ವಿಚಾರ ವಿವರಿಸುವುದು, ಸೃಷ್ಟಿ, ಸಂಘಟನೆ, ತಾಂತ್ರಿಕ ಸಮಸ್ಯೆ ಪರಿಹಾರ, ಗ್ರಾಹಕ ಸಹಾಯ, ಸ್ವತಂತ್ರ ಕೆಲಸ ಅಥವಾ ತಂಡಕಾರ್ಯ—ಯಾವುದು ನಿಮಗೆ ಇಷ್ಟ ಎಂದು ಕೇಳಿ. ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಇಷ್ಟದ ಕೆಲಸ ಹೊಂದಿದಾಗ ವೃತ್ತಿ ಸ್ಪಷ್ಟತೆ ಹೆಚ್ಚುತ್ತದೆ.',
        },
        {
          step: 7,
          titleEn: '7 · Shortlist directions',
          titleKn: '7 · ವೃತ್ತಿ ದಿಕ್ಕು',
          duration: '0:55',
          scriptEn:
            'Select 2–3 directions for investigation—not a final decision. Record why each appears suitable, which strengths support it, what you know and what you need to investigate: daily work, skills, entry opportunities, improvement needs and evidence to build.',
          scriptKn:
            'ಪರಿಶೀಲನೆಗಾಗಿ 2–3 ದಿಕ್ಕುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ; ಇದು ಅಂತಿಮ ನಿರ್ಧಾರವಲ್ಲ. ಪ್ರತಿಯೊಂದು ದಿಕ್ಕು ಏಕೆ ಸೂಕ್ತ, ಯಾವ ಸಾಮರ್ಥ್ಯ ಬೆಂಬಲಿಸುತ್ತದೆ, ನಿಮಗೆ ಏನು ಗೊತ್ತು ಮತ್ತು ದೈನಂದಿನ ಕೆಲಸ, ಕೌಶಲ್ಯ, ಪ್ರವೇಶ ಅವಕಾಶ ಹಾಗೂ ಸುಧಾರಣೆ ಬಗ್ಗೆ ಇನ್ನೇನು ತಿಳಿಯಬೇಕು ಎಂದು ಬರೆಯಿರಿ.',
        },
        {
          step: 8,
          titleEn: '8 · Complete the activity',
          titleKn: '8 · ಚಟುವಟಿಕೆ',
          duration: '0:50',
          scriptEn:
            'Open My Strength-to-Career Map. Select three strengths from Lesson 1, add a real experience, identify the transferable skill, connect it with work activities, and shortlist directions. You may answer in English, Kannada or both; evidence matters more than sophisticated language.',
          scriptKn:
            'My Strength-to-Career Map ತೆರೆಯಿರಿ. ಪಾಠ 1ರಿಂದ ಮೂರು ಸಾಮರ್ಥ್ಯ ಆಯ್ಕೆ ಮಾಡಿ, ನೈಜ ಅನುಭವ, ಕೌಶಲ್ಯ, ಕೆಲಸದ ಚಟುವಟಿಕೆ ಮತ್ತು ವೃತ್ತಿ ದಿಕ್ಕನ್ನು ಸಂಪರ್ಕಿಸಿ. ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ ಅಥವಾ ಎರಡನ್ನೂ ಬಳಸಬಹುದು; ಕಠಿಣ ಭಾಷೆಗಿಂತ ಸಾಕ್ಷ್ಯ ಮುಖ್ಯ.',
        },
        {
          step: 9,
          titleEn: '9 · Closing',
          titleKn: '9 · ಸಮಾಪ್ತಿ',
          duration: '0:45',
          scriptEn:
            'Career clarity does not mean knowing your complete future today. It means understanding yourself well enough to investigate the right possibilities. Submit your map for facilitator review; next you will investigate roles more deeply before selecting a priority direction.',
          scriptKn:
            'ವೃತ್ತಿ ಸ್ಪಷ್ಟತೆ ಎಂದರೆ ಸಂಪೂರ್ಣ ಭವಿಷ್ಯವನ್ನು ಇಂದೇ ತಿಳಿಯುವುದಲ್ಲ. ಸೂಕ್ತ ಸಾಧ್ಯತೆಗಳನ್ನು ಪರಿಶೀಲಿಸುವಷ್ಟು ನಮ್ಮನ್ನು ನಾವು ಅರಿತುಕೊಳ್ಳುವುದು. ನಿಮ್ಮ ನಕ್ಷೆಯನ್ನು facilitator ಪರಿಶೀಲನೆಗೆ ಸಲ್ಲಿಸಿ.',
        },
      ],
      keyTakeawaysEn: [
        'A degree does not restrict you to one job; transferable skills open multiple pathways.',
        'Always link strengths to real work activities you genuinely enjoy performing daily.',
        'Shortlist 2–3 exploratory roles rather than pinning all your hopes on a single title.',
        'Every chosen direction must be paired with an active 7-day research task.',
      ],
      keyTakeawaysKn: [
        'ಪದವಿಯು ಒಂದೇ ಕೆಲಸಕ್ಕೆ ಸೀಮಿತಗೊಳಿಸುವುದಿಲ್ಲ; ಕೌಶಲ್ಯಗಳು ಹಲವು ದಾರಿಗಳನ್ನು ತೆರೆಯುತ್ತವೆ.',
        'ದೈನಂದಿನ ಕೆಲಸದ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಸಾಮರ್ಥ್ಯಗಳ ನಡುವೆ ಸಾಮರಸ್ಯವಿರಬೇಕು.',
        'ಒಂದೇ ಹುದ್ದೆಯ ಬದಲು 2-3 ಸಾಧ್ಯತೆಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಆಳವಾಗಿ ಸಂಶೋಧಿಸಿ.',
        'ಪ್ರತಿಯೊಂದು ದಿಕ್ಕಿಗೂ 7 ದಿನಗಳ ತನಿಖಾ ಕ್ರಮವನ್ನು ಜೋಡಿಸಿ.',
      ],
    },

    quiz: {
      config: {
        totalBank: 10,
        drawCount: 5,
        passPercent: 60,
        maxAttempts: 2,
      },
      questions: [
        {
          id: 1,
          questionEn: 'What makes a claimed strength credible to employers?',
          questionKn: 'ಸಾಮರ್ಥ್ಯವನ್ನು ನಂಬಲರ್ಹವಾಗಿಸುವುದು ಯಾವುದು?',
          optionsEn: [
            'Using loud voice projection in group discussions',
            'Backing it with real experience, actions taken, and results',
            'Listing it first on your LinkedIn headline',
            'Having the same strength listed by your senior',
          ],
          optionsKn: [
            'ಗುಂಪು ಚರ್ಚೆಯಲ್ಲಿ ಜೋರಾಗಿ ಮಾತನಾಡುವುದು',
            'ನೈಜ ಅನುಭವ, ಕ್ರಮ ಮತ್ತು ಫಲಿತಾಂಶದ ವಿವರಣೆ ನೀಡುವುದು',
            'ಲಿಂಕ್ಡ್ಇನ್ ಶೀರ್ಷಿಕೆಯಲ್ಲಿ ಮೊದಲನೆಯದಾಗಿ ಬರೆಯುವುದು',
            'ಹಿರಿಯ ವಿದ್ಯಾರ್ಥಿಯ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿದ್ದದ್ದನ್ನೇ ನಕಲಿಸುವುದು',
          ],
          correctIndex: 1,
          explanationEn: 'Credibility comes from tangible experiences showing what you did and what resulted.',
          explanationKn: 'ನೈಜ ಅನುಭವ ಮತ್ತು ಫಲಿತಾಂಶದ ಮೂಲಕ ಮಾತ್ರ ಸಾಮರ್ಥ್ಯವು ವಿಶ್ವಾಸಾರ್ಹವಾಗುತ್ತದೆ.',
        },
        {
          id: 2,
          questionEn: 'What is a transferable skill?',
          questionKn: 'ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯ ಎಂದರೆ ಏನು?',
          optionsEn: [
            'A certificate that can be transferred to a friend',
            'A skill useful across diverse roles and industries',
            'A tool that works only on one computer operating system',
            'An academic mark that gets converted into credits',
          ],
          optionsKn: [
            'ಸ್ನೇಹಿತರಿಗೆ ವರ್ಗಾಯಿಸಬಹುದಾದ ಪ್ರಮಾಣಪತ್ರ',
            'ವಿವಿಧ ಉದ್ಯೋಗಗಳು ಮತ್ತು ಉದ್ಯಮಗಳಲ್ಲಿ ಉಪಯುಕ್ತವಾಗುವ ಕೌಶಲ್ಯ',
            'ಕೇವಲ ಒಂದು ಕಂಪ್ಯೂಟರ್‌ನಲ್ಲಿ ಮಾತ್ರ ಕೆಲಸ ಮಾಡುವ ತಂತ್ರಾಂಶ',
            'ಕ್ರೆಡಿಟ್‌ಗಳಾಗಿ ಪರಿವರ್ತನೆಯಾಗುವ ಅಂಕಗಳು',
          ],
          correctIndex: 1,
          explanationEn: 'Transferable skills (like communication, problem-solving and planning) apply universally across functional roles.',
          explanationKn: 'ವಿವಿಧ ವೃತ್ತಿಗಳಲ್ಲಿ ಮತ್ತು ಸಂಸ್ಥೆಗಳಲ್ಲಿ ಬಳಸಬಹುದಾದ ಸಾಮರ್ಥ್ಯವೇ ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯ.',
        },
        {
          id: 3,
          questionEn: 'What is the correct framework sequence for connecting strengths to careers?',
          questionKn: 'ಸಾಮರ್ಥ್ಯದಿಂದ ವೃತ್ತಿಗೆ ಸಂಪರ್ಕ ಕಲ್ಪಿಸುವ ಸರಿಯಾದ ಕ್ರಮ ಯಾವುದು?',
          optionsEn: [
            'Salary → Title → Company → Degree → Action',
            'Degree → Interview → Promotion → Strength → Skill',
            'Experience → Strength → Transferable Skill → Work Activity → Career Direction',
            'Interest → Guess → Application → Offer → Verification',
          ],
          optionsKn: [
            'ಸಂಬಳ → ಹುದ್ದೆ → ಕಂಪನಿ → ಪದವಿ → ಕ್ರಮ',
            'ಪದವಿ → ಸಂದರ್ಶನ → ಬಡ್ತಿ → ಸಾಮರ್ಥ್ಯ → ಕೌಶಲ್ಯ',
            'ಅನುಭವ → ಸಾಮರ್ಥ್ಯ → ವರ್ಗಾಯಿಸಬಹುದಾದ ಕೌಶಲ್ಯ → ಕೆಲಸದ ಚಟುವಟಿಕೆ → ವೃತ್ತಿ ದಿಕ್ಕು',
            'ಆಸಕ್ತಿ → ಊಹೆ → ಅರ್ಜಿ → ಆಫರ್ → ಪರಿಶೀಲನೆ',
          ],
          correctIndex: 2,
          explanationEn: 'The approved 5-step framework maps verified experience directly through activities to career directions.',
          explanationKn: 'ಅನುಭವದಿಂದ ಆರಂಭವಾಗಿ ಸಾಮರ್ಥ್ಯ, ಕೌಶಲ್ಯ, ಕೆಲಸ ಮತ್ತು ಅಂತಿಮವಾಗಿ ವೃತ್ತಿ ದಿಕ್ಕಿನ ಸಂಪರ್ಕ ಸಾಧಿಸಲಾಗುತ್ತದೆ.',
        },
        {
          id: 4,
          questionEn: 'Which statement provides proof of communication skill?',
          questionKn: 'ಯಾವುದು ಸಂವಹನದ ನೈಜ ಸಾಕ್ಷ್ಯವಾಗಿದೆ?',
          optionsEn: [
            '“I talk to everyone in my class every day.”',
            '“I am very talkative and extroverted.”',
            '“I explained a technical project and answered panel questions clearly.”',
            '“I prefer chatting over messaging apps.”',
          ],
          optionsKn: [
            '“ನಾನು ಪ್ರತಿದಿನ ತರಗತಿಯಲ್ಲಿ ಎಲ್ಲರೊಂದಿಗೆ ಮಾತನಾಡುತ್ತೇನೆ.”',
            '“ನಾನು ತುಂಬಾ ಮಾತನಾಡುವ ಸ್ವಭಾವದವನು.”',
            '“ಪ್ರಾಜೆಕ್ಟ್ ವಿವರಿಸಿ ಮೌಲ್ಯಮಾಪಕರ ಪ್ರಶ್ನೆಗಳಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಉತ್ತರಿಸಿದೆ.”',
            '“ನಾನು ಮೆಸೇಜಿಂಗ್ ಆ್ಯಪ್ ಮೂಲಕ ಮಾತನಾಡಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.”',
          ],
          correctIndex: 2,
          explanationEn: 'Professional communication is demonstrated by explaining ideas clearly under evaluation.',
          explanationKn: 'ವಿಷಯವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಸಮರ್ಥವಾಗಿ ಎದುರಿಸಿದ್ದೇ ಸಂವಹನದ ಸಾಕ್ಷಿ.',
        },
        {
          id: 5,
          questionEn: 'What is the key distinction between an interest and a strength?',
          questionKn: 'ಆಸಕ್ತಿ ಮತ್ತು ಸಾಮರ್ಥ್ಯದ ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
          optionsEn: [
            'Interests require certificates while strengths do not',
            'Interest is what you enjoy; strength is demonstrated ability through action',
            'Strengths are always born with you while interests change weekly',
            'There is no distinction between them in placements',
          ],
          optionsKn: [
            'ಆಸಕ್ತಿಗೆ ಸರ್ಟಿಫಿಕೇಟ್ ಬೇಕು, ಸಾಮರ್ಥ್ಯಕ್ಕೆ ಬೇಡ',
            'ಆಸಕ್ತಿ ಎಂದರೆ ಇಷ್ಟ; ಸಾಮರ್ಥ್ಯ ಎಂದರೆ ಕಾರ್ಯದ ಮೂಲಕ ತೋರಿಸಿದ ನೈಜ ಕೌಶಲ್ಯ',
            'ಸಾಮರ್ಥ್ಯ ಹುಟ್ಟಿನಿಂದ ಬರುತ್ತದೆ, ಆಸಕ್ತಿ ವಾರಕ್ಕೊಮ್ಮೆ ಬದಲಾಗುತ್ತದೆ',
            'ಉದ್ಯೋಗದ ದೃಷ್ಟಿಯಿಂದ ಇವೆರಡಕ್ಕೂ ಯಾವುದೇ ವ್ಯತ್ಯಾಸವಿಲ್ಲ',
          ],
          correctIndex: 1,
          explanationEn: 'Enjoying an activity is an interest; consistently producing quality results is a strength.',
          explanationKn: 'ಇಷ್ಟಪಡುವುದು ಆಸಕ್ತಿ; ಅದನ್ನು ಸಮರ್ಥವಾಗಿ ಮಾಡಿ ಫಲಿತಾಂಶ ತರುವುದು ಸಾಮರ್ಥ್ಯ.',
        },
        {
          id: 6,
          questionEn: 'Coordinating a college tech symposium demonstrates which transferable skills?',
          questionKn: 'ಕಾಲೇಜು ಕಾರ್ಯಕ್ರಮ ಆಯೋಜನೆ ಯಾವ ಕೌಶಲ್ಯಗಳನ್ನು ತೋರಿಸುತ್ತದೆ?',
          optionsEn: [
            'Planning, teamwork, communication and time management',
            'Only high-performance hardware assembly',
            'Purely individual solitary coding',
            'Passive observation without responsibility',
          ],
          optionsKn: [
            'ಯೋಜನೆ, ತಂಡಕಾರ್ಯ, ಸಂವಹನ ಮತ್ತು ಸಮಯ ನಿರ್ವಹಣೆ',
            'ಕೇವಲ ಹಾರ್ಡ್‌ವೇರ್ ಜೋಡಣೆ',
            'ಏಕಾಂಗಿ ಕೋಡಿಂಗ್ ಮಾತ್ರ',
            'ಯಾವುದೇ ಜವಾಬ್ದಾರಿಯಿಲ್ಲದ ವೀಕ್ಷಣೆ',
          ],
          correctIndex: 0,
          explanationEn: 'Event logistics provide robust evidence of collaborative management and execution skills.',
          explanationKn: 'ಕಾರ್ಯಕ್ರಮ ಸಂಘಟನೆಯು ಯೋಜನೆ, ತಂಡಕಾರ್ಯ ಮತ್ತು ಸಮಯಪಾಲನೆಯ ನೇರ ಸಾಕ್ಷ್ಯ.',
        },
        {
          id: 7,
          questionEn: 'Why is it crucial to investigate daily work activities before picking a role?',
          questionKn: 'ಕೆಲಸದ ಚಟುವಟಿಕೆಗಳನ್ನು ಮುಂಚಿತವಾಗಿ ತಿಳಿಯುವುದು ಏಕೆ ಮುಖ್ಯ?',
          optionsEn: [
            'To calculate how many hours you can spend on social media',
            'They reveal the actual tasks and whether you will genuinely enjoy the daily work',
            'Because recruiters ask for the exact office room number',
            'To see if the company offers free snacks',
          ],
          optionsKn: [
            'ಸೋಷಿಯಲ್ ಮೀಡಿಯಾದಲ್ಲಿ ಎಷ್ಟು ಸಮಯ ಕಳೆಯಬಹುದು ಎಂದು ತಿಳಿಯಲು',
            'ದೈನಂದಿನ ನೈಜ ಕೆಲಸ ಏನು ಮತ್ತು ಅದು ನಮಗೆ ಸರಿಹೊಂದುತ್ತದೆಯೇ ಎಂದು ತಿಳಿಯಲು',
            'ಸಂದರ್ಶಕರು ಕೊಠಡಿಯ ಸಂಖ್ಯೆಯನ್ನು ಕೇಳುವುದರಿಂದ',
            'ಕಂಪನಿಯಲ್ಲಿ ತಿಂಡಿ ಉಚಿತವೇ ಎಂದು ನೋಡಲು',
          ],
          correctIndex: 1,
          explanationEn: 'Job titles can be misleading; understanding day-to-day tasks ensures realistic career fit.',
          explanationKn: 'ದೈನಂದಿನ ಕೆಲಸದ ನೈಜ ಸ್ವರೂಪ ಮತ್ತು ಆಸಕ್ತಿಯ ಹೊಂದಾಣಿಕೆಯನ್ನು ತಿಳಿಯಲು ಇದು ಮುಖ್ಯ.',
        },
        {
          id: 8,
          questionEn: 'What should a learner do immediately after shortlisting 2–3 career directions?',
          questionKn: '2-3 ವೃತ್ತಿ ದಿಕ್ಕುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿದ ನಂತರ ಮುಂದಿನ ಕ್ರಮವೇನು?',
          optionsEn: [
            'Declare the search completed and stop learning',
            'Ask parents to select one without any research',
            'Investigate daily responsibilities, skills, entry opportunities and gaps',
            'Apply to senior management roles immediately',
          ],
          optionsKn: [
            'ಹುಡುಕಾಟ ಮುಗಿಯಿತು ಎಂದು ಕಲಿಕೆ ನಿಲ್ಲಿಸುವುದು',
            'ಯಾವುದೇ ಮಾಹಿತಿಯಿಲ್ಲದೆ ಪೋಷಕರೇ ಒಂದನ್ನು ಆರಿಸಲಿ ಎಂದು ಬಿಡುವುದು',
            'ಕೆಲಸ, ಕೌಶಲ್ಯ, ಅವಕಾಶ ಮತ್ತು ಅಂತರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಸಂಶೋಧಿಸುವುದು',
            'ನೇರವಾಗಿ ಸೀನಿಯರ್ ಮ್ಯಾನೇಜರ್ ಹುದ್ದೆಗಳಿಗೆ ಅರ್ಜಿ ಹಾಕುವುದು',
          ],
          correctIndex: 2,
          explanationEn: 'Shortlisting is an invitation for targeted investigation, not a final unchangeable commitment.',
          explanationKn: 'ಆಯ್ಕೆ ಮಾಡಿದ ದಿಕ್ಕುಗಳ ಕೆಲಸದ ಸ್ವರೂಪ, ಕೌಶಲ್ಯ ಅಗತ್ಯತೆ ಮತ್ತು ಅವಕಾಶಗಳನ್ನು ಪರಿಶೀಲಿಸಬೇಕು.',
        },
        {
          id: 9,
          questionEn: 'Which is the correct statement regarding academic qualifications?',
          questionKn: 'ಶೈಕ್ಷಣಿಕ ಅರ್ಹತೆಯ ಕುರಿತು ಸರಿಯಾದ ಹೇಳಿಕೆ ಯಾವುದು?',
          optionsEn: [
            'A qualification locks you permanently into only one job title',
            'A qualification provides a foundation that can support multiple related career directions',
            'Qualifications guarantee immediate high-paying employment without skills',
            'Employers only care about qualification titles, never about project evidence',
          ],
          optionsKn: [
            'ಅರ್ಹತೆಯು ನಿಮ್ಮನ್ನು ಒಂದೇ ಒಂದು ಹುದ್ದೆಗೆ ಶಾಶ್ವತವಾಗಿ ಕಟ್ಟಿಹಾಕುತ್ತದೆ',
            'ಅರ್ಹತೆಯು ಹಲವು ಸಂಬಂಧಿತ ವೃತ್ತಿ ದಿಕ್ಕುಗಳಿಗೆ ಅಡಿಪಾಯ ನೀಡುತ್ತದೆ',
            'ಯಾವುದೇ ಕೌಶಲ್ಯವಿಲ್ಲದಿದ್ದರೂ ಪದವಿಯೊಂದೇ ಗ್ಯಾರಂಟಿ ಸಂಬಳ ತರುತ್ತದೆ',
            'ಕಂಪನಿಗಳು ಪದವಿಯ ಹೆಸರನ್ನು ಮಾತ್ರ ನೋಡುತ್ತವೆ, ಪ್ರಾಜೆಕ್ಟ್ ಸಾಕ್ಷ್ಯವನ್ನು ಪರಿಗಣಿಸುವುದಿಲ್ಲ',
          ],
          correctIndex: 1,
          explanationEn: 'Degrees open broad horizons; your demonstrated skills determine the specific trajectory.',
          explanationKn: 'ಶಿಕ್ಷಣವು ವಿಶಾಲ ಅಡಿಪಾಯ ನೀಡುತ್ತದೆ; ಆದರೆ ನಿಮ್ಮ ಸಾಕ್ಷ್ಯವೇ ನಿರ್ದಿಷ್ಟ ವೃತ್ತಿಗೆ ಕರೆದೊಯ್ಯುತ್ತದೆ.',
        },
        {
          id: 10,
          questionEn: 'What is the primary evidence output for Lesson 2?',
          questionKn: 'ಪಾಠ 2ರ ಪ್ರಮುಖ ಸಾಕ್ಷ್ಯ ಫಲಿತಾಂಶ ಯಾವುದು?',
          optionsEn: [
            'A final printed resume',
            'My Strength-to-Career Map',
            'A 100-company target spreadsheet',
            'A formal letter of recommendation',
          ],
          optionsKn: [
            'ಅಂತಿಮ ಪ್ರಿಂಟ್ ಆದ ರೆಸ್ಯೂಮ್',
            'My Strength-to-Career Map ವರ್ಕ್‌ಶೀಟ್',
            '100 ಕಂಪನಿಗಳ ಪಟ್ಟಿ',
            'ಶಿಫಾರಸು ಪತ್ರ',
          ],
          correctIndex: 1,
          explanationEn: 'Lesson 2 culminates in the verified bilingual My Strength-to-Career Map.',
          explanationKn: 'ಪಾಠ 2 ರ ಮುಖ್ಯ ಔಟ್‌ಪುಟ್ My Strength-to-Career Map ಆಗಿದೆ.',
        },
      ],
    },

    rubric: {
      maxScore: 10,
      threshold: 6,
      criteria: [
        {
          name: 'Evidence supporting strengths',
          score0: 'Missing or unsupported claims.',
          score1: 'Some unclear evidence provided.',
          score2: 'Three strengths supported by real experience, action and outcome.',
        },
        {
          name: 'Transferable skills',
          score0: 'None identified or irrelevant.',
          score1: 'Partly connected to experiences.',
          score2: 'Relevant transferable skills logically connected to cited experiences.',
        },
        {
          name: 'Work-activity connection',
          score0: 'No connection to daily activities.',
          score1: 'General connection without task specifics.',
          score2: 'Clear connection made with preferred, realistic daily work tasks.',
        },
        {
          name: 'Career-direction logic',
          score0: 'Missing or unrealistic choices.',
          score1: 'Limited reasoning for selected directions.',
          score2: '2–3 realistic directions supported by evidence and logical fit.',
        },
        {
          name: 'Reflection and next action',
          score0: 'Missing reflection and action.',
          score1: 'Vague next step without timeline.',
          score2: 'Relevant investigation questions with a specific, 7-day action.',
        },
      ],
      feedbackSentenceFrame:
        '“Your career connection is strongest where you linked [Strength] with [Career Direction]. Add clearer evidence for [Gap]. Investigate [Priority Role] first and complete [7-Day Action] within seven days.”',
    },

    guidedSession: {
      duration: '30 minutes',
      agenda: [
        { time: '0–3 min', facilitatorAction: 'Welcome; directions are for investigation, not final decisions.', learnerOutput: 'Understands purpose.' },
        { time: '3–7 min', facilitatorAction: 'Recap Lesson 1; name one evidence-backed strength.', learnerOutput: 'Strength + example.' },
        { time: '7–12 min', facilitatorAction: 'Demonstrate the five-step career framework.', learnerOutput: 'Understands connection.' },
        { time: '12–18 min', facilitatorAction: 'Pair explanation of one strength-to-career connection.', learnerOutput: 'Spoken evidence.' },
        { time: '18–23 min', facilitatorAction: 'Review examples; improve assumption-based connections.', learnerOutput: 'Stronger reasoning.' },
        { time: '23–27 min', facilitatorAction: 'Review 2–3 shortlisted directions.', learnerOutput: 'Refined shortlist.' },
        { time: '27–30 min', facilitatorAction: 'State seven-day investigation action.', learnerOutput: 'Action + target date.' },
      ],
      guardrails: [
        'Do not declare that only one career suits a learner.',
        'Do not reject a direction solely because of the learner’s degree.',
        'Do not promise employment, salary or guaranteed success.',
        'Accept English, Kannada or a comfortable combination.',
        'Challenge assumptions respectfully by asking for evidence.',
        'Keep sensitive personal information confidential.',
      ],
      closingCommitmentTemplate:
        '“The career direction I will investigate first is [Role] because [Reason]. Within seven days, I will [Specific Investigation].”',
    },
  },

  // =========================================================================
  // LESSON 3: Exploring Career Roles and Opportunities
  // =========================================================================
  3: {
    id: 3,
    numberStr: '03',
    title: 'Exploring Career Roles and Opportunities',
    subtitle: 'Understand the Role Before Choosing the Career',
    primaryEvidence: 'Career Role Exploration Canvas',
    tagline: 'Research real job responsibilities, skills, entry pathways, and contrast 2 target roles with credible sources.',
    xpReward: 250,
    durationMin: 75,
    framework: 'Role → Responsibilities → Required Skills → Entry Pathway → Opportunities → My Evidence → My Gaps',

    specification: {
      purpose: 'Investigate shortlisted roles using responsibilities, required skills, entry pathways, opportunities, learner evidence and gaps.',
      outcomes: [
        'Distinguish clearly between a broad career field and a specific job role',
        'Research and verify daily/weekly role responsibilities from credible sources',
        'Categorize technical, employability and tool skill requirements',
        'Map entry pathways from internship/entry-level to specialist/manager',
        'Compare two specific roles and select one priority role and one alternative role',
      ],
      primaryOutput: 'Completed bilingual Career Role Exploration Canvas.',
      deliveryMix: 'Platform self-learning & research (60–75 mins) + 30-minute guided review session.',
      estimatedTime: '60–75 minutes platform/research work + 30-minute guided review.',
      eriContribution: 'Career clarity, opportunity awareness, research and decision-making, skill-gap awareness and improvement ownership.',
      lockedRules: {
        video: 'At least 90% watched.',
        note: 'Opened and read by learner.',
        quiz: '5 random questions; 60% pass; maximum 2 attempts; no negative marking.',
        worksheet: 'Research recorded for two specific roles with at least 2 credible sources each.',
        humanReview: 'Rubric score at least 6/10; revisions completed; feedback acknowledged.',
        closure: 'Learner confirms prioritized direction and 7-day research task.',
      },
    },

    notes: {
      titleEn: 'Exploring Career Roles and Opportunities',
      titleKn: 'ವೃತ್ತಿ ಪಾತ್ರಗಳು ಮತ್ತು ಅವಕಾಶಗಳನ್ನು ಅನ್ವೇಷಿಸುವುದು',
      introEn:
        'A career field is broad, while a job role is specific with concrete daily responsibilities. Before committing to a direction, you must understand why the role exists, what tasks fill an average week, what tools are required, and where your evidence matches or has gaps.',
      introKn:
        'ವೃತ್ತಿ ಕ್ಷೇತ್ರವು ವಿಶಾಲವಾದದ್ದು, ಆದರೆ ವೃತ್ತಿಪಾತ್ರವು ನಿರ್ದಿಷ್ಟ ಜವಾಬ್ದಾರಿಗಳಿರುವ ಕೆಲಸ. ವೃತ್ತಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡುವ ಮೊದಲು ಪಾತ್ರವನ್ನು ಕೂಲಂಕಷವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
      sectionsEn: [
        {
          heading: 'Career field versus job role',
          body: 'Information Technology is a field; Software Tester or Cloud Support Associate is a role. Marketing is a field; Performance Marketing Specialist is a role. Meaningful research is only possible when you zoom in on a specific role.',
        },
        {
          heading: 'Three skill categories for every role',
          body: 'When evaluating role requirements across real job postings, categorize requirements into three clear buckets:',
          bulletList: [
            'Technical or Functional Skills: Core domain knowledge required to execute tasks (e.g. SQL querying, manual testing, financial modeling).',
            'Employability Skills: Universal behavioural competencies (e.g. structured communication, problem-solving, stakeholder coordination).',
            'Tools and Applications: Software and platforms used on the job (e.g. Jira, Git, Excel, Figma, Postman).',
          ],
        },
        {
          heading: 'Explore the entry pathway',
          body: 'Study how beginners enter and advance. A typical trajectory progresses through distinct tiers: Intern / Graduate Trainee → Associate / Junior Executive → Specialist → Team Lead / Manager.',
        },
        {
          heading: 'Use credible sources only',
          body: 'Do not rely on hearsay or films. Use employer job descriptions, corporate careers pages, recognised job portals (Naukri, LinkedIn), verified industry practitioners, and college alumni currently working in the role.',
        },
        {
          heading: 'Evaluate your evidence against gaps',
          body: 'Compare requirements against your profile. A skill gap is not a reason to surrender—it is your precise roadmap for preparation and upskilling.',
        },
      ],
      sectionsKn: [
        {
          heading: 'ಕ್ಷೇತ್ರ ಮತ್ತು ಪಾತ್ರದ ವ್ಯತ್ಯಾಸ',
          body: 'ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಒಂದು ಕ್ಷೇತ್ರ; Software Tester ಒಂದು ನಿರ್ದಿಷ್ಟ ಪಾತ್ರ. ಮಾರ್ಕೆಟಿಂಗ್ ಒಂದು ಕ್ಷೇತ್ರ; Digital Marketing Executive ಒಂದು ಪಾತ್ರ. ನಿರ್ದಿಷ್ಟ ಪಾತ್ರವನ್ನು ಪರಿಶೀಲಿಸಿದಾಗ ಮಾತ್ರ ಸಂಶೋಧನೆ ಉಪಯುಕ್ತವಾಗುತ್ತದೆ.',
        },
        {
          heading: 'ಮೂರು ಪ್ರಮುಖ ಕೌಶಲ್ಯ ವರ್ಗಗಳು',
          body: 'ಉದ್ಯೋಗದ ಅಗತ್ಯತೆಗಳನ್ನು ಮೂರು ವಿಭಾಗಗಳಲ್ಲಿ ಗುರುತಿಸಿ:',
          bulletList: [
            'ತಾಂತ್ರಿಕ / ಕಾರ್ಯಾತ್ಮಕ ಕೌಶಲ್ಯ: ಕೆಲಸಕ್ಕೆ ಅಗತ್ಯವಾದ ತಾಂತ್ರಿಕ ಜ್ಞಾನ (ಉದಾ: SQL, ಸಾಫ್ಟ್‌ವೇರ್ ಟೆಸ್ಟಿಂಗ್, ಅಕೌಂಟಿಂಗ್).',
            'ಉದ್ಯೋಗಾರ್ಹತೆ ಕೌಶಲ್ಯ: ಸಂವಹನ, ಸಮಸ್ಯೆ ಪರಿಹಾರ, ತಂಡಕಾರ್ಯ.',
            'ಉಪಕರಣಗಳು / ಅಪ್ಲಿಕೇಶನ್‌ಗಳು: ಬಳಸುವ ಸಾಫ್ಟ್‌ವೇರ್‌ಗಳು (ಉದಾ: Jira, Excel, Git, Figma).',
          ],
        },
        {
          heading: 'ಪ್ರವೇಶ ಮಾರ್ಗವನ್ನು ಅನ್ವೇಷಿಸಿ',
          body: 'ಪ್ರವೇಶ ಹಂತ, ಅರ್ಹತೆ ಮತ್ತು ಬೆಳವಣಿಗೆಯನ್ನು ಪರಿಶೀಲಿಸಿ. ಉದಾಹರಣೆ: Intern → Executive → Specialist → Manager.',
        },
        {
          heading: 'ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲಗಳನ್ನು ಮಾತ್ರ ಬಳಸಿ',
          body: 'ಉದ್ಯೋಗ ವಿವರಣೆ, ಕಂಪನಿ ವೆಬ್‌ಸೈಟ್, ಜಾಬ್ ಪೋರ್ಟಲ್ ಮತ್ತು ಅನುಭವಿ ವೃತ್ತಿಪರರಿಂದ ಮಾಹಿತಿ ಪಡೆದು ದಾಖಲಿಸಿ.',
        },
      ],
      goldenQuoteEn: 'Understand the role before choosing the career.',
      goldenQuoteKn: 'ವೃತ್ತಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡುವ ಮೊದಲು ವೃತ್ತಿಪಾತ್ರವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
      formulaEn: 'Role → Responsibilities → Required Skills → Entry Pathway → Opportunities → My Evidence → My Gaps',
      formulaKn: 'ಪಾತ್ರ → ಜವಾಬ್ದಾರಿಗಳು → ಅಗತ್ಯ ಕೌಶಲ್ಯಗಳು → ಪ್ರವೇಶ ಮಾರ್ಗ → ಅವಕಾಶಗಳು → ನನ್ನ ಸಾಕ್ಷ್ಯ → ನನ್ನ ಅಂತರಗಳು',
    },

    video: {
      targetDuration: '8–9 minutes',
      sections: [
        {
          step: 1,
          titleEn: '1 · Opening',
          titleKn: '1 · ಆರಂಭ',
          duration: '0:50',
          scriptEn:
            'Welcome to Lesson 3. Lessons 1 and 2 helped you identify strengths and possible directions. Now investigate what the careers actually involve: daily work, employer expectations, entry routes, progression and fit. Understand the role before choosing the career.',
          scriptKn:
            'ಪಾಠ 1 ಮತ್ತು 2ರಲ್ಲಿ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಸಾಧ್ಯ ವೃತ್ತಿ ದಿಕ್ಕುಗಳನ್ನು ಗುರುತಿಸಿದ್ದೀರಿ. ಈಗ ದೈನಂದಿನ ಕೆಲಸ, ಅಗತ್ಯ ಕೌಶಲ್ಯ, ಪ್ರವೇಶ ಮಾರ್ಗ, ಬೆಳವಣಿಗೆ ಮತ್ತು ಹೊಂದಾಣಿಕೆಯನ್ನು ಪರಿಶೀಲಿಸಿ. ವೃತ್ತಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡುವ ಮೊದಲು ಪಾತ್ರವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ.',
        },
        {
          step: 2,
          titleEn: '2 · Field versus role',
          titleKn: '2 · ಕ್ಷೇತ್ರ ಮತ್ತು ಪಾತ್ರ',
          duration: '0:50',
          scriptEn:
            'A field is broad; a role is specific. Information Technology is a field and Software Tester is a role. Marketing is a field and Digital Marketing Executive is a role. Move from a broad direction to a role you can investigate.',
          scriptKn:
            'ವೃತ್ತಿ ಕ್ಷೇತ್ರ ವಿಶಾಲ; ವೃತ್ತಿಪಾತ್ರ ನಿರ್ದಿಷ್ಟ. Information Technology ಕ್ಷೇತ್ರ; Software Tester ಪಾತ್ರ. Marketing ಕ್ಷೇತ್ರ; Digital Marketing Executive ಪಾತ್ರ. ವಿಶಾಲ ದಿಕ್ಕಿನಿಂದ ಪರಿಶೀಲಿಸಬಹುದಾದ ನಿರ್ದಿಷ್ಟ ಪಾತ್ರಕ್ಕೆ ಸಾಗಿರಿ.',
        },
        {
          step: 3,
          titleEn: '3 · Role purpose',
          titleKn: '3 · ಪಾತ್ರದ ಉದ್ದೇಶ',
          duration: '0:45',
          scriptEn:
            'Every role exists to create a result. A tester supports software quality; a recruiter helps hire suitable people; a data analyst converts data into insights; customer success helps users succeed. Begin by asking why the role exists.',
          scriptKn:
            'ಪ್ರತಿಯೊಂದು ಪಾತ್ರವೂ ಒಂದು ಫಲಿತಾಂಶ ಸೃಷ್ಟಿಸುತ್ತದೆ. Tester software quality ಬೆಂಬಲಿಸುತ್ತಾರೆ; Recruiter ಸೂಕ್ತ ಅಭ್ಯರ್ಥಿ ನೇಮಕಕ್ಕೆ ಸಹಾಯ; Data Analyst ದತ್ತಾಂಶವನ್ನು insights ಆಗಿ ಪರಿವರ್ತನೆ. ಈ ಪಾತ್ರ ಏಕೆ ಇದೆ ಎಂದು ಮೊದಲು ಕೇಳಿ.',
        },
        {
          step: 4,
          titleEn: '4 · Daily responsibilities',
          titleKn: '4 · ಜವಾಬ್ದಾರಿಗಳು',
          duration: '0:55',
          scriptEn:
            'Study regular responsibilities, not only the title. A digital marketing executive may create content, support campaigns, review data, coordinate teams and prepare reports. Compare multiple descriptions because companies may define the same title differently.',
          scriptKn:
            'ಹೆಸರಿಗಿಂತ ದೈನಂದಿನ ಕೆಲಸ ಪರಿಶೀಲಿಸಿ. Digital Marketing Executive content, campaign, data, team coordination ಮತ್ತು reporting ಮಾಡಬಹುದು. ಒಂದೇ ಹೆಸರು ಬೇರೆ ಸಂಸ್ಥೆಯಲ್ಲಿ ಬೇರೆ ಜವಾಬ್ದಾರಿ ಹೊಂದಬಹುದು; ಹಲವು descriptions ಹೋಲಿಸಿ.',
        },
        {
          step: 5,
          titleEn: '5 · Required skills',
          titleKn: '5 · ಕೌಶಲ್ಯಗಳು',
          duration: '0:55',
          scriptEn:
            'Identify technical or functional skills, employability skills and tool knowledge. Do not copy one description blindly; find requirements that repeat across credible sources.',
          scriptKn:
            'ತಾಂತ್ರಿಕ/ಕಾರ್ಯಾತ್ಮಕ, ಉದ್ಯೋಗಾರ್ಹತೆ ಮತ್ತು tool knowledge ಗುರುತಿಸಿ. ಒಂದೇ description ನಕಲಿಸದೆ ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲಗಳಲ್ಲಿ ಮರುಮರು ಕಾಣುವ ಅಗತ್ಯಗಳನ್ನು ಗುರುತಿಸಿ.',
        },
        {
          step: 6,
          titleEn: '6 · Entry pathway',
          titleKn: '6 · ಪ್ರವೇಶ ಮಾರ್ಗ',
          duration: '0:45',
          scriptEn:
            'Research entry-level titles, qualifications, internships, projects, certifications, portfolio requirements, selection stages and progression. Example: Digital Marketing Intern → Executive → Specialist → Campaign Manager.',
          scriptKn:
            'Entry-level title, qualification, internship, project, certification, portfolio, selection stages ಮತ್ತು progression ಪರಿಶೀಲಿಸಿ. ಉದಾಹರಣೆ: Intern → Executive → Specialist → Manager.',
        },
        {
          step: 7,
          titleEn: '7 · Reliable sources',
          titleKn: '7 · ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲ',
          duration: '0:50',
          scriptEn:
            'Use employer job descriptions, career pages, recognised portals, industry bodies, internships, alumni, professionals, faculty and occupational-information platforms. Use more than one source and record the name, role and date.',
          scriptKn:
            'Employer job description, company career page, recognised portal, industry body, internship, alumni, professional, faculty ಮತ್ತು occupational platform ಬಳಸಿ. ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಮೂಲ ಬಳಸಿಕೊಂಡು ಹೆಸರು, ಪಾತ್ರ ಮತ್ತು ದಿನಾಂಕ ದಾಖಲಿಸಿ.',
        },
        {
          step: 8,
          titleEn: '8 · Evidence and gaps',
          titleKn: '8 · ಸಾಕ್ಷ್ಯ ಮತ್ತು ಅಂತರ',
          duration: '0:50',
          scriptEn:
            'Compare requirements with evidence you already have, skills you are developing and gaps you must address. Projects, presentations, internships and responsibilities can be evidence. A gap is preparation information, not immediate rejection.',
          scriptKn:
            'ಈಗಿರುವ ಸಾಕ್ಷ್ಯ, ಅಭಿವೃದ್ಧಿಯಲ್ಲಿರುವ ಕೌಶಲ್ಯ ಮತ್ತು ಸರಿಪಡಿಸಬೇಕಾದ ಅಂತರಗಳೊಂದಿಗೆ ಪಾತ್ರದ ಅಗತ್ಯಗಳನ್ನು ಹೋಲಿಸಿ. Project, presentation, internship ಮತ್ತು ಜವಾಬ್ದಾರಿ ಸಾಕ್ಷ್ಯವಾಗಬಹುದು. ಅಂತರವು ಸಿದ್ಧತೆಗೆ ಮಾಹಿತಿ.',
        },
        {
          step: 9,
          titleEn: '9 · Compare two roles',
          titleKn: '9 · ಎರಡು ಪಾತ್ರ ಹೋಲಿಕೆ',
          duration: '0:50',
          scriptEn:
            'Use the canvas to compare purpose, responsibilities, skills, entry opportunities, qualifications, evidence, gaps and work-activity fit. Select one priority role and one alternative role.',
          scriptKn:
            'ಉದ್ದೇಶ, ಜವಾಬ್ದಾರಿ, ಕೌಶಲ್ಯ, ಪ್ರವೇಶ ಅವಕಾಶ, ಅರ್ಹತೆ, ನಮ್ಮ ಸಾಕ್ಷ್ಯ, ಅಂತರ ಮತ್ತು ಇಷ್ಟದ ಕೆಲಸದ ಆಧಾರದ ಮೇಲೆ ಎರಡು ಪಾತ್ರ ಹೋಲಿಸಿ. ಒಂದು ಆದ್ಯತೆಯ ಮತ್ತು ಒಂದು ಪರ್ಯಾಯ ಪಾತ್ರ ಆಯ್ಕೆ ಮಾಡಿ.',
        },
        {
          step: 10,
          titleEn: '10 · Complete activity',
          titleKn: '10 · ಚಟುವಟಿಕೆ',
          duration: '0:50',
          scriptEn:
            'For both roles, record purpose, five responsibilities, recurring skills, entry titles, expectations, progression, your evidence and sources. Explain your priority decision. English, Kannada or both may be used, but facts and sources must be verifiable.',
          scriptKn:
            'ಎರಡೂ ಪಾತ್ರಗಳಿಗೆ ಉದ್ದೇಶ, ಐದು ಜವಾಬ್ದಾರಿ, ಕೌಶಲ್ಯ, entry title, ನಿರೀಕ್ಷೆ, progression, ನಿಮ್ಮ ಸಾಕ್ಷ್ಯ ಮತ್ತು ಮೂಲ ದಾಖಲಿಸಿ. ಆದ್ಯತೆಯ ಕಾರಣ ವಿವರಿಸಿ. ಭಾಷೆ ಅನುಕೂಲಕರವಾಗಿರಬಹುದು; ಮಾಹಿತಿ ಪರಿಶೀಲಿಸಬಹುದಾಗಿರಬೇಕು.',
        },
        {
          step: 11,
          titleEn: '11 · Closing',
          titleKn: '11 · ಸಮಾಪ್ತಿ',
          duration: '0:45',
          scriptEn:
            'Career clarity grows when curiosity is supported by research. Ask not only whether you like the title, but whether you understand the work, possess relevant evidence and have a realistic gap-closing plan. Submit the canvas; next you will build a Career Action Plan.',
          scriptKn:
            'ಕುತೂಹಲಕ್ಕೆ ಸಂಶೋಧನೆಯ ಬೆಂಬಲ ಸಿಕ್ಕಾಗ ವೃತ್ತಿ ಸ್ಪಷ್ಟತೆ ಬೆಳೆಯುತ್ತದೆ. ಉದ್ಯೋಗದ ಹೆಸರು ಇಷ್ಟವೇ ಎನ್ನುವುದಷ್ಟೇ ಅಲ್ಲ; ಕೆಲಸ ಅರ್ಥವಾಗಿದೆಯೇ, ಸಾಕ್ಷ್ಯ ಇದೆಯೇ ಮತ್ತು ಅಂತರ ಸರಿಪಡಿಸುವ ಯೋಜನೆ ಇದೆಯೇ ಎಂದು ಕೇಳಿ. Canvas ಸಲ್ಲಿಸಿ; ಮುಂದಿನ ಪಾಠದಲ್ಲಿ Career Action Plan ನಿರ್ಮಿಸುತ್ತೀರಿ.',
        },
      ],
      keyTakeawaysEn: [
        'A job title alone tells you very little; examine the 5 recurring responsibilities.',
        'Always consult multiple sources to filter out employer-specific jargon.',
        'Contrast two distinct roles to make a defended, conscious priority selection.',
        'A skill gap is not a disqualification—it is the foundation of your upskilling agenda.',
      ],
      keyTakeawaysKn: [
        'ಕೇವಲ ಹುದ್ದೆಯ ಹೆಸರಿನಿಂದ ನಿರ್ಧರಿಸಬೇಡಿ; 5 ಪ್ರಮುಖ ಜವಾಬ್ದಾರಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
        'ವಿವಿಧ ಕಂಪನಿಗಳ ಉದ್ಯೋಗ ವಿವರಣೆಗಳನ್ನು ಹೋಲಿಸಿ ಸಾಮಾನ್ಯ ಅಗತ್ಯಗಳನ್ನು ಗುರುತಿಸಿ.',
        'ಆದ್ಯತೆಯ ಪಾತ್ರದ ಜೊತೆಗೆ ಒಂದು ಪರ್ಯಾಯ ಪಾತ್ರವನ್ನು ಸಿದ್ಧವಾಗಿಟ್ಟುಕೊಳ್ಳಿ.',
        'ಕೌಶಲ್ಯದ ಕೊರತೆಯು ತಕ್ಷಣದ ನಿರಾಕರಣೆಯಲ್ಲ; ಅದು ನಿಮ್ಮ ಮುಂದಿನ ಸಿದ್ಧತೆಗೆ ದಾರಿದೀಪ.',
      ],
    },

    quiz: {
      config: {
        totalBank: 10,
        drawCount: 5,
        passPercent: 60,
        maxAttempts: 2,
      },
      questions: [
        {
          id: 1,
          questionEn: 'What is the key difference between a career field and a job role?',
          questionKn: 'ವೃತ್ತಿ ಕ್ಷೇತ್ರ ಮತ್ತು ವೃತ್ತಿಪಾತ್ರದ ನಡುವಿನ ಪ್ರಮುಖ ವ್ಯತ್ಯಾಸವೇನು?',
          optionsEn: [
            'A field is for degree holders while a role is for diploma holders',
            'A field is a broad domain, while a role is a specific position with defined tasks',
            'A field changes every year while a role never changes',
            'There is no difference; they are interchangeable terms',
          ],
          optionsKn: [
            'ಕ್ಷೇತ್ರ ಪದವೀಧರರಿಗೆ, ಪಾತ್ರ ಡಿಪ್ಲೊಮಾದವರಿಗೆ',
            'ಕ್ಷೇತ್ರವು ವಿಶಾಲ ವಿಭಾಗ, ಪಾತ್ರವು ನಿರ್ದಿಷ್ಟ ಕರ್ತವ್ಯಗಳಿರುವ ಉದ್ಯೋಗ',
            'ಕ್ಷೇತ್ರ ಪ್ರತಿ ವರ್ಷ ಬದಲಾಗುತ್ತದೆ, ಪಾತ್ರ ಬದಲಾಗುವುದಿಲ್ಲ',
            'ಯಾವುದೇ ವ್ಯತ್ಯಾಸವಿಲ್ಲ; ಎರಡೂ ಒಂದೇ',
          ],
          correctIndex: 1,
          explanationEn: 'Fields (e.g. IT, Healthcare) are broad sectors; roles (e.g. QA Tester, Clinical Analyst) define specific daily work.',
          explanationKn: 'ಕ್ಷೇತ್ರವು ವಿಶಾಲ ಉದ್ಯಮವಾದರೆ, ಪಾತ್ರವು ದಿನನಿತ್ಯದ ನಿರ್ದಿಷ್ಟ ಕೆಲಸದ ಜವಾಬ್ದಾರಿಯಾಗಿದೆ.',
        },
        {
          id: 2,
          questionEn: 'What is the very first step when conducting structured role research?',
          questionKn: 'ವೃತ್ತಿ ಸಂಶೋಧನೆಯಲ್ಲಿ ತೆಗೆದುಕೊಳ್ಳಬೇಕಾದ ಮೊದಲ ಹಂತ ಯಾವುದು?',
          optionsEn: [
            'Understanding why the role exists and its core responsibilities',
            'Negotiating the starting bonus',
            'Selecting vacation days and office perks',
            'Buying formal interview suits',
          ],
          optionsKn: [
            'ಪಾತ್ರ ಏಕೆ ಅಸ್ತಿತ್ವದಲ್ಲಿದೆ ಮತ್ತು ಅದರ ಪ್ರಮುಖ ಜವಾಬ್ದಾರಿಗಳನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು',
            'ಪ್ರಾರಂಭಿಕ ಬೋನಸ್ ಕುರಿತು ಚರ್ಚಿಸುವುದು',
            'ರಜೆಯ ದಿನಗಳು ಮತ್ತು ಸವಲತ್ತುಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡುವುದು',
            'ಸಂದರ್ಶನದ ಬಟ್ಟೆಗಳನ್ನು ಖರೀದಿಸುವುದು',
          ],
          correctIndex: 0,
          explanationEn: 'Clarifying the fundamental purpose and business value of a position grounds all subsequent investigation.',
          explanationKn: 'ಪಾತ್ರದ ಉದ್ದೇಶ ಮತ್ತು ದೈನಂದಿನ ಜವಾಬ್ದಾರಿಯನ್ನು ತಿಳಿಯುವುದೇ ಸಂಶೋಧನೆಯ ಮೊದಲ ಮೆಟ್ಟಿಲು.',
        },
        {
          id: 3,
          questionEn: 'Why is it critical to compare multiple job descriptions for the same role title?',
          questionKn: 'ಒಂದೇ ಹುದ್ದೆಯ ಹೆಸರಿನ ಹಲವು ವಿವರಣೆಗಳನ್ನು ಹೋಲಿಸುವುದು ಏಕೆ ಮುಖ್ಯ?',
          optionsEn: [
            'To copy text word-for-word into your profile',
            'Because requirements differ across companies and recurring patterns emerge',
            'To see which company has the most colorful webpage',
            'Because government rules mandate reading at least 10 descriptions',
          ],
          optionsKn: [
            'ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಪದಗಳನ್ನು ನಕಲಿಸಲು',
            'ಸಂಸ್ಥೆಗಳ ಅಗತ್ಯತೆಗಳು ಬದಲಾಗುವುದರಿಂದ ಸಾಮಾನ್ಯ ಮಾದರಿಗಳನ್ನು ಗುರುತಿಸಲು',
            'ಯಾವ ಕಂಪನಿಯ ವೆಬ್‌ಸೈಟ್ ಸುಂದರವಾಗಿದೆ ಎಂದು ನೋಡಲು',
            'ಸರ್ಕಾರವು 10 ವಿವರಣೆ ಓದುವುದನ್ನು ಕಡ್ಡಾಯಗೊಳಿಸಿರುವುದರಿಂದ',
          ],
          correctIndex: 1,
          explanationEn: 'Cross-referencing multiple job postings filters out proprietary jargon and highlights core industry requirements.',
          explanationKn: 'ಹಲವು ವಿವರಣೆಗಳನ್ನು ಗಮನಿಸಿದಾಗ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮರುಮರು ಕಾಣುವ ಸಾಮಾನ್ಯ ಅಗತ್ಯಗಳು ಗೋಚರಿಸುತ್ತವೆ.',
        },
        {
          id: 4,
          questionEn: 'Which of the following is classified as an employability skill?',
          questionKn: 'ಯಾವುದು ಉದ್ಯೋಗಾರ್ಹತೆ ಕೌಶಲ್ಯಕ್ಕೆ ಉದಾಹರಣೆಯಾಗಿದೆ?',
          optionsEn: [
            'Structured communication and teamwork',
            'Soldering circuit microchips',
            'Writing complex C++ compiler optimizations',
            'Configuring Cisco network routers',
          ],
          optionsKn: [
            'ಸ್ಪಷ್ಟ ಸಂವಹನ ಮತ್ತು ತಂಡಕಾರ್ಯ',
            'ಸರ್ಕ್ಯೂಟ್ ಮೈಕ್ರೋಚಿಪ್ ಸಾಲ್ಡರಿಂಗ್',
            'ಸಿ++ ಕಂಪೈಲರ್ ಕೋಡಿಂಗ್',
            'ಸಿಸ್ಕೋ ನೆಟ್‌ವರ್ಕ್ ರೂಟರ್ ಕಾನ್ಫಿಗರೇಶನ್',
          ],
          correctIndex: 0,
          explanationEn: 'Employability skills represent universal behavioral competencies like teamwork, problem solving and communication.',
          explanationKn: 'ಸಂವಹನ, ಹೊಂದಾಣಿಕೆ ಮತ್ತು ತಂಡಕಾರ್ಯ ಸಾರ್ವತ್ರಿಕ ಉದ್ಯೋಗಾರ್ಹತೆ ಕೌಶಲ್ಯಗಳಾಗಿವೆ.',
        },
        {
          id: 5,
          questionEn: 'Which is an example of a technical or functional skill?',
          questionKn: 'ತಾಂತ್ರಿಕ ಅಥವಾ ಕಾರ್ಯಾತ್ಮಕ ಕೌಶಲ್ಯಕ್ಕೆ ಉದಾಹರಣೆ ಯಾವುದು?',
          optionsEn: [
            'General punctuality and attendance',
            'Spreadsheet financial analysis or automated software testing',
            'Polite telephone etiquette',
            'Wearing business formal attire',
          ],
          optionsKn: [
            'ಸಾಮಾನ್ಯ ಸಮಯಪಾಲನೆ ಮತ್ತು ಹಾಜರಾತಿ',
            'ಸ್ಪ್ರೆಡ್‌ಶೀಟ್ ದತ್ತಾಂಶ ವಿಶ್ಲೇಷಣೆ ಅಥವಾ ಸಾಫ್ಟ್‌ವೇರ್ ಟೆಸ್ಟಿಂಗ್',
            'ವಿನಯಪೂರ್ವಕ ಫೋನ್ ಸಂಭಾಷಣೆ',
            'ಔಪಚಾರಿಕ ಉಡುಗೆ ಧರಿಸುವುದು',
          ],
          correctIndex: 1,
          explanationEn: 'Technical and functional skills are specific domain competencies required to perform tasks.',
          explanationKn: 'ದತ್ತಾಂಶ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಟೆಸ್ಟಿಂಗ್ ನಿರ್ದಿಷ್ಟ ಕಾರ್ಯವನ್ನು ಸಾಧಿಸಲು ಅಗತ್ಯವಿರುವ ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯಗಳು.',
        },
        {
          id: 6,
          questionEn: 'What does a role’s "entry pathway" explain?',
          questionKn: 'ಪ್ರವೇಶ ಮಾರ್ಗವು ಏನನ್ನು ವಿವರಿಸುತ್ತದೆ?',
          optionsEn: [
            'The physical hallway entrance to the office building',
            'The progression route from entry-level/intern titles to specialist and managerial stages',
            'The bus route from your home to the campus',
            'The elevator guidelines in corporate towers',
          ],
          optionsKn: [
            'ಕಚೇರಿ ಕಟ್ಟಡದ ಪ್ರವೇಶ ದ್ವಾರ',
            'ಪ್ರವೇಶ ಹಂತ/ಇಂಟರ್ನ್‌ಶಿಪ್‌ನಿಂದ ಸ್ಪೆಷಲಿಸ್ಟ್ ಮತ್ತು ಮ್ಯಾನೇಜರ್ ಹಂತದವರೆಗೆ ಬೆಳೆಯುವ ಮಾರ್ಗ',
            'ಮನೆಯಿಂದ ಕಾಲೇಜಿಗೆ ಹೋಗುವ ಬಸ್ ಮಾರ್ಗ',
            'ಲಿಫ್ಟ್ ಬಳಸುವ ನಿಯಮಗಳು',
          ],
          correctIndex: 1,
          explanationEn: 'The entry pathway maps qualifications, starting titles, and step-by-step career progression milestones.',
          explanationKn: 'ಆರಂಭಿಕ ಹಂತದಿಂದ ಹಿಡಿದು ಭವಿಷ್ಯದ ಉನ್ನತ ಹಂತಗಳವರೆಗೆ ಸಾಗುವ ಹಂತಗಳೇ ಪ್ರವೇಶ ಮಾರ್ಗ.',
        },
        {
          id: 7,
          questionEn: 'What is the most reliable approach when researching career roles?',
          questionKn: 'ವೃತ್ತಿ ಪಾತ್ರ ಸಂಶೋಧನೆಗೆ ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ವಿಧಾನ ಯಾವುದು?',
          optionsEn: [
            'Watching fictional television dramas',
            'Believing social media influencers promising overnight riches',
            'Comparing multiple credible sources like employer JDs, verified professionals and industry portals',
            'Assuming all companies operate identically to your local shop',
          ],
          optionsKn: [
            'ಟಿವಿ ನಾಟಕ ಮತ್ತು ಸಿನಿಮಾಗಳನ್ನು ನೋಡುವುದು',
            'ಸೋಷಿಯಲ್ ಮೀಡಿಯಾದಲ್ಲಿ ರಾತ್ರೋರಾತ್ರಿ ಶ್ರೀಮಂತರಾಗುವ ಜಾಹೀರಾತು ನಂಬುವುದು',
            'ಕಂಪನಿ ಜಾಬ್ ವಿವರಣೆ, ವೃತ್ತಿಪರರು ಮತ್ತು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಂತಹ ಹಲವು ವಿಶ್ವಾಸಾರ್ಹ ಮೂಲಗಳನ್ನು ಹೋಲಿಸುವುದು',
            'ಎಲ್ಲಾ ಕಂಪನಿಗಳೂ ಒಂದೇ ರೀತಿ ಕೆಲಸ ಮಾಡುತ್ತವೆ ಎಂದು ಊಹಿಸುವುದು',
          ],
          correctIndex: 2,
          explanationEn: 'Reliability requires primary sources, factual job postings, and insights from active practitioners.',
          explanationKn: 'ವಿಶ್ವಾಸಾರ್ಹ ಮಾಹಿತಿಗಾಗಿ ಅಧಿಕೃತ ಉದ್ಯೋಗ ವಿವರಣೆಗಳು ಮತ್ತು ನೈಜ ವೃತ್ತಿಪರರ ಅನುಭವಗಳನ್ನು ಹೋಲಿಸಬೇಕು.',
        },
        {
          id: 8,
          questionEn: 'What is an evidence gap in role research?',
          questionKn: 'ಪಾತ್ರ ಸಂಶೋಧನೆಯಲ್ಲಿ ಸಾಕ್ಷ್ಯದ ಅಂತರ ಎಂದರೆ ಏನು?',
          optionsEn: [
            'A required skill or qualification where your current verifiable proof is limited',
            'A gap year taken between school and college',
            'A missing page in your printed resume',
            'A broken link on a website',
          ],
          optionsKn: [
            'ಉದ್ಯೋಗಕ್ಕೆ ಅಗತ್ಯವಿರುವ ಕೌಶಲ್ಯದಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ನಿಮ್ಮ ಬಳಿ ಸಾಕ್ಷ್ಯ ಕಡಿಮೆಯಿರುವ ಜಾಗ',
            'ಶಾಲಾ ಶಿಕ್ಷಣದ ನಂತರ ತೆಗೆದುಕೊಂಡ ವಿರಾಮ',
            'ರೆಸ್ಯೂಮ್‌ನಲ್ಲಿ ಕಳೆದುಹೋದ ಪುಟ',
            'ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಕೆಲಸ ಮಾಡದ ಲಿಂಕ್',
          ],
          correctIndex: 0,
          explanationEn: 'An evidence gap highlights skills you must actively build and document prior to placement interviews.',
          explanationKn: 'ಕೆಲಸಕ್ಕೆ ಬೇಕಾದ ಕೌಶಲ್ಯಕ್ಕೆ ತಕ್ಕಂತೆ ನಿಮ್ಮಲ್ಲಿ ಸದ್ಯಕ್ಕೆ ನೈಜ ಸಾಕ್ಷ್ಯದ ಕೊರತೆಯಿರುವುದೇ ಅಂತರ.',
        },
        {
          id: 9,
          questionEn: 'Why is it recommended to maintain an alternative role in your canvas?',
          questionKn: 'ಪರ್ಯಾಯ ಪಾತ್ರವನ್ನು ಸಿದ್ಧವಾಗಿಟ್ಟುಕೊಳ್ಳುವುದು ಏಕೆ ಮುಖ್ಯ?',
          optionsEn: [
            'To confuse recruiters during interviews',
            'To retain another evidence-supported pathway and increase placement resilience',
            'Because companies require every graduate to apply for two roles simultaneously',
            'To avoid making any firm decisions in college',
          ],
          optionsKn: [
            'ಸಂದರ್ಶಕರನ್ನು ಗೊಂದಲಗೊಳಿಸಲು',
            'ಮತ್ತೊಂದು ಸಾಕ್ಷ್ಯ-ಆಧಾರಿತ ಮಾರ್ಗವನ್ನು ಉಳಿಸಿಕೊಂಡು ಉದ್ಯೋಗದ ಅವಕಾಶಗಳನ್ನು ಹೆಚ್ಚಿಸಲು',
            'ಪ್ರತಿಯೊಬ್ಬರೂ ಕಡ್ಡಾಯವಾಗಿ ಎರಡು ಹುದ್ದೆಗಳಿಗೆ ಅರ್ಜಿ ಹಾಕಬೇಕೆಂಬ ನಿಯಮವಿರುವುದರಿಂದ',
            'ಕಾಲೇಜಿನಲ್ಲಿ ಯಾವುದೇ ನಿರ್ಧಾರ ತೆಗೆದುಕೊಳ್ಳುವುದನ್ನು ತಪ್ಪಿಸಲು',
          ],
          correctIndex: 1,
          explanationEn: 'Having a backed alternative broadens your opportunity horizon and safeguards against market fluctuations.',
          explanationKn: 'ಪರ್ಯಾಯ ಪಾತ್ರವು ಮಾರುಕಟ್ಟೆಯ ಬದಲಾವಣೆಗಳಿಗೆ ಸುರಕ್ಷತೆ ನೀಡಿ ಅವಕಾಶಗಳನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
        },
        {
          id: 10,
          questionEn: 'What is the primary evidence output for Lesson 3?',
          questionKn: 'ಪಾಠ 3ರ ಪ್ರಮುಖ ಸಾಕ್ಷ್ಯ ಫಲಿತಾಂಶ ಯಾವುದು?',
          optionsEn: [
            'A signed internship contract',
            'A verified company offer letter',
            'Career Role Exploration Canvas',
            'An academic marks card',
          ],
          optionsKn: [
            'ಸಹಿ ಮಾಡಿದ ಇಂಟರ್ನ್‌ಶಿಪ್ ಒಪ್ಪಂದ',
            'ಅಧಿಕೃತ ಕಂಪನಿ ಆಫರ್ ಲೆಟರ್',
            'Career Role Exploration Canvas',
            'ಪರೀಕ್ಷಾ ಅಂಕಪಟ್ಟಿ',
          ],
          correctIndex: 2,
          explanationEn: 'Lesson 3 culminates in the comprehensive, two-role Career Role Exploration Canvas.',
          explanationKn: 'ಪಾಠ 3 ರ ಮುಖ್ಯ ಔಟ್‌ಪುಟ್ Career Role Exploration Canvas ಆಗಿದೆ.',
        },
      ],
    },

    rubric: {
      maxScore: 10,
      threshold: 6,
      criteria: [
        {
          name: 'Quality of role research',
          score0: 'Missing, fabricated or unreliable sources.',
          score1: 'Some relevant data, but limited sources or superficial analysis.',
          score2: 'Both roles investigated using at least 2 credible, recorded sources each.',
        },
        {
          name: 'Understanding responsibilities',
          score0: 'Missing, copied verbatim without comprehension or unrelated.',
          score1: 'Some relevant tasks, limited clarity on day-to-day workflow.',
          score2: 'Clear role purpose + five specific responsibilities documented for both roles.',
        },
        {
          name: 'Required skills',
          score0: 'Missing, incorrect or generic adjectives.',
          score1: 'Some skills listed, weak categorization across technical and employability.',
          score2: 'Accurately categorized technical, employability and tool competencies.',
        },
        {
          name: 'Evidence and gaps',
          score0: 'No comparison with learner profile.',
          score1: 'Partial or weak connection between profile and role requirements.',
          score2: 'Evidence possessed, developing skills and priority gaps mapped to requirements.',
        },
        {
          name: 'Prioritisation and action',
          score0: 'Missing or unsupported choices.',
          score1: 'Vague reasoning for priority selection; unfocused action.',
          score2: 'Logical priority + alternative selection with specific seven-day investigation action.',
        },
      ],
      feedbackSentenceFrame:
        '“Your research is strongest where you identified [Positive Finding] using [Source]. Clarify [Ambiguity]. Your current evidence supports [Role]; first address [Specific Gap] within seven days.”',
    },

    guidedSession: {
      duration: '30 minutes',
      agenda: [
        { time: '0–3 min', facilitatorAction: 'Welcome; explain why titles alone are insufficient.', learnerOutput: 'Understands purpose.' },
        { time: '3–7 min', facilitatorAction: 'Clarify field versus specific role.', learnerOutput: 'Correct example.' },
        { time: '7–12 min', facilitatorAction: 'Demonstrate seven-element exploration framework.', learnerOutput: 'Understands framework.' },
        { time: '12–18 min', facilitatorAction: 'Pair-review one researched role.', learnerOutput: 'Finds unsupported information.' },
        { time: '18–23 min', facilitatorAction: 'Compare recurring responsibilities and skills.', learnerOutput: 'Improved role understanding.' },
        { time: '23–27 min', facilitatorAction: 'Review priority and alternative decisions.', learnerOutput: 'Evidence-supported priority.' },
        { time: '27–30 min', facilitatorAction: 'Confirm seven-day investigation action.', learnerOutput: 'Task, source, output and date.' },
      ],
      guardrails: [
        'Validate important requirements through employer JDs, career portals or verified professionals.',
        'Do not decide the learner’s career or treat one job description as universal.',
        'Do not promise placement, salary or promotion.',
        'Do not discourage a role only because gaps exist.',
        'Accept English, Kannada or a comfortable combination; require verifiable information.',
      ],
      closingCommitmentTemplate:
        '“My priority role is [Role] because [Reason]. My first gap is [Gap]. Within seven days, I will verify or complete [Action] using [Source].”',
    },
  },

  // =========================================================================
  // LESSON 4: Building My Career Action Plan
  // =========================================================================
  4: {
    id: 4,
    numberStr: '04',
    title: 'Building My Career Action Plan',
    subtitle: 'Career Clarity Becomes Valuable Only When It Leads to Consistent Action',
    primaryEvidence: 'My Career Action Plan / Active Plan',
    tagline: 'Translate clarity into a realistic 6–12-month SMART-E roadmap with milestones across 4 horizons.',
    xpReward: 300,
    durationMin: 75,
    framework: 'Career Goal → Requirement → Current Evidence → Gap → Action → Timeline → Proof → Review',

    specification: {
      purpose: 'Convert the priority role, requirements, evidence and gaps from Lessons 1–3 into a realistic 6–12-month Career Action Plan.',
      outcomes: [
        'Define a clear, evidence-based 6–12-month career goal statement',
        'Convert identified skill gaps into SMART-E action items',
        'Plan actionable milestones across four horizons (7 days, 30 days, 3 months, 6 months)',
        'Incorporate balanced preparation across learning, practice, evidence, networking and opportunities',
        'Anticipate real barriers, design practical fallbacks, and schedule monthly review checkpoints',
      ],
      primaryOutput: 'Approved bilingual My Career Action Plan, activated for monthly milestone tracking.',
      deliveryMix: 'Platform planning work (60–75 mins) + 30-minute guided session.',
      estimatedTime: '60–75 minutes platform/planning work + 30-minute guided session.',
      eriContribution: 'Career clarity, goal setting, planning and execution, improvement ownership, opportunity readiness and career self-management.',
      lockedRules: {
        video: 'At least 90% watched; learning note opened; bilingual accessible.',
        note: 'Opened and read by learner.',
        quiz: '5 random of 10; 60% pass mark; 2 attempts; no negative marking.',
        worksheet: 'Complete priority/alternative roles, goal statement, requirements, gaps, 4 horizons, barriers and commitment.',
        humanReview: 'Rubric score at least 6/10; revision history preserved; feedback acknowledged.',
        closure: 'Approved submission becomes an Active Plan for AERS milestone and ERI tracking.',
      },
    },

    notes: {
      titleEn: 'Building My Career Action Plan',
      titleKn: 'ನನ್ನ ವೃತ್ತಿ ಕ್ರಿಯಾ ಯೋಜನೆಯನ್ನು ನಿರ್ಮಿಸುವುದು',
      introEn:
        'Career clarity becomes valuable only when it leads to consistent action. A plan is not a wish list or a rigid prediction—it is a structured, practical commitment to turn skill gaps into tangible evidence over the next 6 to 12 months.',
      introKn:
        'ವೃತ್ತಿ ಸ್ಪಷ್ಟತೆಯು ನಿರಂತರ ಕ್ರಮಕ್ಕೆ ಕಾರಣವಾದಾಗ ಮಾತ್ರ ಮೌಲ್ಯಯುತವಾಗುತ್ತದೆ. ಯೋಜನೆ ಎಂದರೆ ಕೇವಲ ಆಸೆಗಳ ಪಟ್ಟಿಯಲ್ಲ; ಮುಂದಿನ 6 ರಿಂದ 12 ತಿಂಗಳುಗಳಲ್ಲಿ ಕೌಶಲ್ಯದ ಅಂತರಗಳನ್ನು ನೈಜ ಸಾಕ್ಷ್ಯವಾಗಿ ಪರಿವರ್ತಿಸುವ ಬದ್ಧತೆಯಾಗಿದೆ.',
      sectionsEn: [
        {
          heading: 'Draft a specific, evidence-based career goal',
          body: 'Replace vague desires like “I want a good corporate job” with a specific, time-bound readiness goal: “Within six months, I will become ready for an entry-level Software Testing role by mastering manual testing fundamentals, completing two web application test suites, and preparing verified portfolio evidence.”',
        },
        {
          heading: 'The SMART-E Action Standard',
          body: 'Every major career action in your roadmap must satisfy the six SMART-E criteria:',
          bulletList: [
            'S — Specific: Clear, unambiguous task description.',
            'M — Measurable: Quantifiable completion criteria.',
            'A — Achievable: Realistic given your academic workload.',
            'R — Relevant: Directly addresses a priority role requirement.',
            'T — Time-bound: Definite start and end target dates.',
            'E — Evidence-based: Produces verifiable proof (project, repository, certificate, document).',
          ],
        },
        {
          heading: 'Four progressive planning horizons',
          body: 'Break big goals into manageable timeframes to maintain steady forward momentum:',
          bulletList: [
            'Next 7 Days: Begin one immediate, bite-sized momentum-building action.',
            'First 30 Days: Build core technical foundations and regular practice routines.',
            'Within 3 Months: Demonstrate developing capability through documented evidence projects.',
            'Within 6 Months: Complete portfolio, finalize mock interviews, and prepare for applications.',
          ],
        },
        {
          heading: 'Balanced career preparation',
          body: 'Do not just watch tutorial videos. Balanced career readiness integrates five essential dimensions: (1) Conceptual Learning, (2) Hands-on Practice, (3) Evidence Building, (4) Professional Networking, and (5) Opportunity Exploration.',
        },
        {
          heading: 'Anticipate barriers and prepare fallbacks',
          body: 'Life will present obstacles—exam pressure, paid course costs, motivation drops, or lack of guidance. Pre-plan contingency fallbacks (e.g. using free open-source materials when a paid resource is unaffordable) so progress never halts.',
        },
        {
          heading: 'Monthly review discipline',
          body: 'Track tasks using three unambiguous states: NS (Not Started), IP (In Progress), and CE (Completed with Evidence). Never mark a task completed unless physical proof exists.',
        },
      ],
      sectionsKn: [
        {
          heading: 'ಸ್ಪಷ್ಟ ವೃತ್ತಿ ಗುರಿ',
          body: '“ಒಳ್ಳೆಯ ಉದ್ಯೋಗ ಬೇಕು” ಎಂಬ ಅಸ್ಪಷ್ಟ ಗುರಿಯ ಬದಲಿಗೆ ನಿರ್ದಿಷ್ಟ readiness ಗುರಿಯನ್ನು ರೂಪಿಸಿ: ಪಾತ್ರ, ಅವಧಿ, ಫಲಿತಾಂಶ ಮತ್ತು ಸಾಕ್ಷ್ಯವನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ.',
        },
        {
          heading: 'SMART-E ಕ್ರಮದ ಮಾನದಂಡ',
          body: 'ಪ್ರತಿಯೊಂದು ಮುಖ್ಯ ಕ್ರಮವು SMART-E ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಬೇಕು:',
          bulletList: [
            'Specific: ನಿರ್ದಿಷ್ಟ ಮತ್ತು ಸ್ಪಷ್ಟ.',
            'Measurable: ಅಳೆಯಬಹುದಾದ ಪ್ರಗತಿ.',
            'Achievable: ನಿಮ್ಮ ಸಾಮರ್ಥ್ಯಕ್ಕೆ ಸಾಧಿಸಬಹುದಾದದ್ದು.',
            'Relevant: ಆಯ್ಕೆ ಮಾಡಿದ ಪಾತ್ರಕ್ಕೆ ಸಂಬಂಧಿಸಿದ್ದು.',
            'Time-bound: ನಿಖರ ಗಡುವುಳ್ಳದ್ದು.',
            'Evidence-based: ಸಾಕ್ಷ್ಯಾಧಾರಿತ ಫಲಿತಾಂಶ.',
          ],
        },
        {
          heading: 'ನಾಲ್ಕು ಸಮಯಾವಧಿಗಳ ಯೋಜನೆ',
          body: 'ಗುರಿಯನ್ನು ನಾಲ್ಕು ಹಂತಗಳಲ್ಲಿ ವಿಂಗಡಿಸಿ:',
          bulletList: [
            '7 ದಿನಗಳಲ್ಲಿ: ತಕ್ಷಣದ ಆರಂಭಿಕ ಕ್ರಮ.',
            '30 ದಿನಗಳಲ್ಲಿ: ಅಡಿಪಾಯ ಮತ್ತು ದೈನಂದಿನ ಅಭ್ಯಾಸ.',
            '3 ತಿಂಗಳಲ್ಲಿ: ಪ್ರಾಜೆಕ್ಟ್ ಮತ್ತು ಸಾಮರ್ಥ್ಯದ ಸಾಕ್ಷ್ಯ.',
            '6 ತಿಂಗಳಲ್ಲಿ: ಇಂಟರ್ನ್‌ಶಿಪ್ ಅಥವಾ ನೇಮಕಾತಿಗೆ ಸಂಪೂರ್ಣ ಸಿದ್ಧತೆ.',
          ],
        },
        {
          heading: 'ಅಡೆತಡೆ ಮತ್ತು ಪರ್ಯಾಯ ಯೋಜನೆ',
          body: 'ಸಮಯ, ವೆಚ್ಚ ಅಥವಾ ಮಾರ್ಗದರ್ಶನದ ಕೊರತೆಯಂತಹ ಅಡೆತಡೆಗಳನ್ನು ಮೊದಲೇ ಊಹಿಸಿ ಪರ್ಯಾಯ ಮಾರ್ಗವನ್ನು ರೂಪಿಸಿಕೊಳ್ಳಿ.',
        },
      ],
      goldenQuoteEn: 'Consistent action creates evidence, and evidence builds confidence.',
      goldenQuoteKn: 'ನಿರಂತರ ಕ್ರಮ ಸಾಕ್ಷ್ಯವನ್ನು ನಿರ್ಮಿಸುತ್ತದೆ; ಸಾಕ್ಷ್ಯ ಆತ್ಮವಿಶ್ವಾಸವನ್ನು ಬೆಳೆಸುತ್ತದೆ.',
      formulaEn: 'Career Goal → Requirement → Current Evidence → Gap → Action → Timeline → Proof → Review',
      formulaKn: 'ವೃತ್ತಿ ಗುರಿ → ಅಗತ್ಯತೆ → ಪ್ರಸ್ತುತ ಸಾಕ್ಷ್ಯ → ಅಂತರ → ಕ್ರಮ → ಸಮಯಾವಧಿ → ಸಾಕ್ಷಿ → ಪರಿಶೀಲನೆ',
    },

    video: {
      targetDuration: '8–9 minutes',
      sections: [
        {
          step: 1,
          titleEn: '1 · Opening',
          titleKn: '1 · ಆರಂಭ',
          duration: '0:50',
          scriptEn:
            'Lessons 1–3 built self-awareness, strength-to-career connections and role research. Now convert clarity into action. Career clarity becomes valuable only when it leads to consistent action.',
          scriptKn:
            'ಪಾಠ 1–3ರಲ್ಲಿ ಸ್ವ-ಅರಿವು, ಸಾಮರ್ಥ್ಯ-ವೃತ್ತಿ ಸಂಪರ್ಕ ಮತ್ತು ಪಾತ್ರ ಸಂಶೋಧನೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಈಗ ಸ್ಪಷ್ಟತೆಯನ್ನು ಕ್ರಮಕ್ಕೆ ಪರಿವರ್ತಿಸಿ. ನಿರಂತರ ಕ್ರಮಕ್ಕೆ ಕಾರಣವಾದಾಗ ಮಾತ್ರ ವೃತ್ತಿ ಸ್ಪಷ್ಟತೆ ಮೌಲ್ಯಯುತ.',
        },
        {
          step: 2,
          titleEn: '2 · Clear goal',
          titleKn: '2 · ಸ್ಪಷ್ಟ ಗುರಿ',
          duration: '0:50',
          scriptEn:
            'A useful goal names the priority role, outcome, preparation period and evidence. Example: within six months, become ready for entry-level testing roles by developing testing knowledge, completing two projects and preparing interview evidence.',
          scriptKn:
            'ಉಪಯುಕ್ತ ಗುರಿಯಲ್ಲಿ ಆದ್ಯತೆಯ ಪಾತ್ರ, ಫಲಿತಾಂಶ, ಸಿದ್ಧತೆ ಅವಧಿ ಮತ್ತು ಸಾಕ್ಷ್ಯ ಇರಬೇಕು. ಉದಾಹರಣೆ: ಆರು ತಿಂಗಳಲ್ಲಿ testing ಜ್ಞಾನ, ಎರಡು projects ಮತ್ತು interview evidence ನಿರ್ಮಿಸಿ entry-level testing roleಗೆ ಸಿದ್ಧರಾಗುವುದು.',
        },
        {
          step: 3,
          titleEn: '3 · Role requirements',
          titleKn: '3 · ಪಾತ್ರದ ಅಗತ್ಯತೆ',
          duration: '0:45',
          scriptEn:
            'List technical, employability, tool, portfolio, internship and selection requirements. Compare each with current evidence and classify it as available, developing or a priority gap.',
          scriptKn:
            'ತಾಂತ್ರಿಕ, ಉದ್ಯೋಗಾರ್ಹತೆ, tool, portfolio, internship ಮತ್ತು selection ಅಗತ್ಯತೆ ಪಟ್ಟಿ ಮಾಡಿ. ಪ್ರತಿಯೊಂದನ್ನು ಈಗಿರುವ ಸಾಕ್ಷ್ಯ, ಅಭಿವೃದ್ಧಿಯಲ್ಲಿರುವುದು ಅಥವಾ ಆದ್ಯತೆಯ ಅಂತರ ಎಂದು ಗುರುತಿಸಿ.',
        },
        {
          step: 4,
          titleEn: '4 · Convert gaps',
          titleKn: '4 · ಅಂತರದಿಂದ ಕ್ರಮ',
          duration: '0:50',
          scriptEn:
            'Replace vague actions with specific ones. Instead of “learn spreadsheets,” complete an introductory course and one analysis project within 30 days. Instead of “improve interviews,” record and review one mock interview weekly for four weeks.',
          scriptKn:
            '“Spreadsheet ಕಲಿಯುವುದು” ಬದಲು 30 ದಿನಗಳಲ್ಲಿ introductory course ಮತ್ತು analysis project ಪೂರ್ಣಗೊಳಿಸಿ. “Interview ಸುಧಾರಣೆ” ಬದಲು ನಾಲ್ಕು ವಾರ ಪ್ರತಿ ವಾರ mock interview record ಮಾಡಿ ಪರಿಶೀಲಿಸಿ.',
        },
        {
          step: 5,
          titleEn: '5 · SMART-E',
          titleKn: '5 · SMART-E ಮಾನದಂಡ',
          duration: '0:55',
          scriptEn:
            'Actions must be Specific, Measurable, Achievable, Relevant, Time-bound and Evidence-based. A task, deadline and proof make progress reviewable.',
          scriptKn:
            'ಕ್ರಮವು Specific, Measurable, Achievable, Relevant, Time-bound ಮತ್ತು Evidence-based ಆಗಿರಬೇಕು. ಕೆಲಸ, ಗಡುವು ಮತ್ತು ಸಾಕ್ಷ್ಯ ಪ್ರಗತಿಯನ್ನು ಪರಿಶೀಲಿಸಬಹುದಾಗಿಸುತ್ತದೆ.',
        },
        {
          step: 6,
          titleEn: '6 · Planning horizons',
          titleKn: '6 · ಸಮಯಾವಧಿ',
          duration: '0:55',
          scriptEn:
            'In 7 days begin; in 30 days build foundation and routine; in 3 months demonstrate ability; in 6 months prepare for opportunities; within 12 months progress toward the career outcome.',
          scriptKn:
            '7 ದಿನಗಳಲ್ಲಿ ಆರಂಭ; 30 ದಿನಗಳಲ್ಲಿ ಅಡಿಪಾಯ ಮತ್ತು routine; 3 ತಿಂಗಳಲ್ಲಿ ಸಾಮರ್ಥ್ಯದ ಸಾಕ್ಷ್ಯ; 6 ತಿಂಗಳಲ್ಲಿ ಅವಕಾಶಗಳಿಗೆ ಸಿದ್ಧತೆ; 12 ತಿಂಗಳಲ್ಲಿ ವೃತ್ತಿ ಫಲಿತಾಂಶದತ್ತ ಪ್ರಗತಿ.',
        },
        {
          step: 7,
          titleEn: '7 · Balanced actions',
          titleKn: '7 · ಸಮತೋಲಿತ ಕ್ರಮ',
          duration: '0:45',
          scriptEn:
            'Include learning, practice, evidence-building, networking and opportunity exploration. Courses alone are insufficient; practise, produce proof, seek feedback and investigate opportunities.',
          scriptKn:
            'Learning, practice, evidence-building, networking ಮತ್ತು opportunity exploration ಸೇರಿಸಿ. Course ಮಾತ್ರ ಸಾಕಾಗುವುದಿಲ್ಲ; ಅಭ್ಯಾಸ, ಸಾಕ್ಷ್ಯ, feedback ಮತ್ತು ಅವಕಾಶ ಪರಿಶೀಲನೆ ಅಗತ್ಯ.',
        },
        {
          step: 8,
          titleEn: '8 · Barriers',
          titleKn: '8 · ಅಡೆತಡೆ',
          duration: '0:45',
          scriptEn:
            'Identify possible time, cost, access or guidance barriers. Create fallback actions, such as using a credible free resource and completing the same evidence project when a paid course is unaffordable.',
          scriptKn:
            'ಸಮಯ, ವೆಚ್ಚ, access ಅಥವಾ guidance ಅಡೆತಡೆ ಗುರುತಿಸಿ. Paid course ಸಾಧ್ಯವಿಲ್ಲದಿದ್ದರೆ credible free resource ಬಳಸಿ ಅದೇ evidence project ಪೂರ್ಣಗೊಳಿಸುವ fallback ರೂಪಿಸಿ.',
        },
        {
          step: 9,
          titleEn: '9 · Review system',
          titleKn: '9 · ಪರಿಶೀಲನೆ',
          duration: '0:50',
          scriptEn:
            'Set monthly dates and use Not Started, In Progress and Completed with Evidence. Review completed actions, proof, delays, feedback and necessary changes. Never mark complete without proof.',
          scriptKn:
            'Monthly review dates ನಿಗದಿಪಡಿಸಿ; NS, IP, CE ಬಳಸಿ. ಪೂರ್ಣಗೊಂಡ ಕ್ರಮ, ಸಾಕ್ಷ್ಯ, ವಿಳಂಬ, feedback ಮತ್ತು ಬದಲಾವಣೆ ಪರಿಶೀಲಿಸಿ. ಸಾಕ್ಷ್ಯವಿಲ್ಲದೆ complete ಎಂದು ಗುರುತಿಸಬೇಡಿ.',
        },
        {
          step: 10,
          titleEn: '10 · Complete activity',
          titleKn: '10 · ಚಟುವಟಿಕೆ',
          duration: '0:50',
          scriptEn:
            'Complete the priority and alternative roles, 6–12-month goal, requirements, evidence, gaps, actions across four horizons, proof, networking, opportunities, barriers, fallbacks, review dates and commitment statement. English, Kannada or both may be used.',
          scriptKn:
            'Priority/alternative role, 6–12 ತಿಂಗಳ goal, requirements, evidence, gaps, ನಾಲ್ಕು horizonsನ actions, proof, networking, opportunities, barriers, fallback, review dates ಮತ್ತು commitment ಪೂರ್ಣಗೊಳಿಸಿ.',
        },
        {
          step: 11,
          titleEn: '11 · Closing',
          titleKn: '11 · ಸಮಾಪ್ತಿ',
          duration: '0:45',
          scriptEn:
            'A plan is a practical commitment, not a perfect prediction. Do not wait for perfect confidence: consistent action creates evidence and evidence builds confidence. Submit the plan for review. This completes Module 1.',
          scriptKn:
            'ಯೋಜನೆ ಪರಿಪೂರ್ಣ ಭವಿಷ್ಯವಾಣಿ ಅಲ್ಲ; ಪ್ರಾಯೋಗಿಕ ಬದ್ಧತೆ. ಪರಿಪೂರ್ಣ ಆತ್ಮವಿಶ್ವಾಸಕ್ಕಾಗಿ ಕಾಯಬೇಡಿ. ನಿರಂತರ ಕ್ರಮ ಸಾಕ್ಷ್ಯ ನಿರ್ಮಿಸುತ್ತದೆ; ಸಾಕ್ಷ್ಯ ಆತ್ಮವಿಶ್ವಾಸ ಬೆಳೆಸುತ್ತದೆ. Plan ಸಲ್ಲಿಸಿ. ಇದರಿಂದ Module 1 ಪೂರ್ಣ.',
        },
      ],
      keyTakeawaysEn: [
        'A plan is an operating contract with yourself, not a theoretical wish list.',
        'Always anchor tasks in tangible artifacts (projects, repositories, certifications).',
        'Having pre-planned fallbacks ensures unexpected delays do not kill momentum.',
        'Status is binary: unless verifiable evidence exists, a milestone is never complete.',
      ],
      keyTakeawaysKn: [
        'ಯೋಜನೆಯು ನಿಮ್ಮೊಂದಿಗೆ ಮಾಡಿಕೊಂಡ ಒಡಂಬಡಿಕೆಯೇ ಹೊರತು ಕೇವಲ ಆಶಯಗಳಲ್ಲ.',
        'ಪ್ರತಿಯೊಂದು ಕಲಿಕೆಯನ್ನೂ ಪ್ರಸ್ತುತಪಡಿಸಬಹುದಾದ ಪ್ರಾಜೆಕ್ಟ್ ಅಥವಾ ಸಾಕ್ಷ್ಯಕ್ಕೆ ಜೋಡಿಸಿ.',
        'ಮುಂಚಿತವಾಗಿಯೇ ರೂಪಿಸಿದ ಪರ್ಯಾಯ ಯೋಜನೆಯು ಯಾವುದೇ ಅಡೆತಡೆಯಲ್ಲೂ ಪ್ರಗತಿಯನ್ನು ಕಾಯ್ದುಕೊಳ್ಳುತ್ತದೆ.',
        'ಸಾಕ್ಷ್ಯವಿದ್ದರೆ ಮಾತ್ರ ಕೆಲಸ ಪೂರ್ಣ; ಇಲ್ಲದಿದ್ದರೆ ಅದು ಅಪೂರ್ಣವೆಂದೇ ಅರ್ಥ.',
      ],
    },

    quiz: {
      config: {
        totalBank: 10,
        drawCount: 5,
        passPercent: 60,
        maxAttempts: 2,
      },
      questions: [
        {
          id: 1,
          questionEn: 'What constitutes an effective, actionable career goal statement?',
          questionKn: 'ಉಪಯುಕ್ತ ಮತ್ತು ಸ್ಪಷ್ಟ ವೃತ್ತಿ ಗುರಿ ಹೇಗಿರಬೇಕು?',
          optionsEn: [
            '“I want to become rich and work in a multinational company.”',
            'Target role, timeline, intended readiness outcome, and specific evidence to produce',
            'Selecting whatever company is visiting the college campus first',
            'A general desire to do well without dates or deliverables',
          ],
          optionsKn: [
            '“ನಾನು ಶ್ರೀಮಂತನಾಗಬೇಕು ಮತ್ತು ದೊಡ್ಡ ಕಂಪನಿಯಲ್ಲಿ ಕೆಲಸ ಮಾಡಬೇಕು.”',
            'ಗುರಿಯ ಪಾತ್ರ, ಕಾಲಮಿತಿ, ಸಿದ್ಧತೆಯ ಫಲಿತಾಂಶ ಮತ್ತು ನಿರ್ಮಿಸಬೇಕಾದ ಸಾಕ್ಷ್ಯಗಳ ವಿವರಣೆ',
            'ಕ್ಯಾಂಪಸ್‌ಗೆ ಮೊದಲು ಬರುವ ಯಾವುದೇ ಕಂಪನಿಯನ್ನು ಆರಿಸುವುದು',
            'ಯಾವುದೇ ದಿನಾಂಕ ಅಥವಾ ಫಲಿತಾಂಶವಿಲ್ಲದ ಸಾಮಾನ್ಯ ಆಸೆ',
          ],
          correctIndex: 1,
          explanationEn: 'Actionable goals specify the role, timeframe, target readiness level, and concrete proof.',
          explanationKn: 'ಸ್ಪಷ್ಟ ಗುರಿಯು ಪಾತ್ರ, ನಿಗದಿತ ಅವಧಿ, ನಿರೀಕ್ಷಿತ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಸಾಕ್ಷ್ಯವನ್ನು ಒಳಗೊಂಡಿರುತ್ತದೆ.',
        },
        {
          id: 2,
          questionEn: 'What provides the foundational basis for an authentic Career Action Plan?',
          questionKn: 'ವೃತ್ತಿ ಕ್ರಿಯಾ ಯೋಜನೆಗೆ ಭದ್ರವಾದ ಅಡಿಪಾಯ ಯಾವುದು?',
          optionsEn: [
            'Unverified opinions from social media comments',
            'Copying your classmate’s target milestones',
            'Verified role requirements paired against your current evidence and gaps',
            'Assuming market demands never change over time',
          ],
          optionsKn: [
            'ಸೋಷಿಯಲ್ ಮೀಡಿಯಾದ ಪರಿಶೀಲಿಸದ ಕಾಮೆಂಟ್‌ಗಳು',
            'ಸಹಪಾಠಿಯ ಯೋಜನೆಗಳನ್ನು ಯಥಾವತ್ ನಕಲಿಸುವುದು',
            'ವೃತ್ತಿಪಾತ್ರದ ಅಗತ್ಯತೆಗಳು ಹಾಗೂ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಾಕ್ಷ್ಯ ಮತ್ತು ಅಂತರಗಳ ತಾಳೆ',
            'ಮಾರುಕಟ್ಟೆಯ ಅಗತ್ಯಗಳು ಎಂದಿಗೂ ಬದಲಾಗುವುದಿಲ್ಲ ಎಂದು ನಂಬುವುದು',
          ],
          correctIndex: 2,
          explanationEn: 'Grounded plans arise directly from contrasting investigated role needs with your documented profile.',
          explanationKn: 'ಪಾತ್ರದ ನೈಜ ಅಗತ್ಯಗಳು ಮತ್ತು ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸಾಕ್ಷ್ಯಗಳ ನಡುವಿನ ಅಂತರವೇ ಯೋಜನೆಯ ಮೂಲ.',
        },
        {
          id: 3,
          questionEn: 'What does the "E" in the SMART-E standard signify?',
          questionKn: 'SMART-E ಮಾನದಂಡದಲ್ಲಿ "E" ಅಕ್ಷರವು ಏನನ್ನು ಸೂಚಿಸುತ್ತದೆ?',
          optionsEn: [
            'Expensive',
            'Effortless',
            'Evidence-based',
            'Emotional',
          ],
          optionsKn: [
            'ವೆಚ್ಚದಾಯಕ (Expensive)',
            'ಶ್ರಮವಿಲ್ಲದ (Effortless)',
            'ಸಾಕ್ಷ್ಯಾಧಾರಿತ (Evidence-based)',
            'ಭಾವನಾತ್ಮಕ (Emotional)',
          ],
          correctIndex: 2,
          explanationEn: 'SMART-E emphasizes Evidence-based milestones so that all progress is verified by tangible proof.',
          explanationKn: 'SMART-E ಯಲ್ಲಿ "E" ಎಂದರೆ ಸಾಕ್ಷ್ಯಾಧಾರಿತ (Evidence-based) ಪ್ರಗತಿ ಎಂದರ್ಥ.',
        },
        {
          id: 4,
          questionEn: 'Which is an example of a well-formulated SMART-E milestone?',
          questionKn: 'ಉತ್ತಮ SMART-E ಕ್ರಮಕ್ಕೆ ಸೂಕ್ತ ಉದಾಹರಣೆ ಯಾವುದು?',
          optionsEn: [
            '“I will study computers whenever I find free time.”',
            '“I will become an expert in cloud computing in 2 days.”',
            '“Complete a 30-day SQL fundamentals module and publish one relational database project on GitHub.”',
            '“Apply to 200 random jobs on the internet.”',
          ],
          optionsKn: [
            '“ಸಮಯ ಸಿಕ್ಕಾಗ ಕಂಪ್ಯೂಟರ್ ಕಲಿಯುತ್ತೇನೆ.”',
            '“ಎರಡು ದಿನಗಳಲ್ಲಿ ಕ್ಲೌಡ್ ಕಂಪ್ಯೂಟಿಂಗ್ ಪರಿಣಿತನಾಗುತ್ತೇನೆ.”',
            '“30 ದಿನಗಳಲ್ಲಿ SQL ಮೂಲಪಾಠ ಮುಗಿಸಿ ಒಂದು ಪ್ರಾಜೆಕ್ಟ್‌ನ್ನು GitHub ನಲ್ಲಿ ಪ್ರಕಟಿಸುವುದು.”',
            '“ಇಂಟರ್ನೆಟ್‌ನಲ್ಲಿ ಸಿಕ್ಕ 200 ಕಂಪನಿಗಳಿಗೆ ಅರ್ಜಿ ಹಾಕುವುದು.”',
          ],
          correctIndex: 2,
          explanationEn: 'It has a 30-day timeline, clear task, measurable scope, and verifiable GitHub project evidence.',
          explanationKn: 'ಇದು 30 ದಿನಗಳ ಸ್ಪಷ್ಟ ಗಡುವು, ನಿಖರ ಕಲಿಕೆ ಮತ್ತು GitHub ನಲ್ಲಿ ಪ್ರಾಜೆಕ್ಟ್ ಸಾಕ್ಷ್ಯವನ್ನು ಒಳಗೊಂಡಿದೆ.',
        },
        {
          id: 5,
          questionEn: 'Why are milestones segmented across horizons (7 days, 30 days, 3 months, 6 months)?',
          questionKn: 'ಯೋಜನೆಯನ್ನು ವಿವಿಧ ಸಮಯಾವಧಿಗಳಾಗಿ (7 ದಿನ, 30 ದಿನ, 3 ತಿಂಗಳು, 6 ತಿಂಗಳು) ಏಕೆ ವಿಭಾಗಿಸಬೇಕು?',
          optionsEn: [
            'To make documentation look longer for teachers',
            'To create manageable, reviewable steps and prevent long-term procrastination',
            'Because calendars only show 30 days at a time',
            'To allow postponing all real work until month 6',
          ],
          optionsKn: [
            'ಶಿಕ್ಷಕರಿಗೆ ತೋರಿಸಲು ದಾಖಲೆ ದೊಡ್ಡದಾಗಿ ಕಾಣಲಿ ಎಂದು',
            'ಪ್ರಗತಿಯನ್ನು ಸುಲಭವಾಗಿ ನಿರ್ವಹಿಸಲು ಮತ್ತು ನಿರಂತರವಾಗಿ ಪರಿಶೀಲಿಸಲು',
            'ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ 30 ದಿನಗಳು ಮಾತ್ರ ಇರುವುದರಿಂದ',
            'ಎಲ್ಲಾ ಕೆಲಸಗಳನ್ನೂ ಕೊನೆಯ 6ನೇ ತಿಂಗಳಿಗೆ ಮುಂದೂಡಲು',
          ],
          correctIndex: 1,
          explanationEn: 'Horizons convert distant career goals into immediate daily habits and verifiable checkpoints.',
          explanationKn: 'ಹಂತ-ಹಂತದ ಕಾಲಮಿತಿಯು ಕೆಲಸಗಳನ್ನು ಸುಲಭವಾಗಿಸಿ ಪ್ರಗತಿಯನ್ನು ಸತತವಾಗಿ ಅಳೆಯಲು ನೆರವಾಗುತ್ತದೆ.',
        },
        {
          id: 6,
          questionEn: 'What is an evidence-building action in a career plan?',
          questionKn: 'ಕ್ರಿಯಾ ಯೋಜನೆಯಲ್ಲಿ ಸಾಕ್ಷ್ಯ-ನಿರ್ಮಾಣದ ಕ್ರಮ ಎಂದರೆ ಏನು?',
          optionsEn: [
            'Watching online lectures while resting without taking notes',
            'Designing, completing, and documenting a role-relevant project or case study',
            'Saving motivational quotes to your desktop wallpaper',
            'Discussing career dreams over coffee with friends',
          ],
          optionsKn: [
            'ಯಾವುದೇ ನೋಟ್ಸ್ ಮಾಡದೆ ಕೇವಲ ಆನ್‌ಲೈನ್ ವಿಡಿಯೋ ನೋಡುವುದು',
            'ವೃತ್ತಿಗೆ ಸಂಬಂಧಿಸಿದ ನೈಜ ಪ್ರಾಜೆಕ್ಟ್ ಅಥವಾ ಕೇಸ್ ಸ್ಟಡಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ದಾಖಲಿಸುವುದು',
            'ಡೆಸ್ಕ್‌ಟಾಪ್ ವಾಲ್‌ಪೇಪರ್‌ನಲ್ಲಿ ಸ್ಪೂರ್ತಿದಾಯಕ ಮಾತುಗಳನ್ನು ಹಾಕುವುದು',
            'ಸ್ನೇಹಿತರೊಂದಿಗೆ ಕನಸುಗಳ ಬಗ್ಗೆ ಹರಟೆ ಹೊಡೆಯುವುದು',
          ],
          correctIndex: 1,
          explanationEn: 'Evidence requires producing tangible work (code, documentation, analysis) demonstrating your skill.',
          explanationKn: 'ಕೌಶಲ್ಯವನ್ನು ಪ್ರದರ್ಶಿಸುವ ನೈಜ ಪ್ರಾಜೆಕ್ಟ್, ಕೋಡ್ ಅಥವಾ ದಾಖಲೆಯನ್ನು ಸೃಷ್ಟಿಸುವುದೇ ಸಾಕ್ಷ್ಯ ನಿರ್ಮಾಣ.',
        },
        {
          id: 7,
          questionEn: 'What is the primary purpose of professional networking in your action plan?',
          questionKn: 'ಕ್ರಿಯಾ ಯೋಜನೆಯಲ್ಲಿ ನೆಟ್‌ವರ್ಕಿಂಗ್‌ನ ಮುಖ್ಯ ಉದ್ದೇಶವೇನು?',
          optionsEn: [
            'To aggressively ask strangers for immediate jobs without preparation',
            'To gain information, industry guidance, feedback and opportunity awareness from alumni and practitioners',
            'To increase your follower count on social media platforms',
            'To complain about campus placement policies',
          ],
          optionsKn: [
            'ಯಾವುದೇ ಸಿದ್ಧತೆಯಿಲ್ಲದೆ ಪರಿಚಯವಿಲ್ಲದವರಲ್ಲಿ ತಕ್ಷಣ ಉದ್ಯೋಗ ಬೇಡುವುದು',
            'ಅನುಭವಿಗಳಿಂದ ಮಾಹಿತಿ, ಮಾರ್ಗದರ್ಶನ, ಸಲಹೆ ಮತ್ತು ಅವಕಾಶಗಳ ಅರಿವು ಪಡೆಯುವುದು',
            'ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಫಾಲೋವರ್ಸ್ ಸಂಖ್ಯೆ ಹೆಚ್ಚಿಸಿಕೊಳ್ಳುವುದು',
            'ಕ್ಯಾಂಪಸ್ ನೇಮಕಾತಿ ನಿಯಮಗಳ ಬಗ್ಗೆ ದೂಷಿಸುವುದು',
          ],
          correctIndex: 1,
          explanationEn: 'Networking is an educational discovery process to understand industry expectations and build mentorship.',
          explanationKn: 'ಉದ್ಯಮದ ನೈಜ ನಿರೀಕ್ಷೆಗಳು ಮತ್ತು ಮಾರ್ಗದರ್ಶನವನ್ನು ಪಡೆಯುವುದೇ ನೆಟ್‌ವರ್ಕಿಂಗ್‌ನ ಉದ್ದೇಶ.',
        },
        {
          id: 8,
          questionEn: 'Why must a career plan include explicit barriers and fallback actions?',
          questionKn: 'ಯೋಜನೆಯಲ್ಲಿ ಸಂಭವನೀಯ ಅಡೆತಡೆಗಳು ಮತ್ತು ಪರ್ಯಾಯ ಕ್ರಮಗಳನ್ನು ಸೇರಿಸುವುದು ಏಕೆ ಅಗತ್ಯ?',
          optionsEn: [
            'To give yourself reasons to give up easily',
            'To ensure unexpected challenges (cost, exams, time) do not halt your forward momentum',
            'Because recruiters grade you on how many problems you expect',
            'To prove that your plan is doomed to fail',
          ],
          optionsKn: [
            'ಸುಲಭವಾಗಿ ಕೈಚೆಲ್ಲಲು ಕಾರಣಗಳನ್ನು ಹುಡುಕಿಕೊಳ್ಳಲು',
            'ಅನಿರೀಕ್ಷಿತ ತೊಂದರೆಗಳು ಎದುರಾದರೂ ಪ್ರಗತಿಯು ನಿಲ್ಲದೆ ಮುಂದುವರಿಯುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು',
            'ನೀವು ಎಷ್ಟು ಸಮಸ್ಯೆಗಳನ್ನು ಊಹಿಸುತ್ತೀರಿ ಎಂದು ಪರೀಕ್ಷಿಸಲು',
            'ಯೋಜನೆ ವಿಫಲವಾಗುತ್ತದೆ ಎಂದು ಸಾಬೀತುಪಡಿಸಲು',
          ],
          correctIndex: 1,
          explanationEn: 'Pre-identifying obstacles and fallback alternatives protects your learning continuity.',
          explanationKn: 'ಪರ್ಯಾಯ ಯೋಜನೆಗಳು ಅಡೆತಡೆಗಳು ಎದುರಾದಾಗಲೂ ಕಲಿಕೆಯ ಹಾದಿಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸುತ್ತವೆ.',
        },
        {
          id: 9,
          questionEn: 'In the monthly review tracker, when is an action marked "CE" (Completed with Evidence)?',
          questionKn: 'ಮಾಸಿಕ ಟ್ರ್ಯಾಕರ್‌ನಲ್ಲಿ ಕ್ರಮವನ್ನು "CE" (Completed with Evidence) ಎಂದು ಯಾವಾಗ ಗುರುತಿಸಲಾಗುತ್ತದೆ?',
          optionsEn: [
            'As soon as you add the task to your calendar',
            'When you think about working on it next week',
            'Only when the action is finished and verifiable proof/output exists',
            'When a peer tells you they finished a similar task',
          ],
          optionsKn: [
            'ಕ್ಯಾಲೆಂಡರ್‌ನಲ್ಲಿ ಕೆಲಸವನ್ನು ನಮೂದಿಸಿದ ತಕ್ಷಣ',
            'ಮುಂದಿನ ವಾರ ಕೆಲಸ ಮಾಡೋಣ ಎಂದು ಯೋಚಿಸಿದಾಗ',
            'ಕೆಲಸವು ಪೂರ್ಣಗೊಂಡು ಅದರ ಭೌತಿಕ ಸಾಕ್ಷಿ/ಫಲಿತಾಂಶ ಲಭ್ಯವಿದ್ದಾಗ ಮಾತ್ರ',
            'ಸ್ನೇಹಿತ ತಾನು ಕೆಲಸ ಮುಗಿಸಿದೆ ಎಂದು ಹೇಳಿದಾಗ',
          ],
          correctIndex: 2,
          explanationEn: '“Completed with Evidence” demands proof (repository link, document, test result) before marking completion.',
          explanationKn: 'ನೈಜ ಸಾಕ್ಷಿ ಅಥವಾ ಫಲಿತಾಂಶ ಕೈಯಲ್ಲಿದ್ದಾಗ ಮಾತ್ರ ಅದನ್ನು ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಪರಿಗಣಿಸಲಾಗುತ್ತದೆ.',
        },
        {
          id: 10,
          questionEn: 'What is the final primary evidence output of Lesson 4 that completes Module 1?',
          questionKn: 'ಪಾಠ 4ರ ಅಂತಿಮ ಸಾಕ್ಷ್ಯ ಫಲಿತಾಂಶ ಯಾವುದು?',
          optionsEn: [
            'A casual email to a recruiter',
            'An unverified resume draft',
            'Approved bilingual My Career Action Plan / Active Plan',
            'A textbook certificate of attendance',
          ],
          optionsKn: [
            'ಸಂದರ್ಶಕರಿಗೆ ಕಳುಹಿಸಿದ ಸಾಧಾರಣ ಇಮೇಲ್',
            'ಪರಿಶೀಲಿಸದ ಕರಡು ರೆಸ್ಯೂಮ್',
            'ಅನುಮೋದಿತ My Career Action Plan / Active Plan',
            'ತರಗತಿಯ ಹಾಜರಾತಿ ಪ್ರಮಾಣಪತ್ರ',
          ],
          correctIndex: 2,
          explanationEn: 'Module 1 concludes with the verified and activated My Career Action Plan for ongoing tracking.',
          explanationKn: 'Module 1 ರ ಅಂತಿಮ ಮಹತ್ವದ ಫಲಿತಾಂಶ My Career Action Plan ಆಗಿದೆ.',
        },
      ],
    },

    rubric: {
      maxScore: 10,
      threshold: 6,
      criteria: [
        {
          name: 'Clarity of career goal',
          score0: 'Missing, generic or unrelated.',
          score1: 'Role identified, but missing timeframe, preparation scope or evidence.',
          score2: 'Clear, specific 6–12-month goal with role, period, outcome and evidence.',
        },
        {
          name: 'Gap-to-action connection',
          score0: 'Missing or unrelated to role requirements.',
          score1: 'Some relevant links, but actions are vague or disconnected from gaps.',
          score2: 'Priority gaps from Lessons 1–3 logically and concretely converted into SMART-E actions.',
        },
        {
          name: 'Milestones and timelines',
          score0: 'Missing milestone horizons.',
          score1: 'Some horizons present, but dates are unrealistic or vague.',
          score2: 'Clear, achievable progression across 7-day, 30-day, 3-month and 6-month horizons.',
        },
        {
          name: 'Evidence and progress',
          score0: 'No evidence measures or review mechanism.',
          score1: 'Weak progress measures; tasks lack verifiable deliverables.',
          score2: 'Major actions paired with tangible proof, progress measures, and review schedule.',
        },
        {
          name: 'Feasibility and commitment',
          score0: 'Missing barriers, fallbacks or commitment statement.',
          score1: 'Some barriers identified; weak or unconvincing fallbacks.',
          score2: 'Realistic barriers with actionable fallbacks and a signed personal commitment.',
        },
      ],
      feedbackSentenceFrame:
        '“Your plan is strongest in [Dimension]. To improve feasibility, strengthen [Area]. Within the next seven days, begin by executing [Immediate Priority].”',
    },

    guidedSession: {
      duration: '30 minutes',
      agenda: [
        { time: '0–3 min', facilitatorAction: 'Explain action planning and measurable evidence.', learnerOutput: 'Understands purpose.' },
        { time: '3–7 min', facilitatorAction: 'Review priority role and goal statement.', learnerOutput: 'Clearer 6–12-month goal.' },
        { time: '7–12 min', facilitatorAction: 'Convert one gap into a SMART-E action.', learnerOutput: 'One improved action.' },
        { time: '12–18 min', facilitatorAction: 'Pair-review actions using SMART-E.', learnerOutput: 'Specific, measurable actions.' },
        { time: '18–23 min', facilitatorAction: 'Review four planning horizons.', learnerOutput: 'Realistic sequence.' },
        { time: '23–27 min', facilitatorAction: 'Identify barriers, support and fallback.', learnerOutput: 'At least one fallback.' },
        { time: '27–30 min', facilitatorAction: 'Confirm immediate seven-day commitment.', learnerOutput: 'Action, date and evidence.' },
      ],
      guardrails: [
        'Do not create the entire plan for the learner.',
        'Do not approve vague actions without evidence.',
        'Avoid too many simultaneous priorities.',
        'Do not recommend unnecessary paid courses or promise placement.',
        'Ensure feasibility for available time and resources.',
        'Accept English, Kannada or both and allow refinement with new evidence.',
      ],
      closingCommitmentTemplate:
        '“My priority role is [Role]. My first gap is [Gap]. Within seven days I will complete [Action] and prove it through [Evidence]. I will review on [Date].”',
    },
  },
};
