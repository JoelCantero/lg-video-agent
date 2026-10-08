import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion'
export const VennDiagram3: React.FC<{
  variant?: string
  textColor?: string
  labels?: string
  overlapLabel?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  labels = 'Design,Engineering,Business',
  overlapLabel = 'Innovation',
  title: _title = 'Product Strategy',
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
  const r = 170
  const cx = 960
  const cy = 560
  const dist = 110

  const positions = [
    { x: cx, y: cy - dist }, // top
    { x: cx - dist * Math.cos(Math.PI / 6), y: cy + dist * Math.sin(Math.PI / 6) }, // bottom-left
    { x: cx + dist * Math.cos(Math.PI / 6), y: cy + dist * Math.sin(Math.PI / 6) }, // bottom-right
  ]

  const fills = [diagramFill(theme, "#e5e5e5"), diagramFill(theme, "#d4d4d4"), diagramFill(theme, "#a3a3a3")]
  const labelOffsets = [
    { x: 0, y: -90 },
    { x: -90, y: 60 },
    { x: 90, y: 60 },
  ]

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      {/* No title — diagram centered */}

      <svg width={800} height={520} viewBox="560 280 800 520">
        {positions.map((pos, i) => {
          const sp = spring({ frame: frame - 10 - i * 8, fps, config: { stiffness: 120, damping: 16 } })
          return (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={r * sp} fill={fills[i]} opacity={0.35 * sp} stroke={theme?.borderColor ?? "#d4d4d4"} strokeWidth={1.5} />
            </g>
          )
        })}

        {/* Labels */}
        {positions.map((pos, i) => {
          const sp = spring({ frame: frame - 45 - i * 6, fps, config: { stiffness: 180, damping: 18 } })
          return (
            <text key={`label-${i}`} x={pos.x + labelOffsets[i].x} y={pos.y + labelOffsets[i].y}
              textAnchor="middle" fill={textColor} fontSize={17} fontWeight={style.headingWeight}
              fontFamily={style.bodyFont} opacity={sp}>
              {labelArr[i] ?? ''}
            </text>
          )
        })}

        {/* Center overlap */}
        {(() => {
          const sp = spring({ frame: frame - 60, fps, config: { stiffness: 160, damping: 18 } })
          return (
            <text x={cx} y={cy + 14} textAnchor="middle" fill={textColor}
              fontSize={16} fontWeight={theme?.headingWeight ?? 700} fontFamily={style.bodyFont} opacity={sp}>
              {overlapLabel}
            </text>
          )
        })()}
      </svg>
    </AbsoluteFill>
  )
}
