import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion';
import { entranceProgress, resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, templateHeadingStyle, textHeadingSize, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const FadeSlideUp: React.FC<{ text?: string } & ThemedTemplateProps> = ({ text = 'Hello World', theme }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const style = resolveTemplateTheme(theme);
  useTemplateFonts(style);
  const preserveOriginal = style.motion.kind === 'original'
    || (style.motion.kind === 'gentle' && style.motion.preserveEffects);
  const opacity = preserveOriginal
    ? interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
    : entranceProgress(frame, fps, style);
  const distance = preserveOriginal ? 24 : scaleThemeSize(style, style.motion.distance, width);
  const translateY = (1 - opacity) * distance;

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <h1 style={{
        fontSize: textHeadingSize(style, width),
        fontWeight: style.headingWeight,
        ...templateHeadingStyle(style),
        opacity,
        transform: `translateY(${translateY}px)`,
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