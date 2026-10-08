import React from 'react';
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { WordReveal } from '../components/WordReveal';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { clamp, colors, headingFont, settle } from '../theme';

const at = sceneCues('universe');
const c = { how: at(350), deeply: at(352), universe: at(355), amazed: at(362) };

const WARP_STARS = new Array(140).fill(true).map((_, i) => ({
  angle: random(`warp-angle-${i}`) * Math.PI * 2,
  offset: random(`warp-offset-${i}`),
  size: 2 + random(`warp-size-${i}`) * 4,
}));

// Literal end of the sentence, shown instead of captions (words 363–370).
const closing: Array<{ y: number; size: number; words: Array<[string, number]> }> = [
  { y: 690, size: 56, words: [['davant', 363]] },
  { y: 810, size: 100, words: [['la', 364], ['majestuositat', 365]] },
  { y: 950, size: 72, words: [['i', 366], ['la', 367], ['grandesa', 368], ['de', 369], ['Déu.', 370]] },
];

const CX = 540;
const CY = 860;

export const UniverseScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const speedAt = (f: number) =>
    interpolate(f, [c.deeply - 10, c.deeply + 10, c.universe + 20, c.amazed, c.amazed + 24], [0, 1, 1, 0.45, 0], clamp);
  let travel = 0;
  for (let f = 0; f <= frame; f++) travel += speedAt(f) * 0.014;
  const speed = speedAt(frame);

  const dive = interpolate(frame, [c.deeply, c.universe + 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const r = 280 * settle(frame, fps, 4, 22) + (1450 - 280) * dive;
  const grid = interpolate(frame, [c.how, c.how + 16], [0, 1], clamp) * (1 - interpolate(frame, [c.deeply, c.deeply + 14], [0, 1], clamp));

  return (
    <AbsoluteFill>
      <BrandBackground />
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <clipPath id="universe-dive">
            <circle cx={CX} cy={CY} r={r} />
          </clipPath>
        </defs>
        <circle cx={CX} cy={CY} r={r} fill={colors.ink} />
        <g clipPath="url(#universe-dive)">
          {WARP_STARS.map((star, i) => {
            const pos = (star.offset + travel) % 1;
            const distance = r * (0.06 + 0.94 * pos * pos);
            const tail = distance * (1 - 0.14 * speed);
            const cos = Math.cos(star.angle);
            const sin = Math.sin(star.angle);
            const twinkle = speed < 0.05 ? 0.4 + 0.6 * Math.abs(Math.sin(frame / (10 + (i % 7) * 3) + i)) : 1;
            return (
              <line
                key={i}
                x1={CX + tail * cos}
                y1={CY + tail * sin}
                x2={CX + distance * cos + 0.01}
                y2={CY + distance * sin}
                stroke={colors.white}
                strokeWidth={star.size}
                strokeLinecap="round"
                opacity={Math.min(1, pos * 3) * twinkle}
              />
            );
          })}
          {grid > 0
            ? [-0.5, 0, 0.5].map((v) => (
                <React.Fragment key={v}>
                  <line x1={CX + v * r} y1={CY - r} x2={CX + v * r} y2={CY + r} stroke={colors.white} strokeWidth={3} opacity={0.35 * grid} />
                  <line x1={CX - r} y1={CY + v * r} x2={CX + r} y2={CY + v * r} stroke={colors.white} strokeWidth={3} opacity={0.35 * grid} />
                </React.Fragment>
              ))
            : null}
        </g>
        <circle cx={CX} cy={CY} r={r} fill="none" stroke={colors.ink} strokeWidth={14} />
      </svg>

      {closing.map((line) => (
        <div
          key={line.y}
          style={{
            position: 'absolute',
            left: 60,
            right: 60,
            top: line.y - line.size * 0.6,
            textAlign: 'center',
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: line.size,
            lineHeight: 1.2,
            color: colors.white,
          }}
        >
          {line.words.map(([text, word], i) => (
            <React.Fragment key={word}>
              {i > 0 ? ' ' : null}
              <WordReveal at={at(word)}>{text}</WordReveal>
            </React.Fragment>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};
