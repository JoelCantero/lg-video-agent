import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, scaleThemeSize, templateCanvasStyle, templateEffectProgress, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const SocialPost: React.FC<{
  name?: string; handle?: string; text?: string; likes?: string; textColor?: string; bgColor?: string; variant?: string;
} & ThemedTemplateProps> = ({
  name = 'Acme', handle = '@acmehq',
  text = 'We just launched! After 6 months of building, our product is live. Check it out and let us know what you think.',
  likes = '2,847', textColor, bgColor, theme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const background = bgColor ?? theme?.background ?? '#f5f5f5';
  const isDark = ['#000000', '#171717', '#0a0a0a'].includes(background);
  const style = resolveTemplateAppearance({ ...theme, ...(textColor ? { textColor } : {}), ...(bgColor ? { background: bgColor } : {}) }, {
    headingSize: 16, headingWeight: 700, bodySize: 20, bodyLineHeight: 1.6, secondarySize: 14,
    background: '#f5f5f5', textColor: isDark ? '#ffffff' : '#171717',
    cardBackground: isDark ? '#1a1a1a' : '#ffffff', borderColor: isDark ? '#333333' : '#e5e5e5',
    mutedColor: isDark ? '#737373' : '#a3a3a3', letterSpacing: '-0.02em', borderRadius: 16,
  });
  useTemplateFonts(style);
  const size = (value: number) => scaleThemeSize(style, value, width);
  const card = templateEffectProgress(frame, fps, style, 2, { stiffness: 180, damping: 16 });
  const post = templateEffectProgress(frame, fps, style, 10, { stiffness: 160, damping: 18 });
  const metrics = templateEffectProgress(frame, fps, style, 25, { stiffness: 200, damping: 14 });
  const heart = templateEffectProgress(frame, fps, style, 35, { stiffness: 300, damping: 10 });
  const likesCount = parseInt(likes.replace(/,/g, ''), 10) || 0;
  const animatedLikes = Math.round(interpolate(metrics, [0, 1], [0, likesCount]));
  const metricSize = 15;

  return <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
    <div style={{
      width: 560,
      maxWidth: '100%', padding: 32, borderRadius: style.borderRadius,
      background: style.cardBackground, border: `${style.borderWidth}px solid ${style.borderColor}`,
      boxShadow: '0 12px 32px rgba(0,0,0,0.08)', boxSizing: 'border-box',
      opacity: card, transform: `scale(${0.92 + card * 0.08})`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, flexShrink: 0, borderRadius: 999, background: style.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700, color: style.cardBackground, fontFamily: style.headingFont }}>{name.charAt(0)}</div>
        <div>
          <div style={{ fontSize: size(style.headingSize), fontWeight: style.headingWeight, color: style.textColor, fontFamily: style.headingFont, letterSpacing: style.letterSpacing }}>{name}</div>
          <div style={{ fontSize: size(style.secondarySize), color: style.mutedColor, fontFamily: style.bodyFont }}>{handle}</div>
        </div>
      </div>
      <p style={{ margin: '0 0 24px', fontSize: size(style.bodySize), lineHeight: style.bodyLineHeight, color: style.textColor, fontFamily: style.bodyFont, fontWeight: style.bodyWeight, opacity: post, transform: `translateY(${(1 - post) * size(8)}px)` }}>{text}</p>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 24, paddingTop: 16, borderTop: `1px solid ${theme?.borderColor ?? (isDark ? '#262626' : '#f0f0f0')}`, opacity: metrics }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', fontSize: 18, color: style.negativeColor, transform: `scale(${1 + (heart > 0.8 ? (1 - heart) * 3 : 0)})` }}>{'\u2764'}</span>
          <span style={{ fontSize: metricSize, fontWeight: theme?.bodyWeight ?? 600, color: style.mutedColor, fontFamily: style.bodyFont }}>{animatedLikes.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: style.mutedColor, fontFamily: style.bodyFont }}><span style={{ fontSize: 16 }}>{'\uD83D\uDD01'}</span><span style={{ fontSize: metricSize }}>{Math.round(likesCount * 0.3).toLocaleString()}</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: style.mutedColor, fontFamily: style.bodyFont }}><span style={{ fontSize: 16 }}>{'\uD83D\uDC41'}</span><span style={{ fontSize: metricSize }}>{(likesCount * 12).toLocaleString()}</span></div>
      </div>
    </div>
  </AbsoluteFill>;
};