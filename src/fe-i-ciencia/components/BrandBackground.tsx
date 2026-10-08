import React from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { brandGradient, colors } from '../theme';

const DOT_COUNT = 24;

export const BrandBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const span = height + 200;

  return (
    <AbsoluteFill style={{ background: brandGradient, overflow: 'hidden' }}>
      {new Array(DOT_COUNT).fill(true).map((_, i) => {
        const size = 6 + random(`dot-size-${i}`) * 10;
        const speed = 0.25 + random(`dot-speed-${i}`) * 0.5;
        const startY = random(`dot-y-${i}`) * span;
        const y = ((((startY - frame * speed) % span) + span) % span) - 100;
        const x = random(`dot-x-${i}`) * width + Math.sin(frame / 70 + i) * 14;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: colors.white,
              opacity: 0.06 + random(`dot-opacity-${i}`) * 0.12,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
