import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors, headingFont } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Orb, OrbGroup } from '../illustrations/Orb';
import { Arrow } from '../illustrations/Symbols';
import { lerp, useMotion } from '../motion';

const at = sceneCues('name');
const c = {
  accumulating: at(389),
  more: at(390),
  but: at(392),
  renouncing: at(393),
  paradox: at(397),
  jesus: at(403),
  name: at(408),
  above: at(412),
  every: at(414),
  reference: at(417),
};

const TOP_LEFT = { x: 180, y: 330 };
const BOTTOM = { x: 540, y: 1150 };
const TOP_RIGHT = { x: 900, y: 330 };
const BLOCKS = new Array(4).fill(true).map((_, i) => ({
  y: BOTTOM.y - (i + 1) * 104,
  fallX: (random(`block-x-${i}`) - 0.5) * 260,
  spin: (random(`block-r-${i}`) - 0.5) * 50,
}));
const OTHER_NAMES = [
  { x: 270, y: 720, w: 200 },
  { x: 540, y: 720, w: 240 },
  { x: 810, y: 720, w: 180 },
  { x: 400, y: 814, w: 220 },
  { x: 680, y: 814, w: 190 },
];

const along = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) });

/** Not by piling up power but by giving it up — and, paradoxically, the name above every name. */
export const NameScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle, fall } = useMotion();

  const tumble = fall(c.but, 30);
  const arrow = ramp(c.more - 4, 14) * (1 - ramp(c.but, 10));
  const down = ramp(c.renouncing, 34);
  const up = ramp(c.paradox, 40);
  const nameIn = pop(c.jesus, 11);
  const nameRise = settle(c.jesus, 30);
  const vFade = ramp(c.jesus, 20);
  const glory = settle(c.name, 26);
  const reference = pop(c.reference, 12);

  const light = up > 0 ? along(BOTTOM, TOP_RIGHT, up) : along(TOP_LEFT, BOTTOM, down);
  const lightOpacity = (down > 0 ? 1 : 0) * (1 - vFade);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {tumble < 1
        ? BLOCKS.map((b, i) => {
            const drop = pop(c.accumulating + i * 6 - 4, 13);
            if (drop <= 0) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 540 - 140 + b.fallX * tumble,
                  top: lerp(b.y - 260, b.y, Math.min(1, drop)) + 420 * tumble * (1 + i * 0.2),
                  width: 280,
                  height: 96,
                  borderRadius: 16,
                  background: colors.ink,
                  rotate: `${b.spin * tumble}deg`,
                  opacity: Math.min(1, drop * 2) * (1 - tumble),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: headingFont,
                  fontWeight: 700,
                  fontSize: 52,
                  color: colors.white,
                }}
              >
                {i === 3 ? 'poder' : null}
              </div>
            );
          })
        : null}

      {arrow > 0 ? (
        <Floating x={830} y={820}>
          <Arrow length={300} progress={arrow} angle={-90} stroke={16} />
        </Floating>
      ) : null}

      {down > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 1 - 0.65 * vFade }}>
          <path d={`M ${TOP_LEFT.x} ${TOP_LEFT.y} L ${BOTTOM.x} ${BOTTOM.y}`} stroke={colors.white} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - down} fill="none" />
          <path d={`M ${BOTTOM.x} ${BOTTOM.y} L ${TOP_RIGHT.x} ${TOP_RIGHT.y}`} stroke={colors.white} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - up} fill="none" />
        </svg>
      ) : null}

      {lightOpacity > 0 ? (
        <Floating x={light.x} y={light.y} opacity={lightOpacity}>
          <Orb r={34} spin={time * 20} />
        </Floating>
      ) : null}

      {frame >= c.every
        ? OTHER_NAMES.map((n, i) => {
            const show = pop(c.every + i * 3, 13);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: n.x - n.w / 2,
                  top: n.y - 32,
                  width: n.w,
                  height: 64,
                  borderRadius: 32,
                  background: colors.white,
                  opacity: 0.4 * Math.min(1, show * 1.5),
                  scale: `${0.6 + 0.4 * Math.min(1, show)}`,
                }}
              />
            );
          })
        : null}

      {glory > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <g transform={`translate(540 ${lerp(1150, 420, nameRise)}) scale(${glory})`}>
            <OrbGroup r={170} core={false} rayLength={0.42} spin={time * 10} />
          </g>
        </svg>
      ) : null}

      {nameIn > 0 ? (
        <Floating x={540} y={lerp(1150, 420, nameRise)} scale={0.4 + 0.6 * nameIn}>
          <span style={{ fontFamily: headingFont, fontWeight: 700, fontSize: 176, lineHeight: 1, letterSpacing: 0, color: colors.white }}>Jesús</span>
        </Floating>
      ) : null}

      {reference > 0 ? (
        <Floating x={540} y={960} scale={reference}>
          <Pill size={50} tone="ink">
            Filipencs 2:9
          </Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
