import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const CycleDiagram: React.FC<{
  variant?: string
  textColor?: string
  steps?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  steps = 'Plan,Build,Test,Deploy',
  title: _title = 'Development Cycle',
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
  const stepArr = steps.split(',').map((st) => st.trim())
  const n = stepArr.length
  const cx = 960
  const cy = 540
  const r = 240
  const nodeR = 56

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      {/* No title — just the cycle */}

      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Circle path */}
        {(() => {
          const sp = spring({ frame: frame - 8, fps, config: { stiffness: 100, damping: 18 } })
          const circumference = 2 * Math.PI * r
          return (
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1.5}
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - sp)} />
          )
        })()}

        {/* Nodes */}
        {stepArr.map((step, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2
          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r
          const sp = spring({ frame: frame - 20 - i * 10, fps, config: { stiffness: 160, damping: 16 } })

          // Label positioned well outside the circle
          const labelDist = r + nodeR + 48
          const lx = cx + Math.cos(angle) * labelDist
          const ly = cy + Math.sin(angle) * labelDist

          return (
            <g key={i} opacity={sp}>
              <circle cx={x} cy={y} r={nodeR * interpolate(sp, [0, 1], [0.6, 1])}
                fill={theme?.cardBackground ?? "#fff"} stroke={textColor} strokeWidth={2} />
              <text x={x} y={y + 2} textAnchor="middle" dominantBaseline="middle"
                fontSize={24} fontWeight={theme?.headingWeight ?? 700} fill={textColor} fontFamily={style.bodyFont}>
                {i + 1}
              </text>
              <text x={lx} y={ly + 2} textAnchor="middle" dominantBaseline="middle"
                fontSize={22} fontWeight={theme?.headingWeight ?? 700} fill={textColor} fontFamily={style.bodyFont}>
                {step}
              </text>
            </g>
          )
        })}

        {/* Arrows between nodes */}
        {stepArr.map((_, i) => {
          const sp = spring({ frame: frame - 30 - i * 10, fps, config: { stiffness: 140, damping: 16 } })
          const angle1 = (i / n) * Math.PI * 2 - Math.PI / 2
          const angle2 = (((i + 1) % n) / n) * Math.PI * 2 - Math.PI / 2
          const midAngle = (angle1 + angle2) / 2
          const ax = cx + Math.cos(midAngle) * (r + 12)
          const ay = cy + Math.sin(midAngle) * (r + 12)
          const rotation = (midAngle * 180) / Math.PI + 90

          return (
            <g key={`arrow-${i}`} opacity={sp}>
              <polygon
                points="-5,0 5,0 0,-10"
                transform={`translate(${ax}, ${ay}) rotate(${rotation})`}
                fill={diagramFill(theme, "#a3a3a3")}
              />
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}
