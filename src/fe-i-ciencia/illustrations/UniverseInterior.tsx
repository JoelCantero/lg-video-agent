import React from 'react';
import { random } from 'remotion';
import { colors } from '../theme';

const STARS = new Array(70).fill(true).map((_, i) => {
  const angle = random(`star-angle-${i}`) * Math.PI * 2;
  const distance = Math.sqrt(random(`star-distance-${i}`)) * 0.94;
  return {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    size: 0.006 + random(`star-size-${i}`) * 0.011,
    period: 12 + (i % 9) * 3,
  };
});

// Night disc; the left half adds the measuring grid and lens of "com funciona".
export const UniverseInterior: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly frame: number;
  readonly grid: number;
}> = ({ cx, cy, r, frame, grid }) => {
  const lines = [-0.75, -0.5, -0.25];
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={colors.ink} />
      {STARS.map((star, i) => (
        <circle
          key={i}
          cx={cx + star.x * r}
          cy={cy + star.y * r}
          r={Math.max(1.5, star.size * r)}
          fill={colors.white}
          opacity={0.35 + 0.65 * Math.abs(Math.sin(frame / star.period + i))}
        />
      ))}
      <g opacity={grid}>
        {lines.map((x) => (
          <line key={`v${x}`} x1={cx + x * r} y1={cy - r} x2={cx + x * r} y2={cy + r} stroke={colors.white} strokeWidth={3} opacity={0.4} />
        ))}
        {[-0.5, 0, 0.5].map((y) => (
          <line key={`h${y}`} x1={cx - r} y1={cy + y * r} x2={cx} y2={cy + y * r} stroke={colors.white} strokeWidth={3} opacity={0.4} />
        ))}
        <circle
          cx={cx - 0.42 * r}
          cy={cy - 0.06 * r}
          r={0.26 * r}
          fill="none"
          stroke={colors.white}
          strokeWidth={0.05 * r}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - grid}
        />
        <line
          x1={cx - 0.42 * r + 0.26 * r * Math.SQRT1_2}
          y1={cy - 0.06 * r + 0.26 * r * Math.SQRT1_2}
          x2={cx - 0.42 * r + 0.46 * r * Math.SQRT1_2}
          y2={cy - 0.06 * r + 0.46 * r * Math.SQRT1_2}
          stroke={colors.white}
          strokeWidth={0.06 * r}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};
