import React from 'react';
import { colors, headingFont } from '../theme';

/** The two protagonists: "Ciència" (contrast disc with a measuring grid) and "Fe" (teal disc). */
export const IdeaDisc: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly r: number;
  readonly tone: 'science' | 'faith';
  readonly scale?: number;
  readonly opacity?: number;
}> = ({ x, y, r, tone, scale = 1, opacity = 1 }) => {
  const science = tone === 'science';
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: 2 * r,
        height: 2 * r,
        borderRadius: '50%',
        boxSizing: 'border-box',
        border: `${Math.max(6, r * 0.07)}px solid ${colors.ink}`,
        background: science ? colors.ink : colors.teal,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scale: `${Math.max(0, scale)}`,
        opacity: Math.max(0, Math.min(1, opacity)),
        boxShadow: '0 24px 60px rgba(18, 24, 12, 0.25)',
      }}
    >
      {science ? (
        <svg width={2 * r} height={2 * r} viewBox="-1 -1 2 2" style={{ position: 'absolute', inset: 0 }}>
          {[-0.5, 0, 0.5].map((v) => (
            <React.Fragment key={v}>
              <line x1={v} y1={-1} x2={v} y2={1} stroke={colors.white} strokeWidth={0.012} opacity={0.22} />
              <line x1={-1} y1={v} x2={1} y2={v} stroke={colors.white} strokeWidth={0.012} opacity={0.22} />
            </React.Fragment>
          ))}
        </svg>
      ) : null}
      <span
        style={{
          position: 'relative',
          fontFamily: headingFont,
          fontWeight: 700,
          fontSize: science ? r * 0.36 : r * 0.55,
          lineHeight: 1,
          color: colors.white,
          letterSpacing: 0,
        }}
      >
        {science ? 'Ciència' : 'Fe'}
      </span>
    </div>
  );
};
