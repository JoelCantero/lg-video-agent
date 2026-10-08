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
const c = { pageTwo: at(424), reference: at(440) };

// Literal text of Colossians 1:15-16 as supplied in the script (ending with the ellipsis).
const pageOne: VerseLine[] = [
  [['Ell', 411], ['és', 412], ['la', 413], ['imatge', 414]],
  [['del', 415], ['Déu', 416], ['invisible,', 417]],
  [['el', 418], ['primogènit', 419]],
  [['de', 420], ['tota', 421], ['la', 422], ['creació,', 423]],
];
const pageTwo: VerseLine[] = [
  [['perquè', 424], ['en', 425], ['ell', 426]],
  [['foren', 427], ['creades', 428]],
  [['totes', 429], ['les', 430], ['coses,', 431]],
  [['les', 432], ['del', 433], ['cel', 434]],
  [['i', 435], ['les', 436], ['de', 437], ['la', 438], ['terra…', 439]],
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
