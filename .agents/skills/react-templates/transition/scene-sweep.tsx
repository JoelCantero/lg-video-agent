import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  before?: ReactNode;
  after?: ReactNode;
  cutSeconds?: number;
  durationSeconds?: number;
  direction?: 'left-to-right' | 'right-to-left';
  color?: string;
};

const ANGLE = 12;

export function SceneSweep({
  theme, before, after, cutSeconds, durationSeconds = 16 / 30, direction = 'left-to-right', color,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 40, bodySize: 20, secondarySize: 16,
    headingLineHeight: 1.1, bodyLineHeight: 1.35, borderRadius: 8, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const cut = Math.round((cutSeconds ?? durationInFrames / fps / 2) * fps);
  const half = Math.max(1, durationSeconds * fps / 2);
  const progress = interpolate(frame, [cut - half, cut + half], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.7, 0, 0.3, 1),
  });
  const sign = direction === 'left-to-right' ? 1 : -1;
  const tan = Math.tan(ANGLE * Math.PI / 180);
  const cos = Math.cos(ANGLE * Math.PI / 180);
  // Wide enough to cover every row of the frame when centred on the cut, with 8% slack.
  const mainWidth = (width + height * tan) * cos * 1.08;
  const reach = (mainWidth / cos + height * tan) / 2 + width * 0.1;
  const band = (name: string, position: number, bandWidth: number, opacity: number) => {
    const center = -reach + Math.min(1, position) * (width + 2 * reach);
    return <div data-band={name} style={{ position: 'absolute', top: -height, height: height * 3,
      left: (sign === 1 ? center : width - center) - bandWidth / 2, width: bandWidth,
      background: color ?? appearance.textColor, opacity, rotate: `${ANGLE * sign}deg` }} />;
  };
  const sample = (text: string) => <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ padding: `${24 * scale}px ${36 * scale}px`, borderRadius: 8 * scale, background: appearance.cardBackground,
      color: appearance.textColor, border: `${Math.max(1, scale)}px solid ${appearance.borderColor}`,
      fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: 40 * scale, lineHeight: 1.1, letterSpacing: 0 }}>{text}</div>
  </AbsoluteFill>;
  const showAfter = frame >= cut;

  return <AbsoluteFill data-template="scene-sweep" style={{ background: appearance.background, overflow: 'hidden' }}>
    <AbsoluteFill data-scene={showAfter ? 'after' : 'before'}>
      {showAfter ? (after === undefined ? sample('Next scene') : after) : (before === undefined ? sample('Previous scene') : before)}
    </AbsoluteFill>
    {progress > 0 && progress < 1 && <>
      {band('lead', progress * 1.1, 75 * scale, 0.55)}
      {band('main', progress, mainWidth, 1)}
      {band('trail', progress * 0.92, 30 * scale, 0.7)}
    </>}
  </AbsoluteFill>;
}
