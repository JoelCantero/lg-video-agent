import React from 'react';
import { colors } from '../theme';

// Stage units: viewBox 0 0 800 720. Body centre (400, 470); burner base at y≈702.
export const TEAPOT_VIEWBOX = { width: 800, height: 720 } as const;
export const TEAPOT_PIVOT = { x: 400, y: 470 } as const;
export const SPOUT_TIP = { x: 756, y: 361 } as const;

const Flame: React.FC<{ x: number; base: number; height: number; width: number }> = ({ x, base, height, width }) => (
  <path
    d="M 0 0 C -20 -14 -14 -44 0 -70 C 14 -44 20 -14 0 0 Z"
    fill={colors.white}
    transform={`translate(${x} ${base}) scale(${width / 34} ${height / 70})`}
  />
);

const SteamCurl: React.FC<{ x: number; y: number; scale: number; opacity: number; width?: number }> = ({
  x,
  y,
  scale,
  opacity,
  width = 16,
}) => (
  <path
    d="M 0 0 c -18 -22 18 -44 0 -66 c -18 -22 18 -44 0 -66"
    fill="none"
    stroke={colors.white}
    strokeWidth={width / scale}
    strokeLinecap="round"
    opacity={opacity}
    transform={`translate(${x} ${y}) scale(${scale})`}
  />
);

export const Teapot: React.FC<{
  readonly frame: number;
  readonly heat: number;
  readonly steam: number;
  readonly jiggle: number;
  readonly burner: number;
  readonly tilt: number;
}> = ({ frame, heat, steam, jiggle, burner, tilt }) => {
  const lidAngle = Math.sin(frame * 0.9) * 2.4 * jiggle;
  const lidLift = -Math.abs(Math.sin(frame * 0.9)) * 6 * jiggle;

  return (
    <svg width={TEAPOT_VIEWBOX.width} height={TEAPOT_VIEWBOX.height} viewBox="0 0 800 720" style={{ overflow: 'visible' }}>
      <g opacity={burner}>
        {[0, 1, 2, 3, 4].map((i) => {
          const flicker = 0.82 + Math.sin(frame * 0.8 + i * 1.7) * 0.12 + Math.sin(frame * 1.9 + i) * 0.06;
          return (
            <Flame
              key={i}
              x={260 + i * 70}
              base={678}
              height={70 * (0.55 + 0.5 * heat) * flicker}
              width={34 * (0.8 + 0.35 * heat)}
            />
          );
        })}
        <rect x={230} y={600} width={14} height={92} rx={7} fill={colors.white} />
        <rect x={556} y={600} width={14} height={92} rx={7} fill={colors.white} />
        <rect x={214} y={680} width={372} height={24} rx={12} fill={colors.white} />
      </g>

      <g transform={`rotate(${tilt} ${TEAPOT_PIVOT.x} ${TEAPOT_PIVOT.y})`}>
        {[0, 1, 2].map((i) => {
          const t = (((frame + i * 20) % 60) + 60) % 60 / 60;
          return (
            <SteamCurl
              key={i}
              x={SPOUT_TIP.x + i * 12 - t * 18}
              y={SPOUT_TIP.y - 18 - t * 150}
              scale={0.55 + t * 0.6}
              opacity={Math.sin(t * Math.PI) * steam}
            />
          );
        })}
        <path d="M 262 352 C 236 168, 564 168, 538 352" fill="none" stroke={colors.white} strokeWidth={30} strokeLinecap="round" />
        <path d="M 606 440 C 650 425 700 395 736 350 L 776 372 C 742 432 690 514 628 556 Z" fill={colors.white} />
        <path
          d="M 190 600 Q 160 600 162 572 C 168 440 220 345 310 330 L 490 330 C 580 345 632 440 638 572 Q 640 600 610 600 Z"
          fill={colors.white}
        />
        <path d="M 214 470 C 222 420 246 384 282 364" fill="none" stroke={colors.teal} strokeWidth={12} strokeLinecap="round" opacity={0.35} />
        <path d="M 196 524 Q 400 556 604 524" fill="none" stroke={colors.teal} strokeWidth={10} strokeLinecap="round" opacity={0.45} />
        <g transform={`translate(0 ${lidLift}) rotate(${lidAngle} 400 334)`}>
          <path d="M 296 334 Q 400 262 504 334 Z" fill={colors.white} />
          <circle cx={400} cy={282} r={24} fill={colors.white} />
          <line x1={304} y1={336} x2={496} y2={336} stroke={colors.teal} strokeWidth={8} strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};
