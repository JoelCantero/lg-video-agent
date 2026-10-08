import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { entranceProgress, resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, templateHeadingStyle, textHeadingSize, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const StaggeredWords: React.FC<{ text?: string } & ThemedTemplateProps> = ({ text = 'Design. Build. Ship.', theme }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const style = resolveTemplateTheme(theme, { headingSize: 56 });
  useTemplateFonts(style);
  const words = text.split(' ');

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <div style={{ display: 'flex', gap: scaleThemeSize(style, 16, width), flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' }}>
        {words.map((word, index) => {
          const delay = index * style.motion.staggerFrames * fps / 30;
          const opacity = entranceProgress(frame, fps, style, delay);
          const y = (1 - opacity) * scaleThemeSize(style, style.motion.distance, width);
          return (
            <span key={index} style={{
              fontSize: textHeadingSize(style, width), fontWeight: style.headingWeight, ...templateHeadingStyle(style),
              opacity, transform: `translateY(${y}px)`,
              fontFamily: style.headingFont, lineHeight: style.headingLineHeight, letterSpacing: style.letterSpacing,
            }}>
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};