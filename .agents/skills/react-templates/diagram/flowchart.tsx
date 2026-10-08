import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { useId } from 'react';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const Flowchart: React.FC<{
  variant?: string
  textColor?: string
  steps?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  steps = 'Start,Process Data,Valid?,Store,Retry',
  title = 'Data Pipeline',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const style = resolveTemplateAppearance(theme, { background: "#fafafa", letterSpacing: "-0.02em" });
  useTemplateFonts(style);
  const svgId = useId();
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
  const stepArr = steps.split(',').map((st) => st.trim())

  const boxW = 220
  const boxH = 72
  const gap = 70
  const startX = 960 - ((stepArr.length - 1) * (boxW + gap)) / 2
  const cy = 540

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', opacity: titleSp }}>
        <h2 style={{
          fontSize: 32, fontWeight: style.headingWeight, color: textColor,
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing,
        }}>{title}</h2>
      </div>

      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {stepArr.map((step, i) => {
          const sp = spring({ frame: frame - 12 - i * 12, fps, config: { stiffness: 160, damping: 16 } })
          const x = startX + i * (boxW + gap)
          const isDecision = step.includes('?')

          // Arrow to next
          const arrowSp = spring({ frame: frame - 18 - i * 12, fps, config: { stiffness: 140, damping: 16 } })

          return (
            <g key={i}>
              {/* Arrow from previous */}
              {i > 0 && (
                <line
                  x1={x - gap + 8} y1={cy}
                  x2={x - 8} y2={cy}
                  stroke={theme?.borderColor ?? "#d4d4d4"} strokeWidth={1.5}
                  strokeDasharray={gap - 16}
                  strokeDashoffset={(gap - 16) * (1 - arrowSp)}
                  markerEnd={`url(#${svgId}-arrowhead)`}
                />
              )}

              {/* Node */}
              {isDecision ? (
                <g transform={`translate(${x + boxW / 2}, ${cy})`} opacity={sp}>
                  <polygon
                    points={`0,${-boxH / 2 - 6} ${boxW / 2 + 6},0 0,${boxH / 2 + 6} ${-boxW / 2 - 6},0`}
                    fill={theme?.cardBackground ?? "#fff"} stroke={theme?.borderColor ?? "#a3a3a3"} strokeWidth={1.5}
                    transform={`scale(${interpolate(sp, [0, 1], [0.8, 1])})`}
                  />
                  <text textAnchor="middle" dy={7} fontSize={22} fontWeight={style.headingWeight}
                    fill={textColor} fontFamily={style.bodyFont}>{step}</text>
                </g>
              ) : (
                <g opacity={sp}>
                  <rect x={x} y={cy - boxH / 2} width={boxW} height={boxH} rx={10}
                    fill={theme?.cardBackground ?? "#fff"} stroke={i === 0 ? textColor : theme?.borderColor ?? "#e5e5e5"} strokeWidth={i === 0 ? 2 : 1.5}
                    transform={`scale(${interpolate(sp, [0, 1], [0.9, 1])})`}
                    style={{ transformOrigin: `${x + boxW / 2}px ${cy}px` }}
                  />
                  <text x={x + boxW / 2} y={cy + 7} textAnchor="middle" fontSize={22}
                    fontWeight={style.headingWeight} fill={textColor} fontFamily={style.bodyFont}>{step}</text>
                </g>
              )}
            </g>
          )
        })}

        <defs>
          <marker id={`${svgId}-arrowhead`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={diagramFill(theme, "#a3a3a3")} />
          </marker>
        </defs>
      </svg>
    </AbsoluteFill>
  )
}
