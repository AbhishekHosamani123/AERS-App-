import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../data/journeyData';

export function JourneyTrackSvg() {
  const pathD = `
    M 215,3830
    C 160,3790 95,3720 95,3610
    C 95,3550 155,3520 215,3490
    C 275,3460 335,3430 335,3370
    C 335,3310 335,3270 335,3250
    C 335,3140 215,3100 215,3030
    C 215,2970 95,2950 95,2910
    C 95,2850 95,2820 95,2790
    C 95,2730 155,2700 215,2670
    C 275,2640 335,2570 335,2450
    C 335,2390 335,2360 335,2330
    C 335,2270 275,2240 215,2210
    C 155,2180 95,2150 95,2090
    C 95,1980 95,1930 95,1870
    C 95,1810 155,1780 215,1750
    C 275,1720 335,1690 335,1630
    C 335,1570 335,1540 335,1510
    C 335,1400 215,1360 215,1290
    C 215,1230 95,1210 95,1170
    C 95,1110 95,1080 95,1050
    C 95,990 155,950 215,920
    C 215,860 215,760 215,700
    C 215,640 95,620 95,580
    C 95,520 95,490 95,460
    C 95,400 155,360 215,330
    C 215,260 215,200 215,120
  `;

  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className="journey-track-svg"
      preserveAspectRatio="xMidYMin slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Path Gradient for Active Flow */}
        <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0066F5" />
          <stop offset="40%" stopColor="#0284c7" />
          <stop offset="70%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Summit Golden Glow Filter */}
        <radialGradient id="summitAmbientGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Summit Halo Glow */}
      <circle cx="215" cy="120" r="140" fill="url(#summitAmbientGlow)" />

      {/* ================= 1. GLOWING UNDER-PATH TRACK ================= */}
      <path
        d={pathD}
        fill="none"
        stroke="#ffffff"
        strokeWidth="7"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d={pathD}
        fill="none"
        stroke="#bae6fd"
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* ================= 2. MAIN ELEGANT DOTTED JOURNEY PATH ================= */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#pathGradient)"
        strokeWidth="3"
        strokeDasharray="6 6"
        strokeLinecap="round"
        className="journey-active-track-line"
      />

      {/* ================= 3. SLEEK WAYPOINT BEADS ================= */}
      {/* Module 1 Waypoints */}
      <circle cx="155" cy="3550" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="275" cy="3430" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="335" cy="3310" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 2 Waypoints */}
      <circle cx="275" cy="3140" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="2970" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="95" cy="2850" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="2730" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 3 Waypoints */}
      <circle cx="275" cy="2560" r="3.5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1" />
      <circle cx="335" cy="2390" r="3.5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1" />
      <circle cx="275" cy="2270" r="3.5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="2150" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 4 Waypoints */}
      <circle cx="95" cy="1980" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="1810" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="275" cy="1690" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="335" cy="1570" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 5 Waypoints */}
      <circle cx="275" cy="1400" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="1230" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="95" cy="1110" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="985" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 6 Waypoints */}
      <circle cx="275" cy="810" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="640" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="95" cy="520" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="395" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Summit Approach Waypoint */}
      <circle cx="215" cy="225" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
    </svg>
  );
}
