import { AbsoluteFill, useCurrentFrame, interpolate, interpolateColors, useVideoConfig } from 'remotion'
import { entranceProgress, resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, templateEffectProgress, templateHeadingStyle, textHeadingSize, type ThemedTemplateProps } from '../theme'
import { useTemplateFonts } from '../fonts'

export const GradientText: React.FC<{ text?: string; bgColor?: string; variant?: string } & ThemedTemplateProps> = ({
  text = 'Build something great', bgColor, theme,
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const background = bgColor ?? theme?.background ?? '#ffffff'
  const isDark = background !== '#ffffff' && background !== '#fafafa'
  const style = resolveTemplateTheme({ ...theme, ...(bgColor ? { background: bgColor } : {}) }, {
    headingSize: 100, headingWeight: 800, headingLineHeight: 1.15, letterSpacing: '-0.03em', textColor: isDark ? '#fff' : '#171717',
  })
  useTemplateFonts(style)
  const gentle = style.motion.kind === 'gentle' && !style.motion.preserveEffects
  const titleProgress = entranceProgress(frame, fps, style)

  const chars = text.split('')

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <div style={{
        maxWidth: '85%', lineHeight: style.headingLineHeight,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {chars.map((char, i) => {
          const charDelay = gentle ? 0 : 2 + i * 1.5
          const charS = templateEffectProgress(frame, fps, style, charDelay, { stiffness: 200, damping: 18 })

          const sweepStart = i * 2
          const sweepMid = sweepStart + 15
          const sweepEnd = sweepStart + 30
          const colorProgress = interpolate(frame, [sweepStart, sweepMid, sweepEnd], [0, 1, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          })

          const gradientColor = style.accentColors[i % style.accentColors.length] ?? style.textColor
          const textAccent = style.accentTextMix === 1 ? gradientColor
            : interpolateColors(style.accentTextMix, [0, 1], [style.textColor, gradientColor])
          const glowColor = style.accentTextMix === 1 ? `${gradientColor}40`
            : interpolateColors(0.25, [0, 1], ['rgba(0, 0, 0, 0)', textAccent])

          const color = !gentle && colorProgress > 0.01 ? textAccent : style.textColor
          const opacity = char === ' ' ? 1 : charS

          return (
            <span key={i} style={{
              fontSize: textHeadingSize(style, width),
              fontWeight: style.headingWeight,
              fontFamily: style.headingFont,
              letterSpacing: style.letterSpacing,
              color,
              ...(style.headingBackground ? {
                ...templateHeadingStyle(style),
                backgroundImage: !gentle && colorProgress > 0.01 ? `linear-gradient(to right, ${textAccent}, ${textAccent})` : style.headingBackground,
                backgroundSize: `${chars.length * 100}% 100%`,
                backgroundPosition: `${chars.length > 1 ? i * 100 / (chars.length - 1) : 0}% center`,
              } : {}),
              opacity: gentle ? charS : Math.max(0.15, opacity),
              transform: `translateY(${(1 - charS) * scaleThemeSize(style, gentle ? style.motion.distance : 20, width)}px)`,
              display: 'inline-block',
              minWidth: char === ' ' ? '0.3em' : undefined,
              textShadow: !gentle && colorProgress > 0.3 ? `0 0 20px ${glowColor}` : 'none',
            }}>
              {char}
            </span>
          )
        })}
        </div>
        {gentle && <div style={{ height: scaleThemeSize(style, 8, width), marginTop: scaleThemeSize(style, 24, width), background: style.accentBackground, opacity: titleProgress }} />}
      </div>
    </AbsoluteFill>
  )
}