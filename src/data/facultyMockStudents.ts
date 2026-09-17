import type { Student, Department, ReadinessTier, DepartmentSummary } from '../types/facultyDashboard';

// Real Indian student names pool
const FIRST_NAMES = [
  'Aarav', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Pooja', 'Aditya', 'Priya',
  'Rahul', 'Neha', 'Karthik', 'Divya', 'Siddharth', 'Tanvi', 'Abhishek', 'Kavya',
  'Manish', 'Shreya', 'Gaurav', 'Meera', 'Varun', 'Nandini', 'Pranav', 'Rhea',
  'Deepak', 'Isha', 'Harish', 'Anjali', 'Nikhil', 'Simran', 'Arjun', 'Bhavna',
  'Sanjay', 'Swati', 'Akash', 'Shruti', 'Vishal', 'Preeti', 'Tejas', 'Ritu',
  'Chetan', 'Aishwarya', 'Kiran', 'Pallavi', 'Suraj', 'Monika', 'Rajesh', 'Sangeeta',
  'Sameer', 'Jyoti', 'Tarun', 'Shweta', 'Mayank', 'Archana', 'Ashwin', 'Vidya'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patil', 'Kulkarni', 'Iyer', 'Nair', 'Reddy', 'Rao',
  'Deshmukh', 'Joshi', 'Bhat', 'Hegde', 'Shetty', 'Pujari', 'Kamath', 'Gupta',
  'Singh', 'Mehta', 'Chopra', 'Agarwal', 'Menon', 'Pillai', 'Gowda', 'Kumar',
  'Prasad', 'Das', 'Roy', 'Sen', 'Banerjee', 'Mishra', 'Pandey', 'Tiwari'
];

const DEPTS: Department[] = ['B.Com', 'BBA', 'BCA', 'B.Sc', 'BA'];

const AVATAR_COLORS = [
  '#0066F5', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#EF4444', '#14B8A6'
];

