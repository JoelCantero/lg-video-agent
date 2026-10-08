import React from 'react';
import { interpolateColors, random } from 'remotion';
import { colors } from '../theme';

// Cross-section seen through the lens. Coordinates are fractions of the lens radius.
export const ProcessInterior: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly frame: number;
  readonly heat: number;
  readonly energy: number;
  readonly absorb: number;
  readonly agitation: number;
  readonly boil: number;
}> = ({ cx, cy, r, frame, heat, energy, absorb, agitation, boil }) => {
  const X = (n: number) => cx + n * r;
  const Y = (n: number) => cy + n * r;
  const surface = -0.16;
  const wall = 0.52;
  const amplitude = 0.012 + 0.045 * boil;
  const wave = Array.from({ length: 41 }, (_, i) => {
    const x = -1 + i * 0.05;
    return `L ${X(x)} ${Y(surface + amplitude * Math.sin(x * 9 + frame * 0.25))}`;
  }).join(' ');

  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={colors.ink} />

      {[0, 1, 2, 3].map((i) => {
        const flicker = 0.8 + Math.sin(frame * 0.8 + i * 1.3) * 0.14 + Math.sin(frame * 2.1 + i) * 0.06;
        const height = 0.3 * (0.55 + 0.6 * heat) * flicker * r;
        const width = 0.13 * (0.8 + 0.3 * heat) * r;
        return (
          <path
            key={i}
            d="M 0 0 C -20 -14 -14 -44 0 -70 C 14 -44 20 -14 0 0 Z"
            fill={colors.white}
            transform={`translate(${X(-0.36 + i * 0.24)} ${Y(0.98)}) scale(${width / 34} ${height / 70})`}
          />
        );
      })}

      <path
        d={`M ${X(-1)} ${Y(wall)} L ${X(-1)} ${Y(surface)} ${wave} L ${X(1)} ${Y(wall)} Z`}
        fill={interpolateColors(absorb, [0, 1], [colors.teal, colors.sage])}
      />
      <rect x={X(-1)} y={Y(wall)} width={2 * r} height={0.08 * r} fill={colors.white} />

      {[-0.3, 0, 0.3].map((x, i) => (
        <path
          key={x}
          d={`M ${X(x)} ${Y(0.9)} q ${-0.06 * r} ${-0.1 * r} 0 ${-0.2 * r} t 0 ${-0.2 * r} t 0 ${-0.2 * r} t 0 ${-0.2 * r}`}
          fill="none"
          stroke={colors.white}
          strokeWidth={0.035 * r}
          strokeLinecap="round"
          strokeDasharray={`${0.12 * r} ${0.09 * r}`}
          strokeDashoffset={-(frame * 0.025 * r + i * 0.07 * r)}
          opacity={energy * (1 - 0.55 * absorb)}
        />
      ))}

      {new Array(12).fill(true).map((_, i) => {
        const baseX = -0.7 + random(`molecule-x-${i}`) * 1.4;
        const baseY = -0.04 + random(`molecule-y-${i}`) * 0.46;
        const reach = 0.008 + 0.05 * agitation;
        const speed = 0.25 + 0.55 * agitation;
        return (
          <circle
            key={i}
            cx={X(baseX + Math.sin(frame * speed + i * 2.1) * reach)}
            cy={Y(baseY + Math.cos(frame * speed * 1.13 + i * 3.7) * reach)}
            r={0.045 * r}
            fill={colors.white}
          />
        );
      })}

      {new Array(7).fill(true).map((_, i) => {
        const cycle = 34 + (i % 3) * 8;
        const t = (((frame + i * 11) % cycle) + cycle) % cycle / cycle;
        const radius = (0.02 + random(`bubble-r-${i}`) * 0.035) * r;
        return (
          <circle
            key={i}
            cx={X(-0.6 + i * 0.2 + Math.sin(t * 6 + i) * 0.02)}
            cy={Y(0.46 - t * 0.6)}
            r={radius * (0.6 + t * 0.6)}
            fill="none"
            stroke={colors.white}
            strokeWidth={0.014 * r}
            opacity={boil * Math.min(1, (1 - t) * 4)}
          />
        );
      })}

      {[-0.35, 0, 0.35].map((x, i) => {
        const t = (((frame + i * 15) % 45) + 45) % 45 / 45;
        return (
          <path
            key={x}
            d={`M 0 0 c ${-0.06 * r} ${-0.07 * r} ${0.06 * r} ${-0.14 * r} 0 ${-0.21 * r} c ${-0.06 * r} ${-0.07 * r} ${0.06 * r} ${-0.14 * r} 0 ${-0.21 * r}`}
            fill="none"
            stroke={colors.white}
            strokeWidth={0.03 * r}
            strokeLinecap="round"
            opacity={boil * Math.sin(t * Math.PI) * 0.9}
            transform={`translate(${X(x)} ${Y(surface - 0.04 - t * 0.35)})`}
          />
        );
      })}
    </g>
  );
};
