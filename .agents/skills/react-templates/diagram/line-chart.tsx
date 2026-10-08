import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'
export const LineChart: React.FC<{
  variant?: string
  textColor?: string
  values?: string
  labels?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  values = '20,35,28,45,52,48,65',
  labels = 'Mon,Tue,Wed,Thu,Fri,Sat,Sun',
  title = 'Weekly Growth',
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
  const valArr = values.split(',').map((v) => parseFloat(v.trim()) || 0)
  const labelArr = labels.split(',').map((l) => l.trim())
  const maxVal = Math.max(...valArr, 1)

  const chartX = 120
  const chartY = 60
  const chartW = 560
  const chartH = 280
  const n = valArr.length

  const points = valArr.map((v, i) => ({
    x: chartX + (i / (n - 1)) * chartW,
    y: chartY + chartH - (v / maxVal) * chartH,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const pathLen = points.reduce((len, p, i) => {
    if (i === 0) return 0
    const prev = points[i - 1]
    return len + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2)
  }, 0)

  const lineSp = spring({ frame: frame - 15, fps, config: { stiffness: 80, damping: 18 } })

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ width: 720 }}>
        <h2 style={{
          fontSize: 24, fontWeight: style.headingWeight, color: textColor,
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing, marginBottom: 24, opacity: titleSp,
        }}>{title}</h2>

        <svg width={720} height={400} viewBox="0 0 720 400">
          {/* Y axis */}
          {(() => {
            const sp = spring({ frame: frame - 5, fps, config: { stiffness: 140, damping: 16 } })
            return <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH}
              stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1} opacity={sp} />
          })()}

          {/* X axis */}
          {(() => {
            const sp = spring({ frame: frame - 8, fps, config: { stiffness: 140, damping: 16 } })
            return <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH}
              stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1} opacity={sp} />
          })()}

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((pct, i) => {
            const sp = spring({ frame: frame - 10 - i * 3, fps, config: { stiffness: 140, damping: 18 } })
            const y = chartY + chartH - pct * chartH
            return <line key={i} x1={chartX} y1={y} x2={chartX + chartW} y2={y}
              stroke={theme?.borderColor ?? "#f0f0f0"} strokeWidth={1} opacity={sp} />
          })}

          {/* Line path */}
          <path d={pathD} fill="none" stroke={textColor} strokeWidth={2}
            strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - lineSp)} />

          {/* Fill area */}
          <path d={`${pathD} L ${points[points.length - 1].x} ${chartY + chartH} L ${points[0].x} ${chartY + chartH} Z`}
            fill={textColor} opacity={0.04 * lineSp} />

          {/* Dots */}
          {points.map((p, i) => {
            const sp = spring({ frame: frame - 25 - i * 4, fps, config: { stiffness: 200, damping: 16 } })
            return (
              <g key={i} opacity={sp}>
                <circle cx={p.x} cy={p.y} r={4 * sp} fill={textColor} />
                <circle cx={p.x} cy={p.y} r={2 * sp} fill={theme?.cardBackground ?? "#fafafa"} />
              </g>
            )
          })}

          {/* X labels */}
          {labelArr.map((label, i) => {
            const sp = spring({ frame: frame - 30 - i * 3, fps, config: { stiffness: 180, damping: 18 } })
            const x = chartX + (i / (n - 1)) * chartW
            return (
              <text key={i} x={x} y={chartY + chartH + 24} textAnchor="middle"
                fontSize={11} fill={theme?.mutedColor ?? "#a3a3a3"} fontFamily={style.bodyFont} opacity={sp}>
                {label}
              </text>
            )
          })}
        </svg>
      </div>
    </AbsoluteFill>
  )
}
