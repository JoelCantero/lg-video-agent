import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { clamp, colors } from '../theme';

export const SWEEP_FRAMES = 16;
const snappy = Easing.bezier(0.7, 0, 0.3, 1);

// A tilted white band crosses the frame; at its midpoint (frame 8) it covers the whole cut.
export const SceneSweep: React.FC<{ readonly direction: 1 | -1 }> = ({ direction }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, SWEEP_FRAMES], [0, 1], { ...clamp, easing: snappy });
  const band = (p: number, width: number, opacity: number) => {
    const center = interpolate(Math.min(1, Math.max(0, p)), [0, 1], [-1500, 2580]);
    const x = direction === 1 ? center : 1080 - center;
    return (
      <div
        style={{
          position: 'absolute',
          top: -400,
          height: 2720,
          width,
          left: x - width / 2,
          background: colors.white,
          opacity,
          rotate: `${12 * direction}deg`,
        }}
      />
    );
  };

  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {band(progress * 1.1, 150, 0.55)}
      {band(progress, 1600, 1)}
      {band(progress * 0.92, 60, 0.7)}
    </AbsoluteFill>
  );
};
