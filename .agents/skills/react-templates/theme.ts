import { Easing, interpolate, spring } from 'remotion';
import type { CSSProperties } from 'react';

export type TemplateMotion = {
  kind: 'original' | 'gentle' | 'spring' | 'punch';
  durationFrames: number;
  distance: number;
  staggerFrames: number;
  stiffness: number;
  damping: number;
  blinkCursor: boolean;
  preserveEffects: boolean;
};

export type TemplateTheme = {
  headingFont: string;
  bodyFont: string;
  headingWeight: number;
  bodyWeight: number;
  headingSize: number;
  textHeadingScale: number;
  bodySize: number;
  secondarySize: number;
  referenceWidth: number;
  headingLineHeight: number | 'normal';
  bodyLineHeight: number | 'normal';
  letterSpacing: number | string;
  background: string;
  textColor: string;
  headingBackground?: string;
  inverseBackground: string;
  inverseTextColor: string;
  mutedColor: string;
  cardBackground: string;
  borderColor: string;
  negativeColor: string;
  positiveColor: string;
  accentBackground: string;
  accentColors: string[];
  accentTextMix: number;
  borderRadius: number;
  borderWidth: number;
  safeMargin: number;
  motion: TemplateMotion;
};

export type TemplateThemeInput = Partial<Omit<TemplateTheme, 'motion'>> & {
  motion?: Partial<TemplateMotion>;
};

export type ThemedTemplateProps = { theme?: TemplateThemeInput };
export type TemplatePreset = 'original' | 'elg';

const defaults: TemplateTheme = {
  headingFont: 'system-ui, sans-serif',
  bodyFont: 'system-ui, sans-serif',
  headingWeight: 600,
  bodyWeight: 400,
  headingSize: 64,
  textHeadingScale: 1,
  bodySize: 18,
  secondarySize: 14,
  referenceWidth: 0,
  headingLineHeight: 'normal',
  bodyLineHeight: 'normal',
  letterSpacing: 0,
  background: '#ffffff',
  textColor: '#171717',
  inverseBackground: '#171717',
  inverseTextColor: '#ffffff',
  mutedColor: '#525252',
  cardBackground: '#ffffff',
  borderColor: '#e5e5e5',
  negativeColor: '#EF4444',
  positiveColor: '#171717',
  accentBackground: 'linear-gradient(to right, #171717, #737373)',
  accentColors: ['#171717', '#404040', '#737373', '#525252', '#a3a3a3'],
  accentTextMix: 1,
  borderRadius: 12,
  borderWidth: 1,
  safeMargin: 0,
  motion: {
    kind: 'original', durationFrames: 16, distance: 16, staggerFrames: 6,
    stiffness: 200, damping: 18, blinkCursor: true, preserveEffects: true,
  },
};

export const templatePresets: Record<TemplatePreset, TemplateThemeInput> = {
  original: {},
  elg: {
    headingFont: 'Urbanist, sans-serif',
    bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700,
    bodyWeight: 400,
    headingSize: 88,
    textHeadingScale: 2,
    bodySize: 42,
    secondarySize: 32,
    referenceWidth: 1920,
    headingLineHeight: 1.1,
    bodyLineHeight: 1.35,
    letterSpacing: 0,
    background: '#ffffff',
    textColor: '#12180c',
    inverseBackground: '#12180c',
    inverseTextColor: '#ffffff',
    mutedColor: '#12180c',
    cardBackground: '#ffffff',
    borderColor: '#12180c',
    negativeColor: '#12180c',
    positiveColor: '#12180c',
    accentBackground: 'linear-gradient(to right, #3f7376 50%, #659b92 100%)',
    accentColors: ['#3f7376', '#659b92'],
    accentTextMix: 0.6,
    borderRadius: 8,
    borderWidth: 1,
    safeMargin: 0.08,
    motion: {
      kind: 'gentle', durationFrames: 16, distance: 16, staggerFrames: 8,
      blinkCursor: false, preserveEffects: true,
    },
  },
};

