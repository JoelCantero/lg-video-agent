import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Hand, HAND_HOLD, HAND_RATIO } from '../illustrations/Hand';
import { OrbGroup } from '../illustrations/Orb';
import { Person, personHand } from '../illustrations/Person';
import { JusticeScale, scalePivot } from '../illustrations/Scale';
import { GROUND_Y, lerp, mixColor, useMotion } from '../motion';

const at = sceneCues('light');
const c = {
  yours: at(424),
  truth: at(431),
  light: at(440),
  cannot: at(444),
  become: at(446),
  oppressor: at(450),
  fight: at(451),
  justice: at(454),
  christians: at(467),
  act: at(469),
  oppressors: at(471),
  thereAre: at(472),
  notLiving: at(479),
  essence: at(486),
};

const SOURCE_WIDTH = 240;
const SOURCE_TOP = 270;
const CONE_TOP = SOURCE_TOP + 300;
const YOU_HEIGHT = 360;
const SCALE_WIDTH = 270;

/** In the light of this truth nobody can become an oppressor; those who do have stepped out of it. */
export const LightScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle } = useMotion();

  const sourceIn = pop(4, 14);
  const youIn = pop(c.yours - 4, 13);
  const cone = ramp(c.light - 4, 18);
  const glow = 1 + 0.6 * settle(c.essence, 20);
  const fistIn = pop(c.become, 12);
  const fistOpen = settle(c.oppressor, 18);
  const fistOut = ramp(c.fight - 6, 14);
  const raise = settle(c.fight, 22);
  const scaleIn = pop(c.justice, 13);
  const otherIn = pop(c.christians - 2, 13);
  const stepOut = ramp(c.act, 18);
  const turn = settle(c.oppressors, 20);
  const thereAre = pop(c.thereAre, 12);
  const edge = ramp(c.notLiving, 16);

  const hand = personHand(YOU_HEIGHT, raise);
  const pivot = scalePivot(SCALE_WIDTH);
  const otherX = lerp(735, 905, stepOut);
  const otherH = lerp(300, 560, turn);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {cone > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <clipPath id="light-cone-reveal">
              <rect x={0} y={CONE_TOP} width={1080} height={(GROUND_Y - CONE_TOP + 10) * cone} />
            </clipPath>
          </defs>
          <g clipPath="url(#light-cone-reveal)">
            <polygon
              points={`${540 - 60},${CONE_TOP} ${540 + 60},${CONE_TOP} ${540 + 280},${GROUND_Y} ${540 - 280},${GROUND_Y}`}
              fill={colors.white}
              opacity={0.28 * glow}
            />
            {edge > 0 ? (
              <polyline
                points={`${540 + 60},${CONE_TOP} ${540 + 280},${GROUND_Y}`}
                fill="none"
                stroke={colors.white}
                strokeWidth={8}
                strokeDasharray="22 18"
                opacity={edge}
              />
            ) : null}
          </g>
          <line x1={80} y1={GROUND_Y + 4} x2={1000} y2={GROUND_Y + 4} stroke={colors.white} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
        </svg>
      ) : null}

      <div
        style={{
          position: 'absolute',
          left: 540 - SOURCE_WIDTH / 2,
          top: SOURCE_TOP,
          width: SOURCE_WIDTH,
          height: SOURCE_WIDTH * HAND_RATIO,
          opacity: Math.min(1, sourceIn * 1.4),
          scale: `${0.7 + 0.3 * Math.min(1, sourceIn)}`,
        }}
      >
        <Hand
          width={SOURCE_WIDTH}
          open={1}
          held={
            <g transform={`translate(${HAND_HOLD.x} ${HAND_HOLD.y + 20})`}>
              <OrbGroup r={66} spin={time * 12} rayLength={0.34 + 0.12 * (glow - 1)} />
            </g>
          }
        />
      </div>

      {frame >= c.christians - 2 ? (
        <>
          <Person x={otherX} y={GROUND_Y} height={otherH} color={mixColor(turn, colors.white, colors.ink)} opacity={Math.min(1, otherIn * 1.5) * (1 - 0.35 * edge)}>
            <g opacity={1 - turn}>
              <rect x={-9} y={-150} width={18} height={70} rx={5} fill={colors.teal} />
              <rect x={-26} y={-132} width={52} height={18} rx={5} fill={colors.teal} />
            </g>
          </Person>
          {turn > 0 ? (
            <div style={{ position: 'absolute', left: otherX + 10, top: GROUND_Y - otherH - 120 * turn, width: 140, height: 140 * HAND_RATIO, opacity: turn * (1 - 0.35 * edge) }}>
              <Hand width={140} open={0} color={colors.ink} />
            </div>
          ) : null}
        </>
      ) : null}

      {youIn > 0 ? <Person x={540} y={GROUND_Y} height={YOU_HEIGHT * (0.6 + 0.4 * Math.min(1, youIn))} opacity={Math.min(1, youIn * 1.5)} raise={raise} /> : null}

      {fistIn > 0 && fistOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 640,
            top: 1010,
            width: 120,
            height: 120 * HAND_RATIO,
            opacity: Math.min(1, fistIn * 1.4) * (1 - fistOut),
            scale: `${0.5 + 0.5 * Math.min(1, fistIn)}`,
          }}
        >
          <Hand width={120} open={fistOpen} color={mixColor(fistOpen, colors.ink, colors.white)} />
        </div>
      ) : null}

      {scaleIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 + hand.x - pivot.x,
            top: GROUND_Y + hand.y - 160 - pivot.y,
            opacity: Math.min(1, scaleIn * 1.4),
            scale: `${0.6 + 0.4 * Math.min(1, scaleIn)}`,
          }}
        >
          <JusticeScale width={SCALE_WIDTH} tilt={2 * Math.sin(time * 2)} />
        </div>
      ) : null}

      {thereAre > 0 ? (
        <Floating x={850} y={520} scale={thereAre}>
          <Pill size={48} style={{ color: colors.ink }}>
            i n'hi ha
          </Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
