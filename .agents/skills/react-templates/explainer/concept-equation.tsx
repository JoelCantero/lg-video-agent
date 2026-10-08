import { type CSSProperties } from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Operator = '≠' | '=' | '+';

type Props = ThemedTemplateProps & {
  left?: string;
  operator?: Operator;
  right?: string;
  result?: string;
  leftSeconds?: number;
  operatorSeconds?: number;
  rightSeconds?: number;
  resultSeconds?: number;
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const SYMBOLS: Record<Operator, { label: string; lines: Array<[number, number, number, number]> }> = {
  '≠': { label: 'is not', lines: [[18, 38, 82, 38], [18, 62, 82, 62], [64, 14, 36, 86]] },
  '=': { label: 'equals', lines: [[18, 38, 82, 38], [18, 62, 82, 62]] },
  '+': { label: 'plus', lines: [[18, 50, 82, 50], [50, 18, 50, 82]] },
};

export function ConceptEquation({
  theme, left = 'Admiring creation', operator = '≠', right = 'Knowing the Creator personally', result,
  leftSeconds = 0.3, operatorSeconds = 1, rightSeconds = 1.6, resultSeconds = 2.4,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 30, bodySize: 26, secondarySize: 18,
    headingLineHeight: 1.12, bodyLineHeight: 1.12, borderRadius: 14, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const ramp = (start: number, seconds: number) => interpolate(time, [start, start + seconds], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut,
  });
  const pop = (start: number) => {
    const startFrame = Math.round(start * fps);
    return frame < startFrame ? 0 : spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  };
  const card = appearance.cardBackground;
  const ink = appearance.textColor;
  const cardWidth = portrait ? 400 : result ? 200 : 300;
  const box = (name: string, content: string, start: number, emphasis: boolean) => {
    const shown = pop(start);
    const style: CSSProperties = {
      boxSizing: 'border-box', maxWidth: cardWidth * scale, padding: `${16 * scale}px ${22 * scale}px`, borderRadius: 14 * scale,
      background: emphasis ? ink : card, color: emphasis ? card : ink, border: `${Math.max(1, scale)}px solid ${emphasis ? ink : appearance.borderColor}`,
      fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: (portrait ? 30 : 26) * scale, lineHeight: 1.12,
      letterSpacing: 0, textAlign: 'center', overflowWrap: 'anywhere', opacity: Math.min(1, shown * 1.4), scale: String(0.7 + 0.3 * shown),
    };
    return <div data-card={name} style={style}>{content}</div>;
  };
  const symbol = (name: string, kind: Operator, start: number) => <svg data-operator={name} role="img" aria-label={SYMBOLS[kind].label}
    viewBox="0 0 100 100" width={56 * scale} height={56 * scale} style={{ flexShrink: 0, overflow: 'visible' }}>
    {SYMBOLS[kind].lines.map(([x1, y1, x2, y2], index) => <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={11}
      strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ramp(start + index * 0.12, 0.3)} />)}
  </svg>;

  return <AbsoluteFill data-template="concept-equation" style={{ background: appearance.background, alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ display: 'flex', flexDirection: portrait ? 'column' : 'row', alignItems: 'center', gap: 20 * scale }}>
      {box('left', left, leftSeconds, false)}
      {symbol('operator', operator, operatorSeconds)}
      {box('right', right, rightSeconds, !result)}
      {result && symbol('equals', '=', resultSeconds)}
      {result && box('result', result, resultSeconds + 0.35, true)}
    </div>
  </AbsoluteFill>;
}
