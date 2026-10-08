import { Easing, spring } from 'remotion';

export const colors = {
  teal: '#3f7376',
  sage: '#659b92',
  white: '#ffffff',
  ink: '#12180c',
} as const;

// Exact ELG primary gradient (elg-brand).
export const brandGradient = 'linear-gradient(to right, #3f7376 50%, #659b92 100%)';

export const headingFont = 'Urbanist';
export const bodyFont = '"Open Sans"';

export const VIDEO = { width: 1080, height: 1920, fps: 30 } as const;

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 with an elastic overshoot. */
export const pop = (frame: number, fps: number, start: number, damping = 12) =>
  spring({ frame: frame - start, fps, config: { damping, stiffness: 150, mass: 0.7 } });

/** 0 → 1 without overshoot. */
export const settle = (frame: number, fps: number, start: number, durationInFrames?: number) =>
  spring({ frame: frame - start, fps, config: { damping: 200 }, durationInFrames });
