import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const ComparisonMatrix: React.FC<{
  variant?: string
  textColor?: string
  features?: string
  columns?: string
  checks?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  features = 'Speed,Security,Price,Support',
  columns = 'Startup,Enterprise',
  checks = '1,0,1,1,0,1,0,1',
  title = 'Plan Comparison',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const style = resolveTemplateAppearance(theme, { background: "#fafafa", letterSpacing: "-0.02em" });
  useTemplateFonts(style);
  const s = {
    fontFamily: 'system-ui, sans-serif',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    borderRadius: 12,
    shadow: undefined,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    card: { borderRadius: 12, border: '1px solid #e5e5e5', boxShadow: undefined, background: undefined },
    text: { fontWeight: 600, letterSpacing: '-0.02em', fontFamily: 'system-ui, sans-serif' },
  }
const titleSp = spring({ frame, fps, config: { stiffness: 180, damping: 18 } })
  const featureArr = features.split(',').map((f) => f.trim())
  const colArr = columns.split(',').map((c) => c.trim())
  const checkArr = checks.split(',').map((c) => c.trim())

  const numCols = colArr.length
  const cellW = 140
  const labelW = 160
  const totalW = labelW + cellW * numCols

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ width: totalW }}>
        <h2 style={{
          fontSize: 28, fontWeight: style.headingWeight, color: textColor, textAlign: 'center',
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing, marginBottom: 36, opacity: titleSp,
        }}>{title}</h2>

        {/* Header row */}
        <div style={{ display: 'flex', marginBottom: 4 }}>
          <div style={{ width: labelW }} />
          {colArr.map((col, ci) => {
            const sp = spring({ frame: frame - 12 - ci * 6, fps, config: { stiffness: 180, damping: 18 } })
            return (
              <div key={ci} style={{
                width: cellW, textAlign: 'center', fontSize: 15, fontWeight: theme?.headingWeight ?? 700,
                color: textColor, fontFamily: style.bodyFont, opacity: sp, paddingBottom: 12,
              }}>{col}</div>
            )
          })}
        </div>

        {/* Divider */}
        {(() => {
          const sp = spring({ frame: frame - 20, fps, config: { stiffness: 160, damping: 16 } })
          return <div style={{ height: 1, backgroundColor: theme?.mutedColor ?? "#e5e5e5", transform: `scaleX(${sp})`, transformOrigin: 'left', marginBottom: 4 }} />
        })()}

        {/* Rows */}
        {featureArr.map((feat, ri) => (
          <div key={ri} style={{
            display: 'flex', alignItems: 'center', height: 48,
            borderBottom: ri < featureArr.length - 1 ? `1px solid ${theme?.borderColor ?? "#f0f0f0"}` : 'none',
          }}>
            {(() => {
              const sp = spring({ frame: frame - 25 - ri * 6, fps, config: { stiffness: 180, damping: 18 } })
              return (
                <div style={{
                  width: labelW, fontSize: 15, color: theme?.mutedColor ?? "#525252", fontFamily: style.bodyFont, opacity: sp,
                }}>{feat}</div>
              )
            })()}
            {colArr.map((_, ci) => {
              const idx = ri * numCols + ci
              const isCheck = checkArr[idx] === '1'
              const sp = spring({ frame: frame - 30 - ri * 6 - ci * 4, fps, config: { stiffness: 200, damping: 16 } })
              return (
                <div key={ci} style={{
                  width: cellW, textAlign: 'center', opacity: sp,
                  transform: `scale(${interpolate(sp, [0, 1], [0.5, 1])})`,
                }}>
                  <span style={{
                    fontSize: 18, fontWeight: theme?.headingWeight ?? 600,
                    color: isCheck ? textColor : theme?.borderColor ?? "#d4d4d4",
                  }}>{isCheck ? '✓' : '—'}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  )
}
