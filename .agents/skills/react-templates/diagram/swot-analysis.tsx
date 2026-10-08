import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const SwotAnalysis: React.FC<{
  variant?: string
  textColor?: string
  strengths?: string
  weaknesses?: string
  opportunities?: string
  threats?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  strengths = 'Fast iteration,Strong brand',
  weaknesses = 'Small team,Limited budget',
  opportunities = 'New market,Partnerships',
  threats = 'Competition,Regulation',
  title = 'SWOT Analysis',
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

  const quadrants = [
    { label: 'Strengths', items: strengths.split(',').map((s) => s.trim()), color: theme?.textColor ?? "#171717" },
    { label: 'Weaknesses', items: weaknesses.split(',').map((s) => s.trim()), color: theme?.mutedColor ?? "#737373" },
    { label: 'Opportunities', items: opportunities.split(',').map((s) => s.trim()), color: theme?.mutedColor ?? "#525252" },
    { label: 'Threats', items: threats.split(',').map((s) => s.trim()), color: theme?.mutedColor ?? "#a3a3a3" },
  ]

  const gridW = 280
  const gridH = 180
  const gap = 12

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ width: gridW * 2 + gap }}>
        <h2 style={{
          fontSize: 28, fontWeight: style.headingWeight, color: textColor, textAlign: 'center',
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing, marginBottom: 32, opacity: titleSp,
        }}>{title}</h2>

        {/* Grid lines */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap }}>
          {quadrants.map((q, i) => {
            const sp = spring({ frame: frame - 12 - i * 8, fps, config: { stiffness: 160, damping: 16 } })

            return (
              <div key={i} style={{
                width: gridW, minHeight: gridH, padding: 20,
                backgroundColor: theme?.cardBackground ?? "#fff", borderRadius: 8,
                border: `1px solid ${theme?.borderColor ?? "#e5e5e5"}`,
                opacity: sp, transform: `scale(${interpolate(sp, [0, 1], [0.92, 1])})`,
              }}>
                <div style={{
                  fontSize: 13, fontWeight: theme?.headingWeight ?? 700, color: q.color,
                  fontFamily: style.bodyFont, marginBottom: 14,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>{q.label}</div>

                {q.items.map((item, j) => {
                  const itemSp = spring({ frame: frame - 25 - i * 8 - j * 6, fps, config: { stiffness: 180, damping: 18 } })
                  return (
                    <div key={j} style={{
                      fontSize: 14, color: theme?.mutedColor ?? "#525252", fontFamily: style.bodyFont,
                      marginBottom: 8, opacity: itemSp,
                      transform: `translateX(${interpolate(itemSp, [0, 1], [-8, 0])}px)`,
                    }}>
                      <span style={{ color: theme?.mutedColor ?? "#d4d4d4", marginRight: 8 }}>•</span>{item}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </AbsoluteFill>
  )
}
