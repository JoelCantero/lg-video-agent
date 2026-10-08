import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Hand, HAND_RATIO } from '../illustrations/Hand';
import { OrbGroup } from '../illustrations/Orb';
import { Person } from '../illustrations/Person';
import { GROUND_Y, lerp, mixColor, useMotion } from '../motion';

const at = sceneCues('oppressor');
const c = {
  possess: at(20),
  absolute: at(23),
  convert: at(26),
  oppressor: at(29),
  everyone: at(30),
  possessor: at(36),
};

// Labels stamped on the same fist, in hand viewBox units (360 × 520).
const STAMPS = [
  { text: 'Marxisme', cue: at(43), x: 150, y: 250, rotate: -7 },
  { text: 'Capitalisme', cue: at(45), x: 215, y: 340, rotate: 5 },
  { text: 'Feixisme', cue: at(47), x: 128, y: 412, rotate: 4 },
  { text: 'Fonamentalisme religiós', cue: at(50), x: 180, y: 486, rotate: -3 },
];

const CROWD = new Array(9).fill(true).map((_, i) => ({
  x: 110 + i * 107.5,
  height: 150 + random(`crowd-${i}`) * 40,
}));

/** Possessing the truth: the hand closes on it and becomes the fist that presses on everyone. */
export const OppressorScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle } = useMotion();

  const sink = ramp(c.possess, 16);
  const close = ramp(c.possess + 9, 20);
  const leak = close * (1 - ramp(c.convert, 18));
  const dark = ramp(c.convert, 20);
  const grow = settle(c.convert, 26);
  const slam = pop(c.oppressor, 9) * (1 - 0.75 * settle(c.oppressor + 10, 24));
  const presses = STAMPS.reduce((sum, s) => sum + (frame >= s.cue ? pop(s.cue, 10) * (1 - settle(s.cue + 6, 16)) : 0), 0);

  const width = lerp(380, 540, grow);
  const scale = width / 360;
  const left = 540 - width / 2;
  const top = lerp(640, 150, grow) + 150 * slam + 26 * presses;

  const crowdIn = (i: number) => pop(c.convert + 4 + i * 2, 13);
  const squash = Math.min(1, 0.7 * slam + 0.35 * settle(c.oppressor, 20) + 0.35 * presses);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {frame >= c.convert ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <ellipse cx={540} cy={GROUND_Y + 6} rx={lerp(180, 470, grow) * (1 + 0.15 * slam)} ry={34} fill={colors.ink} opacity={0.32 * grow} />
        </svg>
      ) : null}

      {CROWD.map((p, i) =>
        frame >= c.convert + 4 + i * 2 ? (
          <Person
            key={i}
            x={p.x}
            y={GROUND_Y}
            height={p.height * (0.6 + 0.4 * Math.min(1, crowdIn(i)))}
            opacity={Math.min(1, crowdIn(i) * 1.5)}
            squash={squash}
            lean={(p.x < 540 ? -1 : 1) * 10 * squash}
          />
        ) : null,
      )}

      <div style={{ position: 'absolute', left, top, width, height: width * HAND_RATIO }}>
        <Hand
          width={width}
          open={1 - close}
          color={mixColor(dark, colors.white, colors.ink)}
          behind={
            leak > 0 ? (
              <g transform="translate(180 300)" opacity={leak}>
                <OrbGroup r={56} core={false} ring={0} rayLength={1.9} rayWidth={16} spin={time * 20} />
              </g>
            ) : null
          }
          held={
            frame < c.convert + 20 ? (
              <g transform={`translate(180 ${lerp(-110, 300, sink)})`}>
                <OrbGroup r={lerp(85, 56, sink)} rays={1 - sink} ring={1 - sink} spin={time * 12} />
              </g>
            ) : null
          }
        />
        {STAMPS.map((s) => {
          if (frame < s.cue) return null;
          const hit = settle(s.cue, 9);
          return (
            <Floating key={s.text} x={s.x * scale} y={s.y * scale} scale={lerp(1.7, 1, hit)} rotate={s.rotate + 10 * (1 - hit)} opacity={Math.min(1, hit * 2.5)}>
              <Pill size={46} style={{ color: colors.ink }}>
                {s.text}
              </Pill>
            </Floating>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
