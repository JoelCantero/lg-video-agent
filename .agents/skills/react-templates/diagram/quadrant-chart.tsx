import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const QuadrantChart: React.FC<{
  variant?: string
  textColor?: string
  xLabel?: string
  yLabel?: string
  items?: string
  positions?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  xLabel = 'Effort',
  yLabel = 'Impact',
  items = 'Feature A,Feature B,Feature C,Feature D',
  positions = 'low-high,high-high,low-low,high-low',
  title: _title = 'Priority Matrix',
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
  const itemArr = items.split(',').map((i) => i.trim())
  const posArr = positions.split(',').map((p) => p.trim())

  const chartX = 120
  const chartY = 40
  const chartW = 640
  const chartH = 480

  const posMap: Record<string, { x: number; y: number }> = {
    'low-low': { x: 0.25, y: 0.75 },
    'low-high': { x: 0.25, y: 0.25 },
    'high-low': { x: 0.75, y: 0.75 },
    'high-high': { x: 0.75, y: 0.25 },
  }

  const dots = itemArr.map((item, i) => {
    const pos = posMap[posArr[i]] ?? { x: 0.5, y: 0.5 }
    return {
      label: item,
      x: chartX + pos.x * chartW,
      y: chartY + pos.y * chartH,
    }
  })

  const fills = [diagramFill(theme, "#171717"), diagramFill(theme, "#525252"), diagramFill(theme, "#a3a3a3"), diagramFill(theme, "#d4d4d4")]

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ width: 880 }}>
        {/* No title — chart fills space */}

        <svg width={880} height={560} viewBox="0 0 880 560">
          {/* Axes */}
          {(() => {
            const sp = spring({ frame: frame - 8, fps, config: { stiffness: 140, damping: 16 } })
            return (
              <g opacity={sp}>
                {/* X axis */}
                <line x1={chartX} y1={chartY + chartH / 2} x2={chartX + chartW} y2={chartY + chartH / 2}
                  stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1} />
                {/* Y axis */}
                <line x1={chartX + chartW / 2} y1={chartY} x2={chartX + chartW / 2} y2={chartY + chartH}
                  stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1} />

                {/* Quadrant labels */}
                <text x={chartX + chartW * 0.25} y={chartY + chartH * 0.12} textAnchor="middle"
                  fontSize={10} fill={theme?.mutedColor ?? "#d4d4d4"} fontFamily={style.bodyFont}>Low {xLabel}, High {yLabel}</text>
                <text x={chartX + chartW * 0.75} y={chartY + chartH * 0.12} textAnchor="middle"
                  fontSize={10} fill={theme?.mutedColor ?? "#d4d4d4"} fontFamily={style.bodyFont}>High {xLabel}, High {yLabel}</text>

                {/* Axis labels */}
                <text x={chartX + chartW + 16} y={chartY + chartH / 2 + 4} fontSize={12}
                  fill={theme?.mutedColor ?? "#a3a3a3"} fontFamily={style.bodyFont}>{xLabel}</text>
                <text x={chartX + chartW / 2} y={chartY - 10} textAnchor="middle" fontSize={12}
                  fill={theme?.mutedColor ?? "#a3a3a3"} fontFamily={style.bodyFont}>{yLabel}</text>
              </g>
            )
          })()}

          {/* Dots */}
          {dots.map((dot, i) => {
            const sp = spring({ frame: frame - 25 - i * 8, fps, config: { stiffness: 180, damping: 14 } })
            return (
              <g key={i} opacity={sp}>
                <circle cx={dot.x} cy={dot.y} r={28 * interpolate(sp, [0, 1], [0.5, 1])}
                  fill={fills[i % fills.length]} opacity={0.9} />
                <text x={dot.x} y={dot.y + 48} textAnchor="middle"
                  fontSize={16} fontWeight={theme?.headingWeight ?? 600} fill={textColor} fontFamily={style.bodyFont}>
                  {dot.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </AbsoluteFill>
  )
}