export function resolveTemplateTheme(
  theme: TemplateThemeInput = {},
  templateDefaults: TemplateThemeInput = {},
): TemplateTheme {
  return {
    ...defaults,
    ...templateDefaults,
    ...theme,
    motion: { ...defaults.motion, ...templateDefaults.motion, ...theme.motion },
  };
}

export function resolveTemplateAppearance(
  theme: TemplateThemeInput = {},
  templateDefaults: TemplateThemeInput = {},
): TemplateTheme {
  const original = resolveTemplateTheme({}, templateDefaults);
  return {
    ...resolveTemplateTheme(theme, templateDefaults),
    headingSize: original.headingSize,
    bodySize: original.bodySize,
    secondarySize: original.secondarySize,
    textHeadingScale: original.textHeadingScale,
    referenceWidth: original.referenceWidth,
    headingLineHeight: original.headingLineHeight,
    bodyLineHeight: original.bodyLineHeight,
    borderRadius: original.borderRadius,
    borderWidth: original.borderWidth,
    safeMargin: original.safeMargin,
  };
}

export function templatePreviewTheme(preset: TemplatePreset, dark: boolean, category?: string): TemplateThemeInput {
  const theme = templatePresets[preset];
  if (!dark) return preset === 'elg' && category === 'Text'
    ? { ...theme, headingBackground: theme.accentBackground, accentTextMix: 1 }
    : theme;
  const palette = resolveTemplateTheme(theme);
  return {
    ...theme,
    background: preset === 'elg' ? palette.accentBackground : palette.inverseBackground,
    textColor: palette.inverseTextColor,
    cardBackground: palette.inverseBackground,
    mutedColor: preset === 'elg' ? palette.inverseTextColor : '#a3a3a3',
    borderColor: preset === 'elg' ? palette.inverseTextColor : '#737373',
    positiveColor: palette.inverseTextColor,
    negativeColor: preset === 'elg' ? palette.inverseTextColor : palette.negativeColor,
    accentColors: preset === 'elg' ? palette.accentColors : ['#ffffff', '#d4d4d4', '#a3a3a3', '#e5e5e5', '#bdbdbd'],
  };
}

export function scaleThemeSize(theme: TemplateTheme, value: number, width: number): number {
  return theme.referenceWidth > 0 ? value * width / theme.referenceWidth : value;
}

export function textHeadingSize(theme: TemplateTheme, width: number): number {
  return scaleThemeSize(theme, theme.headingSize, width) * theme.textHeadingScale;
}

export function templateHeadingStyle(theme: TemplateTheme): CSSProperties {
  return theme.headingBackground ? {
    backgroundImage: theme.headingBackground,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  } : { color: theme.textColor };
}

export function templateCanvasStyle(theme: TemplateTheme, width: number, height: number): CSSProperties {
  return {
    justifyContent: 'center', alignItems: 'center', background: theme.background,
    boxSizing: 'border-box', padding: `${height * theme.safeMargin}px ${width * theme.safeMargin}px`,
  };
}

export function entranceProgress(
  frame: number,
  fps: number,
  theme: TemplateTheme,
  delay = 0,
  originalSpring = { stiffness: 200, damping: 15 },
): number {
  if (theme.motion.kind === 'gentle') {
    return interpolate(frame - delay, [0, Math.max(1, theme.motion.durationFrames * fps / 30)], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    });
  }
  return spring({
    frame: frame - delay,
    fps,
    config: theme.motion.kind === 'original' ? originalSpring : {
      stiffness: theme.motion.stiffness,
      damping: theme.motion.kind === 'punch' ? 10 : theme.motion.damping,
    },
  });
}

export function templateEffectProgress(
  frame: number,
  fps: number,
  theme: TemplateTheme,
  delay = 0,
  originalSpring = { stiffness: 200, damping: 15 },
): number {
  if (theme.motion.preserveEffects && theme.motion.kind === 'gentle') {
    return spring({ frame: frame - delay, fps, config: originalSpring });
  }
  return entranceProgress(frame, fps, theme, delay, originalSpring);
}