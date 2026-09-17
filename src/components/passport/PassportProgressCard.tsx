import React from 'react';
import './PassportProgressCard.css';

export interface ReadinessField {
  id: string;
  title: string;
  subtitle: string;
  percentage: number;
  metricLabel: string;
  themeColor: string;
  bgColor: string;
  icon: React.ReactNode;
}

export const READINESS_FIELDS: ReadinessField[] = [
  {
    id: 'career-clarity',
    title: 'Career Clarity and Self Discovery',
    subtitle: 'Identity, Values & Role Fit',
    percentage: 84,
    metricLabel: '4 / 4 Levels Complete',
    themeColor: '#6366f1',
    bgColor: '#eef2ff',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  {
    id: 'resume-readiness',
    title: 'Resume Readiness',
    subtitle: 'Build ATS Friendly Resume',
    percentage: 90,
    metricLabel: 'Completed',
    themeColor: '#f97316',
    bgColor: '#fff7ed',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
  {
    id: 'communication',
    title: 'Communication',
    subtitle: 'English, GD, Presentation',
    percentage: 76,
    metricLabel: '31 / 41 Topics',
    themeColor: '#10b981',
    bgColor: '#ecfdf5',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <circle cx="9" cy="10" r="1" fill="currentColor" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <circle cx="15" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'aptitude-readiness',
    title: 'Aptitude Readiness',
    subtitle: 'Quant, Reasoning, DI, Verbal',
    percentage: 82,
    metricLabel: '42 / 51 Topics',
    themeColor: '#8b5cf6',
    bgColor: '#f5f3ff',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.5 2A4.5 4.5 0 0 0 5 6.5C5 7.7 5.5 8.7 6.3 9.4A5.5 5.5 0 0 0 4 14c0 2.5 1.7 4.6 4 5.2V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.8c2.3-.6 4-2.7 4-5.2a5.5 5.5 0 0 0-2.3-4.6c.8-.7 1.3-1.7 1.3-2.9A4.5 4.5 0 0 0 14.5 2h-5z" />
        <path d="M9 12h6" />
        <path d="M10 16h4" />
      </svg>
    ),
  },
  {
    id: 'workplace-readiness',
    title: 'Workplace Readiness',
    subtitle: 'Corporate Ethics & Teamwork',
    percentage: 72,
    metricLabel: '17 / 24 Modules',
    themeColor: '#06b6d4',
    bgColor: '#ecfeff',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    id: 'interview-readiness',
    title: 'Interview Readiness',
    subtitle: 'HR, Technical, Mock Interviews',
    percentage: 64,
    metricLabel: '18 / 25 Topics',
    themeColor: '#2563eb',
    bgColor: '#eff6ff',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
        <polygon points="23 7 16 12 23 17 23 7" fill="currentColor" fillOpacity="0.35" />
      </svg>
    ),
  },
];

interface PassportProgressCardProps {
  onActionClick?: () => void;
  showCardHeader?: boolean;
}

export function PassportProgressCard({
  onActionClick,
  showCardHeader = true,
}: PassportProgressCardProps) {
  // Average across all 6 fields = 78%
  const overallAverage = Math.round(
    READINESS_FIELDS.reduce((acc, curr) => acc + curr.percentage, 0) / READINESS_FIELDS.length
  );

  return (
    <div className="learning-progress-card">
      {showCardHeader && (
        <div className="learning-progress-card__head">
          <div className="learning-progress-card__title-wrap">
            <h3 className="learning-progress-card__title">Your Learning Progress</h3>
            <span className="learning-progress-card__badge">Overall {overallAverage}%</span>
          </div>
          {onActionClick && (
            <button
              type="button"
              className="learning-progress-card__action"
              onClick={onActionClick}
            >
              View All
            </button>
          )}
        </div>
      )}

      <div className="learning-progress-card__list">
        {READINESS_FIELDS.map((field) => (
          <div key={field.id} className="learning-progress-card__item">
            {/* Left Icon with tinted container */}
            <div
              className="learning-progress-card__icon-box"
              style={{ backgroundColor: field.bgColor, color: field.themeColor }}
            >
              {field.icon}
            </div>

            {/* Middle Title & Subtitle */}
            <div className="learning-progress-card__details">
              <h4 className="learning-progress-card__item-title">{field.title}</h4>
              <p className="learning-progress-card__item-subtitle">{field.subtitle}</p>
            </div>

            {/* Right Metrics & Progress Bar */}
            <div className="learning-progress-card__metrics">
              <div className="learning-progress-card__pct">{field.percentage}%</div>
              <div className="learning-progress-card__metric-label">{field.metricLabel}</div>
              <div className="learning-progress-card__track">
                <div
                  className="learning-progress-card__fill"
                  style={{
                    width: `${field.percentage}%`,
                    backgroundColor: field.themeColor,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
