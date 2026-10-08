import React from 'react';
import { colors, headingFont } from '../theme';

type PillTone = 'light' | 'ink';

export const Pill: React.FC<{
  readonly children: React.ReactNode;
  readonly tone?: PillTone;
  readonly size?: number;
  readonly style?: React.CSSProperties;
}> = ({ children, tone = 'light', size = 48, style }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${Math.round(size * 0.24)}px ${Math.round(size * 0.56)}px`,
      borderRadius: 999,
      fontFamily: headingFont,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.1,
      letterSpacing: 0,
      whiteSpace: 'nowrap',
      background: tone === 'light' ? colors.white : colors.ink,
      color: tone === 'light' ? colors.teal : colors.white,
      boxShadow: '0 18px 44px rgba(18, 24, 12, 0.2)',
      ...style,
    }}
  >
    {children}
  </div>
);
