import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../data/journeyData';

export function JourneyTrackSvg() {
  const pathD = `
    M 215,3240
    C 160,3200 95,3130 95,3020
    C 95,2960 155,2930 215,2900
    C 275,2870 335,2840 335,2780
    C 335,2720 335,2680 335,2660
    C 335,2550 215,2510 215,2440
    C 215,2380 95,2360 95,2320
    C 95,2260 95,2230 95,2200
    C 95,2140 155,2110 215,2080
    C 275,2050 335,1980 335,1860
    C 335,1800 335,1770 335,1740
    C 335,1680 275,1650 215,1620
    C 155,1590 95,1560 95,1500
    C 95,1390 95,1340 95,1280
    C 95,1220 155,1190 215,1160
    C 275,1130 335,1100 335,1040
    C 335,980 335,950 335,920
    C 335,810 215,770 215,700
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
      <circle cx="155" cy="2960" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="275" cy="2840" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="335" cy="2720" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 2 Waypoints */}
      <circle cx="275" cy="2550" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="2380" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="95" cy="2260" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="2140" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 3 Waypoints */}
      <circle cx="275" cy="1970" r="3.5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1" />
      <circle cx="335" cy="1800" r="3.5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1" />
      <circle cx="275" cy="1680" r="3.5" fill="#0ea5e9" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="1560" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 4 Waypoints */}
      <circle cx="95" cy="1390" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="1220" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="275" cy="1100" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
      <circle cx="335" cy="980" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Module 5 Waypoints */}
      <circle cx="275" cy="810" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="640" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="95" cy="520" r="3.5" fill="#0066F5" stroke="#ffffff" strokeWidth="1" />
      <circle cx="155" cy="395" r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />

      {/* Summit Approach Waypoint */}
      <circle cx="215" cy="225" r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
    </svg>
  );
}
