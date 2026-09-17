export type Department = 'B.Com' | 'BBA' | 'BCA' | 'B.Sc' | 'BA';

export type ReadinessTier = 
  | 'star'       // 90-100%: Placement Ready Star Candidate
  | 'ready'      // 75-89%: Campus Placement Ready
  | 'moderate'   // 50-74%: Needs Steady Push
  | 'at-risk';   // <50%: Critical Defaulter / Lagging Behind

export interface ModuleProgress {
  moduleId: number;
  moduleName: string;
  completedLevels: number;
  totalLevels: number;
  score: number; // 0-100%
  status: 'completed' | 'in-progress' | 'not-started';
}

export interface StudentIntervention {
  id: string;
  type: 'whatsapp' | 'sms' | 'parent_call' | 'counseling';
  timestamp: string;
  note: string;
  status: 'sent' | 'scheduled' | 'acknowledged';
  conductedBy: string;
}

export interface Student {
  id: string;
  usn: string; // e.g. "21BCOM001", "21BBA014", "21BCA008"
  name: string;
  email: string;
  phone: string;
  parentPhone: string;
  department: Department;
  semester: number; // 6 or 7
  section: string; // 'A' | 'B' | 'C'
  avatar: string;
  readinessScore: number; // 0 - 100
  tier: ReadinessTier;
  currentLevel: number; // 1 to 20
  streakDays: number;
  attendancePct: number; // 0 - 100%
  aptitudeScore: number; // 0 - 100%
  codingScore: number; // 0 - 100%
  softSkillsScore: number; // 0 - 100%
  mockInterviewRating: number; // 1.0 - 5.0
  resumeVerified: boolean;
  resumeScore: number; // 0 - 100%
  lastActive: string; // e.g. "12m ago", "Today", "4 days ago", "11 days ago"
  daysInactive: number;
  modules: ModuleProgress[];
  interventions: StudentIntervention[];
  notes?: string;
}

export interface DepartmentSummary {
  department: Department;
  studentCount: number;
  avgReadinessScore: number;
  starCount: number;
  readyCount: number;
  atRiskCount: number;
  completionRate: number;
}

export interface DashboardFilterState {
  searchQuery: string;
  department: 'ALL' | Department;
  tier: 'ALL' | ReadinessTier;
  activityStatus: 'ALL' | 'active' | 'inactive';
  sortBy: 'readiness_desc' | 'readiness_asc' | 'usn' | 'name' | 'inactive_days' | 'level_desc';
}
