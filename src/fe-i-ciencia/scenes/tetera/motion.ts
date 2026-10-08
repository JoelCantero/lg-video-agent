import { interpolate } from 'remotion';
import { scenes, toFrame, wordStart } from '../../data/timeline';
import { teteraCues, type TeteraCue } from '../../data/tetera-cues';
import { SPOUT_TIP, TEAPOT_PIVOT } from '../../illustrations/Teapot';
import { clamp, easeInOut, pop, settle } from '../../theme';

export const SCENE_START_FRAME = toFrame(scenes.tetera.start);
export const TETERA_DURATION = toFrame(scenes.tetera.end) - SCENE_START_FRAME;

/** Cue frames relative to the start of the scene. */
export const c = Object.fromEntries(
  (Object.keys(teteraCues) as TeteraCue[]).map((key) => [key, toFrame(wordStart(teteraCues[key])) - SCENE_START_FRAME]),
) as Record<TeteraCue, number>;

export const ramp = (frame: number, start: number, duration: number) =>
  interpolate(frame, [start, start + duration], [0, 1], { ...clamp, easing: easeInOut });

/** 0 → 1 → 0 accent. */
export const bump = (frame: number, start: number, rise = 6, fall = 12) =>
  interpolate(frame, [start, start + rise, start + rise + fall], [0, 1, 0], clamp);

// Camera: stage point (fx, fy) of the 800×720 teapot drawing lands on screen point (px, py).
type Camera = { s: number; fx: number; fy: number; px: number; py: number };
const HERO: Camera = { s: 1.25, fx: 400, fy: 520, px: 456, py: 960 };
const PROCESS: Camera = { s: 2.625, fx: 400, fy: 520, px: 540, py: 840 };
const PURPOSE: Camera = { s: 0.95, fx: 400, fy: 470, px: 450, py: 920 };

const cameraKeys: Array<[number, Camera]> = [
  [c.because, HERO],
  [c.flame, PROCESS],
  [c.perfect, PROCESS],
  [c.perfect + 18, HERO],
  [c.however, HERO],
  [c.however + 30, PURPOSE],
];

export type StageTransform = { s: number; x: number; y: number };

export const cameraAt = (frame: number): StageTransform => {
  const frames = cameraKeys.map(([at]) => at);
  const pick = (select: (camera: Camera) => number) =>
    interpolate(frame, frames, cameraKeys.map(([, camera]) => select(camera)), { ...clamp, easing: easeInOut });
  const s = Math.exp(pick((camera) => Math.log(camera.s)));
  return { s, x: pick((camera) => camera.px) - pick((camera) => camera.fx) * s, y: pick((camera) => camera.py) - pick((camera) => camera.fy) * s };
};

export type Disc = { cx: number; cy: number; r: number };
const mixDisc = (a: Disc, b: Disc, t: number): Disc => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  r: a.r + (b.r - a.r) * t,
});

const LENNOX: Disc = { cx: 540, cy: 900, r: 230 };
const PARK: Disc = { cx: 150, cy: 1185, r: 70 };
const MEDALLION: Disc = { cx: 230, cy: 520, r: 140 };
export const LEFT: Disc = { cx: 300, cy: 800, r: 210 };
export const LEFT_CLOSE: Disc = { cx: 330, cy: 800, r: 210 };
const RIGHT: Disc = { cx: 780, cy: 800, r: 210 };
export const RIGHT_CLOSE: Disc = { cx: 750, cy: 800, r: 210 };
export const FUSED: Disc = { cx: 540, cy: 800, r: 300 };
export const UNIVERSE: Disc = { cx: 540, cy: 790, r: 330 };

const docked = (camera: StageTransform): Disc => ({ cx: camera.x + 400 * camera.s, cy: camera.y + 520 * camera.s, r: 160 * camera.s });

export const fuseAt = (frame: number, fps: number) => (frame < c.complement ? 0 : pop(frame, fps, c.complement, 14));

/** The magnifying lens: Lennox's "way of looking", then the "how" half of the comparison. */
export const lensAt = (frame: number, fps: number, camera: StageTransform): Disc => {
  if (frame < c.teapot) {
    const sweep = interpolate(frame, [c.look, c.look + 8, c.teapot - 10, c.teapot], [0, 1, 1, 0], clamp);
    return { ...LENNOX, cx: LENNOX.cx + Math.sin((frame - c.look) / 7) * 46 * sweep };
  }
  if (frame < c.someone) return mixDisc(LENNOX, PARK, settle(frame, fps, c.teapot, 22));
  if (frame < c.however) return mixDisc(PARK, docked(camera), ramp(frame, c.someone, 34));
  if (frame < c.whichCorrect) return mixDisc(docked(camera), MEDALLION, ramp(frame, c.however, 30));
  if (frame < c.notContradict) return mixDisc(MEDALLION, LEFT, ramp(frame, c.whichCorrect, 26));
  if (frame < c.complement) return mixDisc(LEFT, LEFT_CLOSE, ramp(frame, c.notContradict, 10));
  if (frame < c.sameWay) return mixDisc(LEFT_CLOSE, FUSED, fuseAt(frame, fps));
  return mixDisc(FUSED, UNIVERSE, ramp(frame, c.sameWay, 30));
};

/** The "purpose" disc that holds the cup of tea. */
export const purposeDiscAt = (frame: number, fps: number): Disc => {
  if (frame < c.notContradict) return { ...RIGHT, r: RIGHT.r * settle(frame, fps, c.whichCorrect + 4, 22) };
  if (frame < c.complement) return mixDisc(RIGHT, RIGHT_CLOSE, ramp(frame, c.notContradict, 10));
  if (frame < c.sameWay) return mixDisc(RIGHT_CLOSE, FUSED, fuseAt(frame, fps));
  return mixDisc(FUSED, UNIVERSE, ramp(frame, c.sameWay, 30));
};

type CupPlacement = { x: number; y: number; w: number };
const POUR_CUP: CupPlacement = { x: 820, y: 1191, w: 230 };
const MEDALLION_CUP: CupPlacement = { x: 780, y: 822, w: 236 };
const CLOSE_CUP: CupPlacement = { x: 750, y: 822, w: 236 };
const FUSED_CUP: CupPlacement = { x: 690, y: 822, w: 220 };
const mixCup = (a: CupPlacement, b: CupPlacement, t: number): CupPlacement => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
});

export const cupAt = (frame: number, fps: number): CupPlacement => {
  if (frame < c.whichCorrect) return POUR_CUP;
  if (frame < c.notContradict) return mixCup(POUR_CUP, MEDALLION_CUP, ramp(frame, c.whichCorrect, 26));
  if (frame < c.complement) return mixCup(MEDALLION_CUP, CLOSE_CUP, ramp(frame, c.notContradict, 10));
  return mixCup(CLOSE_CUP, FUSED_CUP, fuseAt(frame, fps));
};

/** Screen position of the spout tip for a tilted teapot. */
export const spoutTip = (camera: StageTransform, tiltDegrees: number) => {
  const angle = (tiltDegrees * Math.PI) / 180;
  const dx = SPOUT_TIP.x - TEAPOT_PIVOT.x;
  const dy = SPOUT_TIP.y - TEAPOT_PIVOT.y;
  const x = TEAPOT_PIVOT.x + dx * Math.cos(angle) - dy * Math.sin(angle);
  const y = TEAPOT_PIVOT.y + dx * Math.sin(angle) + dy * Math.cos(angle);
  return { x: camera.x + x * camera.s, y: camera.y + y * camera.s };
};
