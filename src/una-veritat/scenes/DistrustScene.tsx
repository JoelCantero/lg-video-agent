import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors, headingFont } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Hand, HAND_RATIO } from '../illustrations/Hand';
import { Orb } from '../illustrations/Orb';
import { Person } from '../illustrations/Person';
import { GROUND_Y, lerp, useMotion } from '../motion';

const at = sceneCues('distrust');
const c = {
  today: at(52),
  distrust: at(57),
  any: at(59),
  truth: at(62),
  since: at(64),
  seems: at(69),
  oppressive: at(71),
};

export const PEDESTAL_TOP = 880;
const ORB_Y = 735;

const CROWD = [
  { x: 100, h: 250, side: -1, doubt: true },
  { x: 212, h: 280, side: -1, doubt: false },
  { x: 322, h: 235, side: -1, doubt: true },
  { x: 758, h: 240, side: 1, doubt: false },
  { x: 868, h: 285, side: 1, doubt: true },
  { x: 980, h: 250, side: 1, doubt: true },
] as const;

/** The pedestal that holds the truth in this scene and the next ones. */
export const Pedestal: React.FC<{ readonly top?: number; readonly opacity?: number }> = ({ top = PEDESTAL_TOP, opacity = 1 }) => (
  <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity }}>
    <rect x={410} y={top} width={260} height={34} rx={12} fill={colors.white} />
    <rect x={445} y={top + 30} width={190} height={Math.max(0, GROUND_Y - top - 30)} fill={colors.white} />
    <rect x={400} y={GROUND_Y - 30} width={280} height={34} rx={12} fill={colors.white} />
  </svg>
);

/** Today the truth stands apart: people distrust it and its shadow looks like a fist. */
export const DistrustScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, pop, settle } = useMotion();

  const back = settle(c.distrust, 22);
  const fence = pop(c.any, 14);
  const label = pop(c.truth, 12);
  const shadow = pop(c.seems - 2, 16);
  const loom = settle(c.oppressive, 20);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {frame >= c.seems - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - 310,
            top: PEDESTAL_TOP - 620 * HAND_RATIO + 60,
            width: 620,
            height: 620 * HAND_RATIO,
            opacity: 0.62 * Math.min(1, shadow * 1.4),
            scale: `${0.35 + 0.65 * shadow}`,
            rotate: `${-9 * loom}deg`,
            transformOrigin: '50% 100%',
          }}
        >
          <Hand width={620} open={0} color={colors.ink} line={colors.ink} />
        </div>
      ) : null}

      <Pedestal />

      {CROWD.map((p, i) => {
        const enter = pop(c.today - 6 + i * 2, 13);
        const headTop = GROUND_Y - p.h * 0.95;
        const doubt = p.doubt ? pop(c.distrust + 2 + i * 3, 11) : 0;
        const x = p.x + p.side * 38 * back;
        return (
          <React.Fragment key={p.x}>
            <Person
              x={x}
              y={GROUND_Y}
              height={p.h * (0.6 + 0.4 * Math.min(1, enter)) * (1 - 0.06 * loom)}
              opacity={Math.min(1, enter * 1.5)}
              lean={p.side * 10 * back}
            />
            {doubt > 0 ? (
              <Floating x={x + p.side * 26} y={headTop - 70} scale={doubt}>
                <span style={{ fontFamily: headingFont, fontWeight: 700, fontSize: 92, lineHeight: 1, color: colors.white }}>?</span>
              </Floating>
            ) : null}
          </React.Fragment>
        );
      })}

      {frame >= c.any ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <circle
            cx={540}
            cy={ORB_Y}
            r={235 * (0.7 + 0.3 * fence)}
            fill="none"
            stroke={colors.white}
            strokeWidth={10}
            strokeDasharray="30 24"
            strokeLinecap="round"
            opacity={Math.min(1, fence * 1.4)}
            transform={`rotate(${time * 10} 540 ${ORB_Y})`}
          />
        </svg>
      ) : null}

      <Floating x={540} y={ORB_Y} scale={pop(-4, 14)}>
        <Orb r={112} spin={time * 12} />
      </Floating>

      {label > 0 ? (
        <Floating x={540} y={PEDESTAL_TOP + 170} scale={label}>
          <Pill size={48} tone="ink">
            veritat absoluta
          </Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
