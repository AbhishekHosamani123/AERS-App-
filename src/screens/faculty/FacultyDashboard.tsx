import React, { useState, useMemo, useEffect } from 'react';
import type { 
  Student, 
  Department, 
  ReadinessTier, 
  DashboardFilterState,
  StudentIntervention
} from '../../types/facultyDashboard';
import { 
  INITIAL_STUDENTS, 
  calculateDepartmentSummaries 
} from '../../data/facultyMockStudents';
import './FacultyDashboard.css';

type ActiveTab = 'overview' | 'at-risk' | 'stars' | 'ready' | 'directory';

export const FacultyDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeRole, setActiveRole] = useState('Dr. K. N. Murthy (Principal / Dean)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [nudgeModalStudent, setNudgeModalStudent] = useState<Student | null>(null);
  const [nudgeTemplate, setNudgeTemplate] = useState<'urgent' | 'inactivity' | 'drive'>('urgent');

  // Filter state
  const [filters, setFilters] = useState<DashboardFilterState>({
    searchQuery: '',
    department: 'ALL',
    tier: 'ALL',
    activityStatus: 'ALL',
    sortBy: 'readiness_desc',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Department Aggregates
  const departmentSummaries = useMemo(() => calculateDepartmentSummaries(students), [students]);

  // Overall KPIs
  const totalEnrolled = students.length;
  const avgReadiness = Math.round(
    students.reduce((acc, s) => acc + s.readinessScore, 0) / totalEnrolled
  );
  const starStudents = useMemo(() => students.filter((s) => s.tier === 'star'), [students]);
  const placementReadyStudents = useMemo(
    () => students.filter((s) => s.tier === 'ready' || s.tier === 'star'),
    [students]
  );
  const atRiskStudents = useMemo(() => students.filter((s) => s.tier === 'at-risk'), [students]);
  const activeThisWeek = students.filter((s) => s.daysInactive <= 2).length;
  const activePct = Math.round((activeThisWeek / totalEnrolled) * 100);

  // Sync document title to AERS Institution Dashboard
  useEffect(() => {
    document.title = 'AERS Institution Dashboard';
  }, []);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Tab based restriction
      if (activeTab === 'at-risk' && s.tier !== 'at-risk') return false;
      if (activeTab === 'stars' && s.tier !== 'star') return false;
      if (activeTab === 'ready' && s.tier !== 'ready' && s.tier !== 'star') return false;

      // Search query (flexible matching for USN, number, name, phone)
      if (filters.searchQuery.trim()) {
        const rawQ = filters.searchQuery.toLowerCase().trim();
        const cleanQ = rawQ.replace(/[\s-_]/g, '');
        const cleanUsn = s.usn.toLowerCase().replace(/[\s-_]/g, '');
        const usnWithoutYear = cleanUsn.replace(/^\d{2,4}/, ''); // e.g. "bcom001", "bba014"
        const numOnly = s.usn.replace(/\D/g, ''); // all numbers e.g. "21001"
        
        const matchesUsn = 
          cleanUsn.includes(cleanQ) || 
          usnWithoutYear.includes(cleanQ) ||
          cleanUsn.endsWith(cleanQ) ||
          numOnly.endsWith(cleanQ);
        const matchesName = s.name.toLowerCase().includes(rawQ);
        const matchesPhone = s.phone.replace(/\D/g, '').includes(cleanQ) || s.parentPhone.replace(/\D/g, '').includes(cleanQ);

        if (!matchesUsn && !matchesName && !matchesPhone) return false;
      }

      // Department filter
      if (filters.department !== 'ALL' && s.department !== filters.department) {
        return false;
      }

      // Tier filter: Placement Ready includes BOTH 'ready' (75-89%) AND 'star' (90%+) candidates!
      if (filters.tier !== 'ALL') {
        if (filters.tier === 'ready') {
          if (s.tier !== 'ready' && s.tier !== 'star') {
            return false;
          }
        } else if (s.tier !== filters.tier) {
          return false;
        }
      }

      // Activity filter
      if (filters.activityStatus === 'active' && s.daysInactive > 3) return false;
      if (filters.activityStatus === 'inactive' && s.daysInactive <= 3) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'readiness_desc') return b.readinessScore - a.readinessScore;
      if (filters.sortBy === 'readiness_asc') return a.readinessScore - b.readinessScore;
      if (filters.sortBy === 'inactive_days') return b.daysInactive - a.daysInactive;
      if (filters.sortBy === 'level_desc') return b.currentLevel - a.currentLevel;
      if (filters.sortBy === 'usn') return a.usn.localeCompare(b.usn);
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [students, activeTab, filters]);

  // Bulk Nudge All At-Risk Students Action
  const handleBulkNudgeAtRisk = () => {
    const timestamp = 'Just now';
    const updated = students.map((s) => {
      if (s.tier === 'at-risk') {
        const newInt: StudentIntervention = {
          id: `int-${Date.now()}-${s.id}`,
          type: 'whatsapp',
          timestamp,
          note: '⚡ Automated Bulk Warning: Placement Cell mandatory reminder issued to complete overdue modules.',
          status: 'sent',
          conductedBy: activeRole,
        };
        return {
          ...s,
          interventions: [newInt, ...s.interventions],
        };
      }
      return s;
    });
    setStudents(updated);
    showToast(`⚡ Dispatched urgent academic warning to all ${atRiskStudents.length} at-risk students!`);
  };

  // Single Student Intervention Action
  const handleSendSingleNudge = (student: Student, type: 'whatsapp' | 'sms' | 'parent_call' | 'counseling', customNote?: string) => {
    const noteMap = {
      whatsapp: customNote || 'Urgent WhatsApp alert: You have fallen below the placement readiness threshold. Open the app to complete Level ' + student.currentLevel + ' immediately.',
      sms: 'Official SMS dispatched to student phone.',
      parent_call: 'Parent telephonic alert logged: Informed guardian regarding placement defaulter status and missed assessments.',
      counseling: 'Mandatory 1-on-1 Placement Mentoring scheduled for tomorrow 3:30 PM with HOD.'
    };

    const newInt: StudentIntervention = {
      id: `int-${Date.now()}`,
      type,
      timestamp: 'Just now',
      note: noteMap[type],
      status: type === 'counseling' ? 'scheduled' : 'sent',
      conductedBy: activeRole,
    };

    const updated = students.map((s) => {
      if (s.id === student.id) {
        return {
          ...s,
          interventions: [newInt, ...s.interventions]
        };
      }
      return s;
    });

    setStudents(updated);
    if (selectedStudent && selectedStudent.id === student.id) {
      setSelectedStudent({
        ...selectedStudent,
        interventions: [newInt, ...selectedStudent.interventions]
      });
    }
    setNudgeModalStudent(null);
    showToast(`Action recorded for ${student.name} (${student.usn})!`);
  };

  // Export Filtered Students to CSV
  const handleExportCSV = () => {
    const headers = [
      'USN',
      'Name',
      'Department',
      'Semester',
      'Section',
      'Readiness Score (%)',
      'Status Tier',
      'Current Level (1-20)',
      'Attendance (%)',
      'Days Inactive',
      'Phone',
      'Parent Phone'
    ];

    const rows = filteredStudents.map((s) => [
      s.usn,
      `"${s.name}"`,
      s.department,
      s.semester,
      s.section,
      s.readinessScore,
      s.tier,
      s.currentLevel,
      s.attendancePct,
      s.daysInactive,
      s.phone,
      s.parentPhone
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AERS_Placement_Readiness_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📥 Exported report for ${filteredStudents.length} students.`);
  };

  // Distribution buckets for histogram visual
  const distributionBuckets = useMemo(() => {
    const buckets = [
      { label: '0–40%', sub: 'Critical Defaulters', count: 0, color: '#ef4444' },
      { label: '41–60%', sub: 'Needs Push', count: 0, color: '#f59e0b' },
      { label: '61–80%', sub: 'Near Ready', count: 0, color: '#38bdf8' },
      { label: '81–100%', sub: 'Star Talent', count: 0, color: '#10b981' },
    ];

    students.forEach((s) => {
      if (s.readinessScore <= 40) buckets[0].count++;
      else if (s.readinessScore <= 60) buckets[1].count++;
      else if (s.readinessScore <= 80) buckets[2].count++;
      else buckets[3].count++;
    });

    const maxCount = Math.max(...buckets.map(b => b.count), 1);
    return buckets.map(b => ({
      ...b,
      heightPct: Math.round((b.count / maxCount) * 100),
    }));
  }, [students]);

  // Helper colors
  const getTierColor = (tier: ReadinessTier) => {
    switch (tier) {
      case 'star': return '#fbbf24';
      case 'ready': return '#34d399';
      case 'moderate': return '#38bdf8';
      case 'at-risk': return '#f87171';
    }
  };

  const getTierGradient = (tier: ReadinessTier) => {
    switch (tier) {
      case 'star': return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
      case 'ready': return 'linear-gradient(90deg, #10b981, #34d399)';
      case 'moderate': return 'linear-gradient(90deg, #0066f5, #38bdf8)';
      case 'at-risk': return 'linear-gradient(90deg, #ef4444, #f87171)';
    }
  };

  return (
    <div className="faculty-portal">
      {/* ---------------- TOP NAVBAR ---------------- */}
      <header className="faculty-nav">
        <div className="nav-left">
          <div className="portal-brand">
            <img src="/AERS_Officel_Logo.png" alt="AERS Official Logo" className="brand-logo-img" />
            <div className="brand-text">
              <h1>AERS Institution Dashboard</h1>
              <p>Learn • Prepare • Succeed • Institutional Portal</p>
            </div>
          </div>
          <div className="academic-badge">
            <span>🎓</span>
            <span>Batch of 2026 • 6th Semester (Final Year)</span>
          </div>
        </div>

        <div className="nav-right">
          <div className="role-selector-wrap">
            <span className="role-label">Portal View:</span>
            <select 
              className="role-select" 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value)}
            >
              <option value="Dr. K. N. Murthy (Principal)">Dr. K. N. Murthy (Principal)</option>
              <option value="Prof. Ramesh Rao (HOD - Commerce / B.Com)">Prof. Ramesh Rao (HOD - Commerce / B.Com)</option>
              <option value="Prof. Meenakshi S. (HOD - Management / BBA)">Prof. Meenakshi S. (HOD - Management / BBA)</option>
              <option value="Prof. Suresh K. (HOD - Computer Apps / BCA)">Prof. Suresh K. (HOD - Computer Apps / BCA)</option>
              <option value="Dr. Shobha K. (Placement Director)">Dr. Shobha K. (Placement Director)</option>
            </select>
          </div>

          <button className="btn-export" onClick={handleExportCSV} title="Export current student data as CSV">
            <span>📥</span>
            <span>Export CSV</span>
          </button>

          <button className="btn-nudge-all" onClick={handleBulkNudgeAtRisk}>
            <span>⚡</span>
            <span>Nudge All Defaulters ({atRiskStudents.length})</span>
          </button>
        </div>
      </header>

      {/* ---------------- SUBHEADER TABS & QUICK STATUS ---------------- */}
      <nav className="portal-subnav">
        <div className="tabs-list">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊 Analytics Overview</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'ready' ? 'active' : ''}`}
            onClick={() => setActiveTab('ready')}
          >
            <span>🎯 Placement Ready</span>
            <span className="tab-badge ready">{placementReadyStudents.length}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'stars' ? 'active' : ''}`}
            onClick={() => setActiveTab('stars')}
          >
            <span>⭐ Star Performers</span>
            <span className="tab-badge star">{starStudents.length}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'at-risk' ? 'active' : ''}`}
            onClick={() => setActiveTab('at-risk')}
          >
            <span>🚨 At-Risk Defaulters</span>
            <span className="tab-badge danger">{atRiskStudents.length}</span>
          </button>

          <button 
            className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveTab('directory')}
          >
            <span>👥 Student Master Directory</span>
            <span className="tab-badge neutral">{totalEnrolled}</span>
          </button>
        </div>

        <div className="subnav-status">
          <span className="pulse-dot"></span>
          <span>Live Sync Active • 128 Candidates Tracked</span>
          <a 
            href="/home" 
            target="_blank" 
            rel="noreferrer" 
            style={{ color: '#38bdf8', textDecoration: 'none', marginLeft: '12px', fontSize: '11px', fontWeight: 600 }}
          >
            📱 Preview Student Mobile App ↗
          </a>
        </div>
      </nav>

      {/* ---------------- MAIN DASHBOARD CONTENT ---------------- */}
      <main className="portal-main">
        {/* At-Risk Warning Callout if any tab has critical students */}
        {atRiskStudents.length > 0 && activeTab !== 'stars' && (
          <div className="at-risk-banner">
            <div className="at-risk-info">
              <div className="at-risk-icon-pulse">⚠️</div>
              <div className="at-risk-text">
                <h3>{atRiskStudents.length} Students Require Immediate Academic Intervention</h3>
                <p>These candidates have scored below 50% readiness or have stopped practicing in the app for 6+ days. Use the action triggers below to nudge them or alert parents.</p>
              </div>
            </div>
            <button className="btn-nudge-all" onClick={handleBulkNudgeAtRisk}>
              <span>⚡ Bulk Nudge All {atRiskStudents.length} Defaulters</span>
            </button>
          </div>
        )}

        {/* ---------------- 5 VISUAL KPI METRIC CARDS ---------------- */}
        <section className="kpi-grid">
          {/* Card 1 */}
          <div className="kpi-card blue">
            <div className="kpi-header">
              <span className="kpi-title">Total Enrolled</span>
              <div className="kpi-icon">🎓</div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{totalEnrolled}</span>
              <span className="kpi-trend positive">↑ 100% batch</span>
            </div>
            <p className="kpi-subtitle">B.Com, BBA, BCA, B.Sc & BA</p>
            <div className="kpi-bar-track">
              <div className="kpi-bar-fill" style={{ width: '100%', background: '#0066f5' }}></div>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            className="kpi-card green" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('ready');
              setFilters((f) => ({ ...f, tier: 'ready' }));
              showToast(`🎯 Showing all ${placementReadyStudents.length} Placement Ready & Star Candidates`);
            }}
            title="Click to view all Placement Ready & Star Candidates"
          >
            <div className="kpi-header">
              <span className="kpi-title">Placement Ready (incl. Stars)</span>
              <div className="kpi-icon">🎯</div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{placementReadyStudents.length}</span>
              <span className="kpi-trend positive">{avgReadiness}% avg score</span>
            </div>
            <p className="kpi-subtitle">Includes {starStudents.length} Star Candidates (72%+ score)</p>
            <div className="kpi-bar-track">
              <div className="kpi-bar-fill" style={{ width: `${Math.round((placementReadyStudents.length / totalEnrolled) * 100)}%`, background: '#10b981' }}></div>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            className="kpi-card gold" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setActiveTab('stars');
              setFilters((f) => ({ ...f, tier: 'star' }));
              showToast(`⭐ Showing all ${starStudents.length} Star Performers`);
            }}
            title="Click to view Star Performers"
          >
            <div className="kpi-header">
              <span className="kpi-title">Star Talent (90%+)</span>
              <div className="kpi-icon">🌟</div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{starStudents.length}</span>
              <span className="kpi-trend positive">{Math.round((starStudents.length / totalEnrolled) * 100)}% of cohort</span>
            </div>
            <p className="kpi-subtitle">Campus Drive Super-Dream Ready</p>
            <div className="kpi-bar-track">
              <div className="kpi-bar-fill" style={{ width: `${(starStudents.length / totalEnrolled) * 100}%`, background: '#f59e0b' }}></div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="kpi-card red">
            <div className="kpi-header">
              <span className="kpi-title">At-Risk Defaulters</span>
              <div className="kpi-icon">🚨</div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{atRiskStudents.length}</span>
              <span className="kpi-trend negative">{Math.round((atRiskStudents.length / totalEnrolled) * 100)}% lagging</span>
            </div>
            <p className="kpi-subtitle">Score &lt;50% or Inactive &gt;6 days</p>
            <div className="kpi-bar-track">
              <div className="kpi-bar-fill" style={{ width: `${(atRiskStudents.length / totalEnrolled) * 100}%`, background: '#ef4444' }}></div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="kpi-card purple">
            <div className="kpi-header">
              <span className="kpi-title">Active This Week</span>
              <div className="kpi-icon">🔥</div>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-value">{activePct}%</span>
              <span className="kpi-trend neutral">{activeThisWeek} practicing</span>
            </div>
            <p className="kpi-subtitle">Daily streak retention rate</p>
            <div className="kpi-bar-track">
              <div className="kpi-bar-fill" style={{ width: `${activePct}%`, background: '#8b5cf6' }}></div>
            </div>
          </div>
        </section>

        {/* ---------------- VISUAL ANALYTICS (Histogram + Dept Benchmarks) ---------------- */}
        {activeTab === 'overview' && (
          <>
            <div className="analytics-grid">
              {/* Histogram Chart */}
              <div className="chart-card">
                <div className="card-title-bar">
                  <div className="card-heading">
                    <span>📊 Cohort Readiness Score Distribution</span>
                  </div>
                  <div className="card-legend">
                    <span className="legend-item"><span className="legend-color" style={{ background: '#ef4444' }}></span>Defaulters</span>
                    <span className="legend-item"><span className="legend-color" style={{ background: '#f59e0b' }}></span>Needs Push</span>
                    <span className="legend-item"><span className="legend-color" style={{ background: '#38bdf8' }}></span>Near Ready</span>
                    <span className="legend-item"><span className="legend-color" style={{ background: '#10b981' }}></span>Star Talent</span>
                  </div>
                </div>

                <div className="histogram-visual">
                  {distributionBuckets.map((b, idx) => (
                    <div key={idx} className="hist-col">
                      <div className="hist-bar-wrap">
                        <div 
                          className="hist-bar" 
                          style={{ 
                            height: `${Math.max(b.heightPct, 15)}%`, 
                            background: b.color 
                          }}
                        >
                          <span className="hist-count">{b.count}</span>
                        </div>
                      </div>
                      <span className="hist-label">{b.label}</span>
                      <span className="hist-sub">{b.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Benchmark Comparison */}
              <div className="chart-card">
                <div className="card-title-bar">
                  <div className="card-heading">
                    <span>🏢 Department Performance Benchmark</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Avg Score & Completion</span>
                </div>

                <div className="dept-bars-list">
                  {departmentSummaries.map((dept) => (
                    <div key={dept.department} className="dept-bar-row">
                      <div className="dept-bar-meta">
                        <span className="dept-name">
                          <span>{dept.department}</span>
                          <span className="dept-pill">{dept.studentCount} students</span>
                        </span>
                        <span className="dept-stats">
                          {dept.avgReadinessScore}% avg • {dept.starCount} stars • <span style={{ color: '#f87171' }}>{dept.atRiskCount} risk</span>
                        </span>
                      </div>
                      <div className="dept-progress-bg">
                        <div 
                          className="dept-progress-fill" 
                          style={{ width: `${dept.avgReadinessScore}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5 AERS Learning Modules Matrix Visual */}
            <div className="card-title-bar" style={{ marginBottom: '14px' }}>
              <div className="card-heading">
                <span>📚 5-Module Placement Curriculum Mastery</span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>AERS Student App Module Progress</span>
            </div>

            <div className="modules-matrix-grid">
              {[
                { id: 1, name: 'Career Clarity', levels: 'Levels 01–04', icon: '🧭', rate: 84 },
                { id: 2, name: 'Résumé Readiness', levels: 'Levels 05–08', icon: '📄', rate: 71 },
                { id: 3, name: 'Communication', levels: 'Levels 09–12', icon: '💬', rate: 64 },
                { id: 4, name: 'Interview Prep', levels: 'Levels 13–16', icon: '🎯', rate: 53 },
                { id: 5, name: 'Workplace Ready', levels: 'Levels 17–20', icon: '💼', rate: 42 },
              ].map((m) => (
                <div key={m.id} className="module-widget-card">
                  <div>
                    <div className="mod-header">
                      <div className="mod-num">{m.icon}</div>
                      <div>
                        <div className="mod-title">{m.name}</div>
                        <div className="mod-levels">{m.levels}</div>
                      </div>
                    </div>
                    <div className="mod-completion-stat">{m.rate}%</div>
                  </div>
                  <div className="dept-progress-bg">
                    <div 
                      className="dept-progress-fill" 
                      style={{ 
                        width: `${m.rate}%`,
                        background: m.rate > 70 ? '#10b981' : m.rate > 50 ? '#38bdf8' : '#f59e0b'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------------- SEARCH & FILTER TOOLBAR ---------------- */}
        <div className="table-toolbar">
          <div className="search-box-wrap">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              className="search-input"
              placeholder="Search by Roll Number (e.g. 21BCOM001, BBA, 042) or Name..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            />
          </div>

          <div className="filter-group">
            {/* Department selector */}
            <select 
              className="filter-select"
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value as 'ALL' | Department })}
            >
              <option value="ALL">All Departments ({totalEnrolled})</option>
              <option value="B.Com">B.Com (46)</option>
              <option value="BBA">BBA (36)</option>
              <option value="BCA">BCA (32)</option>
              <option value="B.Sc">B.Sc (20)</option>
              <option value="BA">BA (14)</option>
            </select>

            {/* Tier selector */}
            <select 
              className="filter-select"
              value={filters.tier}
              onChange={(e) => setFilters({ ...filters, tier: e.target.value as 'ALL' | ReadinessTier })}
            >
              <option value="ALL">All Readiness Tiers ({totalEnrolled})</option>
              <option value="ready">✅ Placement Ready (incl. Star Candidates) ({placementReadyStudents.length})</option>
              <option value="star">⭐ Star Talent Only (90%+) ({starStudents.length})</option>
              <option value="moderate">⚡ Needs Steady Push (50-71%)</option>
              <option value="at-risk">🚨 Critical Defaulter (&lt;50%) ({atRiskStudents.length})</option>
            </select>

            {/* Activity filter */}
            <select 
              className="filter-select"
              value={filters.activityStatus}
              onChange={(e) => setFilters({ ...filters, activityStatus: e.target.value as 'ALL' | 'active' | 'inactive' })}
            >
              <option value="ALL">All Activity</option>
              <option value="active">🟢 Active in last 3 days</option>
              <option value="inactive">🔴 Inactive 4+ days</option>
            </select>

            {/* Sort by */}
            <select 
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as DashboardFilterState['sortBy'] })}
            >
              <option value="readiness_desc">Highest Readiness Score</option>
              <option value="readiness_asc">Lowest Readiness Score (Priority)</option>
              <option value="inactive_days">Most Inactive Days</option>
              <option value="level_desc">Highest Module Level</option>
              <option value="usn">USN / Roll Number</option>
              <option value="name">Student Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* ---------------- INTERACTIVE STUDENT DATA TABLE ---------------- */}
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student & Roll No</th>
                <th>Dept / Sec</th>
                <th>Readiness Score</th>
                <th>Progression</th>
                <th>Streak & Attd.</th>
                <th>Status</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Faculty Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔎</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#12233f' }}>No students matched your search criteria</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Try searching by roll number (e.g. "21BCOM001", "BBA", "007") or student name.</div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    {/* Student Info */}
                    <td>
                      <div className="student-cell">
                        <div className="student-avatar" style={{ background: student.avatar }}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="student-name-meta">
                          <span className="student-name">{student.name}</span>
                          <span className="student-usn">{student.usn}</span>
                        </div>
                      </div>
                    </td>

                    {/* Dept */}
                    <td>
                      <div style={{ fontWeight: 800, color: '#12233f' }}>{student.department}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Sem {student.semester} - Sec {student.section}</div>
                    </td>

                    {/* Readiness Score Visual */}
                    <td>
                      <div className="score-cell">
                        <div className="score-num-wrap">
                          <span className="score-num" style={{ color: getTierColor(student.tier) }}>
                            {student.readinessScore}%
                          </span>
                          <span className="score-tier-label" style={{ color: getTierColor(student.tier) }}>
                            {student.tier.toUpperCase()}
                          </span>
                        </div>
                        <div className="score-bar-bg">
                          <div 
                            className="score-bar-fill"
                            style={{ 
                              width: `${student.readinessScore}%`,
                              background: getTierGradient(student.tier)
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Current Level */}
                    <td>
                      <div className="level-pill">
                        <span>Lvl {student.currentLevel}/20</span>
                      </div>
                    </td>

                    {/* Streak & Attendance */}
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: student.streakDays > 0 ? '#f59e0b' : '#64748b' }}>
                        🔥 {student.streakDays}d streak
                      </div>
                      <div style={{ fontSize: '11px', color: student.attendancePct < 75 ? '#f87171' : '#94a3b8' }}>
                        📋 {student.attendancePct}% attd
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td>
                      <span className={`status-pill ${student.tier}`}>
                        {student.tier === 'star' && '⭐ Star Talent'}
                        {student.tier === 'ready' && '✅ Placement Ready'}
                        {student.tier === 'moderate' && '⚡ Needs Push'}
                        {student.tier === 'at-risk' && '🚨 Critical Defaulter'}
                      </span>
                    </td>

                    {/* Last Active */}
                    <td>
                      <div className={`inactivity-pill ${student.daysInactive >= 5 ? 'critical' : ''}`}>
                        <span>{student.daysInactive >= 5 ? '⚠️' : '⏱️'}</span>
                        <span>{student.lastActive}</span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td>
                      <div className="action-buttons-cell" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-view-profile"
                          onClick={() => setSelectedStudent(student)}
                          title="View complete student analysis"
                        >
                          Analysis ↗
                        </button>

                        {student.tier === 'at-risk' && (
                          <button 
                            className="btn-nudge-single"
                            onClick={() => setNudgeModalStudent(student)}
                            title="Send urgent WhatsApp nudge"
                          >
                            <span>💬 Nudge</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ---------------- DEEP-DIVE STUDENT ANALYSIS MODAL ---------------- */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedStudent(null)}>✕</button>

            {/* Modal Header */}
            <div className="detail-header">
              <div className="detail-avatar-lg" style={{ background: selectedStudent.avatar }}>
                {selectedStudent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="detail-name-block" style={{ flex: 1 }}>
                <h2>{selectedStudent.name}</h2>
                <div className="detail-badges">
                  <span className="detail-meta-chip" style={{ color: '#0066f5', fontFamily: 'monospace' }}>
                    {selectedStudent.usn}
                  </span>
                  <span className="detail-meta-chip">{selectedStudent.department} • 6th Sem ({selectedStudent.section})</span>
                  <span className="detail-meta-chip">📞 {selectedStudent.phone}</span>
                  <span className="detail-meta-chip" style={{ color: '#b45309' }}>
                    👨‍👩‍👦 Guardian: {selectedStudent.parentPhone}
                  </span>
                  <span className={`status-pill ${selectedStudent.tier}`}>
                    {selectedStudent.tier.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Big Readiness Score Radial Widget */}
              <div style={{ textAlign: 'center', minWidth: '90px' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: getTierColor(selectedStudent.tier) }}>
                  {selectedStudent.readinessScore}%
                </div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                  Readiness Index
                </div>
              </div>
            </div>

            {/* Core Competency Radar / Skill Bars */}
            <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 800, color: '#12233f' }}>
              📊 Core Placement Competencies
            </div>
            <div className="skills-grid">
              <div className="skill-bar-card">
                <div className="skill-bar-head">
                  <span>Aptitude & Logical Reasoning</span>
                  <span className="skill-pct">{selectedStudent.aptitudeScore}%</span>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${selectedStudent.aptitudeScore}%`, background: '#0066f5' }}></div>
                </div>
              </div>

              <div className="skill-bar-card">
                <div className="skill-bar-head">
                  <span>Domain & Technical Skills</span>
                  <span className="skill-pct">{selectedStudent.codingScore}%</span>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${selectedStudent.codingScore}%`, background: '#10b981' }}></div>
                </div>
              </div>

              <div className="skill-bar-card">
                <div className="skill-bar-head">
                  <span>Soft Skills & Business English</span>
                  <span className="skill-pct">{selectedStudent.softSkillsScore}%</span>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${selectedStudent.softSkillsScore}%`, background: '#8b5cf6' }}></div>
                </div>
              </div>

              <div className="skill-bar-card">
                <div className="skill-bar-head">
                  <span>Mock Interview Performance</span>
                  <span className="skill-pct">{selectedStudent.mockInterviewRating} / 5.0 ⭐</span>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${(selectedStudent.mockInterviewRating / 5) * 100}%`, background: '#f59e0b' }}></div>
                </div>
              </div>
            </div>

            {/* 5 AERS Curriculum Modules Breakdown */}
            <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 800, color: '#12233f' }}>
              🎯 Curriculum Level Progression (Current: Level {selectedStudent.currentLevel} of 20)
            </div>
            <div className="modules-checklist">
              {selectedStudent.modules.map((m) => (
                <div key={m.moduleId} className="mod-check-row">
                  <div className="mod-check-left">
                    <span className={`status-icon-dot ${m.status}`}></span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#12233f' }}>{m.moduleName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {m.completedLevels} of {m.totalLevels} levels verified
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 700, 
                      color: m.status === 'completed' ? '#10b981' : m.status === 'in-progress' ? '#0066f5' : '#64748b' 
                    }}>
                      {m.status === 'completed' ? '✓ Mastered' : m.status === 'in-progress' ? `${m.score}% In Progress` : 'Locked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Faculty Action Intervention Hub */}
            <div className="action-box">
              <div className="action-box-title">
                <span>⚡ Direct Faculty Interventions ("Force Student to Work & Study")</span>
              </div>
              <div className="action-buttons-group">
                <button 
                  className="btn-act-whatsapp"
                  onClick={() => setNudgeModalStudent(selectedStudent)}
                >
                  <span>💬 Send Urgent WhatsApp Nudge</span>
                </button>

                <button 
                  className="btn-act-parent"
                  onClick={() => handleSendSingleNudge(selectedStudent, 'parent_call')}
                >
                  <span>📞 Call Guardian ({selectedStudent.parentPhone})</span>
                </button>

                <button 
                  className="btn-act-counseling"
                  onClick={() => handleSendSingleNudge(selectedStudent, 'counseling')}
                >
                  <span>📅 Schedule Mandatory Mentoring</span>
                </button>
              </div>
            </div>

            {/* Intervention History Timeline */}
            <div className="intervention-timeline">
              <div className="timeline-title">📜 Action & Intervention Audit Log ({selectedStudent.interventions.length})</div>
              {selectedStudent.interventions.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                  No prior faculty interventions recorded for this candidate.
                </div>
              ) : (
                selectedStudent.interventions.map((int) => (
                  <div key={int.id} className="timeline-item">
                    <div className="timeline-head">
                      <span style={{ fontWeight: 700, color: '#0066f5' }}>{int.conductedBy}</span>
                      <span>•</span>
                      <span>{int.timestamp}</span>
                      <span>•</span>
                      <span style={{ 
                        textTransform: 'uppercase', 
                        fontSize: '10px', 
                        color: int.status === 'acknowledged' ? '#10b981' : '#f59e0b' 
                      }}>
                        [{int.status}]
                      </span>
                    </div>
                    <div className="timeline-note">{int.note}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- WHATSAPP NUDGE MODAL ---------------- */}
      {nudgeModalStudent && (
        <div className="modal-overlay" onClick={() => setNudgeModalStudent(null)}>
          <div className="modal-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setNudgeModalStudent(null)}>✕</button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: '#25d366', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px' 
              }}>
                💬
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#12233f', fontSize: '18px', fontWeight: 800 }}>
                  Send WhatsApp Nudge to {nudgeModalStudent.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Roll No: {nudgeModalStudent.usn} • Mobile: {nudgeModalStudent.phone}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Select Warning Template:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setNudgeTemplate('urgent')}
                  style={{ 
                    flex: 1, 
                    padding: '9px', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: nudgeTemplate === 'urgent' ? '#ef4444' : '#f1f5f9',
                    color: nudgeTemplate === 'urgent' ? '#ffffff' : '#475569',
                    border: nudgeTemplate === 'urgent' ? '1px solid #dc2626' : '1px solid #cbd5e1'
                  }}
                >
                  🚨 Defaulter Warning
                </button>
                <button 
                  type="button" 
                  onClick={() => setNudgeTemplate('inactivity')}
                  style={{ 
                    flex: 1, 
                    padding: '9px', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: nudgeTemplate === 'inactivity' ? '#f59e0b' : '#f1f5f9',
                    color: nudgeTemplate === 'inactivity' ? '#ffffff' : '#475569',
                    border: nudgeTemplate === 'inactivity' ? '1px solid #d97706' : '1px solid #cbd5e1'
                  }}
                >
                  ⏳ Inactivity Alert
                </button>
                <button 
                  type="button" 
                  onClick={() => setNudgeTemplate('drive')}
                  style={{ 
                    flex: 1, 
                    padding: '9px', 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    borderRadius: '8px', 
                    cursor: 'pointer',
                    background: nudgeTemplate === 'drive' ? '#0066f5' : '#f1f5f9',
                    color: nudgeTemplate === 'drive' ? '#ffffff' : '#475569',
                    border: nudgeTemplate === 'drive' ? '1px solid #004ec4' : '1px solid #cbd5e1'
                  }}
                >
                  🏢 Drive Eligibility
                </button>
              </div>
            </div>

            <div style={{ 
              background: '#f8fafd', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '16px', 
              marginBottom: '20px' 
            }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>
                Message Preview:
              </div>
              <div style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 500 }}>
                {nudgeTemplate === 'urgent' && (
                  `⚠️ *OFFICIAL PLACEMENT CELL NOTICE*\n\nDear ${nudgeModalStudent.name} (${nudgeModalStudent.usn}),\nYour Placement Readiness Index is currently critical at *${nudgeModalStudent.readinessScore}%* (Level ${nudgeModalStudent.currentLevel}/20).\n\nAs per Department instructions, you are required to open the AERS Learning App and complete your pending assessments *within 24 hours*. Failure to do so will lead to de-registration from upcoming campus drives.\n\n— *${activeRole}*`
                )}
                {nudgeTemplate === 'inactivity' && (
                  `⏳ *AERS ATTENDANCE REMINDER*\n\nHi ${nudgeModalStudent.name},\nYou have been inactive on the AERS Placement App for *${nudgeModalStudent.daysInactive} days*. Daily streak and module progress are strictly monitored by your HOD.\n\nResume your streak today: Complete Level ${nudgeModalStudent.currentLevel}.\n\n— *Placement Mentorship Team*`
                )}
                {nudgeTemplate === 'drive' && (
                  `🏢 *CAMPUS DRIVE ELIGIBILITY CUTOFF*\n\nDear ${nudgeModalStudent.name},\nEligibility for Tier-1 companies requires a minimum Placement Readiness Score of 75%. Your current score is *${nudgeModalStudent.readinessScore}%*.\n\nComplete Module 2 (Resume) and Module 4 (Interview Prep) on your AERS app immediately to qualify.\n\n— *Placement Office*`
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => setNudgeModalStudent(null)}
                style={{ 
                  background: '#f1f5f9', 
                  border: '1px solid #cbd5e1', 
                  color: '#475569', 
                  padding: '10px 18px', 
                  borderRadius: '10px', 
                  fontSize: '13px', 
                  fontWeight: 700,
                  cursor: 'pointer' 
                }}
              >
                Cancel
              </button>

              <button 
                type="button"
                onClick={() => {
                  const msg = nudgeTemplate === 'urgent' 
                    ? `⚠️ OFFICIAL PLACEMENT NOTICE: Dear ${nudgeModalStudent.name}, your readiness score is critical at ${nudgeModalStudent.readinessScore}%. Complete Level ${nudgeModalStudent.currentLevel} immediately.`
                    : nudgeTemplate === 'inactivity'
                    ? `⏳ ATTENDANCE NOTICE: Inactive for ${nudgeModalStudent.daysInactive} days. Resume streak on AERS app today.`
                    : `🏢 DRIVE ELIGIBILITY: Complete your remaining modules to hit the 75% cutoff.`;
                  
                  // Open WhatsApp API in new tab if requested
                  const cleanPhone = nudgeModalStudent.phone.replace(/[^0-9]/g, '');
                  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
                  handleSendSingleNudge(nudgeModalStudent, 'whatsapp', msg);
                }}
                style={{ 
                  background: '#25d366', 
                  border: 'none', 
                  color: '#fff', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
                }}
              >
                <span>💬 Send & Open WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- TOAST NOTIFICATION ---------------- */}
      {toastMessage && (
        <div className="toast-notice">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
