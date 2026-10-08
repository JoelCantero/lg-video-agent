import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const ConcentricCircles: React.FC<{
  variant?: string
  textColor?: string
  layers?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  layers = 'Core,Platform,Ecosystem,Community',
  title: _title = 'Product Architecture',
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
  const layerArr = layers.split(',').map((l) => l.trim())
  const n = layerArr.length
  const cx = 960
  const cy = 560
  const maxR = 320
  const minR = 70
  const fills = [diagramFill(theme, "#171717"), diagramFill(theme, "#737373"), diagramFill(theme, "#a3a3a3"), diagramFill(theme, "#d4d4d4"), diagramFill(theme, "#e5e5e5")]

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      {/* No title — diagram fills the frame */}

      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {/* Rings from outside in (draw outer first so inner overlaps) */}
        {[...layerArr].reverse().map((_, reverseI) => {
          const i = n - 1 - reverseI
          const sp = spring({ frame: frame - 8 - i * 10, fps, config: { stiffness: 130, damping: 16 } })
          const ringR = minR + ((maxR - minR) * (n - 1 - i)) / (n - 1)
          const fill = fills[n - 1 - i] ?? theme?.borderColor ?? "#e5e5e5"

          return (
            <circle key={i} cx={cx} cy={cy} r={ringR * interpolate(sp, [0, 1], [0.5, 1])}
              fill={fill} opacity={0.9 * sp} />
          )
        })}

        {/* Labels with pointer lines */}
        {layerArr.map((layer, i) => {
          const sp = spring({ frame: frame - 20 - i * 10, fps, config: { stiffness: 180, damping: 18 } })
          const ringR = minR + ((maxR - minR) * (n - 1 - i)) / (n - 1)
          // Inner rings have label inside, outer ones get pointer lines

          // Inner rings: label inside. Outer rings: label outside with pointer line
          if (i === 0) {
            return (
              <text key={`label-${i}`} x={cx} y={cy + 6}
                textAnchor="middle" fontSize={22} fontWeight={theme?.headingWeight ?? 700}
                fill={theme?.cardBackground ?? "#fff"} fontFamily={style.bodyFont} opacity={sp}>
                {layer}
              </text>
            )
          }

          // Pointer line angle (spread evenly around right side)
          const angle = -Math.PI / 3 + (i - 1) * (Math.PI / 2 / (n - 2))
          const innerX = cx + Math.cos(angle) * ringR
          const innerY = cy + Math.sin(angle) * ringR
          const outerX = cx + Math.cos(angle) * (maxR + 60 + i * 30)
          const outerY = cy + Math.sin(angle) * (maxR + 60 + i * 30)

          return (
            <g key={`label-${i}`} opacity={sp}>
              <line x1={innerX} y1={innerY} x2={outerX} y2={outerY}
                stroke={theme?.borderColor ?? "#a3a3a3"} strokeWidth={1} />
              <circle cx={innerX} cy={innerY} r={3} fill={diagramFill(theme, "#a3a3a3")} />
              <text x={outerX + 12} y={outerY + 6}
                textAnchor="start" fontSize={18} fontWeight={theme?.headingWeight ?? 600}
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
