import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateAppearance, scaleThemeSize, templateCanvasStyle, templateEffectProgress, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import demoImage from './video-testimonial.jpg';

function GlowDot({ color, size = 10, delay = 0 }: { color: string; size?: number; delay?: number }) {
  const frame = useCurrentFrame();
  const pulse = 0.6 + 0.4 * Math.sin(((frame + delay) / 40) * Math.PI * 2);
  const glowSize = size + pulse * 8;
  return <div style={{ width: size, height: size, borderRadius: 999, background: color, boxShadow: `0 0 ${glowSize}px ${Math.round(glowSize / 2)}px ${color}60`, opacity: 0.7 + pulse * 0.3 }} />;
}

export const VideoTestimonial: React.FC<{
  quote?: string; name?: string; role?: string; rating?: string; imageUrl?: string; textColor?: string; bgColor?: string; variant?: string;
} & ThemedTemplateProps> = ({
  quote = 'This is the best tool I have ever used. It completely transformed our workflow.',
  name = 'Alex Rivera', role = 'CEO at Startup', rating = '5', imageUrl = demoImage, textColor, bgColor, theme,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const background = bgColor ?? theme?.background ?? '#ffffff';
  const isDark = background !== '#ffffff' && background !== '#fafafa';
  const font = 'Inter, system-ui, -apple-system, sans-serif';
  const style = resolveTemplateAppearance({ ...theme, ...(textColor ? { textColor } : {}), ...(bgColor ? { background: bgColor } : {}) }, {
    headingFont: font, bodyFont: font, headingWeight: 700, bodySize: 22, bodyWeight: 500,
    bodyLineHeight: 1.6, secondarySize: 13, textColor: isDark ? '#f0ece6' : '#171717',
    cardBackground: isDark ? '#111111' : '#ffffff', borderColor: isDark ? '#1e1c1a' : '#e5e5e5',
    mutedColor: isDark ? '#737373' : '#a3a3a3',
  });
  useTemplateFonts(style);
  const size = (value: number) => scaleThemeSize(style, value, width);
  const card = templateEffectProgress(frame, fps, style, 3, { stiffness: 160, damping: 16 });
  const quoteProgress = templateEffectProgress(frame, fps, style, 12, { stiffness: 140, damping: 18 });
  const stars = templateEffectProgress(frame, fps, style, 6, { stiffness: 200, damping: 14 });
  const author = templateEffectProgress(frame, fps, style, 28, { stiffness: 180, damping: 16 });
  const image = templateEffectProgress(frame, fps, style, 5, { stiffness: 80, damping: 18 });
  const ratingCount = Math.min(5, Math.max(0, parseInt(rating, 10) || 5));
  const accent = textColor ?? theme?.textColor ?? '#171717';
  const vertical = height > width;
  const videoGradient = theme?.accentBackground ?? 'radial-gradient(ellipse at 50% 40%, #2a1a3e 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, #1a2a4e 0%, transparent 40%), linear-gradient(180deg, #0a0a14, #141428)';

  return <AbsoluteFill style={{ ...templateCanvasStyle(style, width, height), fontFamily: style.bodyFont }}>
    <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', width: '100%', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', background: imageUrl ? '#0a0a14' : videoGradient }}>
        {imageUrl && <Img src={imageUrl} alt="Retrat de mostra" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: image * 0.85, transform: `scale(${1.05 - image * 0.05})` }} />}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${card})`, width: 80, height: 80, borderRadius: 999, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 0, height: 0, marginLeft: 4, borderLeft: '20px solid rgba(255,255,255,0.9)', borderTop: '12px solid transparent', borderBottom: '12px solid transparent' }} />
        </div>
        <div style={{ position: 'absolute', top: 30, right: 30 }}><GlowDot color={accent} size={10} /></div>
        <div style={{ position: 'absolute', bottom: 40, left: 30 }}><GlowDot color={theme?.accentColors?.[1] ?? '#3B82F6'} size={8} delay={20} /></div>
        <div style={{ position: 'absolute', bottom: 60, left: 40, right: 40, display: 'flex', alignItems: 'flex-end', gap: 3, height: 30 }}>
          {Array.from({ length: 24 }, (_, index) => <div key={index} style={{ flex: 1, height: `${20 + Math.sin(frame * 0.15 + index * 0.7) * 15}%`, background: `rgba(255,255,255,${0.08 + index / 24 * 0.12})`, borderRadius: 2 }} />)}
        </div>
      </div>
      <div style={{
        width: vertical ? '100%' : 460,
        flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxSizing: 'border-box',
        padding: '48px 44px', background: style.cardBackground,
        borderLeft: vertical ? undefined : `${style.borderWidth}px solid ${style.borderColor}`,
        borderTop: vertical ? `${style.borderWidth}px solid ${style.borderColor}` : undefined,
      }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, opacity: stars, transform: `translateY(${(1 - stars) * size(8)}px)` }}>
          {Array.from({ length: 5 }, (_, index) => <span key={index} style={{ fontSize: 22, color: index < ratingCount ? accent : style.borderColor, filter: index < ratingCount ? `drop-shadow(0 0 4px ${accent}40)` : 'none' }}>{'\u2605'}</span>)}
        </div>
        <p style={{ margin: '0 0 32px', fontSize: size(style.bodySize), lineHeight: style.bodyLineHeight, fontWeight: style.bodyWeight, color: style.textColor, opacity: quoteProgress, transform: `translateY(${(1 - quoteProgress) * size(12)}px)`, fontFamily: style.bodyFont }}>{'"'}{quote}{'"'}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: author, transform: `translateX(${(1 - author) * -size(10)}px)` }}>
          <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 999, background: theme?.accentBackground ?? `linear-gradient(135deg, ${accent}, ${accent}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#ffffff', boxShadow: `0 4px 12px ${accent}30`, fontFamily: style.headingFont }}>{name.charAt(0)}</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: theme?.headingWeight ?? 700, color: style.textColor, fontFamily: style.headingFont }}>{name}</div>
            <div style={{ fontSize: size(style.secondarySize), color: style.mutedColor, fontFamily: style.bodyFont }}>{role}</div>
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
};