import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { WordReveal } from '../../templates/elg-narrated-video/components/WordReveal';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors, headingFont } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { lerp, useMotion } from '../motion';
import { Pedestal } from './DistrustScene';

const at = sceneCues('contradiction');
const c = {
  relativism: at(192),
  falls: at(193),
  contradiction: at(196),
  tragic: at(197),
  present: at(205),
  truth: at(211),
  absolute: at(212),
};

const QUOTE: Array<Array<[string, number]>> = [
  [['«no', at(199)], ['existeix', at(200)], ['cap', at(201)]],
  [['veritat', at(202)], ['absoluta»', at(203)]],
];

const LOOP = { x: 540, y: 900, r: 290 };
const CARD_Y = 726;
const PEDESTAL_TOP = 890;

const arc = (r: number, from: number, to: number) => {
  const p = (a: number) => [LOOP.x + r * Math.cos((a * Math.PI) / 180), LOOP.y + r * Math.sin((a * Math.PI) / 180)];
  const [x1, y1] = p(from);
  const [x2, y2] = p(to);
  return `M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`;
};

/** Relativism falls into its own loop: the denial of absolute truth is presented as absolute truth. */
export const ContradictionScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, rise, pop, settle, fall } = useMotion();

  const word = pop(c.relativism - 4, 12);
  const drop = fall(c.falls, 16);
  const bounce = settle(c.falls + 16, 16);
  const loop = rise(c.contradiction - 4, 22);
  const partOneOut = ramp(QUOTE[0][0][1] - 34, 18);

  const card = pop(QUOTE[0][0][1] - 6, 14);
  const pedestal = settle(c.present, 24);
  const rays = pop(c.truth, 12);
  const label = pop(c.truth + 4, 12);
  const crack = rise(c.absolute + 8, 18);

  const tilt = 26 * drop - 8 * bounce;
  const wordY = lerp(560, LOOP.y, drop) - 26 * Math.sin(Math.PI * Math.min(1, bounce));

  return (
    <AbsoluteFill>
      <BrandBackground />

      {partOneOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - partOneOut, scale: `${1 - 0.25 * partOneOut}`, transformOrigin: `540px ${LOOP.y}px` }}>
          {loop > 0 ? (
            <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
              <g transform={`rotate(${time * 40} ${LOOP.x} ${LOOP.y})`}>
                <path d={arc(LOOP.r, -70, 220)} fill="none" stroke={colors.white} strokeWidth={18} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - loop} />
                {loop > 0.95 ? (
                  <polyline
                    points={`${LOOP.x + LOOP.r * Math.cos((220 * Math.PI) / 180) - 40} ${LOOP.y + LOOP.r * Math.sin((220 * Math.PI) / 180) + 30} ${LOOP.x + LOOP.r * Math.cos((220 * Math.PI) / 180)} ${LOOP.y + LOOP.r * Math.sin((220 * Math.PI) / 180)} ${LOOP.x + LOOP.r * Math.cos((220 * Math.PI) / 180) + 46} ${LOOP.y + LOOP.r * Math.sin((220 * Math.PI) / 180) + 18}`}
                    fill="none"
                    stroke={colors.white}
                    strokeWidth={18}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}
              </g>
            </svg>
          ) : null}
          {word > 0 ? (
            <Floating x={540} y={wordY} scale={0.55 + 0.45 * word} rotate={tilt} opacity={Math.min(1, word * 1.5)}>
              <Pill size={104} tone="ink">
                relativisme
              </Pill>
            </Floating>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {frame >= c.present ? <Pedestal top={lerp(1300, PEDESTAL_TOP, pedestal)} /> : null}

      {rays > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <g transform={`rotate(${time * 10} 540 ${CARD_Y})`} opacity={Math.min(1, rays)}>
            {new Array(14).fill(true).map((_, i) => {
              const a = (i / 14) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={540 + Math.cos(a) * 330}
                  y1={CARD_Y + Math.sin(a) * 330}
                  x2={540 + Math.cos(a) * (330 + 130 * rays)}
                  y2={CARD_Y + Math.sin(a) * (330 + 130 * rays)}
                  stroke={colors.white}
                  strokeWidth={16}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        </svg>
      ) : null}

      {card > 0 ? (
        <Floating x={540} y={CARD_Y} scale={0.7 + 0.3 * card} opacity={Math.min(1, card * 1.5)}>
          <div
            style={{
              position: 'relative',
              width: 860,
              boxSizing: 'border-box',
              padding: '54px 50px',
              borderRadius: 44,
              background: colors.white,
              boxShadow: '0 24px 60px rgba(18, 24, 12, 0.22)',
              textAlign: 'center',
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 88,
              lineHeight: 1.12,
              letterSpacing: 0,
              color: colors.ink,
            }}
          >
            {QUOTE.map((line, li) => (
              <div key={li}>
                {line.map(([text, cue], i) => (
                  <React.Fragment key={text}>
                    {i > 0 ? ' ' : null}
                    <WordReveal at={cue}>{text}</WordReveal>
                  </React.Fragment>
                ))}
              </div>
            ))}
            {crack > 0 ? (
              <svg width={860} height={320} viewBox="0 0 860 320" style={{ position: 'absolute', left: 0, top: -6, overflow: 'visible' }}>
                <path
                  d="M 452 -10 L 418 70 L 462 128 L 404 196 L 446 252 L 420 330"
                  fill="none"
                  stroke={colors.ink}
                  strokeWidth={14}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - crack}
                />
              </svg>
            ) : null}
          </div>
        </Floating>
      ) : null}

      {label > 0 ? (
        <Floating x={540} y={PEDESTAL_TOP + 190} scale={label}>
          <Pill size={48} tone="ink">
            veritat absoluta
          </Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
