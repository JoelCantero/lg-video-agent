import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'
export const PieChart: React.FC<{
  variant?: string
  textColor?: string
  labels?: string
  values?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  labels = 'Product,Marketing,Engineering,Design',
  values = '35,25,25,15',
  title: _title = 'Budget Allocation',
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
// titleSp removed — no title shown
  const labelArr = labels.split(',').map((l) => l.trim())
  const valArr = values.split(',').map((v) => parseFloat(v.trim()) || 0)
  const total = valArr.reduce((a, b) => a + b, 0) || 1
  const fills = [diagramFill(theme, "#171717"), diagramFill(theme, "#525252"), diagramFill(theme, "#a3a3a3"), diagramFill(theme, "#d4d4d4"), diagramFill(theme, "#e5e5e5")]

  const cx = 200
  const cy = 200
  const r = 140

  // Calculate arc paths
  const slices: { path: string; fill: string; pct: number; label: string }[] = []
  let startAngle = -Math.PI / 2

  valArr.forEach((val, i) => {
    const pct = val / total
    const angle = pct * Math.PI * 2
    const endAngle = startAngle + angle
    const largeArc = angle > Math.PI ? 1 : 0

    const x1 = cx + Math.cos(startAngle) * r
    const y1 = cy + Math.sin(startAngle) * r
    const x2 = cx + Math.cos(endAngle) * r
    const y2 = cy + Math.sin(endAngle) * r

    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    slices.push({ path, fill: fills[i % fills.length], pct: val, label: labelArr[i] ?? '' })
    startAngle = endAngle
  })

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
        {/* Pie */}
        <svg width={400} height={400} viewBox="0 0 400 400">
          {slices.map((slice, i) => {
            const sp = spring({ frame: frame - 10 - i * 8, fps, config: { stiffness: 140, damping: 16 } })
            return (
              <path key={i} d={slice.path} fill={slice.fill} opacity={sp}
                transform={`scale(${sp})`} style={{ transformOrigin: `${cx}px ${cy}px` }} />
            )
          })}
          {/* Inner white circle for donut effect */}
          <circle cx={cx} cy={cy} r={60} fill={theme?.cardBackground ?? "#fafafa"} />
        </svg>

        {/* Legend */}
        <div>
          {/* Legend items only, no title */}

          {slices.map((slice, i) => {
            const sp = spring({ frame: frame - 25 - i * 6, fps, config: { stiffness: 180, damping: 18 } })
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, opacity: sp,
              }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: slice.fill, flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: theme?.mutedColor ?? "#525252", fontFamily: style.bodyFont }}>{slice.label}</span>
                <span style={{ fontSize: 15, fontWeight: style.headingWeight, color: textColor, fontFamily: style.bodyFont, marginLeft: 'auto' }}>
                  {Math.round(slice.pct)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}
