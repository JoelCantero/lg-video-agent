import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { Floating } from '../components/Floating';
import { Pill } from '../components/Pill';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { Arches, Gears } from '../illustrations/Icons';
import { clamp, colors, easeOut, headingFont, pop } from '../theme';

const at = sceneCues('analogies');
const c = {
  com1: at(322),
  architecture: at(327),
  more1: at(328),
  admire: at(330),
  gaudi: at(331),
  com2: at(332),
  engineering: at(337),
  more2: at(338),
  appreciate: at(340),
  genius: at(342),
  inventor: at(346),
};

const AuthorCard: React.FC<{ readonly lines: string[]; readonly size: number }> = ({ lines, size }) => (
  <div
    style={{
      padding: '22px 40px 26px',
      borderRadius: 36,
      background: colors.ink,
      color: colors.white,
      fontFamily: headingFont,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.1,
      textAlign: 'center',
      whiteSpace: 'nowrap',
      boxShadow: '0 24px 60px rgba(18, 24, 12, 0.25)',
    }}
  >
    {lines.map((line) => (
      <div key={line}>{line}</div>
    ))}
  </div>
);

// "Com més entenem X, més admirem l'autor": the work draws itself while the author grows.
export const AnalogiesScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const grow = (start: number) => interpolate(frame, [start, start + 14], [0, 1], { ...clamp, easing: easeOut });
  const label = (start: number, x: number, y: number, text: string) => {
    if (frame < start) return null;
    const p = pop(frame, fps, start, 12);
    return (
      <Floating x={x} y={y} scale={0.6 + 0.4 * p} opacity={Math.min(1, p * 1.4)}>
        <Pill size={40}>{text}</Pill>
      </Floating>
    );
  };
  const arrow = (start: number, y: number) => {
    const p = grow(start);
    if (p <= 0) return null;
    return (
      <g>
        <line x1={490} y1={y} x2={490 + 120 * p} y2={y} stroke={colors.white} strokeWidth={12} strokeLinecap="round" />
        <polyline points={`${582},${y - 26} ${614},${y} ${582},${y + 26}`} fill="none" stroke={colors.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={p >= 1 ? 1 : 0} />
      </g>
    );
  };

  const archesProgress = interpolate(frame, [c.com1, c.architecture + 18], [0, 1], clamp);
  const gearsProgress = interpolate(frame, [c.com2, c.engineering + 18], [0, 1], clamp);
  const gaudiIn = pop(frame, fps, c.more1, 12);
  const gaudiScale = interpolate(frame, [c.more1, c.admire, c.gaudi + 8], [0.55, 1, 1.25], { ...clamp, easing: easeOut });
  const inventorIn = pop(frame, fps, c.more2, 12);
  const inventorScale = interpolate(frame, [c.more2, c.appreciate, c.inventor + 8], [0.55, 1, 1.2], { ...clamp, easing: easeOut });
  const geniusPulse = 1 + 0.08 * interpolate(frame, [c.genius, c.genius + 6, c.genius + 18], [0, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <BrandBackground />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {arrow(c.more1, 560)}
        {arrow(c.more2, 1010)}
      </svg>

      <Floating x={300} y={560}>
        <Arches width={340} progress={archesProgress} />
      </Floating>
      {label(c.architecture, 300, 765, 'Arquitectura')}
      {frame >= c.more1 ? (
        <Floating x={800} y={560} scale={(0.6 + 0.4 * gaudiIn) * gaudiScale} opacity={Math.min(1, gaudiIn * 1.4)}>
          <AuthorCard lines={['Gaudí']} size={72} />
        </Floating>
      ) : null}

      {frame >= c.com2 ? (
        <Floating x={300} y={1010}>
          <Gears width={340} progress={gearsProgress} turn={Math.max(0, frame - c.com2) * 1.2} />
        </Floating>
      ) : null}
      {label(c.engineering, 300, 1215, 'Enginyeria')}
      {frame >= c.more2 ? (
        <Floating x={800} y={1010} scale={(0.6 + 0.4 * inventorIn) * inventorScale * geniusPulse} opacity={Math.min(1, inventorIn * 1.4)}>
          <AuthorCard lines={['Un gran', 'inventor']} size={60} />
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
