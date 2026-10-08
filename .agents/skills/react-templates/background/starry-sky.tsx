import type { ReactNode } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  children?: ReactNode;
  stars?: number;
  brightness?: number;
  diveSeconds?: number;
  diveDurationSeconds?: number;
};

const WARP = Array.from({ length: 140 }, (_, index) => ({
  angle: random(`sky-warp-angle-${index}`) * Math.PI * 2, offset: random(`sky-warp-offset-${index}`), size: 2 + random(`sky-warp-size-${index}`) * 4,
}));

export function StarrySky({ theme, children, stars = 110, brightness = 1, diveSeconds, diveDurationSeconds = 1.6 }: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 42, bodySize: 24, secondarySize: 18,
    headingLineHeight: 1.18, bodyLineHeight: 1.35, borderRadius: 8, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  if (diveSeconds !== undefined && diveDurationSeconds < 1) throw new Error('diveDurationSeconds must be at least 1 second.');
  const time = frame / fps;
  const unit = Math.min(width, height) / 1080;
  const speedAt = (seconds: number) => diveSeconds === undefined ? 0 : interpolate(seconds,
    [diveSeconds, diveSeconds + 0.35, diveSeconds + diveDurationSeconds - 0.5, diveSeconds + diveDurationSeconds], [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  let travel = 0;
  if (diveSeconds !== undefined) for (let step = 0; step <= frame; step++) travel += speedAt(step / fps) * 0.42 / fps;
  const speed = speedAt(time);
  const centerX = width / 2;
  const centerY = height / 2;
  const reach = Math.hypot(centerX, centerY);

  return <AbsoluteFill data-template="starry-sky" style={{ background: appearance.inverseBackground, overflow: 'hidden' }}>
    {Array.from({ length: Math.max(0, Math.round(stars)) }, (_, index) => {
      const size = (2 + random(`sky-size-${index}`) * 5) * unit;
      const period = 0.4 + (index % 9) * 0.1;
      const twinkle = 0.3 + 0.7 * Math.abs(Math.sin(time / period + index));
      return <div key={index} data-star={index} style={{ position: 'absolute', left: random(`sky-x-${index}`) * width,
        top: ((random(`sky-y-${index}`) * (height + 100) - time * 7.5 * unit) % (height + 100) + height + 100) % (height + 100) - 50,
        width: size, height: size, borderRadius: '50%', background: appearance.inverseTextColor,
        opacity: Math.min(1, twinkle * 0.8 * brightness) * (1 - speed) }} />;
    })}
    {speed > 0 && <svg data-warp width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
      {WARP.map((star, index) => {
        const position = (star.offset + travel) % 1;
        const distance = reach * (0.06 + 0.94 * position * position);
        const tail = distance * (1 - 0.14 * speed);
        return <line key={index} x1={centerX + tail * Math.cos(star.angle)} y1={centerY + tail * Math.sin(star.angle)}
          x2={centerX + distance * Math.cos(star.angle) + 0.01} y2={centerY + distance * Math.sin(star.angle)}
          stroke={appearance.inverseTextColor} strokeWidth={star.size * unit} strokeLinecap="round" opacity={Math.min(1, position * 3) * speed * brightness} />;
      })}
    </svg>}
    {children !== undefined && <AbsoluteFill>{children}</AbsoluteFill>}
  </AbsoluteFill>;
}
