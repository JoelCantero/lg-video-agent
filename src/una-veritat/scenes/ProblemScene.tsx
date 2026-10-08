import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Shard } from '../illustrations/Orb';
import { Person, PersonShape, personHand } from '../illustrations/Person';
import { JusticeScale, scalePivot } from '../illustrations/Scale';
import { GROUND_Y, lerp, useMotion } from '../motion';

const at = sceneCues('problem');
const c = {
  freedom: at(148),
  tolerance: at(150),
  but: at(151),
  problem: at(154),
  serious: at(156),
  ifNone: at(157),
  objective: at(162),
  action: at(169),
  unjust: at(172),
  nor: at(173),
  anyone: at(178),
  dignity: at(181),
  regardless: at(182),
  circumstances: at(186),
};

const PAIR_HEIGHT = 380;
const PAIR = [
  { x: 260, flip: false, shard: 1, balloon: 'llibertat', cue: c.freedom, top: 560 },
  { x: 820, flip: true, shard: 5, balloon: 'tolerància', cue: c.tolerance, top: 640 },
] as const;

const SCALE_WIDTH = 760;
const PIVOT_Y = 690;

const ROW = [
  { x: 150, block: 0, shift: 60, phase: 0 },
  { x: 345, block: 80, shift: -50, phase: 1.7 },
  { x: 540, block: 170, shift: -110, phase: 3.1 },
  { x: 735, block: 40, shift: 90, phase: 4.4 },
  { x: 930, block: 120, shift: -40, phase: 5.6 },
];

export const QuestionPill: React.FC<{ readonly children: React.ReactNode; readonly size?: number }> = ({ children, size = 54 }) => (
  <Pill size={size} style={{ color: colors.ink, border: `5px dashed ${colors.ink}`, boxShadow: 'none' }}>
    {children}
  </Pill>
);

