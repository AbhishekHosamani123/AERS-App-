import { useState } from 'react';
import './LeaderboardPodium.css';

export interface LeaderboardStudent {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  college?: string;
}

const TOP_3_STUDENTS: LeaderboardStudent[] = [
  {
    rank: 1,
    name: 'Aarav',
    avatar: '/students/student1.jpg',
    xp: 3450,
    college: 'RV College of Engineering',
  },
  {
    rank: 2,
    name: 'Priya',
    avatar: '/students/student2.jpg',
    xp: 3120,
    college: 'BMS College of Engineering',
  },
  {
    rank: 3,
    name: 'Rahul',
    avatar: '/students/student3.jpg',
    xp: 2890,
    college: 'PES University',
  },
];

const TABLE_STUDENTS: LeaderboardStudent[] = [
  { rank: 4, name: 'Sneha', avatar: '/students/student2.jpg', xp: 2760, college: 'MS Ramaiah Institute of Tech' },
  { rank: 5, name: 'Karan', avatar: '/students/student3.jpg', xp: 2610, college: 'IIIT Bangalore' },
  { rank: 6, name: 'Ananya', avatar: '/students/student2.jpg', xp: 2480, college: 'BMS Institute of Tech' },
  { rank: 7, name: 'Vikram', avatar: '/students/student1.jpg', xp: 2310, college: 'Dayananda Sagar College' },
  { rank: 8, name: 'Rohan', avatar: '/students/student3.jpg', xp: 2190, college: 'RV Institute of Tech' },
  { rank: 9, name: 'Meera', avatar: '/students/student2.jpg', xp: 2050, college: 'Bangalore Institute of Tech' },
  { rank: 10, name: 'Aditya', avatar: '/students/student1.jpg', xp: 1980, college: 'Sir MVIT' },
];

