import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Floating } from '../components/Floating';
import { Pill } from '../components/Pill';
import { StarrySky } from '../components/StarrySky';
import { VerseLines, type VerseLine } from '../components/VerseLines';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { clamp, easeInOut, pop } from '../theme';

const at = sceneCues('psalm');
const c = { salm: at(284), read: at(287), firmament: at(297) };

// Literal text of Psalm 19:1 as supplied in the script.
const lines: VerseLine[] = [
  [['El', 288], ['cel', 289], ['explica', 290]],
  [['la', 291], ['glòria', 292], ['de', 293], ['Déu,', 294]],
  [['i', 295], ['el', 296], ['firmament', 297]],
  [['declara', 298], ['el', 299], ['que', 300]],
  [['les', 301], ['seves', 302], ['mans', 303]],
  [['han', 304], ['creat.', 305]],
];

export const PsalmScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const referenceIn = pop(frame, fps, c.salm, 12);
  const toTop = interpolate(frame, [c.read, c.read + 18], [0, 1], { ...clamp, easing: easeInOut });
  const brightness = 1 + 0.5 * interpolate(frame, [c.firmament, c.firmament + 10, c.firmament + 40], [0, 1, 0], clamp);

  return (
    <AbsoluteFill>
      <StarrySky brightness={brightness} />
      {frame >= c.salm ? (
        <Floating x={540} y={860 - 440 * toTop} scale={(0.5 + 0.5 * referenceIn) * (1.35 - 0.35 * toTop)} opacity={Math.min(1, referenceIn * 1.4)}>
          <Pill size={64}>Salm 19:1</Pill>
        </Floating>
      ) : null}
      <VerseLines lines={lines} cue={at} top={590} />
    </AbsoluteFill>
  );
};
