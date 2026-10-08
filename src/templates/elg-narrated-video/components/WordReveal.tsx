import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { clamp, easeOut } from '../theme';

/** A word that appears when it is spoken (fade, rise and focus). */
export const WordReveal: React.FC<{
  readonly at: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 7], [0, 1], { ...clamp, easing: easeOut });
  return (
    <span
      style={{
        display: 'inline-block',
        opacity: p,
        translate: `0px ${(1 - p) * 24}px`,
        filter: `blur(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
