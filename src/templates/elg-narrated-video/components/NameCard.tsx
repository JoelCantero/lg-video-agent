import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { bodyFont, clamp, colors, easeOut, headingFont } from '../theme';

export const NameCard: React.FC<{
  readonly role: string;
  readonly name: string;
  readonly nameAt: number;
  readonly roleAt?: number;
  readonly nameSize?: number;
  readonly style?: React.CSSProperties;
}> = ({ role, name, nameAt, roleAt, nameSize = 100, style }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [nameAt, nameAt + 14], [0, 1], { ...clamp, easing: easeOut });
  const roleIn = roleAt === undefined ? 1 : interpolate(frame, [roleAt, roleAt + 10], [0, 1], { ...clamp, easing: easeOut });

  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 22, ...style }}>
      <div style={{ width: 14, borderRadius: 7, background: colors.ink }} />
      <div
        style={{
          background: colors.white,
          borderRadius: 36,
          padding: '30px 52px 36px',
          boxShadow: '0 24px 60px rgba(18, 24, 12, 0.2)',
        }}
      >
        <div style={{ fontFamily: bodyFont, fontWeight: 700, fontSize: 42, lineHeight: 1.25, color: colors.ink, opacity: roleIn }}>
          {role}
        </div>
        <div
          style={{
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: nameSize,
            lineHeight: 1.1,
            color: colors.teal,
            whiteSpace: 'nowrap',
            clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
            translate: `${(1 - reveal) * -24}px 0px`,
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
};
