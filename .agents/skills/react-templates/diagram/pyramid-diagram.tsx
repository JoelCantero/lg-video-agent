import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const PyramidDiagram: React.FC<{
  variant?: string
  textColor?: string
  layers?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  layers = 'Self-Actualization,Esteem,Belonging,Safety,Physiological',
  title: _title = 'Hierarchy of Needs',
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
const layerArr = layers.split(',').map((l) => l.trim())
  const n = layerArr.length
  const fills = [diagramFill(theme, "#171717"), diagramFill(theme, "#525252"), diagramFill(theme, "#737373"), diagramFill(theme, "#a3a3a3"), diagramFill(theme, "#d4d4d4")]

  // Pyramid on the left, labels on the right
  const pyramidCx = 680
  const topY = 180
  const bottomY = 900
  const maxW = 700
  const layerH = (bottomY - topY) / n

  // Label column starts to the right of the pyramid
  const labelX = 1140

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      {/* No title */}

      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Layers from bottom to top (reverse for animation: bottom first) */}
        {[...layerArr].reverse().map((layer, reverseI) => {
          const i = n - 1 - reverseI // actual index (0 = top)
          const sp = spring({ frame: frame - 8 - reverseI * 10, fps, config: { stiffness: 150, damping: 16 } })

          const y = topY + i * layerH
          const topW = maxW * (i / n)
          const bottomW = maxW * ((i + 1) / n)

          const x1Top = pyramidCx - topW / 2
          const x2Top = pyramidCx + topW / 2
          const x1Bot = pyramidCx - bottomW / 2
          const x2Bot = pyramidCx + bottomW / 2

          const points = `${x1Top},${y} ${x2Top},${y} ${x2Bot},${y + layerH} ${x1Bot},${y + layerH}`
          const fill = fills[i % fills.length]

          // Label line from right edge of trapezoid to label column
          const midY = y + layerH / 2
          const rightEdge = pyramidCx + ((topW + bottomW) / 2) / 2 + 12

          return (
            <g key={i} opacity={sp} transform={`translate(0, ${interpolate(sp, [0, 1], [20, 0])})`}>
              <polygon points={points} fill={fill} />
              {/* Connector line */}
              <line x1={rightEdge} y1={midY} x2={labelX - 16} y2={midY}
                stroke={theme?.borderColor ?? "#d4d4d4"} strokeWidth={1} strokeDasharray="4 3" />
              {/* Label text */}
              <text x={labelX} y={midY + 6} fontSize={20} fontWeight={theme?.headingWeight ?? 600}
                fill={textColor} fontFamily={style.bodyFont}>
                {layer}
              </text>
            </g>
          )
        })}
      </svg>
    </AbsoluteFill>
  )
}
