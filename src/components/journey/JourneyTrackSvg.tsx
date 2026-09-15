import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../data/journeyData';

export function JourneyTrackSvg() {
  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className="journey-track-svg"
      preserveAspectRatio="xMidYMin slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Dot Matrix Pattern */}
        <pattern id="dotGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#cbd5e1" opacity="0.45" />
        </pattern>

        {/* Minimalist Tree Def */}
        <g id="modernTealTree">
          {/* Ground Shadow */}
          <ellipse cx="0" cy="18" rx="14" ry="4" fill="#e2e8f0" />
          {/* Trunk */}
          <line x1="0" y1="0" x2="0" y2="18" stroke="#0f766e" strokeWidth="2.5" strokeLinecap="round" />
          {/* Oval Foliage */}
          <ellipse cx="0" cy="-6" rx="14" ry="22" fill="#0d9488" />
          <ellipse cx="-3" cy="-8" rx="8" ry="15" fill="#14b8a6" opacity="0.6" />
          {/* Leaf Accent */}
          <path d="M 0,-14 Q 3,-6 0,2" stroke="#042f2e" strokeWidth="1.2" fill="none" opacity="0.4" />
        </g>

        {/* Tree Small */}
        <g id="modernTealTreeSm">
          <ellipse cx="0" cy="14" rx="10" ry="3" fill="#e2e8f0" />
          <line x1="0" y1="0" x2="0" y2="14" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="0" cy="-4" rx="10" ry="16" fill="#0d9488" />
          <ellipse cx="-2" cy="-6" rx="6" ry="11" fill="#14b8a6" opacity="0.6" />
        </g>
      </defs>

      {/* ================= BACKGROUND DOT GRIDS ================= */}
      <rect x="0" y="0" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#ffffff" />
      
      {/* Decorative Dot Matrix Sections */}
      <rect x="10" y="200" width="90" height="120" fill="url(#dotGrid)" />
      <rect x="320" y="480" width="90" height="120" fill="url(#dotGrid)" />
      <rect x="10" y="1000" width="80" height="120" fill="url(#dotGrid)" />
      <rect x="330" y="1420" width="80" height="120" fill="url(#dotGrid)" />
      <rect x="10" y="1920" width="80" height="120" fill="url(#dotGrid)" />
      <rect x="330" y="2350" width="80" height="120" fill="url(#dotGrid)" />

      {/* ================= CONTINUOUS SERPENTINE DASHED PATH ================= */}
      {/* Path connecting:
          START (210, 2600)
          -> Lvl 01 (85, 2420)
          -> Waypoint (148, 2390)
          -> Lvl 02 (210, 2360)
          -> Waypoint (272, 2330)
          -> Lvl 03 (335, 2300)
          -> Curve Up to Lvl 04 (335, 2190)
          -> Waypoint (272, 2130)
          -> Lvl 05 (210, 2070)
          -> Waypoint (148, 2040)
          -> Lvl 06 (85, 2010)
          -> Curve Up to Lvl 07 (85, 1870)
          -> Waypoint (148, 1830)
          -> Lvl 08 (210, 1790)
          -> Waypoint (272, 1740)
          -> Lvl 09 (335, 1690)
          -> Curve Up to Lvl 10 (335, 1550)
          -> Waypoint (272, 1510)
          -> Lvl 11 (210, 1470)
          -> Waypoint (148, 1430)
          -> Lvl 12 (85, 1390)
          -> Curve Up to Lvl 13 (85, 1250)
          -> Waypoint (148, 1210)
          -> Lvl 14 (210, 1170)
          -> Waypoint (272, 1130)
          -> Lvl 15 (335, 1090)
          -> Curve Up to Lvl 16 (335, 950)
          -> Waypoint (272, 910)
          -> Lvl 17 (210, 870)
          -> Waypoint (148, 830)
          -> Lvl 18 (85, 790)
          -> Curve Up to Lvl 19 (85, 650)
          -> Waypoint (148, 600)
          -> Lvl 20 (210, 550)
          -> Summit Passport (210, 310)
      */}
      <path
        d="M 210,2600
           C 150,2550 85,2490 85,2420
           C 140,2400 170,2370 210,2360
           C 250,2350 290,2320 335,2300
           C 365,2280 365,2210 335,2190
           C 290,2160 250,2100 210,2070
           C 170,2040 130,2025 85,2010
           C 55,1990 55,1890 85,1870
           C 130,1850 170,1815 210,1790
           C 250,1765 290,1720 335,1690
           C 365,1670 365,1570 335,1550
           C 290,1530 250,1490 210,1470
           C 170,1450 130,1410 85,1390
           C 55,1370 55,1270 85,1250
           C 130,1230 170,1190 210,1170
           C 250,1150 290,1110 335,1090
           C 365,1070 365,970 335,950
           C 290,930 250,890 210,870
           C 170,850 130,810 85,790
           C 55,770 55,670 85,650
           C 130,620 170,570 210,550
           C 210,480 210,420 210,310"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />

      {/* ================= WAYPOINT DOTS ================= */}
      {/* Intermediate Waypoints */}
      <circle cx="148" cy="2390" r="3.5" fill="#3b82f6" />
      <circle cx="272" cy="2330" r="3.5" fill="#3b82f6" />
      <circle cx="360" cy="2245" r="3.5" fill="#3b82f6" />
      <circle cx="272" cy="2130" r="3.5" fill="#f59e0b" />
      <circle cx="148" cy="2040" r="3.5" fill="#3b82f6" />
      <circle cx="60" cy="1940" r="3.5" fill="#3b82f6" />
      <circle cx="148" cy="1830" r="3.5" fill="#3b82f6" />
      <circle cx="272" cy="1740" r="3.5" fill="#3b82f6" />
      <circle cx="360" cy="1620" r="3.5" fill="#f59e0b" />
      <circle cx="272" cy="1510" r="3.5" fill="#3b82f6" />
      <circle cx="148" cy="1430" r="3.5" fill="#3b82f6" />
      <circle cx="60" cy="1320" r="3.5" fill="#3b82f6" />
      <circle cx="148" cy="1210" r="3.5" fill="#3b82f6" />
      <circle cx="272" cy="1130" r="3.5" fill="#f59e0b" />
      <circle cx="360" cy="1020" r="3.5" fill="#3b82f6" />
      <circle cx="272" cy="910" r="3.5" fill="#3b82f6" />
      <circle cx="148" cy="830" r="3.5" fill="#3b82f6" />
      <circle cx="60" cy="720" r="3.5" fill="#3b82f6" />
      <circle cx="148" cy="600" r="3.5" fill="#f59e0b" />

      {/* ================= MINIMALIST TEAL TREES ================= */}
      <use href="#modernTealTree" x="30" y="2440" />
      <use href="#modernTealTreeSm" x="390" y="2320" />
      <use href="#modernTealTree" x="385" y="2100" />
      <use href="#modernTealTreeSm" x="25" y="1960" />
      <use href="#modernTealTree" x="25" y="1740" />
      <use href="#modernTealTreeSm" x="390" y="1580" />
      <use href="#modernTealTree" x="390" y="1360" />
      <use href="#modernTealTreeSm" x="25" y="1200" />
      <use href="#modernTealTree" x="25" y="980" />
      <use href="#modernTealTreeSm" x="390" y="820" />
      <use href="#modernTealTree" x="390" y="600" />
      <use href="#modernTealTree" x="30" y="460" />
      <use href="#modernTealTreeSm" x="390" y="360" />
    </svg>
  );
}