// Helper to deterministically generate consistent 140+ mock students across degree courses
function generateMockStudents(): Student[] {
  const students: Student[] = [];
  const deptDist: { [key in Department]: number } = {
    'B.Com': 46,
    'BBA': 36,
    'BCA': 32,
    'B.Sc': 20,
    'BA': 14,
  };

  let globalIndex = 1;

  DEPTS.forEach((dept) => {
    const count = deptDist[dept];
    for (let i = 1; i <= count; i++) {
      const fn = FIRST_NAMES[(globalIndex * 7 + i * 3) % FIRST_NAMES.length];
      const ln = LAST_NAMES[(globalIndex * 5 + i * 11) % LAST_NAMES.length];
      const name = `${fn} ${ln}`;
      const deptCodeMap: { [key in Department]: string } = {
        'B.Com': 'BCOM',
        'BBA': 'BBA',
        'BCA': 'BCA',
        'B.Sc': 'BSC',
        'BA': 'BA',
      };
      const usnNum = i.toString().padStart(3, '0');
      const usn = `21${deptCodeMap[dept]}${usnNum}`;
      
      // Determine student performance profile:
      // ~22% Star candidates, ~40% Placement Ready, ~22% Moderate, ~16% At-Risk Defaulters
      const modValue = (globalIndex * 13 + i * 17) % 100;
      let tier: ReadinessTier;
      let readinessScore: number;
      let currentLevel: number;
      let daysInactive: number;
      let streakDays: number;
      let attendancePct: number;
      let aptitudeScore: number;
      let codingScore: number;
      let softSkillsScore: number;
      let mockInterviewRating: number;
      let resumeVerified: boolean;
      let resumeScore: number;

      if (modValue < 22) {
        // Star Candidate
        tier = 'star';
        readinessScore = 88 + (modValue % 12); // 88 - 99
        currentLevel = 17 + (modValue % 4); // 17 - 20
        daysInactive = 0;
        streakDays = 14 + (modValue % 25); // 14 - 38
        attendancePct = 90 + (modValue % 10);
        aptitudeScore = 85 + (modValue % 15);
        codingScore = 88 + (modValue % 12);
        softSkillsScore = 85 + (modValue % 14);
        mockInterviewRating = Number((4.3 + (modValue % 7) * 0.1).toFixed(1));
        resumeVerified = true;
        resumeScore = 92 + (modValue % 8);
      } else if (modValue < 62) {
        // Placement Ready
        tier = 'ready';
        readinessScore = 72 + (modValue % 16); // 72 - 87
        currentLevel = 13 + (modValue % 5); // 13 - 17
        daysInactive = (modValue % 3);
        streakDays = 5 + (modValue % 10);
        attendancePct = 78 + (modValue % 14);
        aptitudeScore = 72 + (modValue % 18);
        codingScore = 70 + (modValue % 18);
        softSkillsScore = 74 + (modValue % 16);
        mockInterviewRating = Number((3.6 + (modValue % 8) * 0.1).toFixed(1));
        resumeVerified = modValue % 3 !== 0;
        resumeScore = 75 + (modValue % 15);
      } else if (modValue < 84) {
        // Moderate / Needs Steady Push
        tier = 'moderate';
        readinessScore = 52 + (modValue % 18); // 52 - 69
        currentLevel = 7 + (modValue % 6); // 7 - 12
        daysInactive = 2 + (modValue % 4);
        streakDays = (modValue % 4);
        attendancePct = 65 + (modValue % 15);
        aptitudeScore = 50 + (modValue % 20);
        codingScore = 52 + (modValue % 20);
        softSkillsScore = 55 + (modValue % 20);
        mockInterviewRating = Number((2.8 + (modValue % 7) * 0.1).toFixed(1));
        resumeVerified = modValue % 2 === 0;
        resumeScore = 55 + (modValue % 20);
      } else {
        // At-Risk / Critical Defaulter
        tier = 'at-risk';
        readinessScore = 22 + (modValue % 26); // 22 - 47
        currentLevel = 1 + (modValue % 5); // 1 - 5
        daysInactive = 6 + (modValue % 16); // 6 - 21 days inactive!
        streakDays = 0;
        attendancePct = 42 + (modValue % 22);
        aptitudeScore = 28 + (modValue % 22);
        codingScore = 25 + (modValue % 25);
        softSkillsScore = 32 + (modValue % 20);
        mockInterviewRating = Number((1.5 + (modValue % 8) * 0.1).toFixed(1));
        resumeVerified = false;
        resumeScore = 20 + (modValue % 25);
      }

      // Format last active string
      let lastActive: string;
      if (daysInactive === 0) {
        lastActive = `${(globalIndex % 45) + 5}m ago`;
      } else if (daysInactive === 1) {
        lastActive = 'Yesterday';
      } else {
        lastActive = `${daysInactive} days ago`;
      }

      // Generate 5 module progress records matching AERS levels (4 levels each = 20 total)
      const moduleDefs = [
        { id: 1, name: 'Career Clarity', levels: 4 },
        { id: 2, name: 'Résumé Readiness', levels: 4 },
        { id: 3, name: 'Communication Confidence', levels: 4 },
        { id: 4, name: 'Interview Readiness', levels: 4 },
        { id: 5, name: 'Workplace Readiness', levels: 4 },
      ];

      let remainingLevels = currentLevel;
      const modules = moduleDefs.map((m) => {
        let completedInModule = 0;
        let modStatus: 'completed' | 'in-progress' | 'not-started' = 'not-started';
        let modScore = 0;

        if (remainingLevels >= m.levels) {
          completedInModule = m.levels;
          modStatus = 'completed';
          modScore = Math.min(100, Math.round(readinessScore + (i % 8)));
          remainingLevels -= m.levels;
        } else if (remainingLevels > 0) {
          completedInModule = remainingLevels;
          modStatus = 'in-progress';
          modScore = Math.round((completedInModule / m.levels) * (readinessScore * 0.9));
          remainingLevels = 0;
        } else {
          completedInModule = 0;
          modStatus = 'not-started';
          modScore = 0;
        }

        return {
          moduleId: m.id,
          moduleName: m.name,
          completedLevels: completedInModule,
          totalLevels: m.levels,
          score: modScore,
          status: modStatus,
        };
      });

      // Sample intervention history for at-risk and moderate students
      const interventions = [];
      if (tier === 'at-risk') {
        interventions.push({
          id: `int-${globalIndex}-1`,
          type: 'whatsapp' as const,
          timestamp: '2 days ago',
          note: 'Urgent reminder sent to complete Level 03 Career Clarity. Defaulter warning issued.',
          status: 'sent' as const,
          conductedBy: 'Prof. S. R. Hegde (Placement Head)',
        });
        if (daysInactive > 10) {
          interventions.push({
            id: `int-${globalIndex}-2`,
            type: 'parent_call' as const,
            timestamp: 'Yesterday',
            note: 'Parent alerted regarding 10+ days inactivity and missed placement aptitude assessments.',
            status: 'acknowledged' as const,
            conductedBy: 'Dr. V. Kulkarni (HOD)',
          });
        }
      }

      students.push({
        id: `std-${globalIndex}`,
        usn,
        name,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@college.edu.in`,
        phone: `+91 98${(40000000 + globalIndex * 739).toString().slice(0, 8)}`,
        parentPhone: `+91 97${(60000000 + globalIndex * 893).toString().slice(0, 8)}`,
        department: dept,
        semester: 6,
        section: ['A', 'B', 'C'][i % 3],
        avatar: AVATAR_COLORS[globalIndex % AVATAR_COLORS.length],
        readinessScore,
        tier,
        currentLevel,
        streakDays,
        attendancePct,
        aptitudeScore,
        codingScore,
        softSkillsScore,
        mockInterviewRating,
        resumeVerified,
        resumeScore,
        lastActive,
        daysInactive,
        modules,
        interventions,
        notes: tier === 'at-risk' ? 'Flagged for mandatory mentoring session before Campus Drive Round 1.' : undefined
      });

      globalIndex++;
    }
  });

  return students;
}

export const INITIAL_STUDENTS: Student[] = generateMockStudents();

// Department aggregate calculator
export function calculateDepartmentSummaries(students: Student[]): DepartmentSummary[] {
  return DEPTS.map((dept) => {
    const deptStudents = students.filter((s) => s.department === dept);
    const count = deptStudents.length;
    const avgScore = count > 0 
      ? Math.round(deptStudents.reduce((acc, s) => acc + s.readinessScore, 0) / count) 
      : 0;
    const starCount = deptStudents.filter((s) => s.tier === 'star').length;
    const readyCount = deptStudents.filter((s) => s.tier === 'ready').length;
    const atRiskCount = deptStudents.filter((s) => s.tier === 'at-risk').length;
    const avgLevels = count > 0 
      ? deptStudents.reduce((acc, s) => acc + s.currentLevel, 0) / count 
      : 0;
    const completionRate = Math.round((avgLevels / 20) * 100);

    return {
      department: dept,
      studentCount: count,
      avgReadinessScore: avgScore,
      starCount,
      readyCount,
      atRiskCount,
      completionRate,
    };
  });
}
