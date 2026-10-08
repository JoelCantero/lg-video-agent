import React from 'react';
import { random } from 'remotion';
import { colors } from '../elg-narrated-video/theme';

const SHARD_COUNT = 9;
const RAY_COUNT = 12;

const polar = (r: number, a: number): [number, number] => [r * Math.cos(a), r * Math.sin(a)];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Jagged boundaries are shared by neighbouring shards, so the pieces tile the disc exactly.
const boundaries = Array.from({ length: SHARD_COUNT }, (_, i) => {
  const angle = (i / SHARD_COUNT) * Math.PI * 2 - Math.PI / 2 + (random(`orb-angle-${i}`) - 0.5) * 0.35;
  return { angle, kink: polar(0.32 + random(`orb-kink-${i}`) * 0.3, angle + (random(`orb-bend-${i}`) - 0.5) * 0.55) };
});

/** Unit-radius shards of the truth disc, with the direction they fly towards. */
export const SHARDS = boundaries.map((b, i) => {
  const next = boundaries[(i + 1) % SHARD_COUNT];
  const end = next.angle > b.angle ? next.angle : next.angle + Math.PI * 2;
  const arc = Array.from({ length: 7 }, (_, s) => polar(1, b.angle + ((end - b.angle) * s) / 6));
  const points: Array<[number, number]> = [[0, 0], b.kink, ...arc, next.kink];
  const mid = (b.angle + end) / 2;
  const [cx, cy] = polar(0.58, mid);
  return {
    points,
    cx,
    cy,
    mid,
    distance: 0.9 + random(`orb-distance-${i}`) * 0.8,
    rotation: (random(`orb-rotation-${i}`) - 0.5) * 80,
  };
});

const shardPath = (points: Array<[number, number]>, r: number, ox = 0, oy = 0) =>
  `M ${points.map(([x, y]) => `${((x - ox) * r).toFixed(1)} ${((y - oy) * r).toFixed(1)}`).join(' L ')} Z`;

type OrbProps = {
  readonly r: number;
  readonly rays?: number;
  readonly spin?: number;
  readonly ring?: number;
  readonly crack?: number;
  readonly shatter?: number;
  /** Seconds, for the gentle bobbing of loose shards. */
  readonly time?: number;
  readonly color?: string;
  readonly crackColor?: string;
  readonly rayLength?: number;
  readonly rayWidth?: number;
  readonly core?: boolean;
};

const orbBox = (r: number, rayLength: number) => r * (1.4 + rayLength) * 2;

/**
 * The truth as a disc of light: core, ring and rays. It can crack (ink lines
 * drawn from the centre) and shatter into shards that drift apart; driving
 * `shatter` back to 0 reassembles it.
 */
export const Orb: React.FC<OrbProps> = (props) => {
  const box = orbBox(props.r, props.rayLength ?? 0.34);
  return (
    <svg width={box} height={box} viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} style={{ overflow: 'visible' }}>
      <OrbGroup {...props} />
    </svg>
  );
};

/** The same orb as an SVG group centred on (0, 0), to place inside another drawing. */
export const OrbGroup: React.FC<OrbProps> = ({
  r,
  rays = 1,
  spin = 0,
  ring = 1,
  crack = 0,
  shatter = 0,
  time = 0,
  color = colors.white,
  crackColor = colors.ink,
  rayLength = 0.34,
  rayWidth,
  core = true,
}) => {
  const whole = shatter <= 0;
  const halo = 1 - clamp01(shatter * 4);
  return (
    <g>
      {rays > 0 && halo > 0 ? (
        <g transform={`rotate(${spin})`} opacity={halo}>
          {Array.from({ length: RAY_COUNT }, (_, i) => {
            const a = (i / RAY_COUNT) * Math.PI * 2;
            const [x1, y1] = polar(r * 1.34, a);
            const [x2, y2] = polar(r * (1.34 + rayLength * rays), a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={rayWidth ?? r * 0.1} strokeLinecap="round" />;
          })}
        </g>
      ) : null}
      {ring > 0 && halo > 0 ? <circle r={r * 1.16} fill="none" stroke={color} strokeWidth={r * 0.07} opacity={ring * halo} /> : null}
      {whole ? (
        core ? <circle r={r} fill={color} /> : null
      ) : (
        SHARDS.map((shard, i) => {
          const fly = shard.distance * shatter * r;
          const bob = Math.sin(time * 1.3 + i * 1.7) * r * 0.05 * shatter;
          const dx = Math.cos(shard.mid) * fly;
          const dy = Math.sin(shard.mid) * fly + bob;
          return (
            <path
              key={i}
              d={shardPath(shard.points, r)}
              fill={color}
              stroke={crackColor}
              strokeWidth={r * 0.03 * (1 - clamp01(shatter * 2))}
              strokeLinejoin="round"
              transform={`translate(${dx} ${dy}) rotate(${shard.rotation * shatter} ${shard.cx * r} ${shard.cy * r})`}
            />
          );
        })
      )}
      {whole && crack > 0
        ? boundaries.map((b, i) => {
            const [ex, ey] = polar(1, b.angle);
            return (
              <path
                key={i}
                d={`M 0 0 L ${b.kink[0] * r} ${b.kink[1] * r} L ${ex * r} ${ey * r}`}
                fill="none"
                stroke={crackColor}
                strokeWidth={r * 0.045}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray="1 1"
                strokeDashoffset={1 - clamp01(crack * 1.6 - i * 0.07)}
              />
            );
          })
        : null}
    </g>
  );
};

/** A single loose shard, drawn around its own centre (for people holding "their" truth). */
export const Shard: React.FC<{ readonly index: number; readonly size: number; readonly color?: string; readonly rotate?: number }> = ({
  index,
  size,
  color = colors.white,
  rotate = 0,
}) => {
  const shard = SHARDS[index % SHARD_COUNT];
  const box = size * 2.4;
  return (
    <svg width={box} height={box} viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`} style={{ overflow: 'visible' }}>
      <path d={shardPath(shard.points, size, shard.cx, shard.cy)} fill={color} transform={`rotate(${rotate})`} strokeLinejoin="round" />
    </svg>
  );
};
