import React from 'react';
import { colors } from '../theme';

// Design units: the cup with handle and saucer is ~270 wide, centred on (0, 0).
const DESIGN_WIDTH = 270;

export const Cup: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly fill: number;
  readonly steam: number;
  readonly frame: number;
  readonly opacity?: number;
}> = ({ x, y, width, fill, steam, frame, opacity = 1 }) => {
  const k = width / DESIGN_WIDTH;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={opacity}>
      <ellipse cx={0} cy={72} rx={128} ry={18} fill={colors.white} />
      <circle cx={112} cy={-12} r={30} fill="none" stroke={colors.white} strokeWidth={16} />
      <path d="M -100 -60 L 100 -60 C 96 10 80 50 52 62 L -52 62 C -80 50 -96 10 -100 -60 Z" fill={colors.white} />
      <ellipse cx={0} cy={-60} rx={100} ry={16} fill={colors.ink} opacity={0.18} />
      <ellipse cx={0} cy={-60} rx={94 * fill} ry={13 * fill} fill={colors.teal} />
      {[-34, 34].map((offset, i) => {
        const t = (((frame + i * 22) % 44) + 44) % 44 / 44;
        return (
          <path
            key={offset}
            d="M 0 0 c -14 -18 14 -36 0 -54 c -14 -18 14 -36 0 -54"
            fill="none"
            stroke={colors.white}
            strokeWidth={12}
            strokeLinecap="round"
            opacity={steam * Math.sin(t * Math.PI)}
            transform={`translate(${offset} ${-84 - t * 50})`}
          />
        );
      })}
    </g>
  );
};
