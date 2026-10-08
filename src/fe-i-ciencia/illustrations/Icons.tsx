import React from 'react';
import { colors } from '../theme';

type IconProps = { readonly size: number; readonly color?: string };

export const EyeIcon: React.FC<IconProps> = ({ size, color = colors.teal }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 6 50 Q 50 6 94 50 Q 50 94 6 50 Z" fill="none" stroke={color} strokeWidth={9} strokeLinejoin="round" />
    <circle cx={50} cy={50} r={15} fill={color} />
  </svg>
);

export const RulerIcon: React.FC<IconProps> = ({ size, color = colors.teal }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={6} y={30} width={88} height={40} rx={7} fill="none" stroke={color} strokeWidth={8} />
    {[24, 40, 56, 72].map((x, i) => (
      <line key={x} x1={x} y1={30} x2={x} y2={i % 2 === 0 ? 50 : 44} stroke={color} strokeWidth={7} strokeLinecap="round" />
    ))}
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size, color = colors.teal }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 16 52 L 40 76 L 84 26" fill="none" stroke={color} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EmptyProofIcon: React.FC<IconProps> = ({ size, color = colors.white }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={36} fill="none" stroke={color} strokeWidth={8} strokeDasharray="12 10" />
  </svg>
);

export const OpenBook: React.FC<{ readonly width: number }> = ({ width }) => (
  <svg width={width} height={(width * 240) / 360} viewBox="0 0 360 240">
    <path d="M 180 40 C 140 14 70 10 16 26 L 16 214 C 70 198 140 202 180 226 Z" fill={colors.white} />
    <path d="M 180 40 C 220 14 290 10 344 26 L 344 214 C 290 198 220 202 180 226 Z" fill={colors.white} />
    <line x1={180} y1={44} x2={180} y2={222} stroke={colors.teal} strokeWidth={6} strokeLinecap="round" />
    {[70, 102, 134, 166].map((y) => (
      <React.Fragment key={y}>
        <line x1={46} y1={y} x2={150} y2={y - 4} stroke={colors.teal} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
        <line x1={210} y1={y - 4} x2={314} y2={y} stroke={colors.teal} strokeWidth={6} strokeLinecap="round" opacity={0.6} />
      </React.Fragment>
    ))}
  </svg>
);

export const Apple: React.FC<{ readonly width: number }> = ({ width }) => (
  <svg width={width} height={(width * 210) / 200} viewBox="0 0 200 210" style={{ overflow: 'visible' }}>
    <path d="M 100 74 Q 96 42 114 22" fill="none" stroke={colors.white} strokeWidth={13} strokeLinecap="round" />
    <path d="M 112 46 C 128 22 160 20 172 32 C 156 52 128 58 112 46 Z" fill={colors.white} />
    <path d="M 100 72 C 80 54 28 52 24 106 C 20 162 66 206 100 188 C 134 206 180 162 176 106 C 172 52 120 54 100 72 Z" fill={colors.white} />
    <path d="M 52 104 C 50 132 62 156 80 170" fill="none" stroke={colors.teal} strokeWidth={10} strokeLinecap="round" opacity={0.4} />
  </svg>
);

const drawn = (progress: number, start: number, span: number) => 1 - Math.min(1, Math.max(0, (progress - start) / span));

/** Generic catenary arches and spires, drawn as understanding grows. */
export const Arches: React.FC<{ readonly width: number; readonly progress: number }> = ({ width, progress }) => {
  const paths = [
    'M 10 286 L 330 286',
    'M 24 286 Q 84 46 144 286',
    'M 196 286 Q 256 46 316 286',
    'M 110 286 Q 170 -14 230 286',
    'M 136 150 Q 146 30 156 150',
    'M 184 150 Q 194 30 204 150',
  ];
  return (
    <svg width={width} height={(width * 300) / 340} viewBox="0 0 340 300" style={{ overflow: 'visible' }}>
      {paths.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={colors.white}
          strokeWidth={11}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={drawn(progress, i * 0.13, 0.35)}
        />
      ))}
    </svg>
  );
};

