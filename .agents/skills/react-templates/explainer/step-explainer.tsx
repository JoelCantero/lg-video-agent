import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion'
import { entranceProgress, resolveTemplateTheme, scaleThemeSize, templateCanvasStyle, type ThemedTemplateProps } from '../theme'
import { useTemplateFonts } from '../fonts'
export const StepExplainer: React.FC<{ title?: string; steps?: string; textColor?: string; variant?: string } & ThemedTemplateProps> = ({ title = 'How it works', steps: stepsStr, textColor, theme }) => {
  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()
  const style = resolveTemplateTheme({ ...theme, ...(textColor ? { textColor } : {}) }, {
    headingSize: 42, bodySize: 20, bodyWeight: 600, secondarySize: 13, letterSpacing: '-0.02em', mutedColor: '#a3a3a3',
  })
  useTemplateFonts(style)
  const gentle = style.motion.kind === 'gentle'
  const size = (value: number) => scaleThemeSize(style, value, width)

  const titleProgress = entranceProgress(frame, fps, style, 0, { stiffness: 200, damping: 20 })
  const stepList = stepsStr ? stepsStr.split(',').map((s) => s.trim()).filter(Boolean) : ['Sign up for free', 'Connect your tools', 'Launch in minutes']
  const steps = stepList.map((text, i) => ({ num: String(i + 1).padStart(2, '0'), text }))

  return (
    <AbsoluteFill style={templateCanvasStyle(style, width, height)}>
      <div style={{ width: style.referenceWidth > 0 ? size(1280) : 600, maxWidth: '100%' }}>
        <h2 style={{
          fontSize: size(style.headingSize), fontWeight: style.headingWeight, color: style.textColor, marginBottom: 32,
          opacity: titleProgress, transform: `translateY(${(1 - titleProgress) * size(style.motion.distance)}px)`,
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing, lineHeight: style.headingLineHeight,
        }}>{title}</h2>

        {steps.map((step, i) => {
          const delay = gentle ? (i + 1) * style.motion.staggerFrames * fps / 30 : 12 + i * 14
          const sp = entranceProgress(frame, fps, style, delay, { stiffness: 180, damping: 16 })
          const lineWidth = sp * 100

          return (
            <div key={i} style={{ display: 'flex', gap: 16, marginBottom: 20, opacity: sp, transform: `translateX(${(1 - sp) * -size(gentle ? style.motion.distance : 20)}px)` }}>
              <div style={{
                fontSize: size(style.secondarySize), fontWeight: 700, color: style.mutedColor, fontFamily: style.bodyFont,
                width: 30, flexShrink: 0, paddingTop: 2,
              }}>{step.num}</div>
              <div>
                <div style={{ fontSize: size(style.bodySize), fontWeight: style.bodyWeight, color: style.textColor, fontFamily: style.bodyFont, letterSpacing: style.letterSpacing, lineHeight: style.bodyLineHeight }}>{step.text}</div>
                <div style={{ height: 2, background: gentle ? style.accentBackground : style.textColor, width: `${lineWidth}%`, marginTop: 6, borderRadius: 1 }} />
              </div>
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}