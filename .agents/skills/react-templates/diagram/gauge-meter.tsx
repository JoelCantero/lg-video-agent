import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const GaugeMeter: React.FC<{
  variant?: string
  textColor?: string
  value?: string
  max?: string
  label?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  value = '73',
  max = '100',
  label = 'Performance',
  title: _title = 'System Health',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const style = resolveTemplateAppearance(theme, { background: "#fafafa", letterSpacing: "-0.02em" });
  useTemplateFonts(style);
  const trackColor = theme?.borderColor && theme.borderColor === theme.textColor
    ? `color-mix(in srgb, ${theme.borderColor} 16%, transparent)` : theme?.borderColor ?? '#e5e5e5';
  const secondaryColor = theme?.mutedColor && theme.mutedColor === theme.textColor
    ? `color-mix(in srgb, ${theme.mutedColor} 65%, transparent)` : theme?.mutedColor;
  const labelColor = secondaryColor ?? '#a3a3a3';
  const limitColor = secondaryColor ?? '#d4d4d4';
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
  const val = parseFloat(value) || 0
  const maxVal = parseFloat(max) || 100
  const pct = Math.min(val / maxVal, 1)

  const cx = 300
  const cy = 280
  const r = 180
  const startAngle = Math.PI * 0.8
  const totalAngle = Math.PI * 1.6 // 288 degrees

  const arcSp = spring({ frame: frame - 8, fps, config: { stiffness: 100, damping: 18 } })
  const needleSp = spring({ frame: frame - 20, fps, config: { stiffness: 80, damping: 14 } })
  const countSp = spring({ frame: frame - 15, fps, config: { stiffness: 120, damping: 18 } })

  const currentVal = Math.round(interpolate(countSp, [0, 1], [0, val]))

  // Arc path helper
  const arcPath = (startA: number, endA: number, radius: number) => {
    const x1 = cx + Math.cos(startA) * radius
    const y1 = cy + Math.sin(startA) * radius
    const x2 = cx + Math.cos(endA) * radius
    const y2 = cy + Math.sin(endA) * radius
    const largeArc = Math.abs(endA - startA) > Math.PI ? 1 : 0
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
  }

  const needleAngle = startAngle + totalAngle * pct * needleSp
  const needleX = cx + Math.cos(needleAngle) * (r - 30)
  const needleY = cy + Math.sin(needleAngle) * (r - 30)

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ textAlign: 'center' }}>
        <svg width={600} height={360} viewBox="0 0 600 360">
          {/* Background arc */}
          <path d={arcPath(startAngle, startAngle + totalAngle, r)}
            fill="none" stroke={trackColor} strokeWidth={16} strokeLinecap="round" opacity={arcSp} />

          {/* Value arc */}
          <path d={arcPath(startAngle, startAngle + totalAngle * pct * needleSp, r)}
            fill="none" stroke={textColor} strokeWidth={16} strokeLinecap="round" opacity={arcSp} />

          {/* Needle */}
          <line x1={cx} y1={cy} x2={needleX} y2={needleY}
            stroke={textColor} strokeWidth={3} strokeLinecap="round" opacity={needleSp} />
          <circle cx={cx} cy={cy} r={8} fill={textColor} opacity={needleSp} />
          <circle cx={cx} cy={cy} r={4} fill={theme?.cardBackground ?? "#fafafa"} opacity={needleSp} />

          {/* Value text */}
          <text x={cx} y={cy + 50} textAnchor="middle" fontSize={42} fontWeight={theme?.headingWeight ?? 700}
            fill={textColor} fontFamily={style.bodyFont} opacity={countSp}>
            {currentVal}
          </text>

          {/* Label */}
          <text x={cx} y={cy + 78} textAnchor="middle" fontSize={14}
            fill={labelColor} fontFamily={style.bodyFont} opacity={countSp}>
            {label}
          </text>

          {/* Min/Max */}
          <text x={cx - r - 10} y={cy + 20} textAnchor="middle" fontSize={11}
            fill={limitColor} fontFamily={style.bodyFont} opacity={arcSp}>0</text>
          <text x={cx + r + 10} y={cy + 20} textAnchor="middle" fontSize={11}
            fill={limitColor} fontFamily={style.bodyFont} opacity={arcSp}>{maxVal}</text>
        </svg>
      </div>
    </AbsoluteFill>
  )
}
