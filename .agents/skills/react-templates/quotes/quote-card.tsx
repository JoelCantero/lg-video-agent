import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, scaleThemeSize, templateCanvasStyle, templateEffectProgress, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const QuoteCard: React.FC<{
  text?: string; variant?: string; textColor?: string; authorName?: string; authorRole?: string;
} & ThemedTemplateProps> = ({
  text = 'This changed everything for our team.', authorName = 'Sarah Chen', authorRole = 'CEO, Acme Inc.', textColor, theme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const style = resolveTemplateAppearance({ ...theme, ...(textColor ? { textColor } : {}) }, {
    headingSize: 22, headingWeight: 600, headingLineHeight: 1.5, bodySize: 13, bodyWeight: 600,
    secondarySize: 11, background: '#fafafa', mutedColor: '#a3a3a3', letterSpacing: '-0.02em',
  });
  useTemplateFonts(style);
  const size = (value: number) => scaleThemeSize(style, value, width);
  const card = templateEffectProgress(frame, fps, style, 0, { stiffness: 180, damping: 18 });
  const quote = templateEffectProgress(frame, fps, style, 10, { stiffness: 200, damping: 20 });
  const author = templateEffectProgress(frame, fps, style, 25, { stiffness: 200, damping: 20 });

  return <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
    <div style={{
      width: 480,
      maxWidth: '100%', padding: 36,
      background: style.cardBackground, borderRadius: style.borderRadius,
      border: `${style.borderWidth}px solid ${style.borderColor}`, boxSizing: 'border-box',
      opacity: card, transform: `translateY(${(1 - card) * size(16)}px)`,
    }}>
      <div style={{ fontSize: size(48), color: style.borderColor, fontFamily: 'Georgia, serif', lineHeight: 0.5, marginBottom: 16, fontWeight: style.headingWeight }}>{'"'}</div>
      <p style={{
        margin: 0, fontSize: size(style.headingSize), fontWeight: style.headingWeight,
        color: style.textColor, lineHeight: style.headingLineHeight, fontFamily: style.headingFont,
        opacity: quote, transform: `translateY(${(1 - quote) * size(8)}px)`, letterSpacing: style.letterSpacing,
      }}>{text}</p>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10, opacity: author }}>
        <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: style.borderRadius / 3, background: style.borderColor }} />
        <div>
          <div style={{ fontSize: size(style.bodySize), fontWeight: theme?.headingWeight ?? 600, color: style.textColor, fontFamily: style.bodyFont, letterSpacing: style.letterSpacing }}>{authorName}</div>
          <div style={{ fontSize: size(style.secondarySize), color: style.mutedColor, fontFamily: style.bodyFont, letterSpacing: style.letterSpacing }}>{authorRole}</div>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};