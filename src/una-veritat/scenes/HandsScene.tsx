import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Hand, HAND_HOLD, HAND_RATIO } from '../illustrations/Hand';
import { Orb, OrbGroup } from '../illustrations/Orb';
import { Person } from '../illustrations/Person';
import { Crown } from '../illustrations/Symbols';
import { GROUND_Y, lerp, mixColor, useMotion } from '../motion';

const at = sceneCues('hands');
const c = {
  meaning: at(346),
  nature: at(351),
  cling: at(358),
  clingEnd: at(359),
  but: at(360),
  release: at(362),
  nature2: at(363),
  renounce: at(368),
  rights: at(371),
  nature3: at(372),
  give: at(377),
  for: at(382),
  us: at(383),
};

const HAND_WIDTH = 420;
const HAND_TOP = 560;
const LABEL_Y = 1250;
const PEOPLE = [
  { x: 150, h: 175 },
  { x: 345, h: 200 },
  { x: 540, h: 185 },
  { x: 735, h: 205 },
  { x: 930, h: 180 },
];

/** God's nature: not clinging but letting go — the fist opens, sets the crown aside and gives itself. */
export const HandsScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle, fall } = useMotion();

  const fistIn = pop(8, 14);
  const header = pop(c.nature - 2, 12) * (1 - ramp(c.nature2 - 12, 12));
  const clingPill = pop(c.cling, 12);
  const strike = ramp(c.clingEnd - 2, 12);
  const clingDrop = fall(c.but, 20);
  const releasePill = pop(c.release, 12);

  const whiten = ramp(c.but, 16);
  const open = ramp(c.but + 6, 30);
  const emerge = settle(c.release + 4, 30);
  const crownIn = pop(c.nature2 + 4, 12);
  const setAside = settle(c.renounce, 34);

  const lift = settle(c.nature3 - 6, 30);
  const tilt = settle(c.give, 26);
  const share = ramp(c.give + 4, c.us + 2 - (c.give + 4));
  const peopleIn = (i: number) => pop(c.nature3 + i * 3, 13);

  const handScale = 1 - 0.2 * lift;
  const handTop = HAND_TOP - 150 * lift;
  const unit = (HAND_WIDTH / 360) * handScale;
  const theta = (22 * tilt * Math.PI) / 180;
  const hold = HAND_HOLD.y * unit;
  const holdX = 540 - hold * Math.sin(theta);
  const holdY = handTop + hold * Math.cos(theta);

  return (
    <AbsoluteFill>
      <BrandBackground />

      {header > 0 ? (
        <Floating x={540} y={230} scale={header}>
          <Pill size={56} tone="ink">
            la naturalesa de Déu
          </Pill>
        </Floating>
      ) : null}

      {frame >= c.nature3
        ? PEOPLE.map((p, i) => (
            <Person key={p.x} x={p.x} y={GROUND_Y} height={p.h * (0.6 + 0.4 * Math.min(1, peopleIn(i)))} opacity={Math.min(1, peopleIn(i) * 1.5)} lean={((540 - p.x) / 400) * 6 * share} />
          ))
        : null}

      <div
        style={{
          position: 'absolute',
          left: 540 - HAND_WIDTH / 2,
          top: handTop,
          width: HAND_WIDTH,
          height: HAND_WIDTH * HAND_RATIO,
          opacity: Math.min(1, fistIn * 1.4),
          scale: `${(0.7 + 0.3 * Math.min(1, fistIn)) * handScale}`,
          rotate: `${22 * tilt}deg`,
          transformOrigin: '50% 0%',
        }}
      >
        <Hand
          width={HAND_WIDTH}
          open={open}
          color={mixColor(whiten, colors.ink, colors.white)}
          behind={
            whiten > 0 && open < 1 ? (
              <g transform="translate(180 300)" opacity={whiten * (1 - open)}>
                <OrbGroup r={56} core={false} ring={0} rayLength={1.9} rayWidth={16} spin={time * 20} />
              </g>
            ) : null
          }
          held={
            emerge > 0 && share < 0.35 ? (
              <g transform={`translate(180 ${lerp(300, HAND_HOLD.y, emerge)}) rotate(${-22 * tilt})`} opacity={1 - share / 0.35}>
                <OrbGroup r={lerp(20, 70, emerge)} spin={time * 12} />
              </g>
            ) : null
          }
        />
      </div>

      {crownIn > 0 ? (
        <Floating x={lerp(holdX, 860, setAside)} y={lerp(holdY - 170, 1160, setAside)} scale={crownIn * lerp(1, 0.6, setAside)} rotate={-25 * setAside} opacity={1 - 0.55 * setAside}>
          <Crown width={210} />
        </Floating>
      ) : null}

      {share > 0
        ? PEOPLE.map((p, i) => {
            const k = Math.min(1, Math.max(0, share * 1.25 - i * 0.06));
            return (
              <Floating key={p.x} x={lerp(holdX, p.x, k)} y={lerp(holdY, GROUND_Y - p.h - 60, k)} scale={lerp(1.6, 1, k)}>
                <Orb r={24} rays={k} spin={time * 20} />
              </Floating>
            );
          })
        : null}

      {clingPill > 0 && clingDrop < 1 ? (
        <Floating x={540} y={LABEL_Y + 500 * clingDrop} scale={clingPill} rotate={14 * clingDrop} opacity={1 - clingDrop}>
          <div style={{ position: 'relative' }}>
            <Pill size={58} style={{ color: colors.ink }}>
              aferrar-se
            </Pill>
            <div style={{ position: 'absolute', left: 18, top: '50%', width: `calc((100% - 36px) * ${strike})`, height: 10, marginTop: -5, borderRadius: 5, background: colors.ink, rotate: '-4deg' }} />
          </div>
        </Floating>
      ) : null}

      {releasePill > 0 ? (
        <Floating x={540} y={LABEL_Y} scale={releasePill} opacity={1 - ramp(c.nature3 - 10, 12)}>
          <Pill size={58} tone="ink">
            desprendre's
          </Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
