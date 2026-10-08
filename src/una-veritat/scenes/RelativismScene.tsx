import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { BrandBackground } from '../../templates/elg-narrated-video/components/BrandBackground';
import { Floating } from '../../templates/elg-narrated-video/components/Floating';
import { Pill } from '../../templates/elg-narrated-video/components/Pill';
import { useBrandFonts } from '../../templates/elg-narrated-video/fonts';
import { colors } from '../../templates/elg-narrated-video/theme';
import { sceneCues } from '../data/timeline';
import { Hand, HAND_RATIO } from '../illustrations/Hand';
import { Orb, Shard, SHARDS } from '../illustrations/Orb';
import { Person, personHand } from '../illustrations/Person';
import { GROUND_Y, lerp, useMotion } from '../motion';
import { Pedestal } from './DistrustScene';

const at = sceneCues('relativism');
const c = {
  notExists: at(85),
  absolute: at(92),
  relativism: at(97),
  reason: at(98),
  conclusion: at(115),
  ifNot: at(117),
  absolute2: at(122),
  then: at(123),
  noOppressors: at(124),
  oppressors: at(132),
  you: at(133),
  yours: at(136),
  mine: at(142),
};

const ORB_Y = 735;
const R = 112;
const ORBIT = { x: 540, y: 770, rx: 400, ry: 330 };
const SWAP = c.absolute + 30;
const FIST_WIDTH = 330;
const FIST_Y = 700;
const PAIR = [
  { x: 300, flip: false, shard: 1, label: 'la teva', cue: c.yours },
  { x: 780, flip: true, shard: 5, label: 'la meva', cue: c.mine },
] as const;
const PAIR_HEIGHT = 380;
const SMALL = [380, 540, 700];
const DUST = new Array(16).fill(true).map((_, i) => ({ a: (i / 16) * Math.PI * 2 + random(`dust-a-${i}`), d: 160 + random(`dust-d-${i}`) * 200 }));

