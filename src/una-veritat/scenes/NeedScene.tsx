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
import { Orb, OrbGroup } from '../illustrations/Orb';
import { Person, PersonShape } from '../illustrations/Person';
import { JusticeScale, scalePivot } from '../illustrations/Scale';
import { GROUND_Y, lerp, useMotion } from '../motion';

const at = sceneCues('need');
const c = {
  absolute: at(218),
  universal: at(220),
  accepted: at(221),
  aTruth: at(222),
  denounce: at(226),
  injustices: at(228),
  and: at(229),
  no: at(234),
  convert: at(235),
  oppressor: at(237),
  everyone: at(238),
  need: at(242),
};

const HEADLINE: Array<Array<[string, number]>> = [
  [['Necessitem', at(242)], ['un', at(243)], ['absolut', at(244)]],
  [['que', at(245)], ['no', at(246)], ['sigui', at(247)], ['opressiu', at(248)]],
];

const CENTER = { x: 540, y: 640 };
const RING = new Array(10).fill(true).map((_, i) => {
  const a = ((-90 + i * 36) * Math.PI) / 180;
  return { x: CENTER.x + Math.cos(a) * 390, y: CENTER.y + Math.sin(a) * 390 + 60 };
});
const SCALE_WIDTH = 640;
const PIVOT_Y = 640;
const HAND_WIDTH = 360;
const HAND_TOP = 720;
const HOLDERS = [190, 320, 760, 890];

/** The truth we need: whole, for everyone, able to judge injustice, held by a hand that stays open. */
export const NeedScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle } = useMotion();

  const gather = ramp(c.absolute - 14, 30);
  const ringIn = (i: number) => pop(c.universal + i * 2, 13);
  const beams = ramp(c.universal + 4, 18);
  const ringOut = ramp(c.aTruth - 14, 16);

  const toPivot = ramp(c.aTruth - 6, 22);
  const scaleIn = pop(c.aTruth, 14) * (1 - ramp(c.and - 8, 16));
  const verdict = settle(c.denounce, 24);
  const stamp = settle(c.injustices, 9);

  const handIn = pop(c.and - 4, 14);
  const flinch = ramp(c.convert, 10) * (1 - settle(c.oppressor, 14));
  const fistIcon = pop(c.no, 12) * (1 - ramp(c.need - 6, 16));
  const strike = ramp(c.oppressor, 10);
  const holdersIn = (i: number) => pop(c.everyone + i * 3, 13);
  const headline = frame >= c.need - 4;

  const pivot = scalePivot(SCALE_WIDTH);
  const orbScene = frame < c.and + 8;
  const orbOpacity = toPivot < 1 ? 1 : Math.min(1, scaleIn * 1.4);
  const orbY = lerp(CENTER.y, PIVOT_Y, toPivot);
  const orbR = lerp(120, 44, toPivot);
  const scale = HAND_WIDTH / 360;

  return (
    <AbsoluteFill>
      <BrandBackground />

      {ringOut < 1 && frame >= c.universal ? (
        <AbsoluteFill style={{ opacity: 1 - ringOut }}>
          <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
            {RING.map((p, i) => (
              <line
                key={i}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={lerp(CENTER.x, p.x, beams)}
                y2={lerp(CENTER.y, p.y - 70, beams)}
                stroke={colors.white}
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.7}
              />
            ))}
          </svg>
          {RING.map((p, i) => (
            <Person key={i} x={p.x} y={p.y} height={130 * (0.6 + 0.4 * Math.min(1, ringIn(i)))} opacity={Math.min(1, ringIn(i) * 1.5)} />
          ))}
        </AbsoluteFill>
      ) : null}

      {scaleIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - pivot.x,
            top: PIVOT_Y - pivot.y,
            opacity: Math.min(1, scaleIn * 1.4),
            scale: `${0.7 + 0.3 * scaleIn}`,
            transformOrigin: `${pivot.x}px ${pivot.y}px`,
          }}
        >
          <JusticeScale
            width={SCALE_WIDTH}
            tilt={16 * verdict}
            pivot={<g />}
            left={
              <g>
                <PersonShape x={-34} y={2} height={130} color={colors.ink} lean={16} />
                <PersonShape x={44} y={2} height={84} squash={0.7} lean={-10} />
              </g>
            }
          />
        </div>
      ) : null}

      {orbScene ? (
        <Floating x={CENTER.x} y={orbY} opacity={orbOpacity}>
          <Orb r={orbR} shatter={2.4 * (1 - gather)} time={time} spin={time * 12} rayLength={0.34 + 0.25 * beams * (1 - toPivot)} />
        </Floating>
      ) : null}

      {stamp > 0 && scaleIn > 0 ? (
        <Floating x={540 - 230} y={PIVOT_Y - 230 * Math.sin((16 * verdict * Math.PI) / 180) + 30} scale={lerp(1.8, 1, stamp)} rotate={-6} opacity={Math.min(1, stamp * 2.5) * Math.min(1, scaleIn * 1.4)}>
          <Pill size={52} tone="ink">
            injustícia
          </Pill>
        </Floating>
      ) : null}

      {frame >= c.and - 4 ? (
        <>
          {HOLDERS.map((x, i) => (
            <Person key={x} x={x} y={GROUND_Y} height={200 * (0.6 + 0.4 * Math.min(1, holdersIn(i)))} opacity={Math.min(1, holdersIn(i) * 1.5)} />
          ))}
          <div
            style={{
              position: 'absolute',
              left: 540 - HAND_WIDTH / 2,
              top: HAND_TOP,
              width: HAND_WIDTH,
              height: HAND_WIDTH * HAND_RATIO,
              opacity: Math.min(1, handIn * 1.4),
              scale: `${0.7 + 0.3 * handIn}`,
              transformOrigin: '50% 100%',
            }}
          >
            <Hand
              width={HAND_WIDTH}
              open={1 - 0.45 * flinch}
              held={
                <g transform={`translate(${HAND_HOLD.x} ${HAND_HOLD.y})`}>
                  <OrbGroup r={80 / scale} spin={time * 12} />
                </g>
              }
            />
          </div>
        </>
      ) : null}

      {fistIcon > 0 ? (
        <Floating x={860} y={500} scale={fistIcon}>
          <div style={{ position: 'relative', width: 150, height: 150 * HAND_RATIO }}>
            <Hand width={150} open={0} color={colors.ink} />
            <svg width={220} height={260} style={{ position: 'absolute', left: -35, top: -20, overflow: 'visible' }}>
              <line x1={10} y1={250} x2={10 + 200 * strike} y2={250 - 240 * strike} stroke={colors.white} strokeWidth={16} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
            </svg>
          </div>
        </Floating>
      ) : null}

      {headline ? (
        <div
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            top: 170,
            textAlign: 'center',
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 88,
            lineHeight: 1.12,
            letterSpacing: 0,
            color: colors.white,
          }}
        >
          {HEADLINE.map((line, li) => (
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
