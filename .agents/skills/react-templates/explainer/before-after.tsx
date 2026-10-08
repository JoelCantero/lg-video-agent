import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { entranceProgress, resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, type ThemedTemplateProps } from '../theme'
import { useTemplateFonts } from '../fonts'
export const BeforeAfter: React.FC<{ beforeTitle?: string; afterTitle?: string; beforeItems?: string; afterItems?: string; textColor?: string; bgColor?: string; variant?: string } & ThemedTemplateProps> = ({
  beforeTitle = 'Before', afterTitle = 'After',
  beforeItems = 'Manual deploys,No monitoring,Slow feedback', afterItems = 'Auto CI/CD,Real-time alerts,Ship in minutes',
  textColor, bgColor, theme,
}) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const background = bgColor ?? theme?.background ?? '#ffffff'
  const isDark = background === '#000000' || background === '#171717' || background === '#0a0a0a'
  const style = resolveTemplateTheme({ ...theme, ...(textColor ? { textColor, positiveColor: textColor } : {}), ...(bgColor ? { background: bgColor } : {}) }, {
    bodySize: 16, secondarySize: 12, mutedColor: isDark ? '#a3a3a3' : '#737373',
    textColor: isDark ? '#fff' : '#171717', cardBackground: isDark ? '#1a1a1a' : '#fff', borderColor: isDark ? '#333' : '#e5e5e5',
  })
  useTemplateFonts(style)
  const gentle = style.motion.kind === 'gentle'
  const vertical = height > width
  const size = (value: number) => scaleThemeSize(style, value, width)
  const availableWidth = width * (1 - style.safeMargin * 2)
  const cardWidth = style.referenceWidth > 0 ? (vertical ? availableWidth : (availableWidth - 80) / 2) : 300

  const beforeList = beforeItems.split(',').map((i) => i.trim()).filter(Boolean)
  const afterList = afterItems.split(',').map((i) => i.trim()).filter(Boolean)

  const stagger = style.motion.staggerFrames * fps / 30
  const beforeS = entranceProgress(frame, fps, style, gentle ? 0 : 3, { stiffness: 180, damping: 16 })
  const afterS = entranceProgress(frame, fps, style, gentle ? stagger : 20, { stiffness: 180, damping: 16 })
  const arrowS = entranceProgress(frame, fps, style, gentle ? stagger : 15, { stiffness: 200, damping: 14 })

  const cardStyle = (bg: string, border: string): React.CSSProperties => ({
    width: cardWidth, padding: 32, borderRadius: style.borderRadius, boxSizing: 'border-box',
    backgroundColor: bg,
    border: `${style.borderWidth}px solid ${border}`,
  })

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <div style={{ display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: 24, maxWidth: '100%' }}>
        {/* Before */}
        <div style={{
          ...cardStyle(style.cardBackground, style.borderColor),
          opacity: beforeS, transform: `translateX(${(1 - beforeS) * -size(gentle ? style.motion.distance : 20)}px)`,
        }}>
          <div style={{
            fontSize: size(style.secondarySize), fontWeight: style.headingWeight, color: style.negativeColor,
            textTransform: 'uppercase', letterSpacing: theme?.letterSpacing ?? '0.08em', marginBottom: 16,
            fontFamily: style.headingFont, lineHeight: style.headingLineHeight,
          }}>{beforeTitle}</div>
          {beforeList.map((item, i) => {
            const delay = gentle ? (i + 1) * stagger : 8 + i * 6
            const itemS = entranceProgress(frame, fps, style, delay, { stiffness: 180, damping: 16 })
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                opacity: itemS, transform: `translateX(${(1 - itemS) * -size(gentle ? style.motion.distance : 10)}px)`,
              }}>
                <span style={{ color: style.negativeColor, fontSize: size(style.bodySize) }}>{'\u2717'}</span>
                <span style={{ fontSize: size(style.bodySize), color: style.mutedColor, fontFamily: style.bodyFont, fontWeight: style.bodyWeight, lineHeight: style.bodyLineHeight }}>{item}</span>
              </div>
            )
          })}
        </div>

        {/* Arrow */}
        <div style={{
          fontSize: 32, color: style.textColor, opacity: arrowS,
          transform: `scale(${gentle ? 1 : arrowS})`,
        }}>{vertical ? '\u2193' : '\u2192'}</div>

        {/* After */}
        <div style={{
          ...cardStyle(style.cardBackground, style.borderColor),
          opacity: afterS, transform: `translateX(${(1 - afterS) * size(gentle ? style.motion.distance : 20)}px)`,
          border: `${style.borderWidth + 1}px solid ${style.positiveColor}`,
        }}>
          <div style={{
            fontSize: size(style.secondarySize), fontWeight: style.headingWeight, color: style.positiveColor,
            textTransform: 'uppercase', letterSpacing: theme?.letterSpacing ?? '0.08em', marginBottom: 16,
            fontFamily: style.headingFont, lineHeight: style.headingLineHeight,
          }}>{afterTitle}</div>
          {afterList.map((item, i) => {
            const delay = gentle ? (i + 2) * stagger : 24 + i * 6
            const itemS = entranceProgress(frame, fps, style, delay, { stiffness: 180, damping: 16 })
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                opacity: itemS, transform: `translateX(${(1 - itemS) * size(gentle ? style.motion.distance : 10)}px)`,
              }}>
                <span style={{ color: style.positiveColor, fontSize: size(style.bodySize) }}>{'\u2713'}</span>
                <span style={{ fontSize: size(style.bodySize), color: style.textColor, fontWeight: theme?.bodyWeight ?? 500, fontFamily: style.bodyFont, lineHeight: style.bodyLineHeight }}>{item}</span>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}