import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { Floating } from '../components/Floating';
import { Pill } from '../components/Pill';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { LensGlyph, OpenBook } from '../illustrations/Icons';
import { UniverseInterior } from '../illustrations/UniverseInterior';
import { clamp, colors, easeInOut, easeOut, pop, settle } from '../theme';

const at = sceneCues('creation');
const c = { bible: at(308), admire: at(313), god: at(314), know: at(316), partially: at(318), observing: at(319) };

const CX = 540;
const CY = 930;
const R = 260;

export const CreationScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bookIn = pop(frame, fps, c.bible, 13);
  const link = interpolate(frame, [c.admire, c.admire + 10], [0, 1], { ...clamp, easing: easeOut });
  const outline = interpolate(frame, [c.god, c.god + 16], [0, 1], { ...clamp, easing: easeOut });
  // The reveal stops at ~42 % of the disc: "conèixer-lo parcialment".
  const sweep = interpolate(frame, [c.know, c.partially + 8], [0, 150], { ...clamp, easing: easeOut });
  const partiallyIn = pop(frame, fps, c.partially, 12);
  const lensIn = settle(frame, fps, c.observing, 20);
  const lensDraw = interpolate(frame, [c.observing, c.observing + 14], [0, 1], { ...clamp, easing: easeInOut });

  const a0 = -Math.PI / 2;
  const a1 = a0 + (sweep * Math.PI) / 180;
  const wedge = `M ${CX} ${CY} L ${CX + R * Math.cos(a0)} ${CY + R * Math.sin(a0)} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 1 ${CX + R * Math.cos(a1)} ${CY + R * Math.sin(a1)} Z`;
  const mid = a0 + (sweep * Math.PI) / 360;
  const lensX = 990 + (CX + 0.52 * R * Math.cos(mid) - 990) * lensIn;
  const lensY = 1260 + (CY + 0.52 * R * Math.sin(mid) - 1260) * lensIn;

  return (
    <AbsoluteFill>
      <BrandBackground />
      {frame >= c.bible ? (
        <Floating x={540} y={470} scale={0.6 + 0.4 * bookIn} opacity={Math.min(1, bookIn * 1.4)}>
          <OpenBook width={380} />
        </Floating>
      ) : null}

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id="creation-wedge">
            <path d={wedge} />
          </clipPath>
        </defs>
        {link > 0 ? (
          <line x1={540} y1={612} x2={540} y2={612 + 50 * link} stroke={colors.white} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 18" />
        ) : null}
        {outline > 0 ? (
          <circle cx={CX} cy={CY} r={R} fill="none" stroke={colors.white} strokeWidth={6} strokeDasharray="18 14" opacity={outline} />
        ) : null}
        {sweep > 0.5 ? (
          <g>
            <g clipPath="url(#creation-wedge)">
              <UniverseInterior cx={CX} cy={CY} r={R} frame={frame} grid={0} />
            </g>
            <path d={wedge} fill="none" stroke={colors.white} strokeWidth={8} strokeLinejoin="round" />
          </g>
        ) : null}
        {lensDraw > 0 ? <LensGlyph cx={lensX} cy={lensY} r={100} draw={lensDraw} /> : null}
      </svg>

      {frame >= c.partially ? (
        <Floating x={540} y={1255} scale={0.6 + 0.4 * partiallyIn} opacity={Math.min(1, partiallyIn * 1.4)}>
          <Pill size={48}>Parcialment</Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
