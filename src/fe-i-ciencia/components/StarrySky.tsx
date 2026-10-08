import React from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../theme';

const STARS = new Array(110).fill(true).map((_, i) => ({
  x: random(`sky-x-${i}`),
  y: random(`sky-y-${i}`),
  size: 2 + random(`sky-size-${i}`) * 5,
  period: 12 + (i % 9) * 3,
}));

/** Night sky on the contrast colour, used for the verses and the universe. */
export const StarrySky: React.FC<{ readonly brightness?: number }> = ({ brightness = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: colors.ink, overflow: 'hidden' }}>
      {STARS.map((star, i) => {
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(frame / star.period + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: star.x * width,
              top: ((star.y * (height + 100) - frame * 0.25) % (height + 100) + height + 100) % (height + 100) - 50,
              width: star.size,
              height: star.size,
              borderRadius: '50%',
              background: colors.white,
              opacity: Math.min(1, twinkle * 0.8 * brightness),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
