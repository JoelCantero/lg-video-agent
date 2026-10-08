import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { useId } from 'react';
import { resolveTemplateAppearance, type ThemedTemplateProps } from '../theme';
import { useTemplateFonts } from '../fonts';

export const VennDiagram2: React.FC<{
  variant?: string; textColor?: string; leftLabel?: string; rightLabel?: string; overlapLabel?: string; title?: string;
} & ThemedTemplateProps> = ({ leftLabel = 'Design', rightLabel = 'Engineering', overlapLabel = 'UX', textColor, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const style = resolveTemplateAppearance(theme, { background: '#fafafa' });
  useTemplateFonts(style);
  const color = textColor ?? style.textColor;
  const clipId = useId();
  const leftSp = spring({ frame: frame - 12, fps, config: { stiffness: 120, damping: 16 } });
  const rightSp = spring({ frame: frame - 20, fps, config: { stiffness: 120, damping: 16 } });
  const overlapSp = spring({ frame: frame - 40, fps, config: { stiffness: 160, damping: 18 } });
  const labelSp = spring({ frame: frame - 55, fps, config: { stiffness: 180, damping: 18 } });
  const cx = 960;
  const cy = 560;
  const radius = 200;
  const offset = 130;
  return <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', background: style.background }}>
    <svg width={800} height={500} viewBox="560 310 800 500">
      <circle cx={cx - offset} cy={cy} r={radius * leftSp} fill="none" stroke={theme?.borderColor ?? '#d4d4d4'} strokeWidth={2} />
      <circle cx={cx - offset} cy={cy} r={radius * leftSp} fill={theme?.accentColors?.[0] ?? '#e5e5e5'} opacity={0.3 * leftSp} />
      <circle cx={cx + offset} cy={cy} r={radius * rightSp} fill="none" stroke={theme?.borderColor ?? '#a3a3a3'} strokeWidth={2} />
      <circle cx={cx + offset} cy={cy} r={radius * rightSp} fill={theme?.accentColors?.[1] ?? '#a3a3a3'} opacity={0.15 * rightSp} />
      <clipPath id={clipId}><circle cx={cx - offset} cy={cy} r={radius} /></clipPath>
      <circle cx={cx + offset} cy={cy} r={radius} clipPath={`url(#${clipId})`} fill={color} opacity={0.08 * overlapSp} />
      <text x={cx - offset - 80} y={cy + 4} textAnchor="middle" fill={color} fontSize={18} fontWeight={style.headingWeight} fontFamily={style.headingFont} opacity={labelSp}>{leftLabel}</text>
      <text x={cx + offset + 80} y={cy + 4} textAnchor="middle" fill={color} fontSize={18} fontWeight={style.headingWeight} fontFamily={style.headingFont} opacity={labelSp}>{rightLabel}</text>
      <text x={cx} y={cy + 4} textAnchor="middle" fill={color} fontSize={16} fontWeight={theme?.headingWeight ?? 700} fontFamily={style.headingFont} opacity={overlapSp}>{overlapLabel}</text>
    </svg>
  </AbsoluteFill>;
};