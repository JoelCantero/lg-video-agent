import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { WordReveal } from '../../templates/elg-narrated-video/components/WordReveal';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors, headingFont } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Hand, HAND_RATIO } from '../illustrations/Hand';
import { OrbGroup } from '../illustrations/Orb';
import { Person } from '../illustrations/Person';
import { Cross, Crown } from '../illustrations/Symbols';
import { lerp, useMotion } from '../motion';

const at = sceneCues('descent');
const c = {
  jesus: at(306),
  god: at(308),
  no: at(311),
  divine: at(317),
  but: at(319),
  dispossess: at(323),
  glory: at(327),
  went: at(328),
  earth: at(332),
  die: at(335),
  cross: at(338),
  us: at(340),
};

const QUESTION: Array<[string, number]> = [
  ['Saps', at(341)],
  ['què', at(342)],
  ['vol', at(343)],
  ['dir', at(344)],
  ['això?', at(345)],
];

const TRAVEL = 1280;
const GLORY_Y = 610;
const HAND_WIDTH = 300;
const HAND_TOP = 700;
const HILL_TOP = 2440;
const GROUND = 2580;
const CROSS_HEIGHT = 440;
const PEOPLE = [
  { x: 120, h: 210, side: -1 },
  { x: 235, h: 240, side: -1 },
  { x: 345, h: 200, side: -1 },
  { x: 735, h: 205, side: 1 },
  { x: 845, h: 245, side: 1 },
  { x: 960, h: 215, side: 1 },
];
// Specks along the way down, fixed in the world so they stream past the camera.
const SPECKS = new Array(36).fill(true).map((_, i) => ({
  x: 60 + random(`speck-x-${i}`) * 960,
  y: 1000 + random(`speck-y-${i}`) * 1350,
  r: 5 + random(`speck-r-${i}`) * 7,
  opacity: 0.25 + random(`speck-o-${i}`) * 0.4,
}));

/** He did not cling to his divine condition: the glory is let go and the camera follows him down to the cross. */
export const DescentScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle } = useMotion();

  const gloryIn = pop(c.jesus - 6, 14);
  const crownIn = pop(c.jesus + 4, 12);
  const handIn = pop(c.god - 4, 14);
  const label = pop(c.divine, 12) * (1 - ramp(c.dispossess, 14));
  const letGo = settle(c.dispossess, 34);
  const dim = ramp(c.dispossess, 30);

  const camera = ramp(c.went - 4, 52);
  const descend = ramp(c.went - 8, 58);
  const handWorldY = lerp(HAND_TOP, 2040, descend);
  const crossDraw = ramp(c.die - 4, 26);
  const handFade = ramp(c.cross - 6, 18);
  const love = settle(c.us, 26);
  const question = frame >= QUESTION[0][1] - 4;

  const pathTop = HAND_TOP + 440;

  return (
    <AbsoluteFill>
      <BrandBackground />

      <AbsoluteFill style={{ translate: `0px ${-TRAVEL * camera}px` }}>
        <svg width={1080} height={3400} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <defs>
            <clipPath id="descent-path">
              <rect x={0} y={pathTop} width={1080} height={(HILL_TOP - pathTop) * descend} />
            </clipPath>
          </defs>
          {gloryIn > 0 ? (
            <g transform={`translate(540 ${GLORY_Y}) scale(${gloryIn})`} opacity={1 - 0.85 * dim}>
              <OrbGroup r={190} core={false} rays={1 - dim} rayLength={0.55} spin={time * 8} ring={1 - dim} />
            </g>
          ) : null}
          <line x1={540} y1={pathTop} x2={540} y2={HILL_TOP} stroke={colors.white} strokeWidth={14} strokeDasharray="6 30" strokeLinecap="round" clipPath="url(#descent-path)" />
          {SPECKS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={colors.white} opacity={s.opacity} />
          ))}
          <path d={`M 60 ${GROUND} Q 300 ${GROUND - 20} 400 ${HILL_TOP + 60} Q 540 ${HILL_TOP - 40} 680 ${HILL_TOP + 60} Q 780 ${GROUND - 20} 1020 ${GROUND} Z`} fill={colors.ink} />
          <line x1={0} y1={GROUND} x2={1080} y2={GROUND} stroke={colors.white} strokeWidth={10} />
          {love > 0 ? (
            <g transform={`translate(540 ${HILL_TOP - CROSS_HEIGHT * 0.62}) scale(${love})`}>
              <OrbGroup r={150} core={false} rayLength={0.5} spin={time * 10} />
            </g>
          ) : null}
        </svg>

        {crossDraw > 0 ? (
          <div style={{ position: 'absolute', left: 540 - (CROSS_HEIGHT * 240) / 380 / 2, top: HILL_TOP - CROSS_HEIGHT + 20 }}>
            <Cross height={CROSS_HEIGHT} draw={crossDraw} />
          </div>
        ) : null}

        {PEOPLE.map((p) => (
          <Person key={p.x} x={p.x} y={GROUND} height={p.h} lean={-p.side * 9 * love} />
        ))}

        {crownIn > 0 ? (
          <Floating x={540 + 260 * letGo} y={GLORY_Y - 10 - 160 * letGo} scale={crownIn * (1 - 0.35 * letGo)} rotate={18 * letGo} opacity={1 - 0.8 * letGo}>
            <Crown width={250} />
          </Floating>
        ) : null}

        {handIn > 0 && handFade < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: 540 - HAND_WIDTH / 2,
              top: handWorldY,
              width: HAND_WIDTH,
              height: HAND_WIDTH * HAND_RATIO,
              opacity: Math.min(1, handIn * 1.4) * (1 - handFade),
              scale: `${(0.7 + 0.3 * handIn) * (1 - 0.3 * descend)}`,
              transformOrigin: '50% 0%',
            }}
          >
            <Hand width={HAND_WIDTH} open={1} />
          </div>
        ) : null}

        {label > 0 ? (
          <Floating x={540} y={HAND_TOP + HAND_WIDTH * HAND_RATIO + 60} scale={label}>
            <Pill size={50} tone="ink">
              condició divina
            </Pill>
          </Floating>
        ) : null}
      </AbsoluteFill>

      {question ? (
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            top: 250,
            textAlign: 'center',
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.1,
            letterSpacing: 0,
            color: colors.white,
          }}
        >
          {QUESTION.map(([text, cue], i) => (
            <React.Fragment key={text}>
              {i > 0 ? ' ' : null}
              <WordReveal at={cue}>{text}</WordReveal>
            </React.Fragment>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
