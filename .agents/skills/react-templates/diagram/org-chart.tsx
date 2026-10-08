import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const OrgChart: React.FC<{
  variant?: string
  textColor?: string
  root?: string
  children?: string
  grandchildren?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  root = 'CEO',
  children = 'CTO,CPO,CFO',
  grandchildren = 'Engineering,Design,Finance',
  title = 'Organization',
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
  const childArr = children.split(',').map((c) => c.trim())
  const gcArr = grandchildren.split(',').map((g) => g.trim())

  const cx = 960
  const rootY = 280
  const childY = 500
  const gcY = 720
  const childSpacing = 320
  const childStartX = cx - ((childArr.length - 1) * childSpacing) / 2
  const boxW = 180
  const boxH = 60

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      {/* Title in top-left */}
      <div style={{ position: 'absolute', top: 60, left: 80, opacity: titleSp }}>
        <h2 style={{
          fontSize: 22, fontWeight: style.headingWeight, color: theme?.mutedColor ?? "#a3a3a3",
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing,
        }}>{title}</h2>
      </div>

      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Root node */}
        {(() => {
          const sp = spring({ frame: frame - 8, fps, config: { stiffness: 180, damping: 16 } })
          return (
            <g opacity={sp} transform={`scale(${interpolate(sp, [0, 1], [0.85, 1])})`}
              style={{ transformOrigin: `${cx}px ${rootY}px` }}>
              <rect x={cx - boxW / 2} y={rootY - boxH / 2} width={boxW} height={boxH} rx={10}
                fill={textColor} />
              <text x={cx} y={rootY + 7} textAnchor="middle" fontSize={20}
                fontWeight={theme?.headingWeight ?? 700} fill={theme?.cardBackground ?? "#fff"} fontFamily={style.bodyFont}>{root}</text>
            </g>
          )
        })()}

        {/* Lines from root to children */}
        {childArr.map((_, i) => {
          const sp = spring({ frame: frame - 18 - i * 4, fps, config: { stiffness: 120, damping: 16 } })
          const childX = childStartX + i * childSpacing
          const midY = (rootY + boxH / 2 + childY - boxH / 2) / 2
          return (
            <g key={`line-${i}`} opacity={sp}>
              <polyline
                points={`${cx},${rootY + boxH / 2} ${cx},${midY} ${childX},${midY} ${childX},${childY - boxH / 2}`}
                fill="none" stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1.5}
              />
            </g>
          )
        })}

        {/* Child nodes */}
        {childArr.map((child, i) => {
          const sp = spring({ frame: frame - 25 - i * 8, fps, config: { stiffness: 180, damping: 16 } })
          const x = childStartX + i * childSpacing
          return (
            <g key={`child-${i}`} opacity={sp} transform={`scale(${interpolate(sp, [0, 1], [0.85, 1])})`}
              style={{ transformOrigin: `${x}px ${childY}px` }}>
              <rect x={x - boxW / 2} y={childY - boxH / 2} width={boxW} height={boxH} rx={10}
                fill={theme?.cardBackground ?? "#fff"} stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1.5} />
              <text x={x} y={childY + 7} textAnchor="middle" fontSize={18}
                fontWeight={style.headingWeight} fill={textColor} fontFamily={style.bodyFont}>{child}</text>
            </g>
          )
        })}

        {/* Lines from children to grandchildren */}
        {gcArr.map((_, i) => {
          const sp = spring({ frame: frame - 40 - i * 4, fps, config: { stiffness: 120, damping: 16 } })
          const parentX = childStartX + i * childSpacing
          return (
            <g key={`gcline-${i}`} opacity={sp}>
              <line x1={parentX} y1={childY + boxH / 2} x2={parentX} y2={gcY - boxH / 2}
                stroke={theme?.borderColor ?? "#e5e5e5"} strokeWidth={1.5} />
            </g>
          )
        })}

        {/* Grandchild nodes */}
        {gcArr.map((gc, i) => {
          const sp = spring({ frame: frame - 48 - i * 8, fps, config: { stiffness: 180, damping: 16 } })
          const x = childStartX + i * childSpacing
          return (
            <g key={`gc-${i}`} opacity={sp} transform={`scale(${interpolate(sp, [0, 1], [0.85, 1])})`}
              style={{ transformOrigin: `${x}px ${gcY}px` }}>
              <rect x={x - boxW / 2} y={gcY - boxH / 2} width={boxW} height={boxH} rx={10}
                fill={theme?.cardBackground ?? "#fff"} stroke={theme?.borderColor ?? "#f0f0f0"} strokeWidth={1.5} />
              <text x={x} y={gcY + 7} textAnchor="middle" fontSize={17}
                fontWeight={theme?.bodyWeight ?? 500} fill={theme?.mutedColor ?? "#737373"} fontFamily={style.bodyFont}>{gc}</text>
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}
