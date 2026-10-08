import React from 'react';
import { colors } from '../elg-narrated-video/theme';

const HALF_BEAM = 230;
const DROP = 150;

/** Pan position (bowl centre) for a beam tilted by `tilt` degrees, relative to the pivot. */
export const panPosition = (side: -1 | 1, tilt: number) => {
  const t = (tilt * Math.PI) / 180;
  return { x: side * HALF_BEAM * Math.cos(t), y: side * HALF_BEAM * Math.sin(t) + DROP };
};

/** Offset of the pivot inside the drawing, to place the scale by its pivot. */
export const scalePivot = (width: number) => ({ x: width / 2, y: (80 * width) / 620, height: (width * 520) / 620 });

/**
 * Scales of justice centred on the pivot. Without a post (`post` 0) the beam
 * floats with nothing to measure against; `pivot` can replace the hub.
 */
export const JusticeScale: React.FC<{
  readonly width: number;
  readonly tilt: number;
  readonly post?: number;
  /** Opacity of a dashed outline where the post should be. */
  readonly ghostPost?: number;
  readonly color?: string;
  readonly pivot?: React.ReactNode;
  readonly left?: React.ReactNode;
  readonly right?: React.ReactNode;
}> = ({ width, tilt, post = 1, ghostPost = 0, color = colors.white, pivot, left, right }) => {
  const pans = ([-1, 1] as const).map((side) => ({ side, ...panPosition(side, tilt) }));
  return (
    <svg width={width} height={(width * 520) / 620} viewBox="-310 -80 620 520" style={{ overflow: 'visible' }}>
      {ghostPost > 0 ? (
        <g fill="none" stroke={color} strokeWidth={10} strokeDasharray="24 16" opacity={ghostPost}>
          <rect x={-12} y={30} width={24} height={362} rx={12} />
          <rect x={-110} y={384} width={220} height={30} rx={15} />
        </g>
      ) : null}
      {post > 0 ? (
        <g opacity={post}>
          <rect x={-12} y={0} width={24} height={392} rx={12} fill={color} />
          <rect x={-110} y={384} width={220} height={30} rx={15} fill={color} />
        </g>
      ) : null}
      {pans.map(({ side, x, y }) => (
        <g key={side}>
          <line x1={x} y1={y - DROP} x2={x - 76} y2={y} stroke={color} strokeWidth={6} />
          <line x1={x} y1={y - DROP} x2={x + 76} y2={y} stroke={color} strokeWidth={6} />
          <path d={`M ${x - 100} ${y} Q ${x} ${y + 70} ${x + 100} ${y} Z`} fill={color} />
          <g transform={`translate(${x} ${y})`}>{side === -1 ? left : right}</g>
        </g>
      ))}
      <g transform={`rotate(${tilt})`}>
        <rect x={-HALF_BEAM - 14} y={-12} width={HALF_BEAM * 2 + 28} height={24} rx={12} fill={color} />
      </g>
      {pivot ?? <circle r={26} fill={color} />}
    </svg>
  );
};
