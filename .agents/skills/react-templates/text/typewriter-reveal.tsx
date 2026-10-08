import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { resolveTemplateTheme, templateCanvasStyle, templateHeadingStyle, textHeadingSize, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const TypewriterReveal: React.FC<{ text?: string; revealFrames?: number } & ThemedTemplateProps> = ({ text = 'Building the future.', revealFrames, theme }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const style = resolveTemplateTheme(theme, { headingFont: 'ui-monospace, monospace', headingSize: 42, headingWeight: 400, background: '#fafafa', mutedColor: '#a3a3a3' });
  useTemplateFonts(style);
  const gentle = style.motion.kind === 'gentle' && !style.motion.preserveEffects;
  const duration = revealFrames ?? (gentle ? style.motion.durationFrames : 70);
  const chars = Math.floor(interpolate(frame, [0, Math.max(1, duration * fps / 30)], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const cursorOpacity = Math.round(frame / 8) % 2 === 0 ? 1 : 0;
  const showCursor = style.motion.preserveEffects || style.motion.blinkCursor;

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <div style={{ fontFamily: style.headingFont, fontSize: textHeadingSize(style, width), color: style.textColor, fontWeight: style.headingWeight, lineHeight: style.headingLineHeight, letterSpacing: style.letterSpacing, maxWidth: '100%', textAlign: 'center' }}>
        <span style={templateHeadingStyle(style)}>{text.slice(0, chars)}</span>
        {showCursor && <span style={{ opacity: cursorOpacity, color: style.headingBackground ? style.accentColors[0] : style.mutedColor }}>|</span>}
      </div>
    </AbsoluteFill>
  );
};