/** Freedom and tolerance float up; then nothing can measure injustice or secure dignity. */
export const ProblemScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle } = useMotion();
  const hand = personHand(PAIR_HEIGHT, 1);

  const split = settle(c.problem, 30);
  const pairOut = ramp(c.ifNone - 8, 18);
  const scaleIn = pop(c.ifNone, 14) * (1 - ramp(c.nor, 20));
  const ghost = ramp(c.objective - 10, 16);
  const injusticeIn = pop(c.action, 12);
  const unjust = pop(c.unjust, 11) * (1 - ramp(c.nor, 16));
  const wobble = 10 * Math.sin(time * 2.1) + 4 * Math.sin(time * 3.4 + 1);

  const rowIn = (i: number) => pop(c.anyone + i * 3, 13);
  const halos = ramp(c.dignity, 10);
  const shuffle = ramp(c.regardless, 40);
  const dignityPill = pop(c.dignity + 2, 11);

  const pivot = scalePivot(SCALE_WIDTH);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {pairOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - pairOut }}>
          <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
            <line x1={80} y1={GROUND_Y + 4} x2={540 - 40 * split} y2={GROUND_Y + 4} stroke={colors.white} strokeWidth={10} strokeLinecap="round" />
            <line x1={540 + 40 * split} y1={GROUND_Y + 4} x2={1000} y2={GROUND_Y + 4} stroke={colors.white} strokeWidth={10} strokeLinecap="round" />
            {split > 0 ? (
              <path
                d={`M ${540 - 40 * split} ${GROUND_Y - 2} L ${540 - 12 * split} ${GROUND_Y + 40 * split} L ${540 - 26 * split} ${GROUND_Y + 70 * split} L ${540 + 4 * split} ${GROUND_Y + 110 * split} L ${540 + 22 * split} ${GROUND_Y + 60 * split} L ${540 + 8 * split} ${GROUND_Y + 34 * split} L ${540 + 40 * split} ${GROUND_Y - 2} Z`}
                fill={colors.ink}
              />
            ) : null}
          </svg>
          {PAIR.map((p) => {
            const hx = p.x + (p.flip ? -hand.x : hand.x);
            const hy = GROUND_Y + hand.y;
            const lift = settle(p.cue, 30);
            const sag = settle(c.but, 24);
            const by = lerp(hy - 90, p.top, lift) + 70 * sag + Math.sin(time * 1.6 + p.x) * 10;
            const bx = hx + Math.sin(time * 1.1 + p.x) * 14 + (p.flip ? 40 : -40) * sag;
            return (
              <React.Fragment key={p.x}>
                <Person x={p.x} y={GROUND_Y} height={PAIR_HEIGHT} raise={1} flip={p.flip} lean={(p.flip ? 1 : -1) * 7 * split} />
                <Floating x={hx} y={hy - 62} rotate={p.flip ? 20 : -20}>
                  <Shard index={p.shard} size={60} />
                </Floating>
                {frame >= p.cue ? (
                  <>
                    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
                      <path d={`M ${hx} ${hy - 20} Q ${(hx + bx) / 2 + 20} ${(hy + by) / 2} ${bx} ${by + 36}`} fill="none" stroke={colors.white} strokeWidth={4} opacity={lift} />
                    </svg>
                    <Floating x={bx} y={by} scale={(0.5 + 0.5 * lift) * (1 - 0.12 * sag)} opacity={Math.min(1, lift * 2)}>
                      <Pill size={50}>{p.balloon}</Pill>
                    </Floating>
                  </>
                ) : null}
              </React.Fragment>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {scaleIn > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - pivot.x,
            top: PIVOT_Y - pivot.y + 30 * Math.sin(time * 1.3),
            opacity: Math.min(1, scaleIn * 1.4),
            scale: `${0.7 + 0.3 * scaleIn}`,
          }}
        >
          <JusticeScale
            width={SCALE_WIDTH}
            tilt={wobble}
            post={0}
            ghostPost={ghost}
            left={
              injusticeIn > 0 ? (
                <g opacity={Math.min(1, injusticeIn * 1.4)}>
                  <PersonShape x={-34} y={2} height={130 * Math.min(1, injusticeIn)} color={colors.ink} lean={16} />
                  <PersonShape x={44} y={2} height={84} squash={0.7} lean={-10} />
                </g>
              ) : null
            }
          />
        </div>
      ) : null}

      {unjust > 0 ? (
        <Floating x={540} y={470} scale={unjust} rotate={wobble * 0.5}>
          <QuestionPill size={60}>injusta?</QuestionPill>
        </Floating>
      ) : null}

      {frame >= c.anyone
        ? ROW.map((p, i) => {
            const enter = rowIn(i);
            const block = Math.max(0, p.block + p.shift * shuffle);
            const feet = GROUND_Y - block;
            const flicker = 0.25 + 0.75 * Math.abs(Math.sin(time * (2.2 + i * 0.4) + p.phase));
            return (
              <React.Fragment key={p.x}>
                <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: Math.min(1, enter * 1.4) }}>
                  {block > 0 ? <rect x={p.x - 78} y={feet} width={156} height={block} rx={10} fill={colors.white} opacity={0.55} /> : null}
                  {halos > 0 ? (
                    <ellipse cx={p.x} cy={feet - 238} rx={60} ry={17} fill="none" stroke={colors.white} strokeWidth={8} strokeDasharray="14 10" opacity={halos * flicker} />
                  ) : null}
                </svg>
                <Person x={p.x} y={feet} height={210 * (0.6 + 0.4 * Math.min(1, enter))} opacity={Math.min(1, enter * 1.5)} />
              </React.Fragment>
            );
          })
        : null}

      {dignityPill > 0 ? (
        <Floating x={540} y={640} scale={dignityPill} rotate={3 * Math.sin(time * 2)}>
          <QuestionPill size={60}>dignitat?</QuestionPill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
