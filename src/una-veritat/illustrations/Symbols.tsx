import React from 'react';
import { colors } from '../../templates/elg-narrated-video/theme';

export const Cross: React.FC<{ readonly height: number; readonly color?: string; readonly draw?: number }> = ({ height, color = colors.white, draw = 1 }) => {
  const k = Math.min(1, Math.max(0, draw));
  return (
    <svg width={(height * 240) / 380} height={height} viewBox="-120 0 240 380" style={{ overflow: 'visible' }}>
      <rect x={-28} y={380 - 380 * k} width={56} height={380 * k} rx={14} fill={color} />
      <rect x={-120 * k} y={88} width={240 * k} height={56} rx={14} fill={color} opacity={k > 0.5 ? 1 : 0} />
    </svg>
  );
};

export const Crown: React.FC<{ readonly width: number; readonly color?: string; readonly jewel?: string }> = ({ width, color = colors.white, jewel = colors.teal }) => (
  <svg width={width} height={(width * 200) / 280} viewBox="-140 -110 280 200" style={{ overflow: 'visible' }}>
    <path d="M -116 46 L -126 -58 L -62 -6 L 0 -92 L 62 -6 L 126 -58 L 116 46 Z" fill={color} strokeLinejoin="round" stroke={color} strokeWidth={10} />
    <rect x={-120} y={50} width={240} height={36} rx={12} fill={color} />
    {[-126, 0, 126].map((x, i) => (
      <circle key={x} cx={x} cy={i === 1 ? -96 : -62} r={14} fill={color} />
    ))}
    <circle cx={0} cy={14} r={16} fill={jewel} />
  </svg>
);

export const OpenBible: React.FC<{ readonly width: number; readonly open?: number }> = ({ width, open = 1 }) => {
  const k = Math.min(1, Math.max(0, open));
  return (
    <svg width={width} height={(width * 250) / 380} viewBox="-190 -10 380 250" style={{ overflow: 'visible' }}>
      <g transform={`scale(${0.25 + 0.75 * k} 1)`}>
        <path d="M 0 30 C -44 4 -116 0 -176 16 L -176 214 C -116 198 -44 202 0 228 Z" fill={colors.white} />
        <path d="M 0 30 C 44 4 116 0 176 16 L 176 214 C 116 198 44 202 0 228 Z" fill={colors.white} />
        <line x1={0} y1={34} x2={0} y2={224} stroke={colors.teal} strokeWidth={6} strokeLinecap="round" />
        {[66, 98, 130, 162].map((y) => (
          <React.Fragment key={y}>
            <line x1={-146} y1={y} x2={-30} y2={y - 4} stroke={colors.teal} strokeWidth={7} strokeLinecap="round" opacity={0.55} />
            <line x1={30} y1={y - 4} x2={146} y2={y} stroke={colors.teal} strokeWidth={7} strokeLinecap="round" opacity={0.55} />
          </React.Fragment>
        ))}
      </g>
    </svg>
  );
};

/** Straight arrow drawn from its tail; `progress` 0–1. */
export const Arrow: React.FC<{
  readonly length: number;
  readonly progress: number;
  readonly angle?: number;
  readonly color?: string;
  readonly stroke?: number;
}> = ({ length, progress, angle = 0, color = colors.white, stroke = 14 }) => {
  const p = Math.min(1, Math.max(0, progress));
  const tip = length * p;
  const head = stroke * 2.4;
  return (
    <svg width={length + head * 2} height={head * 3} viewBox={`${-head} ${-head * 1.5} ${length + head * 2} ${head * 3}`} style={{ overflow: 'visible', rotate: `${angle}deg` }}>
      {p > 0 ? (
        <>
          <line x1={0} y1={0} x2={tip} y2={0} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
          <polyline
            points={`${tip - head} ${-head} ${tip} 0 ${tip - head} ${head}`}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={p > 0.6 ? 1 : 0}
          />
        </>
      ) : null}
    </svg>
  );
};