/** «No existeix cap veritat absoluta»: the truth breaks, the oppressor goes with it and everyone keeps a piece. */
export const RelativismScene: React.FC = () => {
  useBrandFonts();
  const { frame, time, ramp, pop, settle, rise } = useMotion();

  const zoom = 1 + 0.1 * ramp(0, c.notExists) - 0.1 * ramp(c.absolute, SWAP - c.absolute);
  const crack = ramp(c.notExists, 40);
  const shatter = rise(c.absolute, 28);
  const pedestalOut = 1 - ramp(c.absolute, 30);
  const toOrbit = ramp(SWAP, 50);

  const word = pop(c.relativism - 2, 12);
  const wordUp = settle(c.reason, 26);

  const fistIn = pop(c.conclusion, 13) * (1 - ramp(c.noOppressors, 30));
  const dissolve = rise(c.noOppressors, 40);
  const ghost = rise(c.ifNot, 14) * (1 - ramp(c.absolute2 + 16, 20));
  const smallIn = pop(c.conclusion + 6, 13) * (1 - ramp(c.you - 14, 14));
  const relief = settle(c.oppressors, 20);

  const pairIn = pop(c.you - 6, 13);
  const toHands = ramp(c.you, 22);
  const hand = personHand(PAIR_HEIGHT, 1);

  return (
    <AbsoluteFill>
      <BrandBackground />

      <AbsoluteFill style={{ scale: `${zoom}`, transformOrigin: `540px ${ORB_Y}px` }}>
        {pedestalOut > 0 ? <Pedestal opacity={pedestalOut} /> : null}
        {pedestalOut > 0 ? (
          <Floating x={540} y={1050 + 260 * (1 - pedestalOut)} opacity={pedestalOut}>
            <Pill size={48} tone="ink">
              veritat absoluta
            </Pill>
          </Floating>
        ) : null}
        {frame < SWAP ? (
          <Floating x={540} y={ORB_Y}>
            <Orb r={R} spin={time * 12} crack={crack} shatter={shatter} time={time} />
          </Floating>
        ) : null}
      </AbsoluteFill>

      {ghost > 0 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={540} cy={FIST_Y} r={290} fill="none" stroke={colors.white} strokeWidth={10} strokeDasharray="26 22" opacity={ghost} />
        </svg>
      ) : null}

      {frame >= c.conclusion && dissolve < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - FIST_WIDTH / 2,
            top: FIST_Y - (FIST_WIDTH * HAND_RATIO) / 2,
            width: FIST_WIDTH,
            height: FIST_WIDTH * HAND_RATIO,
            opacity: Math.min(1, fistIn * 1.4),
            scale: `${(0.6 + 0.4 * Math.min(1, fistIn)) * (1 + 0.15 * dissolve)}`,
          }}
        >
          <Hand width={FIST_WIDTH} open={0} color={colors.ink} />
        </div>
      ) : null}
      {dissolve > 0 && dissolve < 1 ? (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {DUST.map((p, i) => (
            <circle key={i} cx={540 + Math.cos(p.a) * p.d * dissolve} cy={FIST_Y + Math.sin(p.a) * p.d * dissolve} r={16 * (1 - dissolve)} fill={colors.ink} />
          ))}
        </svg>
      ) : null}

      {smallIn > 0
        ? SMALL.map((x, i) => (
            <Person key={x} x={x} y={GROUND_Y} height={200 + (i === 1 ? 30 : 0)} opacity={Math.min(1, smallIn * 1.5)} squash={0.45 * (1 - relief)} lean={(i - 1) * 6 * (1 - relief)} />
          ))
        : null}

      {frame >= c.you - 6
        ? PAIR.map((p) => (
            <Person key={p.x} x={p.x} y={GROUND_Y} height={PAIR_HEIGHT * (0.7 + 0.3 * Math.min(1, pairIn))} opacity={Math.min(1, pairIn * 1.5)} raise={toHands} flip={p.flip} />
          ))
        : null}

      {frame >= SWAP
        ? SHARDS.map((s, i) => {
            const fly = s.distance * R;
            const startX = 540 + s.cx * R + Math.cos(s.mid) * fly;
            const startY = ORB_Y + s.cy * R + Math.sin(s.mid) * fly + Math.sin(time * 1.3 + i * 1.7) * R * 0.05 * (1 - toOrbit);
            const a = s.mid + (frame - SWAP) / 90;
            let x = lerp(startX, ORBIT.x + Math.cos(a) * ORBIT.rx, toOrbit);
            let y = lerp(startY, ORBIT.y + Math.sin(a) * ORBIT.ry, toOrbit);
            let size = lerp(R, 66, toOrbit);
            let rotate = s.rotation + toOrbit * (frame - SWAP) * 0.6;
            let opacity = 1;
            const owner = PAIR.find((p) => p.shard === i);
            if (owner) {
              const hx = owner.x + (owner.flip ? -hand.x : hand.x);
              x = lerp(x, hx, toHands);
              y = lerp(y, GROUND_Y + hand.y - 62, toHands);
              size = lerp(size, 60, toHands);
              rotate = lerp(rotate, owner.flip ? 20 : -20, toHands);
            } else {
              opacity = 1 - ramp(c.you, 20);
            }
            return opacity > 0 ? (
              <Floating key={i} x={x} y={y} opacity={opacity}>
                <Shard index={i} size={size} rotate={rotate} />
              </Floating>
            ) : null;
          })
        : null}

      {PAIR.map((p) => {
        const show = pop(p.cue, 12);
        if (show <= 0) return null;
        const hx = p.x + (p.flip ? -hand.x : hand.x);
        return (
          <Floating key={p.label} x={hx} y={GROUND_Y + hand.y - 175} scale={show}>
            <Pill size={46}>{p.label}</Pill>
          </Floating>
        );
      })}

      {word > 0 ? (
        <Floating x={540} y={lerp(ORBIT.y, 250, wordUp)} scale={(0.55 + 0.45 * word) * lerp(1, 0.6, wordUp)} opacity={Math.min(1, word * 1.5)}>
          <Pill size={112} tone="ink" style={{ boxShadow: 'none' }}>
            relativisme
          </Pill>
        </Floating>
      ) : null}
    </AbsoluteFill>
  );
};
