import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { WordReveal } from '../../templates/elg-narrated-video/components/WordReveal';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors, headingFont } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Orb } from '../illustrations/Orb';
import { Person, personHand } from '../illustrations/Person';
import { GROUND_Y, lerp, useMotion } from '../motion';

const at = sceneCues('opening');
const c = {
  una: at(0),
  veritat: at(1),
  que: at(2),
  no: at(3),
  oprimeix: at(4),
  perQue: at(5),
  rebuig: at(9),
  algu: at(11),
  afirma: at(12),
  tenir: at(13),
};

const TITLE: Array<Array<[string, number]>> = [
  [['Una', c.una], ['veritat', c.veritat]],
  [['que', c.que], ['no', c.no], ['oprimeix', c.oprimeix]],
];

const CROWD = [
  { x: 140, side: -1, h: 250 },
  { x: 255, side: -1, h: 290 },
  { x: 365, side: -1, h: 240 },
  { x: 715, side: 1, h: 250 },
  { x: 825, side: 1, h: 285 },
  { x: 940, side: 1, h: 245 },
] as const;

const HOLDER_HEIGHT = 430;

/** Title over the truth; then someone raises it and the others step back. */
export const OpeningScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle } = useMotion();

  const orbIn = pop(c.una - 6, 11);
  const toHeader = settle(c.perQue - 4, 22);
  const toHand = ramp(c.perQue, 24);
  const raise = ramp(c.perQue + 4, 22);
  const hand = personHand(HOLDER_HEIGHT, raise);
  const holderIn = pop(c.perQue, 13);
  const claim = settle(c.afirma, 16);
  const recoil = settle(c.rebuig, 20);

  const orbX = lerp(540, 540 + hand.x, toHand);
  const orbY = lerp(650, GROUND_Y + hand.y - 92, toHand);
  const orbR = lerp(150, 74, toHand) * (1 + 0.12 * claim);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {frame >= c.perQue
        ? CROWD.map((p, i) => {
            const enter = pop(c.perQue + 3 + i * 3, 13);
            return (
              <Person
                key={p.x}
                x={p.x + p.side * 28 * recoil}
                y={GROUND_Y}
                height={p.h * (0.6 + 0.4 * Math.min(1, enter))}
                opacity={Math.min(1, enter * 1.5)}
                lean={p.side * 10 * recoil}
              />
            );
          })
        : null}

      {frame >= c.perQue ? (
        <Person x={540} y={GROUND_Y} height={HOLDER_HEIGHT * (0.7 + 0.3 * Math.min(1, holderIn)) * (1 + 0.06 * claim)} raise={raise} opacity={Math.min(1, holderIn * 1.5)} />
      ) : null}

      {frame >= c.una - 6 ? (
        <Floating x={orbX} y={orbY} scale={Math.max(0, orbIn)}>
          <Orb r={orbR} rays={Math.min(1, orbIn)} spin={time * 12} rayLength={0.34 + 0.2 * claim} />
        </Floating>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: lerp(960, 150, toHeader),
          textAlign: 'center',
          fontFamily: headingFont,
          fontWeight: 700,
          fontSize: lerp(124, 70, toHeader),
          lineHeight: 1.1,
          letterSpacing: 0,
          color: colors.white,
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
    </AbsoluteFill>
  );
};
