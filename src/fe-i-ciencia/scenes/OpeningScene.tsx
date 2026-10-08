import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrandBackground } from '../components/BrandBackground';
import { Floating } from '../components/Floating';
import { IdeaDisc } from '../components/IdeaDisc';
import { Pill } from '../components/Pill';
import { FIRST_VOICE_OFFSET, sceneCues } from '../data/timeline';
import { useBrandFonts } from '../fonts';
import { CheckIcon, EmptyProofIcon, EyeIcon, MiniIdeaCard, RulerIcon } from '../illustrations/Icons';
import { clamp, colors, easeInOut, headingFont, pop, settle } from '../theme';

const at = sceneCues('opening');
const c = {
  son: at(0, FIRST_VOICE_OFFSET),
  la: at(1),
  science: at(2),
  iLa: at(3),
  faith: at(5),
  incompatible: at(6),
  idea: at(7),
  scienceAgain: at(10),
  observe: at(14),
  measure: at(15),
  demonstrate: at(17),
  faithAgain: at(21),
  believe: at(24),
  withoutProof: at(25),
  widespread: at(27),
  very: at(31),
};

// The shrunken diagram sits in the middle cell; copies fill the others ("una idea molt estesa").
const COPY_CELLS: Array<[number, number]> = [
  [540, 425],
  [880, 735],
  [540, 1045],
  [200, 735],
  [880, 425],
  [880, 1045],
  [200, 1045],
  [200, 425],
];

const titleStyle: React.CSSProperties = {
  fontFamily: headingFont,
  fontWeight: 700,
  color: colors.white,
  lineHeight: 1.05,
  letterSpacing: 0,
  display: 'inline-block',
};

export const OpeningScene: React.FC = () => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ramp = (start: number, duration: number) =>
    interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: easeInOut });
  const bump = (start: number) => interpolate(frame, [start, start + 6, start + 18], [0, 1, 0], clamp);
  const word = (start: number) => {
    const p = pop(frame, fps, start, 12);
    return { opacity: Math.min(1, p * 1.5), scale: `${0.5 + 0.5 * p}` };
  };

  const titleOut = 1 - ramp(c.idea, 12);
  const leftIn = pop(frame, fps, c.science, 13);
  const rightIn = pop(frame, fps, c.faith, 13);
  const jolt = interpolate(frame, [c.incompatible, c.incompatible + 5, c.incompatible + 11, c.incompatible + 24], [0, 1, -0.7, 0], clamp);
  const crack = interpolate(frame, [c.incompatible + 3, c.incompatible + 6, c.incompatible + 26, c.incompatible + 34], [0, 1, 1, 0], clamp);
  const toIdea = settle(frame, fps, c.idea, 22);
  const discR = 190 - 40 * toIdea;
  const discY = 820 - 260 * toIdea;
  const shrink = settle(frame, fps, c.widespread, 24);
  const incompatibleIn = pop(frame, fps, c.incompatible, 11);

  const column = (start: number, x: number, y: number, children: React.ReactNode, tone: 'light' | 'ink' = 'light') => {
    if (frame < start) return null;
    const p = pop(frame, fps, start, 12);
    return (
      <Floating x={x} y={y} scale={0.6 + 0.4 * p} opacity={Math.min(1, p * 1.5)} dx={(1 - Math.min(1, p)) * (x < 540 ? -70 : 70)}>
        <Pill size={44} tone={tone} style={{ gap: 14 }}>
          {children}
        </Pill>
      </Floating>
    );
  };

  return (
    <AbsoluteFill>
      <BrandBackground />

      {shrink > 0.55 ? (
        <Floating x={540} y={735} opacity={interpolate(shrink, [0.55, 0.9], [0, 1], clamp)}>
          <div style={{ width: 300, height: 250, borderRadius: 30, background: colors.white, boxShadow: '0 18px 44px rgba(18, 24, 12, 0.2)' }} />
        </Floating>
      ) : null}

      <AbsoluteFill style={{ transformOrigin: '540px 735px', scale: `${1 - 0.64 * shrink}` }}>
        <IdeaDisc x={285 + jolt * 50 - (1 - Math.min(1, leftIn)) * 320} y={discY} r={discR} tone="science" scale={(0.6 + 0.4 * leftIn) * (1 + 0.08 * bump(c.scienceAgain))} opacity={Math.min(1, leftIn * 1.5)} />
        <IdeaDisc x={795 - jolt * 50 + (1 - Math.min(1, rightIn)) * 320} y={discY} r={discR} tone="faith" scale={(0.6 + 0.4 * rightIn) * (1 + 0.08 * bump(c.faithAgain))} opacity={Math.min(1, rightIn * 1.5)} />
        {column(c.observe, 285, 800, <><EyeIcon size={50} /> Observar</>)}
        {column(c.measure, 285, 910, <><RulerIcon size={50} /> Mesurar</>)}
        {column(c.demonstrate, 285, 1020, <><CheckIcon size={50} /> Demostrar</>)}
        {column(c.believe, 795, 800, <>Creure</>)}
        {column(c.withoutProof, 795, 910, <><EmptyProofIcon size={50} /> sense proves?</>, 'ink')}
      </AbsoluteFill>

      {crack > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <polyline
            points="540,860 522,895 558,930 522,965 550,1010"
            fill="none"
            stroke={colors.white}
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={crack}
          />
        </svg>
      ) : null}

      {titleOut > 0 ? (
        <>
          <Floating x={540} y={400} opacity={titleOut} dy={-40 * (1 - titleOut)}>
            <div style={{ display: 'flex', gap: 30 }}>
              <span style={{ ...titleStyle, fontSize: 104, ...word(c.son) }}>Són</span>
              <span style={{ ...titleStyle, fontSize: 104, ...word(c.la) }}>la</span>
            </div>
          </Floating>
          <Floating x={540} y={820} opacity={titleOut}>
            <span style={{ ...titleStyle, fontSize: 60, ...word(c.iLa) }}>i la</span>
          </Floating>
          {frame >= c.incompatible ? (
            <Floating x={540} y={1190} scale={0.6 + 0.4 * incompatibleIn} opacity={Math.min(1, incompatibleIn * 1.5) * titleOut} rotate={jolt * 2}>
              <Pill size={92} tone="ink">
                incompatibles?
              </Pill>
            </Floating>
          ) : null}
        </>
      ) : null}

      {COPY_CELLS.map(([x, y], i) => {
        const start = c.very + i * 2;
        if (frame < start) return null;
        const p = pop(frame, fps, start, 12);
        return (
          <Floating key={`${x}-${y}`} x={x} y={y} scale={0.3 + 0.7 * p} opacity={Math.min(1, p * 1.5)}>
            <MiniIdeaCard width={300} />
          </Floating>
        );
      })}
    </AbsoluteFill>
  );
};
