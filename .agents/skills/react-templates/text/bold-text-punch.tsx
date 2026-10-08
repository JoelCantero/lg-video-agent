import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from 'remotion'
import { resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, templateEffectProgress, templateHeadingStyle, textHeadingSize, type ThemedTemplateProps } from '../theme'
import { useTemplateFonts } from '../fonts'
export const BoldTextPunch: React.FC<{ text?: string; textColor?: string; bgColor?: string; variant?: string } & ThemedTemplateProps> = ({
  text = 'Stop scrolling.',
  textColor,
  bgColor,
  theme,
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const background = bgColor ?? (theme?.headingBackground ? theme.background : theme?.accentBackground ?? theme?.inverseBackground) ?? theme?.background ?? '#171717'
  const style = resolveTemplateTheme({
    ...theme,
    textColor: textColor ?? theme?.inverseTextColor ?? theme?.textColor ?? '#ffffff',
    headingBackground: textColor ? undefined : theme?.headingBackground,
    background,
  }, {
    textColor: '#ffffff', background: '#171717', headingSize: 80, headingWeight: 800, headingLineHeight: 1.1, letterSpacing: '-0.02em',
  })
  useTemplateFonts(style)
  const gentle = style.motion.kind === 'gentle' && !style.motion.preserveEffects
  const progress = templateEffectProgress(frame, fps, style, 0, { stiffness: 300, damping: 10 })
  const scale = gentle ? 1 : progress
  const opacity = !gentle ? interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }) : progress
  const shake = !gentle && frame > 5 && frame < 12 ? Math.sin(frame * 3) * 2 * (1 - (frame - 5) / 7) : 0
  const translateY = gentle ? (1 - progress) * scaleThemeSize(style, style.motion.distance, width) : 0

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <h1 style={{
        fontSize: textHeadingSize(style, width), fontWeight: style.headingWeight, ...templateHeadingStyle(style), opacity,
        transform: `translateY(${translateY}px) scale(${scale}) translateX(${shake}px)`,
        fontFamily: style.headingFont, letterSpacing: style.letterSpacing,
        textAlign: 'center', lineHeight: style.headingLineHeight, maxWidth: '80%',
      }}>
        {text}
      </h1>
    </AbsoluteFill>
  )
}