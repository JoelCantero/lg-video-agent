import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  content?: ReactNode;
  fraction?: number;
  label?: string;
  outlineSeconds?: number;
  revealSeconds?: number;
  revealDurationSeconds?: number;
  labelSeconds?: number;
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const STARS = Array.from({ length: 70 }, (_, index) => ({
  x: random(`partial-star-x-${index}`), y: random(`partial-star-y-${index}`), size: 0.006 + random(`partial-star-size-${index}`) * 0.012,
}));

export function PartialReveal({
  theme, content, fraction = 0.42, label = 'Partially',
  outlineSeconds = 0.2, revealSeconds = 0.7, revealDurationSeconds = 1.4, labelSeconds = 2.2,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 26, bodySize: 20, secondarySize: 18,
    headingLineHeight: 1.1, bodyLineHeight: 1.35, borderRadius: 999, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  if (!(fraction > 0 && fraction <= 1)) throw new Error('fraction must be greater than 0 and at most 1.');
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const ramp = (start: number, seconds: number) => interpolate(time, [start, start + seconds], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut,
  });
  const labelFrame = Math.round(labelSeconds * fps);
  const labelIn = frame < labelFrame ? 0 : spring({ frame: frame - labelFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  const size = (portrait ? 400 : 330) * scale;
  const radius = size / 2;
  const degrees = 360 * fraction * ramp(revealSeconds, revealDurationSeconds);
  const mask = `conic-gradient(#000 0deg ${degrees}deg, transparent ${degrees}deg 360deg)`;
  const end = (degrees - 90) * Math.PI / 180;
  const wedge = degrees >= 359.9
    ? `M ${radius} 0 A ${radius} ${radius} 0 1 1 ${radius} ${size} A ${radius} ${radius} 0 1 1 ${radius} 0 Z`
    : `M ${radius} ${radius} L ${radius} 0 A ${radius} ${radius} 0 ${degrees > 180 ? 1 : 0} 1 ${radius + radius * Math.cos(end)} ${radius + radius * Math.sin(end)} Z`;
  const sample = <AbsoluteFill style={{ background: appearance.inverseBackground }}>
    {STARS.map((star, index) => <div key={index} style={{ position: 'absolute', left: star.x * size, top: star.y * size, width: star.size * size,
      height: star.size * size, borderRadius: '50%', background: appearance.inverseTextColor, opacity: 0.4 + 0.6 * Math.abs(Math.sin(time * 2 + index)) }} />)}
  </AbsoluteFill>;

  return <AbsoluteFill data-template="partial-reveal" style={{ background: appearance.background, alignItems: 'center', justifyContent: 'center', gap: 26 * scale }}>
    <div data-disc style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle cx={radius} cy={radius} r={radius - 1.5 * scale} fill="none" stroke={appearance.textColor} strokeWidth={3 * scale}
          strokeDasharray={`${9 * scale} ${7 * scale}`} opacity={ramp(outlineSeconds, 0.5)} />
      </svg>
      {degrees > 0 && <div data-reveal={Math.round(degrees * 10) / 10} style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden',
        maskImage: mask, WebkitMaskImage: mask }}>{content ?? sample}</div>}
      {degrees > 0 && <svg width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <path d={wedge} fill="none" stroke={appearance.inverseTextColor} strokeWidth={4 * scale} strokeLinejoin="round" />
      </svg>}
    </div>
    <div data-label style={{ opacity: Math.min(1, labelIn * 1.4), scale: String(0.6 + 0.4 * labelIn), padding: `${7 * scale}px ${16 * scale}px`,
      borderRadius: 999, background: appearance.textColor, color: appearance.cardBackground, fontFamily: appearance.headingFont,
      fontWeight: appearance.headingWeight, fontSize: 26 * scale, lineHeight: 1.1, letterSpacing: 0, whiteSpace: 'nowrap' }}>{label}</div>
  </AbsoluteFill>;
}
