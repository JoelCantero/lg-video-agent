import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { WordReveal } from '../../templates/elg-narrated-video/components/WordReveal';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors, headingFont } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Hand, HAND_HOLD, HAND_RATIO } from '../illustrations/Hand';
import { Orb, Shard, SHARDS } from '../illustrations/Orb';
import { Person } from '../illustrations/Person';
import { GROUND_Y, lerp, mixColor, useMotion } from '../motion';

const at = sceneCues('gospel');
const c = {
  offers: at(494),
  aTruth: at(501),
  provides: at(505),
  norm: at(507),
  external: at(508),
  allowing: at(509),
  relativism: at(517),
  individualism: at(521),
  selfish: at(522),
  but: at(523),
  can: at(529),
  serve: at(532),
  legitimately: at(533),
  oppress: at(535),
};

const TITLE: Array<Array<[string, number]>> = [
  [['Una', at(495)], ['veritat', at(496)], ['absoluta', at(497)]],
  [['que', at(498)], ['no', at(499)], ['oprimeix', at(500)]],
];

const HAND_WIDTH = 380;
const HAND_TOP = 720;
const STAR = { x: 540, y: 300 };
const PEOPLE = [
  { x: 130, h: 205 },
  { x: 265, h: 235 },
  { x: 400, h: 210 },
  { x: 680, h: 225 },
  { x: 815, h: 200 },
  { x: 950, h: 230 },
];
const LOOSE = SHARDS.map((_, i) => ({ x: 120 + ((i * 113) % 840), y: 760 + ((i * 71) % 260), rotate: i * 37 }));

/** The gospel offers an absolute truth that does not oppress: an external norm that cannot be wielded against others. */
export const GospelScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle, fall } = useMotion();

  const handIn = pop(2, 14);
  const offer = settle(c.offers, 20);
  const titleOut = ramp(c.aTruth - 8, 14);
  const toStar = ramp(c.aTruth - 4, 30);
  const handOut = ramp(c.aTruth, 20);
  const peopleIn = (i: number) => pop(c.provides + i * 3, 13);
  const plumb = ramp(c.norm, 22);
  const normPill = pop(c.external, 12);
  const looseIn = ramp(c.allowing, 20);
  const looseFall = fall(c.relativism, 34);
  const bubbles = pop(c.individualism, 12);
  const burst = ramp(c.selfish, 14);
  const orient = settle(c.selfish, 24);
  const fistRise = ramp(c.can - 6, 34);
  const fistOpen = settle(c.legitimately, 24);
  const offerAgain = settle(c.oppress, 30);

  const unit = HAND_WIDTH / 360;
  const handTop = HAND_TOP - 40 * offer;
  const orbX = STAR.x;
  const orbY = lerp(handTop + HAND_HOLD.y * unit, STAR.y, toStar);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {plumb > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <line x1={STAR.x} y1={STAR.y + 110} x2={STAR.x} y2={lerp(STAR.y + 110, 1190, plumb)} stroke={colors.white} strokeWidth={12} strokeLinecap="round" />
          <path d={`M ${STAR.x} ${lerp(STAR.y + 110, 1190, plumb) + 8} l -26 34 l 26 48 l 26 -48 Z`} fill={colors.white} opacity={plumb > 0.9 ? 1 : 0} />
        </svg>
      ) : null}

      {frame >= c.provides
        ? PEOPLE.map((p, i) => {
            const toward = p.x < 540 ? 1 : -1;
            return (
              <React.Fragment key={p.x}>
                <Person x={p.x} y={GROUND_Y} height={p.h * (0.6 + 0.4 * Math.min(1, peopleIn(i)))} opacity={Math.min(1, peopleIn(i) * 1.5)} lean={toward * 7 * orient} />
                {bubbles > 0 && burst < 1 ? (
                  <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
                    <circle
                      cx={p.x}
                      cy={GROUND_Y - p.h * 0.82}
                      r={p.h * 0.27 * (0.6 + 0.4 * Math.min(1, bubbles)) * (1 + 0.45 * burst)}
                      fill={colors.white}
                      fillOpacity={0.12}
                      stroke={colors.white}
                      strokeWidth={7}
                      opacity={1 - burst}
                    />
                  </svg>
                ) : null}
              </React.Fragment>
            );
          })
        : null}

      {looseIn > 0 && looseFall < 1
        ? LOOSE.map((s, i) => (
            <Floating
              key={i}
              x={s.x + Math.sin(time + i) * 16}
              y={s.y - 160 * (1 - looseIn) + 900 * looseFall + Math.cos(time * 1.2 + i) * 12}
              rotate={s.rotate + 120 * looseFall}
              opacity={looseIn * (1 - looseFall)}
            >
              <Shard index={i} size={44} />
            </Floating>
          ))
        : null}

      {handOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - HAND_WIDTH / 2,
            top: handTop + 200 * handOut,
            width: HAND_WIDTH,
            height: HAND_WIDTH * HAND_RATIO,
            opacity: Math.min(1, handIn * 1.4) * (1 - handOut),
            scale: `${0.7 + 0.3 * Math.min(1, handIn)}`,
          }}
        >
          <Hand width={HAND_WIDTH} open={1} />
        </div>
      ) : null}

      <Floating x={orbX} y={orbY} scale={Math.min(1, pop(0, 14))}>
        <Orb r={lerp(95, 74, toStar)} spin={time * 12} rayLength={0.34 + 0.2 * toStar} />
      </Floating>

      {normPill > 0 ? (
        <Floating x={800} y={480} scale={normPill}>
          <Pill size={46} tone="ink">
            norma externa
          </Pill>
        </Floating>
      ) : null}

      {fistRise > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 770,
            top: lerp(1500, 560 + 40 * offerAgain, fistRise),
            width: 190,
            height: 190 * HAND_RATIO,
            rotate: `${-12 * (1 - fistOpen)}deg`,
          }}
        >
          <Hand width={190} open={fistOpen} color={mixColor(fistOpen, colors.ink, colors.white)} />
        </div>
      ) : null}

      {titleOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            top: 170,
            textAlign: 'center',
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.1,
            letterSpacing: 0,
            color: colors.white,
            opacity: 1 - titleOut,
          }}
        >
          {TITLE.map((line, li) => (
            <div key={li}>
              {line.map(([text, cue], i) => (
                <React.Fragment key={text}>
                  {i > 0 ? ' ' : null}
                  <WordReveal at={cue}>{text}</WordReveal>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
