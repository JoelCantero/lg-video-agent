import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { entranceProgress, resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, type ThemedTemplateProps } from '../theme'
import { useTemplateFonts } from '../fonts'
export const ConceptBreakdown: React.FC<{
  title?: string
  variant?: string
  textColor?: string
  eyebrow?: string
  bulletList?: string
} & ThemedTemplateProps> = ({
  title = 'What is AI?',
  textColor,
  theme,
  eyebrow = 'Explained',
  bulletList = 'Machines that learn from data,Automates complex decisions,Powers modern applications',
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const style = resolveTemplateTheme({ ...theme, ...(textColor ? { textColor } : {}) }, {
    background: '#fafafa', headingSize: 48, headingWeight: 800, letterSpacing: '-0.02em',
  })
  useTemplateFonts(style)
  const gentle = style.motion.kind === 'gentle'
  const size = (value: number) => scaleThemeSize(style, value, width)

  const titleS = entranceProgress(frame, fps, style, 0, { stiffness: 160, damping: 18 })
  const bulletDelay = [20, 35, 50]
  const bullets = bulletList.split(',').slice(0, 3).map((b) => b.trim())

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <div style={{ width: style.referenceWidth > 0 ? size(1280) : 520, maxWidth: '100%' }}>
        <div style={{
          fontSize: size(style.secondarySize), fontWeight: theme?.headingWeight ?? 600, color: theme?.mutedColor ?? '#a3a3a3', textTransform: 'uppercase',
          letterSpacing: theme?.letterSpacing ?? '0.08em', marginBottom: 8, opacity: titleS, fontFamily: style.bodyFont,
        }}>{eyebrow}</div>
        <h1 style={{
          fontSize: size(style.headingSize), fontWeight: style.headingWeight, color: style.textColor, marginBottom: 28,
          opacity: titleS, transform: `translateY(${(1 - titleS) * size(gentle ? style.motion.distance : 12)}px)`,
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing, lineHeight: style.headingLineHeight,
        }}>{title}</h1>

        {bullets.map((b, i) => {
          const delay = gentle ? (i + 1) * style.motion.staggerFrames * fps / 30 : bulletDelay[i]
          const sp = entranceProgress(frame, fps, style, delay, { stiffness: 200, damping: 16 })
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
              opacity: sp, transform: `translateY(${(1 - sp) * size(gentle ? style.motion.distance : 8)}px)`,
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: 999, background: style.textColor, flexShrink: 0,
              }} />
              <span style={{ fontSize: size(style.bodySize), fontWeight: style.bodyWeight, color: style.mutedColor, fontFamily: style.bodyFont, letterSpacing: style.letterSpacing, lineHeight: style.bodyLineHeight }}>{b}</span>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}