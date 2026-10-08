import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';
import { diagramFill } from './appearance';
import { AbsoluteFill, useCurrentFrame, spring, interpolate, useVideoConfig } from 'remotion'
export const VersusSplit: React.FC<{
  variant?: string
  textColor?: string
  leftTitle?: string
  rightTitle?: string
  leftItems?: string
  rightItems?: string
  title?: string
} & ThemedTemplateProps> = ({
  theme,
  variant = 'default',
  textColor = theme?.textColor ?? '#171717',
  leftTitle = 'React',
  rightTitle = 'Vue',
  leftItems = 'JSX syntax,Virtual DOM,Large ecosystem',
  rightItems = 'Template syntax,Reactive system,Lightweight',
  title = 'Framework Comparison',
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
  const dividerSp = spring({ frame: frame - 15, fps, config: { stiffness: 140, damping: 16 } })
  const leftArr = leftItems.split(',').map((i) => i.trim())
  const rightArr = rightItems.split(',').map((i) => i.trim())

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
      <div style={{ width: 680 }}>
        <h2 style={{
          fontSize: 30, fontWeight: style.headingWeight, color: textColor, textAlign: 'center',
          fontFamily: style.headingFont, letterSpacing: style.letterSpacing, marginBottom: 40, opacity: titleSp,
        }}>{title}</h2>

        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          {/* Left side */}
          <div style={{ flex: 1, paddingRight: 40 }}>
            {(() => {
              const sp = spring({ frame: frame - 20, fps, config: { stiffness: 180, damping: 18 } })
              return <h3 style={{
                fontSize: 22, fontWeight: style.headingWeight, color: textColor,
                fontFamily: style.headingFont, marginBottom: 20, opacity: sp,
              }}>{leftTitle}</h3>
            })()}
            {leftArr.map((item, i) => {
              const sp = spring({ frame: frame - 30 - i * 8, fps, config: { stiffness: 160, damping: 16 } })
              return (
                <div key={i} style={{
                  fontSize: 16, color: theme?.mutedColor ?? "#525252", fontFamily: style.bodyFont, marginBottom: 14,
                  opacity: sp, transform: `translateX(${interpolate(sp, [0, 1], [-20, 0])}px)`,
                }}>
                  <span style={{ color: theme?.mutedColor ?? "#a3a3a3", marginRight: 10 }}>—</span>{item}
                </div>
              )
            })}
          </div>

          {/* Divider */}
          <div style={{
            width: 1, backgroundColor: theme?.mutedColor ?? "#e5e5e5", alignSelf: 'stretch',
            transform: `scaleY(${dividerSp})`, transformOrigin: 'top',
          }} />

          {/* VS badge */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: `translate(-50%, -50%) scale(${dividerSp})`,
            width: 36, height: 36, borderRadius: 999, backgroundColor: theme?.textColor ?? "#171717",
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: theme?.headingWeight ?? 700, color: theme?.cardBackground ?? "#fff", fontFamily: style.bodyFont,
          }}>VS</div>

          {/* Right side */}
          <div style={{ flex: 1, paddingLeft: 40 }}>
            {(() => {
              const sp = spring({ frame: frame - 25, fps, config: { stiffness: 180, damping: 18 } })
              return <h3 style={{
                fontSize: 22, fontWeight: style.headingWeight, color: textColor,
                fontFamily: style.headingFont, marginBottom: 20, opacity: sp,
              }}>{rightTitle}</h3>
            })()}
            {rightArr.map((item, i) => {
              const sp = spring({ frame: frame - 38 - i * 8, fps, config: { stiffness: 160, damping: 16 } })
              return (
                <div key={i} style={{
                  fontSize: 16, color: theme?.mutedColor ?? "#525252", fontFamily: style.bodyFont, marginBottom: 14,
                  opacity: sp, transform: `translateX(${interpolate(sp, [0, 1], [20, 0])}px)`,
                }}>
                  <span style={{ color: theme?.mutedColor ?? "#a3a3a3", marginRight: 10 }}>—</span>{item}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  )
}
