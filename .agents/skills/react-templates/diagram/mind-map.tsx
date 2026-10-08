import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const MindMap: React.FC<{
  variant?: string
  textColor?: string
  center?: string
  branches?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  center = 'Product',
  branches = 'Features,Design,Marketing,Engineering',
  title = '',
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
const branchArr = branches.split(',').map((b) => b.trim())
  const cx = 960
  const cy = 540
  const r = 320
  const nodeR = 68
  const n = branchArr.length

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      {title && (
        <div style={{
          position: 'absolute', top: 100, width: '100%', textAlign: 'center',
          opacity: spring({ frame, fps, config: { stiffness: 180, damping: 18 } }),
        }}>
          <h2 style={{
            fontSize: 28, fontWeight: style.headingWeight, color: textColor,
            fontFamily: style.headingFont, letterSpacing: style.letterSpacing,
          }}>{title}</h2>
        </div>
      )}

      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Branches (lines) */}
        {branchArr.map((_, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2
          const bx = cx + Math.cos(angle) * r
          const by = cy + Math.sin(angle) * r
          const sp = spring({ frame: frame - 15 - i * 8, fps, config: { stiffness: 120, damping: 16 } })
          const len = Math.sqrt((bx - cx) ** 2 + (by - cy) ** 2)

          return (
            <line key={`line-${i}`} x1={cx} y1={cy} x2={bx} y2={by}
              stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={2}
              strokeDasharray={len} strokeDashoffset={len * (1 - sp)} />
          )
        })}

        {/* Center node */}
        {(() => {
          const sp = spring({ frame: frame - 5, fps, config: { stiffness: 200, damping: 16 } })
          return (
            <g opacity={sp}>
              <circle cx={cx} cy={cy} r={76 * interpolate(sp, [0, 1], [0.7, 1])}
                fill={textColor} />
              <text x={cx} y={cy + 8} textAnchor="middle" fontSize={26}
                fontWeight={theme?.headingWeight ?? 700} fill={theme?.cardBackground ?? "#fff"} fontFamily={style.bodyFont}>{center}</text>
            </g>
          )
        })()}

        {/* Branch nodes */}
        {branchArr.map((branch, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2
          const bx = cx + Math.cos(angle) * r
          const by = cy + Math.sin(angle) * r
          const sp = spring({ frame: frame - 28 - i * 8, fps, config: { stiffness: 180, damping: 16 } })

          return (
            <g key={`node-${i}`} opacity={sp}>
              <circle cx={bx} cy={by} r={nodeR * interpolate(sp, [0, 1], [0.7, 1])}
                fill={theme?.cardBackground ?? "#fff"} stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1.5} />
              <text x={bx} y={by + 6} textAnchor="middle" fontSize={20}
                fontWeight={theme?.headingWeight ?? 600} fill={textColor} fontFamily={style.bodyFont}>
                {branch}
              </text>
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}
