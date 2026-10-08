import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { Floating } from '../components/Floating';
import { IdeaDisc } from '../components/IdeaDisc';
import { Pill } from '../components/Pill';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { clamp, colors, easeInOut, headingFont, pop, settle } from '../theme';

const at = sceneCues('question');
const c = {
  but: at(79),
  science: at(84),
  faith: at(86),
  enemies: at(88),
  shouldAsk: at(89),
  is: at(93),
  the: at(94),
  scienceWord: at(95),
  really: at(96),
  only: at(97),
  way: at(99),
  of: at(100),
  know: at(101),
  theTruth: at(102),
  truth: at(103),
};

// Left-aligned lines stay over the solid half of the gradient (≥4.5:1 for white text).
const lines: Array<{ y: number; size: number; words: Array<[string, number]>; pill?: boolean }> = [
  { y: 600, size: 88, words: [['És', c.is], ['la', c.the], ['ciència', c.scienceWord]] },
  { y: 720, size: 88, words: [['realment', c.really]] },
  { y: 850, size: 84, words: [["l'única", c.only], ['manera', c.way]], pill: true },
  { y: 980, size: 88, words: [['de', c.of], ['conèixer', c.know]] },
  { y: 1110, size: 100, words: [['la', c.theTruth], ['veritat?', c.truth]] },
];

export const QuestionScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftIn = pop(frame, fps, c.but, 13);
  const rightIn = pop(frame, fps, c.but + 6, 13);
  const clash = settle(frame, fps, c.enemies, 10);
  const shake = frame >= c.enemies && frame < c.shouldAsk + 10 ? Math.sin(frame * 1.9) * 8 : 0;
  const crack = interpolate(frame, [c.enemies + 2, c.enemies + 8, c.shouldAsk + 6, c.shouldAsk + 14], [0, 1, 1, 0], clamp);
  const retreat = settle(frame, fps, c.shouldAsk, 26);
  const pulse = (start: number) => 1 + 0.08 * interpolate(frame, [start, start + 6, start + 18], [0, 1, 0], clamp);

  const discR = 180 - 100 * retreat;
  const discY = 760 - 360 * retreat;
  const leftX = 300 + 60 * clash * (1 - retreat) + 130 * retreat - (1 - Math.min(1, leftIn)) * 320 + shake;
  const rightX = 780 - 60 * clash * (1 - retreat) - 130 * retreat + (1 - Math.min(1, rightIn)) * 320 - shake;
  const pillIn = pop(frame, fps, c.only, 12);

  return (
    <AbsoluteFill>
      <BrandBackground />

      <IdeaDisc x={leftX} y={discY} r={discR} tone="science" scale={(0.6 + 0.4 * leftIn) * pulse(c.science)} opacity={Math.min(1, leftIn * 1.5)} />
      <IdeaDisc x={rightX} y={discY} r={discR} tone="faith" scale={(0.6 + 0.4 * rightIn) * pulse(c.faith)} opacity={Math.min(1, rightIn * 1.5)} />

      {crack > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <polyline points="540,600 520,650 560,700 518,760 562,820 528,880 546,930" fill="none" stroke={colors.white} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" opacity={crack} />
        </svg>
      ) : null}

      {lines.map((line) => {
        const first = line.words[0][1];
        if (frame < first) return null;
        const content = line.words.map(([text, start], i) => {
          const p = pop(frame, fps, start, 12);
          return (
            <span
              key={text}
              style={{
                display: 'inline-block',
                marginLeft: i > 0 ? '0.26em' : 0,
                opacity: Math.min(1, p * 1.5),
                translate: `${(1 - Math.min(1, p)) * -40}px 0px`,
              }}
            >
              {text}
            </span>
          );
        });
        return (
          <Floating key={line.y} x={80} y={line.y} anchor="left" scale={line.pill ? 0.7 + 0.3 * pillIn : 1}>
            {line.pill ? (
              <Pill size={line.size} tone="ink">
                {content}
              </Pill>
            ) : (
              <div style={{ fontFamily: headingFont, fontWeight: 700, fontSize: line.size, lineHeight: 1.1, color: colors.white, whiteSpace: 'nowrap' }}>
                {content}
              </div>
            )}
          </Floating>
        );
      })}
    </AbsoluteFill>
  );
};
