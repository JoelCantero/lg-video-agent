import React from 'react';
import { colors } from '../elg-narrated-video/theme';

const VIEW_W = 160;
const VIEW_H = 300;
const SHOULDER = [40, -150] as const;
const ARM = 118;

const armAngle = (raise: number) => ((172 - 148 * raise) * Math.PI) / 180;

/** Hand position of a person with its feet at (0, 0), in px for the given height. */
export const personHand = (height: number, raise: number) => {
  const k = height / VIEW_H;
  const a = armAngle(raise);
  return { x: (SHOULDER[0] + Math.sin(a) * ARM) * k, y: (SHOULDER[1] - Math.cos(a) * ARM) * k };
};

/** The same person as an SVG group with the feet at (x, y), to place inside another drawing. */
export const PersonShape: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly color?: string;
  readonly squash?: number;
  readonly lean?: number;
}> = ({ x, y, height, color = colors.white, squash = 0, lean = 0 }) => {
  const k = height / VIEW_H;
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${k} ${k * (1 - 0.28 * squash)})`}>
      <path d="M -58 0 L -58 -140 A 58 58 0 0 1 58 -140 L 58 0 Z" fill={color} />
      <circle cx={0} cy={-246} r={40} fill={color} />
    </g>
  );
};

/** A simple person (head and rounded body) standing with the feet at (x, y). */
export const Person: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly height: number;
  readonly color?: string;
  readonly opacity?: number;
  /** 0: arm down, 1: arm raised up and to the right. */
  readonly raise?: number;
  readonly lean?: number;
  readonly squash?: number;
  readonly flip?: boolean;
  readonly children?: React.ReactNode;
}> = ({ x, y, height, color = colors.white, opacity = 1, raise = 0, lean = 0, squash = 0, flip = false, children }) => {
  const width = (height * VIEW_W) / VIEW_H;
  const a = armAngle(raise);
  const hand = [SHOULDER[0] + Math.sin(a) * ARM, SHOULDER[1] - Math.cos(a) * ARM];
  return (
    <svg
      width={width}
      height={height}
      viewBox={`${-VIEW_W / 2} ${-VIEW_H} ${VIEW_W} ${VIEW_H}`}
      style={{ position: 'absolute', left: x - width / 2, top: y - height, overflow: 'visible', opacity }}
    >
      <g transform={`rotate(${lean}) scale(${flip ? -1 : 1} ${1 - 0.28 * squash})`}>
        {raise > 0 ? (
          <line x1={SHOULDER[0]} y1={SHOULDER[1]} x2={hand[0]} y2={hand[1]} stroke={color} strokeWidth={30} strokeLinecap="round" opacity={Math.min(1, raise * 4)} />
        ) : null}
        <path d="M -58 0 L -58 -140 A 58 58 0 0 1 58 -140 L 58 0 Z" fill={color} />
        <circle cx={0} cy={-246} r={40} fill={color} />
        {children}
      </g>
    </svg>
  );
};
