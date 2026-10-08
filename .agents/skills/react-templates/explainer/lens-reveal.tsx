import type { ReactNode } from 'react';
import { AbsoluteFill, Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  outside?: ReactNode;
  inside?: ReactNode;
  label?: string;
  check?: boolean;
  lensX?: number;
  lensY?: number;
  lensSize?: number;
  drawSeconds?: number;
  moveSeconds?: number;
  insideSeconds?: number;
  labelSeconds?: number;
  checkSeconds?: number;
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
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

function gearPath(cx: number, cy: number, outer: number, inner: number, teeth: number, turn: number): string {
  const step = 360 / teeth;
  const point = (radius: number, degrees: number) => {
    const angle = (degrees + turn) * Math.PI / 180;
    return `${(cx + radius * Math.cos(angle)).toFixed(2)} ${(cy + radius * Math.sin(angle)).toFixed(2)}`;
  };
  return Array.from({ length: teeth }, (_, tooth) => {
    const center = tooth * step;
    return [point(inner, center - 0.3 * step), point(outer, center - 0.17 * step), point(outer, center + 0.17 * step), point(inner, center + 0.3 * step)].join(' L ');
  }).map((teethPoints, index) => `${index === 0 ? 'M' : 'L'} ${teethPoints}`).join(' ') + ' Z';
}

export function LensReveal({
  theme, outside, inside, label = 'How it works', check = true, lensX = 0.5, lensY = 0.5, lensSize = 0.3,
  drawSeconds = 0.2, moveSeconds = 0.6, insideSeconds = 1.6, labelSeconds = 2.2, checkSeconds = 2.6,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 26, bodySize: 20, secondarySize: 18,
    headingLineHeight: 1.1, bodyLineHeight: 1.35, borderRadius: 999, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const ramp = (start: number, seconds: number, easing = easeOut) => interpolate(time, [start, start + seconds], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing,
  });
  const pop = (start: number) => {
    const startFrame = Math.round(start * fps);
    return frame < startFrame ? 0 : spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  };
  const card = appearance.cardBackground;
  const ink = appearance.textColor;
  const stage = (portrait ? 400 : 330) * scale;
  const move = ramp(moveSeconds, 1.2, easeInOut);
  const cx = stage * (0.82 + (lensX - 0.82) * move);
  const cy = stage * (0.8 + (lensY - 0.8) * move);
  const r = stage * lensSize;
  const draw = ramp(drawSeconds, 0.6);
  const insideIn = ramp(insideSeconds, 0.5);
  const checkIn = check ? pop(checkSeconds) : 0;
  const labelIn = pop(labelSeconds);
  const gearColor = appearance.accentColors.find(color => contrast(color, ink) >= 3) ?? card;
  const badge = appearance.accentColors.find(color => contrast(color, card) >= 3) ?? ink;
  const turn = time * 40;
  const highlight = (degrees: number) => [cx + 0.72 * r * Math.cos(degrees * Math.PI / 180), cy + 0.72 * r * Math.sin(degrees * Math.PI / 180)];
  const [arcStartX, arcStartY] = highlight(200);
  const [arcEndX, arcEndY] = highlight(250);
  const handle = Math.max(0, draw * 2 - 1);

  const sampleOutside = <svg viewBox="0 0 400 400" width="100%" height="100%" role="img" aria-label="Clock face">
    <circle cx={200} cy={200} r={170} fill={card} stroke={ink} strokeWidth={10} />
    {Array.from({ length: 12 }, (_, hour) => {
      const angle = hour * Math.PI / 6;
      return <line key={hour} x1={200 + 136 * Math.sin(angle)} y1={200 - 136 * Math.cos(angle)} x2={200 + 154 * Math.sin(angle)}
        y2={200 - 154 * Math.cos(angle)} stroke={ink} strokeWidth={hour % 3 === 0 ? 10 : 6} strokeLinecap="round" />;
    })}
    <line x1={200} y1={200} x2={200 + 80 * Math.sin(-1.05)} y2={200 - 80 * Math.cos(-1.05)} stroke={ink} strokeWidth={12} strokeLinecap="round" />
    <line x1={200} y1={200} x2={200 + 118 * Math.sin(1.05)} y2={200 - 118 * Math.cos(1.05)} stroke={ink} strokeWidth={8} strokeLinecap="round" />
    <circle cx={200} cy={200} r={11} fill={ink} />
  </svg>;
  const sampleInside = <svg viewBox="0 0 400 400" width="100%" height="100%" role="img" aria-label="Gears inside the clock">
    <circle cx={200} cy={200} r={170} fill={ink} />
    <path d={gearPath(168, 178, 78, 62, 12, turn)} fill={gearColor} />
    <circle cx={168} cy={178} r={20} fill={ink} />
    <path d={gearPath(262, 262, 56, 42, 9, 20 - turn * 12 / 9)} fill={card} />
    <circle cx={262} cy={262} r={15} fill={ink} />
  </svg>;

  return <AbsoluteFill data-template="lens-reveal" style={{ background: appearance.background, alignItems: 'center', justifyContent: 'center', gap: 24 * scale }}>
    <div data-stage style={{ position: 'relative', width: stage, height: stage, flexShrink: 0 }}>
      <AbsoluteFill>{outside ?? sampleOutside}</AbsoluteFill>
      {insideIn > 0 && <AbsoluteFill data-inside style={{ clipPath: `circle(${r}px at ${cx}px ${cy}px)`, opacity: insideIn }}>
        <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, scale: '1.15' }}>{inside ?? sampleInside}</AbsoluteFill>
      </AbsoluteFill>}
      {draw > 0 && <svg data-lens width={stage} height={stage} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle cx={cx} cy={cy} r={r} fill={card} opacity={0.18 * draw * (1 - insideIn)} />
        <path d={`M ${arcStartX} ${arcStartY} A ${0.72 * r} ${0.72 * r} 0 0 1 ${arcEndX} ${arcEndY}`} fill="none" stroke={card}
          strokeWidth={r * 0.07} strokeLinecap="round" opacity={0.8 * draw * (1 - insideIn)} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={ink} strokeWidth={Math.max(4 * scale, r * 0.1)} pathLength={1}
          strokeDasharray="1 1" strokeDashoffset={1 - draw} />
        {handle > 0 && <line x1={cx + r * Math.SQRT1_2} y1={cy + r * Math.SQRT1_2} x2={cx + r * (1 + 0.85 * handle) * Math.SQRT1_2}
          y2={cy + r * (1 + 0.85 * handle) * Math.SQRT1_2} stroke={ink} strokeWidth={r * 0.2} strokeLinecap="round" />}
      </svg>}
      {checkIn > 0 && <div data-check style={{ position: 'absolute', left: cx + r * Math.SQRT1_2, top: cy - r * Math.SQRT1_2, width: r * 0.5, height: r * 0.5,
        translate: '-50% -50%', scale: String(checkIn), borderRadius: '50%', background: badge, display: 'grid', placeItems: 'center' }}>
        <svg viewBox="-30 -30 60 60" width="62%" height="62%" role="img" aria-label="Correct">
          <path d="M -15 1 L -4 12 L 16 -11" fill="none" stroke={card} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>}
    </div>
    <div data-label style={{ opacity: Math.min(1, labelIn * 1.4), scale: String(0.6 + 0.4 * labelIn), padding: `${7 * scale}px ${16 * scale}px`,
      borderRadius: 999, background: ink, color: card, fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight,
      fontSize: 26 * scale, lineHeight: 1.1, letterSpacing: 0, whiteSpace: 'nowrap' }}>{label}</div>
  </AbsoluteFill>;
}
