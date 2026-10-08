import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { Floating } from '../components/Floating';
import { Pill } from '../components/Pill';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { LensGlyph } from '../illustrations/Icons';
import { UniverseInterior } from '../illustrations/UniverseInterior';
import { brandGradient, clamp, colors, easeInOut, easeOut, headingFont, pop, settle } from '../theme';

const at = sceneCues('christ');
const c = {
  admire: at(374),
  creation: at(376),
  not: at(377),
  same: at(380),
  know: at(382),
  theirCreator: at(384),
  therefore: at(387),
  knowGod: at(391),
  full: at(396),
  relation: at(400),
  intimate: at(401),
  look: at(406),
  christ: at(409),
};

const MAGNIFY = 1.35;

const ChristPill: React.FC = () => (
  <Floating x={540} y={820}>
    <Pill size={110}>Crist Jesús</Pill>
  </Floating>
);

export const ChristScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ramp = (start: number, duration: number) =>
    interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: easeInOut });
  const pulse = (start: number) => 1 + 0.12 * interpolate(frame, [start, start + 6, start + 18], [0, 1, 0], clamp);

  const phaseOneOut = ramp(c.therefore, 16);
  const frameIn = pop(frame, fps, c.admire, 13);
  const admireIn = pop(frame, fps, c.creation, 12);
  const notIn = pop(frame, fps, c.not, 10);
  const knowIn = pop(frame, fps, c.know, 12);
  const creatorLine = interpolate(frame, [c.theirCreator, c.theirCreator + 8], [0, 1], { ...clamp, easing: easeOut });

  const circlesIn = settle(frame, fps, c.knowGod, 22);
  const fill = interpolate(frame, [c.full, c.full + 12], [0, 1], { ...clamp, easing: easeOut });
  const together = settle(frame, fps, c.relation, 24);
  const intimacy = interpolate(frame, [c.intimate, c.intimate + 10], [0, 1], { ...clamp, easing: easeOut });
  const circlesOut = ramp(c.look, 14);
  const leftX = 360 + 100 * together - (1 - circlesIn) * 600;
  const rightX = 720 - 100 * together + (1 - circlesIn) * 600;

  const lensDraw = interpolate(frame, [c.look, c.look + 16], [0, 1], { ...clamp, easing: easeInOut });
  const lensMove = settle(frame, fps, c.look + 4, 34);
  const lensX = 860 + (610 - 860) * lensMove;
  const lensY = 1180 + (820 - 1180) * lensMove;
  const lensR = 150;
  const christIn = pop(frame, fps, c.christ, 12);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {phaseOneOut < 1 && frame >= c.admire ? (
        <AbsoluteFill style={{ opacity: 1 - phaseOneOut, scale: `${1 - 0.1 * phaseOneOut}` }}>
          <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, frameIn * 1.4) }}>
            <defs>
              <clipPath id="christ-frame">
                <rect x={300} y={370} width={480} height={380} rx={24} />
              </clipPath>
            </defs>
            <g transform={`translate(540 560) scale(${0.6 + 0.4 * frameIn}) translate(-540 -560)`}>
              <g clipPath="url(#christ-frame)">
                <UniverseInterior cx={540} cy={560} r={330} frame={frame} grid={0} />
              </g>
              <rect x={300} y={370} width={480} height={380} rx={24} fill="none" stroke={colors.white} strokeWidth={16} />
            </g>
          </svg>
          {frame >= c.creation ? (
            <Floating x={540} y={815} scale={0.6 + 0.4 * admireIn} opacity={Math.min(1, admireIn * 1.4)}>
              <Pill size={46}>Admirar la creació</Pill>
            </Floating>
          ) : null}
          {frame >= c.not ? (
            <Floating x={540} y={955} scale={(0.5 + 0.5 * notIn) * pulse(c.same)} opacity={Math.min(1, notIn * 1.4)}>
              <svg width={150} height={130} viewBox="0 0 150 130">
                <line x1={20} y1={45} x2={130} y2={45} stroke={colors.white} strokeWidth={16} strokeLinecap="round" />
                <line x1={20} y1={85} x2={130} y2={85} stroke={colors.white} strokeWidth={16} strokeLinecap="round" />
                <line x1={98} y1={10} x2={52} y2={120} stroke={colors.white} strokeWidth={16} strokeLinecap="round" />
              </svg>
            </Floating>
          ) : null}
          {frame >= c.know ? (
            <Floating x={540} y={1140} scale={0.6 + 0.4 * knowIn} opacity={Math.min(1, knowIn * 1.4)}>
              <div
                style={{
                  padding: '22px 44px 26px',
                  borderRadius: 36,
                  background: colors.ink,
                  color: colors.white,
                  fontFamily: headingFont,
                  fontWeight: 700,
                  fontSize: 54,
                  lineHeight: 1.12,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                <div>Conèixer personalment</div>
                <div style={{ opacity: creatorLine }}>el seu Creador</div>
              </div>
            </Floating>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {frame >= c.knowGod && circlesOut < 1 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: (1 - circlesOut) * Math.min(1, circlesIn * 1.5) }}>
          <defs>
            <clipPath id="christ-left-circle">
              <circle cx={leftX} cy={820} r={165} />
            </clipPath>
          </defs>
          <circle cx={leftX} cy={820} r={165} fill={colors.white} fillOpacity={fill} stroke={colors.white} strokeWidth={14} />
          <circle cx={rightX} cy={820} r={165} fill={colors.white} />
          <circle cx={rightX} cy={820} r={165} fill={colors.ink} clipPath="url(#christ-left-circle)" opacity={intimacy} />
        </svg>
      ) : null}

      {frame >= c.christ ? (
        <AbsoluteFill style={{ opacity: Math.min(1, christIn * 1.4), scale: `${0.6 + 0.4 * christIn}`, transformOrigin: '540px 820px' }}>
          <ChristPill />
        </AbsoluteFill>
      ) : null}
      {frame >= c.christ ? (
        <AbsoluteFill style={{ clipPath: `circle(${lensR}px at ${lensX}px ${lensY}px)`, opacity: lensDraw }}>
          <AbsoluteFill style={{ background: brandGradient }} />
          <AbsoluteFill style={{ transformOrigin: `${lensX}px ${lensY}px`, scale: `${MAGNIFY}` }}>
            <AbsoluteFill style={{ transformOrigin: '540px 820px', scale: `${0.6 + 0.4 * christIn}`, opacity: Math.min(1, christIn * 1.4) }}>
              <ChristPill />
            </AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      {lensDraw > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <LensGlyph cx={lensX} cy={lensY} r={lensR} draw={lensDraw} glass={frame >= c.christ ? 0 : 0.16} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