const gearPath = (cx: number, cy: number, teeth: number, outer: number, inner: number) => {
  const step = (Math.PI * 2) / teeth;
  const points: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    for (const [r, angle] of [
      [inner, a],
      [outer, a + step * 0.15],
      [outer, a + step * 0.45],
      [inner, a + step * 0.6],
    ] as const) {
      points.push(`${(cx + r * Math.cos(angle)).toFixed(1)} ${(cy + r * Math.sin(angle)).toFixed(1)}`);
    }
  }
  return `M ${points.join(' L ')} Z`;
};

/** Two meshing gears; they turn once drawn. */
export const Gears: React.FC<{ readonly width: number; readonly progress: number; readonly turn: number }> = ({ width, progress, turn }) => (
  <svg width={width} height={(width * 300) / 340} viewBox="0 0 340 300" style={{ overflow: 'visible' }}>
    <g transform={`rotate(${turn} 130 170)`}>
      <path d={gearPath(130, 170, 12, 112, 92)} fill="none" stroke={colors.white} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn(progress, 0, 0.55)} />
      <circle cx={130} cy={170} r={34} fill="none" stroke={colors.white} strokeWidth={10} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn(progress, 0.3, 0.3)} />
    </g>
    <g transform={`rotate(${-turn * 1.6 + 11} 262 86)`}>
      <path d={gearPath(262, 86, 8, 70, 54)} fill="none" stroke={colors.white} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn(progress, 0.35, 0.5)} />
      <circle cx={262} cy={86} r={20} fill="none" stroke={colors.white} strokeWidth={9} pathLength={1} strokeDasharray="1 1" strokeDashoffset={drawn(progress, 0.6, 0.3)} />
    </g>
  </svg>
);

/** Miniature of the "science vs faith" card, used to show the idea spreading. */
export const MiniIdeaCard: React.FC<{ readonly width: number }> = ({ width }) => (
  <svg width={width} height={(width * 250) / 300} viewBox="0 0 300 250">
    <rect x={0} y={0} width={300} height={250} rx={30} fill={colors.white} />
    <circle cx={95} cy={82} r={48} fill={colors.ink} />
    <circle cx={205} cy={82} r={48} fill={colors.teal} stroke={colors.ink} strokeWidth={6} />
    {[156, 184, 212].map((y) => (
      <rect key={y} x={55} y={y} width={80} height={14} rx={7} fill={colors.teal} opacity={0.55} />
    ))}
    {[156, 184].map((y) => (
      <rect key={y} x={165} y={y} width={80} height={14} rx={7} fill={colors.ink} opacity={0.55} />
    ))}
  </svg>
);

/** Magnifying glass centred on (cx, cy) inside a full-frame SVG. */
export const LensGlyph: React.FC<{
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
  readonly draw?: number;
  readonly glass?: number;
}> = ({ cx, cy, r, draw = 1, glass = 0.16 }) => {
  const a = Math.SQRT1_2;
  const arc = (angle: number) => [cx + 0.72 * r * Math.cos(angle), cy + 0.72 * r * Math.sin(angle)];
  const [x1, y1] = arc((200 * Math.PI) / 180);
  const [x2, y2] = arc((250 * Math.PI) / 180);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={colors.white} opacity={glass * draw} />
      <path d={`M ${x1} ${y1} A ${0.72 * r} ${0.72 * r} 0 0 1 ${x2} ${y2}`} fill="none" stroke={colors.white} strokeWidth={r * 0.07} strokeLinecap="round" opacity={0.8 * draw} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.ink} strokeWidth={Math.max(10, r * 0.12)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      <line
        x1={cx + r * a}
        y1={cy + r * a}
        x2={cx + r * (1 + 0.85 * Math.max(0, draw * 2 - 1)) * a}
        y2={cy + r * (1 + 0.85 * Math.max(0, draw * 2 - 1)) * a}
        stroke={colors.ink}
        strokeWidth={Math.max(14, r * 0.22)}
        strokeLinecap="round"
        opacity={draw > 0.5 ? 1 : 0}
      />
    </g>
  );
};
