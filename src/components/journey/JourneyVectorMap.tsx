import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../data/journeyData';

export function JourneyVectorMap() {
  return (
    <svg
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      className="journey-vector-svg"
      preserveAspectRatio="xMidYMin slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Sky Gradients */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="10%" stopColor="#3b82f6" />
          <stop offset="18%" stopColor="#93c5fd" />
          <stop offset="25%" stopColor="#e0f2fe" />
        </linearGradient>

        {/* Plateau Terrains */}
        <linearGradient id="plateau5Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>

        <linearGradient id="plateau4Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        <linearGradient id="plateau3Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>

        <linearGradient id="plateau2Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>

        <linearGradient id="plateau1Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="50%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>

        <linearGradient id="valleyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        {/* Path Gradient */}
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* River Gradient */}
        <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* Wood Signboard Texture */}
        <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#854d0e" />
          <stop offset="50%" stopColor="#713f12" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* Gold Glow */}
        <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        {/* Tree Defs */}
        <g id="pineTree">
          <polygon points="0,-22 -9, -8 9, -8" fill="#15803d" />
          <polygon points="0,-15 -11, 0 11, 0" fill="#166534" />
          <polygon points="0,-8 -13, 8 13, 8" fill="#14532d" />
          <rect x="-2" y="8" width="4" height="6" fill="#78350f" />
        </g>

        <g id="pineTreeGold">
          <polygon points="0,-22 -9, -8 9, -8" fill="#eab308" />
          <polygon points="0,-15 -11, 0 11, 0" fill="#ca8a04" />
          <polygon points="0,-8 -13, 8 13, 8" fill="#a16207" />
          <rect x="-2" y="8" width="4" height="6" fill="#78350f" />
        </g>

        <g id="pineTreePurple">
          <polygon points="0,-22 -9, -8 9, -8" fill="#a855f7" />
          <polygon points="0,-15 -11, 0 11, 0" fill="#9333ea" />
          <polygon points="0,-8 -13, 8 13, 8" fill="#7e22ce" />
          <rect x="-2" y="8" width="4" height="6" fill="#78350f" />
        </g>

        <g id="rockCluster">
          <ellipse cx="-4" cy="0" rx="7" ry="5" fill="#64748b" />
          <ellipse cx="4" cy="2" rx="9" ry="6" fill="#475569" />
          <ellipse cx="1" cy="-2" rx="5" ry="4" fill="#94a3b8" />
        </g>
      </defs>

      {/* ================= BACKGROUND SKY & DISTANT PEAKS ================= */}
      <rect x="0" y="0" width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#valleyGrad)" />
      <rect x="0" y="0" width={CANVAS_WIDTH} height="400" fill="url(#skyGrad)" />

      {/* Sunburst Rays at the Summit */}
      <circle cx="210" cy="180" r="160" fill="url(#sunburstGrad)" />
      <g opacity="0.35" stroke="#fef08a" strokeWidth="2.5" strokeDasharray="6 8">
        <line x1="210" y1="180" x2="30" y2="40" />
        <line x1="210" y1="180" x2="100" y2="10" />
        <line x1="210" y1="180" x2="210" y2="0" />
        <line x1="210" y1="180" x2="320" y2="10" />
        <line x1="210" y1="180" x2="390" y2="40" />
        <line x1="210" y1="180" x2="410" y2="120" />
        <line x1="210" y1="180" x2="10" y2="120" />
      </g>

      {/* Distant Mountains */}
      <polygon points="40,240 120,110 200,240" fill="#60a5fa" opacity="0.7" />
      <polygon points="120,110 140,145 100,145" fill="#ffffff" opacity="0.9" />
      <polygon points="220,240 300,100 380,240" fill="#60a5fa" opacity="0.7" />
      <polygon points="300,100 320,135 280,135" fill="#ffffff" opacity="0.9" />

      {/* Clouds */}
      <g fill="#ffffff" opacity="0.85">
        <ellipse cx="60" cy="60" rx="36" ry="16" />
        <ellipse cx="80" cy="52" rx="24" ry="18" />
        <ellipse cx="360" cy="70" rx="40" ry="16" />
        <ellipse cx="340" cy="62" rx="26" ry="20" />
      </g>

      {/* ================= TERRAIN PLATEAUS ================= */}

      {/* Plateau 5: Workplace Readiness (y ~ 300 to 740) */}
      <path
        d="M -10,320 Q 80,300 210,300 Q 340,300 430,320 L 430,730 Q 300,750 200,740 Q 100,730 -10,720 Z"
        fill="url(#plateau5Grad)"
      />
      {/* Cliff Depth Under Plateau 5 */}
      <path
        d="M -10,720 Q 100,730 200,740 Q 300,750 430,730 L 430,760 Q 300,780 200,770 Q 100,760 -10,750 Z"
        fill="#581c87"
      />

      {/* Plateau 4: Interview Readiness (y ~ 740 to 1180) */}
      <path
        d="M -10,750 Q 120,730 220,740 Q 320,750 430,760 L 430,1170 Q 320,1190 210,1180 Q 100,1170 -10,1160 Z"
        fill="url(#plateau4Grad)"
      />
      {/* Cliff Depth Under Plateau 4 */}
      <path
        d="M -10,1160 Q 100,1170 210,1180 Q 320,1190 430,1170 L 430,1200 Q 320,1220 210,1210 Q 100,1200 -10,1190 Z"
        fill="#9a3412"
      />

      {/* Plateau 3: Communication (y ~ 1180 to 1620) */}
      <path
        d="M -10,1190 Q 110,1180 210,1185 Q 310,1190 430,1200 L 430,1610 Q 310,1630 210,1620 Q 110,1610 -10,1600 Z"
        fill="url(#plateau3Grad)"
      />
      {/* Cascading Water River / Rapids on Right */}
      <path
        d="M 380,760 Q 400,980 390,1200 Q 380,1420 390,1640 Q 400,1860 380,2080 L 420,2080 L 420,760 Z"
        fill="url(#riverGrad)"
        opacity="0.85"
      />
      {/* Water Spray */}
      <ellipse cx="395" cy="1200" rx="14" ry="6" fill="#ffffff" opacity="0.6" />
      <ellipse cx="395" cy="1640" rx="14" ry="6" fill="#ffffff" opacity="0.6" />

      {/* Cliff Depth Under Plateau 3 */}
      <path
        d="M -10,1600 Q 110,1610 210,1620 Q 310,1630 430,1610 L 430,1640 Q 310,1660 210,1650 Q 110,1640 -10,1630 Z"
        fill="#075985"
      />

      {/* Plateau 2: Résumé Readiness (y ~ 1620 to 2060) */}
      <path
        d="M -10,1630 Q 120,1615 220,1625 Q 320,1635 430,1640 L 430,2050 Q 320,2070 210,2060 Q 100,2050 -10,2040 Z"
        fill="url(#plateau2Grad)"
      />
      {/* Cliff Depth Under Plateau 2 */}
      <path
        d="M -10,2040 Q 100,2050 210,2060 Q 320,2070 430,2050 L 430,2080 Q 320,2100 210,2090 Q 100,2080 -10,2070 Z"
        fill="#854d0e"
      />

      {/* Plateau 1: Career Clarity & Valley (y ~ 2060 to 2600) */}
      <path
        d="M -10,2070 Q 110,2060 210,2065 Q 310,2070 430,2080 L 430,2610 L -10,2610 Z"
        fill="url(#plateau1Grad)"
      />

      {/* ================= CONTINUOUS WINDING GAME PATH ================= */}
      {/* Path Shadow / Outer Border */}
      <path
        d="M 210,2600 
           L 210,2470 
           C 210,2380 135,2360 135,2260 
           C 135,2200 200,2290 200,2290 
           C 200,2290 265,2290 265,2290 
           C 265,2290 330,2200 330,2260 
           C 330,2140 190,2120 190,2050 
           C 190,1960 145,1930 145,1820 
           C 145,1760 205,1850 205,1850 
           C 205,1850 265,1850 265,1850 
           C 265,1850 330,1760 330,1820 
           C 330,1700 170,1680 170,1610 
           C 170,1520 145,1490 145,1380 
           C 145,1320 205,1410 205,1410 
           C 205,1410 265,1410 265,1410 
           C 265,1410 330,1320 330,1380 
           C 330,1260 140,1240 140,1170 
           C 140,1080 145,1050 145,940 
           C 145,880 205,970 205,970 
           C 205,970 265,970 265,970 
           C 265,970 330,880 330,940 
           C 330,830 300,790 300,730 
           C 300,640 145,610 145,500 
           C 145,440 205,530 205,530 
           C 205,530 265,530 265,530 
           C 265,530 330,440 330,500 
           C 330,370 210,320 210,230"
        fill="none"
        stroke="#78350f"
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />

      {/* Main Sandy Road */}
      <path
        d="M 210,2600 
           L 210,2470 
           C 210,2380 135,2360 135,2260 
           C 135,2200 200,2290 200,2290 
           C 200,2290 265,2290 265,2290 
           C 265,2290 330,2200 330,2260 
           C 330,2140 190,2120 190,2050 
           C 190,1960 145,1930 145,1820 
           C 145,1760 205,1850 205,1850 
           C 205,1850 265,1850 265,1850 
           C 265,1850 330,1760 330,1820 
           C 330,1700 170,1680 170,1610 
           C 170,1520 145,1490 145,1380 
           C 145,1320 205,1410 205,1410 
           C 205,1410 265,1410 265,1410 
           C 265,1410 330,1320 330,1380 
           C 330,1260 140,1240 140,1170 
           C 140,1080 145,1050 145,940 
           C 145,880 205,970 205,970 
           C 205,970 265,970 265,970 
           C 265,970 330,880 330,940 
           C 330,830 300,790 300,730 
           C 300,640 145,610 145,500 
           C 145,440 205,530 205,530 
           C 205,530 265,530 265,530 
           C 265,530 330,440 330,500 
           C 330,370 210,320 210,230"
        fill="none"
        stroke="url(#pathGrad)"
        strokeWidth="40"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Path Dashed Centerline Guide */}
      <path
        d="M 210,2600 
           L 210,2470 
           C 210,2380 135,2360 135,2260 
           C 135,2200 200,2290 200,2290 
           C 200,2290 265,2290 265,2290 
           C 265,2290 330,2200 330,2260 
           C 330,2140 190,2120 190,2050 
           C 190,1960 145,1930 145,1820 
           C 145,1760 205,1850 205,1850 
           C 205,1850 265,1850 265,1850 
           C 265,1850 330,1760 330,1820 
           C 330,1700 170,1680 170,1610 
           C 170,1520 145,1490 145,1380 
           C 145,1320 205,1410 205,1410 
           C 205,1410 265,1410 265,1410 
           C 265,1410 330,1320 330,1380 
           C 330,1260 140,1240 140,1170 
           C 140,1080 145,1050 145,940 
           C 145,880 205,970 205,970 
           C 205,970 265,970 265,970 
           C 265,970 330,880 330,940 
           C 330,830 300,790 300,730 
           C 300,640 145,610 145,500 
           C 145,440 205,530 205,530 
           C 205,530 265,530 265,530 
           C 265,530 330,440 330,500 
           C 330,370 210,320 210,230"
        fill="none"
        stroke="#d97706"
        strokeWidth="2.5"
        strokeDasharray="6 8"
        opacity="0.6"
      />

      {/* ================= WOODEN TRANSITION BRIDGES ================= */}
      {/* Bridge 1 (M1 to M2): at (190, 2050) */}
      <g transform="translate(190, 2050) rotate(-15)">
        <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#92400e" stroke="#451a03" strokeWidth="2" />
        <line x1="-24" y1="-7" x2="24" y2="-7" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="0" x2="24" y2="0" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="7" x2="24" y2="7" stroke="#b45309" strokeWidth="2" />
        <line x1="-22" y1="-14" x2="22" y2="-14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <line x1="-22" y1="14" x2="22" y2="14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Bridge 2 (M2 to M3): at (170, 1610) */}
      <g transform="translate(170, 1610) rotate(20)">
        <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#92400e" stroke="#451a03" strokeWidth="2" />
        <line x1="-24" y1="-7" x2="24" y2="-7" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="0" x2="24" y2="0" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="7" x2="24" y2="7" stroke="#b45309" strokeWidth="2" />
        <line x1="-22" y1="-14" x2="22" y2="-14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <line x1="-22" y1="14" x2="22" y2="14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Bridge 3 (M3 to M4): at (140, 1170) */}
      <g transform="translate(140, 1170) rotate(-25)">
        <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#92400e" stroke="#451a03" strokeWidth="2" />
        <line x1="-24" y1="-7" x2="24" y2="-7" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="0" x2="24" y2="0" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="7" x2="24" y2="7" stroke="#b45309" strokeWidth="2" />
        <line x1="-22" y1="-14" x2="22" y2="-14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <line x1="-22" y1="14" x2="22" y2="14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Bridge 4 (M4 to M5): at (300, 730) */}
      <g transform="translate(300, 730) rotate(30)">
        <rect x="-24" y="-12" width="48" height="24" rx="4" fill="#92400e" stroke="#451a03" strokeWidth="2" />
        <line x1="-24" y1="-7" x2="24" y2="-7" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="0" x2="24" y2="0" stroke="#b45309" strokeWidth="2" />
        <line x1="-24" y1="7" x2="24" y2="7" stroke="#b45309" strokeWidth="2" />
        <line x1="-22" y1="-14" x2="22" y2="-14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
        <line x1="-22" y1="14" x2="22" y2="14" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* ================= SCATTERED TREES & ROCKS ================= */}
      {/* Module 5 Trees */}
      <use href="#pineTreePurple" x="380" y="360" transform="scale(1.2)" />
      <use href="#pineTreePurple" x="30" y="380" />
      <use href="#pineTreePurple" x="110" y="440" />
      <use href="#rockCluster" x="380" y="440" />

      {/* Module 4 Trees */}
      <use href="#pineTree" x="30" y="800" />
      <use href="#pineTreeGold" x="380" y="820" />
      <use href="#pineTree" x="100" y="900" />
      <use href="#rockCluster" x="380" y="940" />

      {/* Module 3 Trees */}
      <use href="#pineTree" x="25" y="1240" />
      <use href="#pineTree" x="100" y="1320" />
      <use href="#pineTree" x="360" y="1320" />
      <use href="#rockCluster" x="40" y="1420" />

      {/* Module 2 Trees */}
      <use href="#pineTreeGold" x="30" y="1680" />
      <use href="#pineTreeGold" x="380" y="1700" />
      <use href="#pineTree" x="100" y="1760" />
      <use href="#rockCluster" x="380" y="1860" />

      {/* Module 1 Trees & Valley Foliage */}
      <use href="#pineTree" x="30" y="2100" />
      <use href="#pineTree" x="380" y="2120" />
      <use href="#pineTree" x="80" y="2220" />
      <use href="#pineTree" x="360" y="2220" />
      <use href="#rockCluster" x="40" y="2380" />
      <use href="#rockCluster" x="370" y="2380" />

      {/* Start Area Trees */}
      <use href="#pineTree" x="40" y="2480" />
      <use href="#pineTree" x="380" y="2480" />
    </svg>
  );
}
