import { Fragment, type CSSProperties } from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Row = { cause: string; effect: string };

type Props = ThemedTemplateProps & {
  causeLabel?: string;
  effectLabel?: string;
  rows?: Row[];
  rowSeconds?: number;
  rowStaggerSeconds?: number;
  growSeconds?: number;
};

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

function luminance(color: string): number {
  const channels = (interpolateColors(0, [0, 1], [color, color]).match(/[\d.]+/g) ?? []).slice(0, 3).map(value => {
    const channel = Number(value) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

const contrast = (first: string, second: string) => {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};

export function TheMoreTheMore({
  theme, causeLabel = 'The more we understand', effectLabel = 'the more we admire',
  rows = [{ cause: 'Architecture', effect: 'Gaudí' }, { cause: 'Engineering', effect: 'A great inventor' }],
  rowSeconds = 0.4, rowStaggerSeconds = 2.2, growSeconds = 1.6,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 28, bodySize: 24, secondarySize: 18,
    headingLineHeight: 1.1, bodyLineHeight: 1.1, borderRadius: 14, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  if (rows.length < 1 || rows.length > 3) throw new Error('TheMoreTheMore needs one to three rows.');
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const pop = (start: number) => {
    const startFrame = Math.round(start * fps);
    return frame < startFrame ? 0 : spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  };
  const card = appearance.cardBackground;
  const ink = appearance.textColor;
  const bar = appearance.accentColors.find(color => contrast(color, card) >= 3) ?? ink;
  const columns = portrait ? { cause: 196, arrow: 44, effect: 200 } : { cause: 300, arrow: 64, effect: 300 };
  const text: CSSProperties = { fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, letterSpacing: 0, overflowWrap: 'anywhere' };
  const header: CSSProperties = { ...text, fontSize: 18 * scale, lineHeight: 1.1, textAlign: 'center', padding: `${6 * scale}px ${12 * scale}px`,
    borderRadius: 999, background: card, color: ink, border: `${Math.max(1, scale)}px solid ${appearance.borderColor}` };

  return <AbsoluteFill data-template="the-more-the-more" style={{ background: appearance.background, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'grid', gridTemplateColumns: `${columns.cause * scale}px ${columns.arrow * scale}px ${columns.effect * scale}px`,
      rowGap: (portrait ? 34 : 22) * scale, alignItems: 'center', justifyItems: 'center' }}>
      <div data-header="cause" style={header}>{causeLabel}</div>
      <div />
      <div data-header="effect" style={header}>{effectLabel}</div>
      {rows.map((row, index) => {
        const start = rowSeconds + index * rowStaggerSeconds;
        const grow = interpolate(time, [start, start + growSeconds], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut });
        const enter = pop(start);
        const effectIn = pop(start + 0.15);
        const tip = 6 + 30 * grow;
        return <Fragment key={index}>
          <div data-cause={index} style={{ width: '100%', boxSizing: 'border-box', padding: `${14 * scale}px ${16 * scale}px`, borderRadius: 14 * scale,
            background: card, border: `${Math.max(1, scale)}px solid ${appearance.borderColor}`,
            opacity: Math.min(1, enter * 1.4), scale: String(0.85 + 0.15 * enter) }}>
            <div style={{ ...text, fontSize: 24 * scale, lineHeight: 1.1, color: ink }}>{row.cause}</div>
            <div style={{ marginTop: 12 * scale, height: 10 * scale, borderRadius: 5 * scale, background: `color-mix(in srgb, ${appearance.borderColor} 30%, transparent)` }}>
              <div data-bar={index} style={{ width: `${grow * 100}%`, height: '100%', borderRadius: 5 * scale, background: bar }} />
            </div>
          </div>
          <svg data-arrow={index} viewBox="0 0 44 30" width={columns.arrow * scale} height={30 * scale} style={{ overflow: 'visible', opacity: Math.min(1, enter * 1.4) }}>
            <line x1={6} y1={15} x2={tip} y2={15} stroke={ink} strokeWidth={4} strokeLinecap="round" />
            <polyline points={`${tip - 8},7 ${tip},15 ${tip - 8},23`} fill="none" stroke={ink} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={grow > 0.2 ? 1 : 0} />
          </svg>
          <div data-effect={index} style={{ ...text, boxSizing: 'border-box', maxWidth: columns.effect * scale / 1.25, padding: `${12 * scale}px ${18 * scale}px`,
            borderRadius: 18 * scale, background: ink, color: card, fontSize: 28 * scale, lineHeight: 1.1, textAlign: 'center',
            opacity: Math.min(1, effectIn * 1.4), scale: String(0.6 + 0.65 * grow) }}>{row.effect}</div>
        </Fragment>;
      })}
    </div>
  </AbsoluteFill>;
}
