import { Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { clamp, easeInOut, easeOut, pop, settle } from '../elg-narrated-video/theme';

/** Frame-driven helpers shared by the scenes; every value is deterministic. */
export const useMotion = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return {
    frame,
    fps,
    time: frame / fps,
    /** 0 → 1 between two frames with an ease-in-out curve. */
    ramp: (start: number, duration: number, easing = easeInOut) =>
      interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing }),
    /** 0 → 1 with a fast ease-out, for entrances. */
    rise: (start: number, duration = 12) => interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: easeOut }),
    /** 0 → 1 accelerating, for falls and exits. */
    fall: (start: number, duration: number) => interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) }),
    /** Elastic entrance (overshoots 1). */
    pop: (start: number, damping = 12) => (frame < start ? 0 : pop(frame, fps, start, damping)),
    /** Spring without overshoot. */
    settle: (start: number, duration?: number) => (frame < start ? 0 : settle(frame, fps, start, duration)),
  };
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mixColor = (t: number, from: string, to: string) => interpolateColors(Math.min(1, Math.max(0, t)), [0, 1], [from, to]);
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Keep graphics above the caption plate (it starts around y = 1378). */
export const GROUND_Y = 1300;
