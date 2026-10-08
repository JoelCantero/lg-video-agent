import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'
export const RadarChart: React.FC<{
  variant?: string
  textColor?: string
  axes?: string
  values?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  axes = 'Speed,Quality,Cost,Flexibility,Support',
  values = '80,65,70,90,75',
  title = 'Product Score',
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
  const axisArr = axes.split(',').map((a) => a.trim())
  const valArr = values.split(',').map((v) => parseFloat(v.trim()) || 0)
  const n = axisArr.length
  const cx = 360
  const cy = 280
  const maxR = 180

  const getPoint = (i: number, r: number) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r }
  }

  // Grid rings
  const rings = [0.25, 0.5, 0.75, 1]

  // Data polygon points
  const dataSp = spring({ frame: frame - 30, fps, config: { stiffness: 100, damping: 16 } })
  const dataPoints = valArr.map((v, i) => {
    const r = (v / 100) * maxR * dataSp
    return getPoint(i, r)
  })
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
        <svg width={720} height={560} viewBox="0 0 720 560">
          {/* Grid rings */}
          {rings.map((pct, ri) => {
            const sp = spring({ frame: frame - 5 - ri * 4, fps, config: { stiffness: 140, damping: 18 } })
            const r = pct * maxR
            const pts = Array.from({ length: n }, (_, i) => getPoint(i, r))
            const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
            return <path key={ri} d={path} fill="none" stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1} opacity={sp} />
          })}

          {/* Axis lines */}
          {axisArr.map((_, i) => {
            const sp = spring({ frame: frame - 10 - i * 3, fps, config: { stiffness: 120, damping: 16 } })
            const p = getPoint(i, maxR)
            return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y}
              stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1} opacity={sp} />
          })}

          {/* Data fill */}
          <path d={dataPath} fill={textColor} opacity={0.08} />
          <path d={dataPath} fill="none" stroke={textColor} strokeWidth={2} opacity={dataSp} />

          {/* Data dots */}
          {dataPoints.map((p, i) => {
            const sp = spring({ frame: frame - 40 - i * 4, fps, config: { stiffness: 200, damping: 16 } })
            return <circle key={i} cx={p.x} cy={p.y} r={4 * sp} fill={textColor} opacity={sp} />
          })}

          {/* Axis labels */}
          {axisArr.map((axis, i) => {
            const sp = spring({ frame: frame - 20 - i * 4, fps, config: { stiffness: 180, damping: 18 } })
            const p = getPoint(i, maxR + 28)
            return (
              <text key={`label-${i}`} x={p.x} y={p.y + 4} textAnchor="middle"
                fontSize={13} fontWeight={theme?.bodyWeight ?? 500} fill={theme?.mutedColor ?? "#525252"} fontFamily={style.bodyFont} opacity={sp}>
                {axis}
              </text>
            )
          })}
        </svg>

        <div style={{ opacity: titleSp }}>
          <h2 style={{
            fontSize: 24, fontWeight: style.headingWeight, color: textColor,
            fontFamily: style.headingFont, letterSpacing: style.letterSpacing,
          }}>{title}</h2>
        </div>
      </div>
    </AbsoluteFill>
  )
}