export function LeaderboardPodium() {
  const [expanded, setExpanded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardStudent | null>(null);

  const rank1 = TOP_3_STUDENTS[0];
  const rank2 = TOP_3_STUDENTS[1];
  const rank3 = TOP_3_STUDENTS[2];

  return (
    <section className="leaderboard-card" aria-label="Student Leaderboard">
      {/* Subtle entrance shine sweep */}
      <div className="leaderboard-card__shine-sweep" aria-hidden="true" />

      {/* Decorative Background Botanical Leaves */}
      <img
        src="/leaf.png"
        alt=""
        className="leaderboard-card__leaf leaf--left"
        aria-hidden="true"
      />
      <img
        src="/leaf.png"
        alt=""
        className="leaderboard-card__leaf leaf--right"
        aria-hidden="true"
      />


      {/* Floating Confetti Shapes */}
      <div className="leaderboard-card__confetti" aria-hidden="true">
        <span className="confetti-chip chip--1" />
        <span className="confetti-chip chip--2" />
        <span className="confetti-chip chip--3" />
        <span className="confetti-chip chip--4" />
        <span className="confetti-chip chip--5" />
        <span className="confetti-chip chip--6" />
        <span className="confetti-chip chip--7" />
        <span className="confetti-chip chip--8" />
      </div>

      {/* Header: Title */}
      <div className="leaderboard-card__header">
        <div className="leaderboard-card__title-box">
          <div className="leaderboard-card__title-row">
            <span className="leaderboard-card__trophy">🏆</span>
            <h2 className="leaderboard-card__title">Student Leaderboard</h2>
            <div className="leaderboard-card__sparks" aria-hidden="true">
              <span className="spark-line spark-1" />
              <span className="spark-line spark-2" />
              <span className="spark-line spark-3" />
            </div>
          </div>
          <p className="leaderboard-card__subtitle">Top learners advancing on their AERS Journey</p>
        </div>
      </div>


      {/* 3-Tier Podium (Ranks 2, 1, 3) */}
      <div className="leaderboard-card__podium-stage">
        {/* ================= RANK 2 (LEFT) ================= */}
        <div
          className="podium-col col--rank-2"
          onClick={() => setSelectedStudent(rank2)}
          role="button"
          tabIndex={0}
          aria-label={`Rank 2: ${rank2.name}`}
        >
          {/* Silver Tiara / Crown */}
          <div className="podium-crown crown--silver" aria-hidden="true">
            <svg viewBox="0 0 32 20" fill="none">
              <path d="M4 17 L8 6 L16 11 L24 6 L28 17 Z" fill="#94a3b8" />
              <circle cx="8" cy="5" r="1.5" fill="#cbd5e1" />
              <circle cx="16" cy="10" r="1.5" fill="#cbd5e1" />
              <circle cx="24" cy="5" r="1.5" fill="#cbd5e1" />
            </svg>
          </div>

          {/* Avatar with Silver Pill */}
          <div className="podium-avatar-wrap">
            <div className="podium-avatar-ring ring--silver">
              <img src={rank2.avatar} alt={rank2.name} className="podium-avatar-img" />
            </div>
            <span className="podium-rank-pill pill--silver">Rank 2</span>
          </div>

          {/* Stepped Block 2 */}
          <div className="podium-block block--rank-2">
            <strong className="podium-student-name">{rank2.name}</strong>
            <span className="podium-student-xp">{rank2.xp} XP</span>
          </div>
        </div>

        {/* ================= RANK 1 (CENTER - TALLEST) ================= */}
        <div
          className="podium-col col--rank-1"
          onClick={() => setSelectedStudent(rank1)}
          role="button"
          tabIndex={0}
          aria-label={`Rank 1: ${rank1.name}`}
        >
          {/* Gold Radiant Crown */}
          <div className="podium-crown crown--gold" aria-hidden="true">
            <div className="crown-rays">
              <span className="c-ray ray-l2" />
              <span className="c-ray ray-l1" />
              <span className="c-ray ray-r1" />
              <span className="c-ray ray-r2" />
            </div>
            <svg viewBox="0 0 44 26" fill="none">
              <path d="M4 22 L10 7 L22 14 L34 7 L40 22 Z" fill="#f59e0b" />
              <circle cx="10" cy="6" r="2.5" fill="#fef08a" />
              <circle cx="22" cy="13" r="2.5" fill="#fef08a" />
              <circle cx="34" cy="6" r="2.5" fill="#fef08a" />
            </svg>
          </div>

          {/* Avatar with Gold Halo Ring & Pill */}
          <div className="podium-avatar-wrap">
            <div className="podium-avatar-ring ring--gold">
              <img src={rank1.avatar} alt={rank1.name} className="podium-avatar-img" />
            </div>
            <span className="podium-rank-pill pill--gold">Rank 1</span>
          </div>

          {/* Royal Blue Stepped Block 1 */}
          <div className="podium-block block--rank-1">
            <strong className="podium-student-name name--rank-1">{rank1.name}</strong>
            <span className="podium-student-xp xp--rank-1">{rank1.xp} XP</span>
          </div>
        </div>

        {/* ================= RANK 3 (RIGHT) ================= */}
        <div
          className="podium-col col--rank-3"
          onClick={() => setSelectedStudent(rank3)}
          role="button"
          tabIndex={0}
          aria-label={`Rank 3: ${rank3.name}`}
        >
          {/* Bronze Tiara / Crown */}
          <div className="podium-crown crown--bronze" aria-hidden="true">
            <svg viewBox="0 0 32 20" fill="none">
              <path d="M4 17 L8 6 L16 11 L24 6 L28 17 Z" fill="#b45309" />
              <circle cx="8" cy="5" r="1.5" fill="#fde68a" />
              <circle cx="16" cy="10" r="1.5" fill="#fde68a" />
              <circle cx="24" cy="5" r="1.5" fill="#fde68a" />
            </svg>
          </div>

          {/* Avatar with Bronze Pill */}
          <div className="podium-avatar-wrap">
            <div className="podium-avatar-ring ring--bronze">
              <img src={rank3.avatar} alt={rank3.name} className="podium-avatar-img" />
            </div>
            <span className="podium-rank-pill pill--bronze">Rank 3</span>
          </div>

          {/* Stepped Block 3 */}
          <div className="podium-block block--rank-3">
            <strong className="podium-student-name">{rank3.name}</strong>
            <span className="podium-student-xp">{rank3.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Top 10 Table & Expand Button */}
      <div className={`leaderboard-card__table-box ${expanded ? 'is-expanded' : 'is-collapsed'}`}>
        {expanded && (
          <>
            {/* Table Header */}
            <div className="leaderboard-table__header">
              <span className="col-header col-rank">RANK</span>
              <span className="col-header col-student">STUDENT</span>
              <span className="col-header col-xp">XP</span>
            </div>

            {/* Student Rows (Ranks 4-10) */}
            <div className="leaderboard-table__body">
              {TABLE_STUDENTS.map((st) => (
                <div
                  key={st.rank}
                  className="leaderboard-table__row"
                  onClick={() => setSelectedStudent(st)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="row-rank-num">{st.rank}</span>
                  <div className="row-student-info">
                    <img src={st.avatar} alt={st.name} className="row-avatar-img" />
                    <span className="row-student-name">{st.name}</span>
                  </div>
                  <span className="row-xp-val">{st.xp} XP</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* View Top 10 CTA Button */}
        <button
          className="leaderboard-table__view-btn"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Show fewer ranks' : 'View top 10 students'}
        >
          <span>{expanded ? 'Show Less' : 'View Top 10 Students'}</span>
          <span className="view-btn-arrow">{expanded ? '↑' : '→'}</span>
        </button>
      </div>

      {/* Student Profile Quick Popover / Toast */}
      {selectedStudent && (
        <div className="leaderboard-modal__backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="leaderboard-modal__dialog" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
            <div className="modal-avatar-box">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} className="modal-avatar-img" />
              <span className="modal-rank-badge">Rank #{selectedStudent.rank}</span>
            </div>
            <h3 className="modal-student-name">{selectedStudent.name}</h3>
            {selectedStudent.college && <p className="modal-college-name">{selectedStudent.college}</p>}
            <div className="modal-xp-pill">{selectedStudent.xp} Total XP</div>
          </div>
        </div>
      )}
    </section>
  );
}
