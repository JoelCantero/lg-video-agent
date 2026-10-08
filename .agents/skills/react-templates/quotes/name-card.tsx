import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  name?: string;
  role?: string;
  placement?: 'center' | 'lower-third';
  nameSeconds?: number;
  roleSeconds?: number;
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

export function NameCard({
  theme, name = 'John Lennox', role = 'Theologian and mathematician', placement = 'center', nameSeconds = 0.3, roleSeconds = 0.8,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 50, bodySize: 21, secondarySize: 21,
    headingLineHeight: 1.1, bodyLineHeight: 1.25, borderRadius: 18, safeMargin: 0.08,
  });
  // The role uses Open Sans Bold, so wait for that weight instead of Regular.
  useTemplateFonts({ ...appearance, bodyWeight: 700 });
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const ramp = (start: number, seconds: number) => interpolate(time, [start, start + seconds], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut,
  });
  const enter = ramp(0, 0.5);
  const reveal = ramp(nameSeconds, 0.47);
  const roleIn = ramp(roleSeconds, 0.33);
  const accent = appearance.accentColors[0] ?? appearance.textColor;
  const nameColor = appearance.accentTextMix === 1 ? accent
    : interpolateColors(appearance.accentTextMix, [0, 1], [appearance.textColor, accent]);
  const centered = placement === 'center';

  return <AbsoluteFill data-template="name-card" style={{ background: appearance.background, boxSizing: 'border-box',
    padding: `${height * 0.08}px ${width * 0.08}px`, justifyContent: centered ? 'center' : 'flex-end', alignItems: centered ? 'center' : 'flex-start' }}>
    <div data-card style={{ display: 'flex', alignItems: 'stretch', gap: 11 * scale, maxWidth: '100%',
      opacity: enter, translate: `0px ${(1 - enter) * 16 * scale}px` }}>
      <div style={{ width: 7 * scale, flexShrink: 0, borderRadius: 3.5 * scale, background: appearance.textColor }} />
      <div style={{ minWidth: 0, padding: `${15 * scale}px ${26 * scale}px ${18 * scale}px`, borderRadius: 18 * scale,
        background: appearance.cardBackground, border: `${Math.max(1, scale)}px solid ${appearance.borderColor}` }}>
        <div data-role style={{ fontFamily: appearance.bodyFont, fontWeight: 700, fontSize: 21 * scale, lineHeight: 1.25,
          letterSpacing: 0, color: appearance.textColor, opacity: roleIn, overflowWrap: 'anywhere' }}>{role}</div>
        <div data-name style={{ fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight,
          fontSize: (portrait ? 50 : 46) * scale, lineHeight: 1.1, letterSpacing: 0, color: nameColor, overflowWrap: 'anywhere',
          clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, translate: `${(1 - reveal) * -12 * scale}px 0px` }}>{name}</div>
      </div>
    </div>
  </AbsoluteFill>;
}
