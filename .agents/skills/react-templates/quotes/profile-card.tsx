import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, scaleThemeSize, templateCanvasStyle, templateEffectProgress, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const ProfileCard: React.FC<{
  name?: string; role?: string; bio?: string; stats?: string; textColor?: string; bgColor?: string; variant?: string;
} & ThemedTemplateProps> = ({
  name = 'Alex Rivera', role = 'Founder & CEO', bio = 'Building the future of programmatic video. Previously at Stripe and Vercel.',
  stats = '12K followers,500+ posts,50 projects', textColor, bgColor, theme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const background = bgColor ?? theme?.background ?? '#fafafa';
  const isDark = ['#000000', '#171717', '#0a0a0a'].includes(background);
  const style = resolveTemplateAppearance({ ...theme, ...(textColor ? { textColor } : {}), ...(bgColor ? { background: bgColor } : {}) }, {
    headingSize: 26, headingWeight: 800, bodySize: 16, bodyLineHeight: 1.6, secondarySize: 15,
    background: '#fafafa', textColor: isDark ? '#ffffff' : '#171717',
    cardBackground: isDark ? '#1a1a1a' : '#ffffff', borderColor: isDark ? '#333333' : '#e5e5e5',
    mutedColor: isDark ? '#737373' : '#a3a3a3', letterSpacing: '-0.02em', borderRadius: 16,
  });
  useTemplateFonts(style);
  const size = (value: number) => scaleThemeSize(style, value, width);
  const card = templateEffectProgress(frame, fps, style, 2, { stiffness: 180, damping: 16 });
  const avatar = templateEffectProgress(frame, fps, style, 6, { stiffness: 250, damping: 12 });
  const author = templateEffectProgress(frame, fps, style, 12, { stiffness: 180, damping: 16 });
  const bioProgress = templateEffectProgress(frame, fps, style, 20, { stiffness: 160, damping: 18 });
  const statsList = stats.split(',').map(stat => stat.trim()).filter(Boolean);

  return <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
    <div style={{
      width: 480,
      maxWidth: '100%', padding: 44, borderRadius: style.borderRadius,
      background: style.cardBackground, textAlign: 'center', border: `${style.borderWidth}px solid ${style.borderColor}`,
      boxShadow: '0 16px 40px rgba(0,0,0,0.08)', boxSizing: 'border-box', opacity: card, transform: `scale(${0.92 + card * 0.08})`,
    }}>
      <div style={{ width: 80, height: 80, borderRadius: 999, margin: '0 auto 20px', background: style.textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: theme?.headingWeight ?? 800, color: style.cardBackground, fontFamily: style.headingFont, transform: `scale(${avatar})` }}>{name.charAt(0)}</div>
      <div style={{ fontSize: size(style.headingSize), fontWeight: style.headingWeight, color: style.textColor, fontFamily: style.headingFont, opacity: author, marginBottom: 4, letterSpacing: style.letterSpacing }}>{name}</div>
      <div style={{ fontSize: size(style.secondarySize), color: style.mutedColor, fontFamily: style.bodyFont, opacity: author, marginBottom: 20 }}>{role}</div>
      <p style={{ margin: '0 0 28px', fontSize: size(style.bodySize), lineHeight: style.bodyLineHeight, color: theme?.mutedColor ?? (isDark ? '#a3a3a3' : '#737373'), fontFamily: style.bodyFont, fontWeight: style.bodyWeight, opacity: bioProgress, transform: `translateY(${(1 - bioProgress) * size(8)}px)` }}>{bio}</p>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 24, paddingTop: 20, borderTop: `1px solid ${theme?.borderColor ?? (isDark ? '#262626' : '#f0f0f0')}` }}>
        {statsList.map((stat, index) => {
          const progress = templateEffectProgress(frame, fps, style, 28 + index * 6, { stiffness: 200, damping: 14 });
          const parts = stat.match(/^([\d,.KMk+]+)\s*(.*)$/);
          return <div key={index} style={{ opacity: progress, transform: `translateY(${(1 - progress) * size(8)}px)` }}>
            <div style={{ fontSize: 20, fontWeight: theme?.headingWeight ?? 800, color: style.textColor, fontFamily: style.headingFont }}>{parts?.[1] ?? stat}</div>
            <div style={{ fontSize: 12, color: theme?.mutedColor ?? (isDark ? '#525252' : '#a3a3a3'), fontFamily: style.bodyFont }}>{parts?.[2] ?? ''}</div>
          </div>;
        })}
      </div>
    </div>
  </AbsoluteFill>;
};