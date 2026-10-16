import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../../data/journeyData';

/**
 * Minimal journey spine — a single muted dashed line.
 * No gradients, no glows, no extra dots. The nodes do the work.
 */
export function JourneyTrackSvg() {
  const d = `
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
      {/* One quiet spine — light, dashed, behind everything */}
      <path
        d={d}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="1.75"
        strokeDasharray="7 9"
        strokeLinecap="round"
        opacity="0.95"
      />
    </svg>
  );
}
