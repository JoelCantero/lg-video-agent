import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, templateEffectProgress, templateHeadingStyle, textHeadingSize, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const SpringScaleIn: React.FC<{ text?: string } & ThemedTemplateProps> = ({ text = 'Welcome', theme }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const style = resolveTemplateTheme(theme, { headingSize: 72, headingWeight: 800, textColor: '#000' });
  useTemplateFonts(style);
  const gentle = style.motion.kind === 'gentle' && !style.motion.preserveEffects;
  const progress = templateEffectProgress(frame, fps, style, 0, { stiffness: 200, damping: 12 });
  const scale = gentle ? 1 : progress;
  const opacity = templateEffectProgress(frame, fps, style, 0, { stiffness: 300, damping: 20 });
  const translateY = gentle ? (1 - progress) * scaleThemeSize(style, style.motion.distance, width) : 0;

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <h1 style={{
        fontSize: textHeadingSize(style, width),
        fontWeight: style.headingWeight,
        ...templateHeadingStyle(style),
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        fontFamily: style.headingFont,
        lineHeight: style.headingLineHeight,
        letterSpacing: style.letterSpacing,
        textAlign: 'center',
        maxWidth: '100%',
      }}>
        {text}
      </h1>
    </AbsoluteFill>
  );
};