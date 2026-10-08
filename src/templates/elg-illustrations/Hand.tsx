import React from 'react';
import { Easing } from 'remotion';
import { colors } from '../elg-narrated-video/theme';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = Easing.bezier(0.65, 0, 0.35, 1);

// Front view, palm towards the viewer, fingers up (viewBox 360 × 520).
const FINGERS = [
  { cx: 97, top: 44 },
  { cx: 153, top: 20 },
  { cx: 209, top: 40 },
  { cx: 265, top: 92 },
];
const KNUCKLE_TOP = 196;
const FINGER_BASE = 282;
const THUMB_BASE = [92, 372] as const;

export const HAND_RATIO = 520 / 360;
/** Point above the open palm, in viewBox units, where a held object sits. */
export const HAND_HOLD = { x: 180, y: -110 } as const;

/**
 * A hand that closes into a fist (`open` 0) or opens with the palm up to the
 * viewer (`open` 1). Fingers straighten one after another and the thumb swings out.
 */
export const Hand: React.FC<{
  readonly width: number;
  readonly open: number;
  readonly color?: string;
  readonly line?: string;
  readonly cuff?: string;
  /** SVG content in viewBox units drawn behind the hand. */
  readonly behind?: React.ReactNode;
  /** SVG content in viewBox units drawn over the palm, under the folded fingers and thumb. */
  readonly held?: React.ReactNode;
}> = ({ width, open, color = colors.white, line = colors.teal, cuff, behind, held }) => {
  const thumbAngle = -18 - 100 * ease(clamp01(open / 0.8));
  const band = clamp01(1 - open / 0.35);
  const palmLines = clamp01((open - 0.6) / 0.4);
  return (
    <svg width={width} height={width * HAND_RATIO} viewBox="0 0 360 520" style={{ overflow: 'visible' }}>
      {behind}
      <rect x={108} y={380} width={144} height={140} rx={24} fill={color} />
      <rect x={70} y={210} width={220} height={210} rx={64} fill={color} />
      {FINGERS.map((finger, i) => {
        const p = ease(clamp01((open - i * 0.06) / 0.76));
        const top = KNUCKLE_TOP + (finger.top - KNUCKLE_TOP) * p;
        return <rect key={i} x={finger.cx - 25} y={top} width={50} height={FINGER_BASE - top} rx={25} fill={color} />;
      })}
      {palmLines > 0 ? (
        <g fill="none" stroke={line} strokeWidth={6} strokeLinecap="round" opacity={0.45 * palmLines}>
          <path d="M 118 300 Q 190 332 262 296" />
          <path d="M 132 346 Q 180 366 236 352" />
        </g>
      ) : null}
      {held}
      {band > 0
        ? FINGERS.map((finger, i) => (
            <rect key={i} x={finger.cx - 26} y={250} width={52} height={84} rx={22} fill={color} stroke={line} strokeWidth={5} opacity={band} />
          ))
        : null}
      <g transform={`translate(${THUMB_BASE[0]} ${THUMB_BASE[1]}) rotate(${thumbAngle})`}>
        <rect x={-22} y={-28} width={172} height={56} rx={28} fill={color} stroke={line} strokeWidth={5} />
      </g>
      {/* Hides the outline where the thumb joins the palm. */}
      <circle cx={THUMB_BASE[0] + 4} cy={THUMB_BASE[1] + 6} r={30} fill={color} />
      {cuff ? <rect x={96} y={470} width={168} height={56} rx={16} fill={cuff} /> : null}
    </svg>
  );
};
