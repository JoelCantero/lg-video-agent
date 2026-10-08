import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { KeyQuestion } from '../../../.agents/skills/react-templates/explainer/key-question';
import { templatePresets } from '../../../.agents/skills/react-templates/theme';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors } from '../../templates/elg-narrated-video/theme';
import { FPS, sceneCues, scenes, words } from '../data/timeline';
import { Orb } from '../illustrations/Orb';
import { Person } from '../illustrations/Person';
import { GROUND_Y, lerp, useMotion } from '../motion';

const at = sceneCues('question');
const c = {
  need: at(249),
  believe: at(251),
  truth: at(253),
  then: at(254),
};

const QUESTION_FROM = c.then - 6;
const QUESTION_WORDS = [254, 255, 256, 257, 258, 259].map((i) => words[i].start - scenes.question.start - QUESTION_FROM / FPS);
const QUESTION_THEME = { ...templatePresets.elg, background: 'transparent' };

const PEOPLE = [
  { x: 150, h: 230 },
  { x: 345, h: 270 },
  { x: 540, h: 250 },
  { x: 735, h: 280 },
  { x: 930, h: 235 },
];

/** Looking up to a truth we could believe in, then the question: which one? */
export const QuestionScene: React.FC = () => {
  useBrandFonts();
  const { frame, fps, time, ramp, pop, settle } = useMotion();

  const believe = settle(c.believe, 22);
  const beams = ramp(c.believe, 18) * (1 - ramp(c.then - 10, 14));
  const peopleOut = ramp(c.then - 10, 14);
  const orbUp = settle(c.then - 6, 24);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {peopleOut < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - peopleOut }}>
          {beams > 0 ? (
            <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
              {PEOPLE.map((p) => (
                <line key={p.x} x1={540} y1={520} x2={lerp(540, p.x, beams)} y2={lerp(520, GROUND_Y - p.h - 30, beams)} stroke={colors.white} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
              ))}
            </svg>
          ) : null}
          {PEOPLE.map((p, i) => {
            const enter = pop(i * 3 - 4, 13);
            return (
              <Person
                key={p.x}
                x={p.x}
                y={GROUND_Y}
                height={p.h * (0.6 + 0.4 * Math.min(1, enter)) * (1 + 0.08 * believe)}
                opacity={Math.min(1, enter * 1.5)}
                lean={((540 - p.x) / 400) * 9 * (0.4 + 0.6 * believe)}
              />
            );
          })}
        </AbsoluteFill>
      ) : null}

      <Floating x={540} y={lerp(520, 330, orbUp)} scale={pop(-6, 14)}>
        <Orb r={lerp(115, 80, orbUp)} spin={time * 14} rayLength={0.34 + 0.24 * believe} />
      </Floating>

      <Sequence name="Key Question (catàleg)" from={QUESTION_FROM} premountFor={fps}>
        <AbsoluteFill style={{ opacity: Math.min(1, pop(QUESTION_FROM, 14) * 1.5), scale: `${0.8 + 0.2 * Math.min(1, pop(QUESTION_FROM, 14))}`, translate: '0px 90px' }}>
          <KeyQuestion theme={QUESTION_THEME} question="Aleshores, quina veritat podria ser aquesta?" keyPhrase="quina veritat" wordSeconds={QUESTION_WORDS} />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
