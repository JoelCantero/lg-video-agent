import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Floating } from '../components/Floating';
import { Pill } from '../components/Pill';
import { StarrySky } from '../components/StarrySky';
import { VerseLines, type VerseLine } from '../components/VerseLines';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { clamp, pop } from '../theme';

const at = sceneCues('colossians');
const c = { pageTwo: at(423), reference: at(439) };

// Literal text of Colossians 1:15-16 as supplied in the script (ending with the ellipsis).
const pageOne: VerseLine[] = [
  [['Ell', 410], ['és', 411], ['la', 412], ['imatge', 413]],
  [['del', 414], ['Déu', 415], ['invisible,', 416]],
  [['el', 417], ['primogènit', 418]],
  [['de', 419], ['tota', 420], ['la', 421], ['creació,', 422]],
];
const pageTwo: VerseLine[] = [
  [['perquè', 423], ['en', 424], ['ell', 425]],
  [['foren', 426], ['creades', 427]],
  [['totes', 428], ['les', 429], ['coses,', 430]],
  [['les', 431], ['del', 432], ['cel', 433]],
  [['i', 434], ['les', 435], ['de', 436], ['la', 437], ['terra…', 438]],
];

export const ColossiansScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const referenceIn = pop(frame, fps, 4, 12);
  const referencePulse = 1 + 0.15 * interpolate(frame, [c.reference, c.reference + 8, c.reference + 30], [0, 1, 0], clamp);
  const pageOneOut = interpolate(frame, [c.pageTwo - 10, c.pageTwo - 2], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <StarrySky />
      <Floating x={540} y={420} scale={(0.5 + 0.5 * referenceIn) * referencePulse} opacity={Math.min(1, referenceIn * 1.4)}>
        <Pill size={60}>Colossencs 1:15-16</Pill>
      </Floating>
      {pageOneOut > 0 ? <VerseLines lines={pageOne} cue={at} top={640} opacity={pageOneOut} /> : null}
      {frame >= c.pageTwo - 2 ? <VerseLines lines={pageTwo} cue={at} top={590} /> : null}
    </AbsoluteFill>
  );
};
