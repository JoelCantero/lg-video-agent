import React from 'react';
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { Floating } from '../components/Floating';
import { NameCard } from '../components/NameCard';
import { Pill } from '../components/Pill';
import { WordReveal } from '../components/WordReveal';
import { sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { Apple } from '../illustrations/Icons';
import { clamp, colors, easeInOut, easeOut, headingFont, pop, settle } from '../theme';

const at = sceneCues('newton');
const c = {
  isaac: at(240),
  discover: at(243),
  law: at(245),
  gravity: at(248),
  notThink: at(249),
  contrary: at(264),
  contraryWord: at(265),
  knowledge: at(266),
  order: at(270),
  bring: at(276),
  admire: at(278),
  more: at(280),
  theirCreator: at(281),
};

// The thought Newton did not have, revealed word by word with the narration (words 252–263).
const quote: Array<[string, number]> = [
  ['«Ara', 252], ['que', 253], ['ja', 254], ['sé', 255], ['com', 256], ['funciona', 257],
  ['la', 258], ['gravetat,', 259], ['ja', 260], ['no', 261], ['necessito', 262], ['Déu»', 263],
];

const DOTS = new Array(42).fill(true).map((_, i) => {
  const row = Math.floor(i / 7);
  const col = i % 7;
  return {
    fromX: 150 + random(`newton-x-${i}`) * 780,
    fromY: 720 + random(`newton-y-${i}`) * 420,
    toX: 540 + (col - 3) * 110 + (row % 2 === 0 ? -27 : 27),
    toY: 830 + row * 58,
  };
});

export const NewtonScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ramp = (start: number, duration: number) =>
    interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: easeInOut });

  const cardIn = pop(frame, fps, c.isaac, 14);
  const cardOut = ramp(c.notThink, 14);
  const fall = spring({ frame: frame - (c.isaac + 4), fps, config: { damping: 9, stiffness: 90, mass: 1.1 } });
  const toCorner = settle(frame, fps, c.notThink, 24);
  const appleFade = 1 - ramp(c.knowledge, 16);
  const appleX = 540 - 320 * toCorner;
  const appleY = interpolate(fall, [0, 1], [-260, 1030]) + 130 * toCorner;
  const ground = interpolate(frame, [c.isaac + 8, c.isaac + 22], [0, 1], { ...clamp, easing: easeOut }) * (1 - ramp(c.notThink, 12));
  const gravityArrow = interpolate(frame, [c.gravity, c.gravity + 12], [0, 1], { ...clamp, easing: easeOut }) * (1 - ramp(c.notThink, 10));

  const bubbleIn = pop(frame, fps, c.notThink, 13);
  const strike = interpolate(frame, [c.contrary, c.contrary + 10], [0, 1], { ...clamp, easing: easeOut });
  const drop = interpolate(frame, [c.contraryWord + 4, c.contraryWord + 30], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const contraryIn = pop(frame, fps, c.contraryWord, 11);
  const contraryOut = ramp(c.bring - 18, 14);

  const dotsIn = (i: number) => pop(frame, fps, c.knowledge + (i % 14), 14);
  const toOrder = (i: number) => interpolate(frame, [c.order + i * 0.4, c.order + 22 + i * 0.4], [0, 1], { ...clamp, easing: easeInOut });
  const upArrow = interpolate(frame, [c.bring, c.bring + 14], [0, 1], { ...clamp, easing: easeOut });
  const admireIn = pop(frame, fps, c.admire, 12);
  const morePulse = 1 + 0.1 * interpolate(frame, [c.more, c.more + 6, c.more + 18], [0, 1, 0], clamp);
  const creatorIn = pop(frame, fps, c.theirCreator, 12);

  return (
    <AbsoluteFill>
      <BrandBackground />

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {ground > 0 ? <line x1={540 - 380 * ground} y1={1182} x2={540 + 380 * ground} y2={1182} stroke={colors.white} strokeWidth={10} strokeLinecap="round" /> : null}
        {gravityArrow > 0 ? (
          <g opacity={Math.min(1, gravityArrow * 2)}>
            <line x1={820} y1={720} x2={820} y2={720 + 250 * gravityArrow} stroke={colors.white} strokeWidth={12} strokeLinecap="round" />
            <polyline points="794,940 820,972 846,940" fill="none" stroke={colors.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={gravityArrow >= 1 ? 1 : 0} />
          </g>
        ) : null}
        {frame >= c.knowledge
          ? DOTS.map((dot, i) => {
              const p = dotsIn(i);
              const o = toOrder(i);
              return <circle key={i} cx={dot.fromX + (dot.toX - dot.fromX) * o} cy={dot.fromY + (dot.toY - dot.fromY) * o} r={11 * Math.min(1.2, p)} fill={colors.white} opacity={Math.min(1, p * 1.5)} />;
            })
          : null}
        {upArrow > 0 ? (
          <g>
            <line x1={540} y1={790} x2={540} y2={790 - 150 * upArrow} stroke={colors.white} strokeWidth={12} strokeLinecap="round" />
            <polyline points="514,668 540,636 566,668" fill="none" stroke={colors.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" opacity={upArrow >= 1 ? 1 : 0} />
          </g>
        ) : null}
      </svg>

      {frame >= c.isaac - 2 && appleFade > 0 ? (
        <Floating x={appleX} y={appleY} scale={1 - 0.45 * toCorner} opacity={appleFade}>
          <Apple width={280} />
        </Floating>
      ) : null}

      {frame >= c.isaac && cardOut < 1 ? (
        <Floating x={540} y={366} scale={0.85 + 0.15 * cardIn} opacity={Math.min(1, cardIn * 1.4) * (1 - cardOut)} dy={-40 * cardOut}>
          <NameCard role="La llei de la gravetat" name="Isaac Newton" nameAt={c.isaac} roleAt={c.law} nameSize={92} />
        </Floating>
      ) : null}

      {frame >= c.notThink && drop < 1 ? (
        <Floating x={540} y={640} scale={0.6 + 0.4 * bubbleIn} opacity={Math.min(1, bubbleIn * 1.4) * (1 - drop)} rotate={10 * drop} dy={900 * drop}>
          <div
            style={{
              position: 'relative',
              width: 900,
              boxSizing: 'border-box',
              padding: '64px 56px 56px',
              borderRadius: 48,
              background: colors.white,
              boxShadow: '0 24px 60px rgba(18, 24, 12, 0.22)',
              textAlign: 'center',
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 62,
              lineHeight: 1.16,
              color: colors.teal,
            }}
          >
            <div style={{ position: 'absolute', left: 40, top: -36 }}>
              <Pill size={40} tone="ink">
                No va pensar:
              </Pill>
            </div>
            {quote.map(([text, word], i) => (
              <React.Fragment key={word}>
                {i > 0 ? ' ' : null}
                <WordReveal at={at(word)}>{text}</WordReveal>
              </React.Fragment>
            ))}
            {strike > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 50,
                  top: '54%',
                  width: 800 * strike,
                  height: 14,
                  borderRadius: 7,
                  background: colors.ink,
                  rotate: '-4deg',
                  transformOrigin: '0% 50%',
                }}
              />
            ) : null}
          </div>
        </Floating>
      ) : null}

      {frame >= c.contraryWord && contraryOut < 1 ? (
        <Floating x={540} y={560} scale={0.5 + 0.5 * contraryIn} opacity={Math.min(1, contraryIn * 1.4) * (1 - contraryOut)}>
          <Pill size={96} tone="ink">
            Al contrari
          </Pill>
        </Floating>
      ) : null}

      {frame >= c.admire ? (
        <Floating x={540} y={430} scale={(0.6 + 0.4 * admireIn) * morePulse} opacity={Math.min(1, admireIn * 1.4)}>
          <Pill size={60}>Admirar encara més</Pill>
        </Floating>
      ) : null}
      {frame >= c.theirCreator ? (
        <Floating x={540} y={560} scale={0.5 + 0.5 * creatorIn} opacity={Math.min(1, creatorIn * 1.4)}>
          <Pill size={84} tone="ink">
            el seu Creador
          </Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
