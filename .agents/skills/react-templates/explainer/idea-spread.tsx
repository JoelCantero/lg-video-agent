import { type CSSProperties } from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

type Props = ThemedTemplateProps & {
  idea?: string;
  label?: string;
  shrinkSeconds?: number;
  spreadSeconds?: number;
  copyStaggerSeconds?: number;
  labelSeconds?: number;
};

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export function IdeaSpread({
  theme, idea = 'Science and faith are incompatible', label = 'A widespread idea',
  shrinkSeconds = 1.2, spreadSeconds = 1.7, copyStaggerSeconds = 0.06, labelSeconds = 2.5,
}: Props) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const appearance = resolveTemplateAppearance(theme, {
    headingFont: 'Urbanist, sans-serif', bodyFont: 'Open Sans, sans-serif',
    headingWeight: 700, headingSize: 34, bodySize: 24, secondarySize: 18,
    headingLineHeight: 1.12, bodyLineHeight: 1.1, borderRadius: 18, safeMargin: 0.08,
  });
  useTemplateFonts(appearance);
  const portrait = height > width;
  const scale = Math.min(width / (portrait ? 540 : 960), height / (portrait ? 960 : 540));
  const time = frame / fps;
  const pop = (start: number) => {
    const startFrame = Math.round(start * fps);
    return frame < startFrame ? 0 : spring({ frame: frame - startFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.7 } });
  };
  const columns = portrait ? 3 : 5;
  const rows = 3;
  const cardWidth = (portrait ? 420 : 520) * scale;
  const cardHeight = (portrait ? 250 : 270) * scale;
  const labelSpace = 70 * scale;
  const cellWidth = width * 0.84 / columns;
  const cellHeight = (height * 0.84 - labelSpace) / rows;
  const small = Math.min(cellWidth * 0.86 / cardWidth, cellHeight * 0.86 / cardHeight);
  const cell = (column: number, row: number) => ({ x: width * 0.08 + (column + 0.5) * cellWidth, y: height * 0.08 + (row + 0.5) * cellHeight });
  const middle = { column: Math.floor(columns / 2), row: 1 };
  const copies = Array.from({ length: columns * rows }, (_, index) => ({ column: index % columns, row: Math.floor(index / columns) }))
    .filter(({ column, row }) => column !== middle.column || row !== middle.row)
    .sort((a, b) => Math.hypot(a.column - middle.column, a.row - middle.row) - Math.hypot(b.column - middle.column, b.row - middle.row));
  const shrink = interpolate(time, [shrinkSeconds, shrinkSeconds + 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut });
  const enter = pop(0.2);
  const labelIn = pop(labelSeconds);
  const ideaCard = (x: number, y: number, size: number, opacity: number, copy: boolean): CSSProperties => ({
    position: 'absolute', left: x, top: y, width: cardWidth, height: cardHeight, boxSizing: 'border-box', translate: '-50% -50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${20 * scale}px ${24 * scale}px`, borderRadius: 18 * scale,
    background: appearance.cardBackground, color: appearance.textColor, border: `${Math.max(1, 2 * scale)}px solid ${appearance.borderColor}`,
    fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight, fontSize: 34 * scale, lineHeight: 1.12, letterSpacing: 0,
    textAlign: 'center', overflowWrap: 'anywhere', scale: String(size), opacity, pointerEvents: copy ? 'none' : undefined,
  });
  const center = cell(middle.column, middle.row);

  return <AbsoluteFill data-template="idea-spread" style={{ background: appearance.background, overflow: 'hidden' }}>
    {copies.map(({ column, row }, index) => {
      const shown = pop(spreadSeconds + index * copyStaggerSeconds);
      if (shown <= 0) return null;
      const { x, y } = cell(column, row);
      return <div key={index} data-copy={index} aria-hidden="true" style={ideaCard(x, y, small * (0.3 + 0.7 * shown), Math.min(1, shown * 1.5), true)}>{idea}</div>;
    })}
    <div data-idea style={ideaCard(center.x, center.y, (0.6 + 0.4 * enter) * (1 - (1 - small) * shrink), Math.min(1, enter * 1.5), false)}>{idea}</div>
    <div data-label style={{ position: 'absolute', left: '50%', bottom: height * 0.08 + 10 * scale, translate: '-50% 0px',
      scale: String(0.6 + 0.4 * labelIn), opacity: Math.min(1, labelIn * 1.4), padding: `${8 * scale}px ${18 * scale}px`, borderRadius: 999,
      background: appearance.textColor, color: appearance.cardBackground, fontFamily: appearance.headingFont, fontWeight: appearance.headingWeight,
      fontSize: 26 * scale, lineHeight: 1.1, letterSpacing: 0, whiteSpace: 'nowrap' }}>{label}</div>
  </AbsoluteFill>;
}
