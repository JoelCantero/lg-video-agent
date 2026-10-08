import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, scaleThemeSize, templateCanvasStyle, templateEffectProgress, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const TestimonialCard: React.FC<{
  quote?: string; name?: string; role?: string; textColor?: string; bgColor?: string; variant?: string;
} & ThemedTemplateProps> = ({
  quote = 'This product completely changed how we work. The team shipped 3x faster in the first month.',
  name = 'Sarah Chen', role = 'CTO at Acme', textColor, bgColor, theme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const background = bgColor ?? theme?.background ?? '#fafafa';
  const isDark = ['#000000', '#171717', '#0a0a0a'].includes(background);
  const style = resolveTemplateAppearance({ ...theme, ...(textColor ? { textColor } : {}), ...(bgColor ? { background: bgColor } : {}) }, {
    headingSize: 22, headingWeight: 500, headingLineHeight: 1.6, bodySize: 16, secondarySize: 14,
    background: '#fafafa', cardBackground: isDark ? '#1a1a1a' : '#ffffff',
    borderColor: isDark ? '#333333' : '#e5e5e5', mutedColor: isDark ? '#737373' : '#a3a3a3',
    letterSpacing: '-0.02em', borderRadius: 16,
  });
  useTemplateFonts(style);
  const size = (value: number) => scaleThemeSize(style, value, width);
  const card = templateEffectProgress(frame, fps, style, 3, { stiffness: 160, damping: 16 });
  const quoteProgress = templateEffectProgress(frame, fps, style, 12, { stiffness: 140, damping: 18 });
  const avatar = templateEffectProgress(frame, fps, style, 25, { stiffness: 200, damping: 14 });
  const author = templateEffectProgress(frame, fps, style, 30, { stiffness: 180, damping: 16 });

  return <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
    <div style={{
      width: 620,
      maxWidth: '100%', padding: 48,
      borderRadius: style.borderRadius, background: style.cardBackground,
      border: `${style.borderWidth}px solid ${style.borderColor}`, boxSizing: 'border-box',
      boxShadow: isDark ? '0 24px 48px rgba(0,0,0,0.4)' : '0 24px 48px rgba(0,0,0,0.08)',
      opacity: card, transform: `scale(${0.92 + card * 0.08})`, backdropFilter: 'blur(20px)',
    }}>
      <div style={{ fontSize: 64, lineHeight: 1, color: style.textColor, opacity: 0.15, fontFamily: 'Georgia, serif', marginBottom: -20 }}>{'\u201C'}</div>
      <p style={{
        margin: '0 0 32px', fontSize: size(style.headingSize), lineHeight: style.headingLineHeight,
        color: style.textColor, fontFamily: style.headingFont, fontWeight: style.headingWeight,
        opacity: quoteProgress, transform: `translateY(${(1 - quoteProgress) * size(10)}px)`, letterSpacing: style.letterSpacing,
      }}>{quote}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 48, height: 48, flexShrink: 0, borderRadius: 999, background: style.textColor,
          opacity: avatar, transform: `scale(${avatar})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color: style.cardBackground, fontFamily: style.headingFont,
        }}>{name.charAt(0)}</div>
        <div style={{ opacity: author, transform: `translateX(${(1 - author) * -size(8)}px)` }}>
          <div style={{ fontSize: size(style.bodySize), fontWeight: theme?.headingWeight ?? 700, color: style.textColor, fontFamily: style.bodyFont }}>{name}</div>
          <div style={{ fontSize: size(style.secondarySize), color: style.mutedColor, fontFamily: style.bodyFont }}>{role}</div>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};